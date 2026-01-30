import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import * as XLSX from 'xlsx';
import { Loader2, Upload, Trash2, Check, AlertCircle } from 'lucide-react';

interface PaidMember {
  id: string;
  phone: string;
  name?: string;
  batch_name?: string;
  created_at: string;
}

interface WechatGroupQr {
  id: string;
  image_url: string;
  title?: string;
  remark?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export default function MemberManagement() {
  const [members, setMembers] = useState<PaidMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState<{ total: number; success: number; failed: number } | null>(null);

  const [qrs, setQrs] = useState<WechatGroupQr[]>([]);
  const [loadingQrs, setLoadingQrs] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [newQrFile, setNewQrFile] = useState<File | null>(null);
  const [newQrTitle, setNewQrTitle] = useState('');
  const [newQrRemark, setNewQrRemark] = useState('');

  useEffect(() => {
    fetchMembers();
    fetchQrs();
  }, []);

  const fetchMembers = async () => {
    setLoadingMembers(true);
    const { data, error } = await supabase
      .from('paid_members')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) console.error('Error fetching members:', error);
    else setMembers(data || []);
    setLoadingMembers(false);
  };

  const fetchQrs = async () => {
    setLoadingQrs(true);
    const { data, error } = await supabase
      .from('wechat_group_qr')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching QRs:', error);
    else setQrs(data || []);
    setLoadingQrs(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStats(null);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

        // Assuming first row is header, or we just look for phone column
        // Let's assume user provides a column named "phone" or "手机号"
        // Or we just take the first column if it looks like a phone number

        let successCount = 0;
        let failCount = 0;
        
        // Find phone column index
        const headerRow = data[0];
        let phoneIdx = -1;
        let nameIdx = -1;
        
        // Simple heuristic for column detection
        headerRow.forEach((cell: any, idx: number) => {
          if (typeof cell === 'string') {
            if (cell.includes('phone') || cell.includes('手机')) phoneIdx = idx;
            if (cell.includes('name') || cell.includes('姓名')) nameIdx = idx;
          }
        });

        // If not found in header, assume col 0 is phone
        if (phoneIdx === -1) phoneIdx = 0;

        const membersToInsert = [];

        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          if (!row || row.length === 0) continue;

          const rawPhone = row[phoneIdx];
          if (!rawPhone) continue;

          // Normalize phone
          const phoneStr = String(rawPhone).replace(/\D/g, '');
          if (phoneStr.length < 11) { // Basic check
            failCount++;
            continue;
          }

          const name = nameIdx !== -1 ? row[nameIdx] : undefined;

          membersToInsert.push({
            phone: phoneStr,
            name: name,
            batch_name: `Import ${new Date().toLocaleDateString()}`
          });
        }

        // Batch insert (or one by one to handle duplicates gracefully)
        // Using upsert to handle duplicates
        const { error } = await supabase
          .from('paid_members')
          .upsert(membersToInsert, { onConflict: 'phone', ignoreDuplicates: true });

        if (error) {
          console.error('Batch insert error:', error);
          alert('导入失败: ' + error.message);
        } else {
          successCount = membersToInsert.length;
          setUploadStats({
            total: membersToInsert.length,
            success: successCount,
            failed: failCount
          });
          fetchMembers();
        }

      } catch (err: any) {
        console.error('Error parsing file:', err);
        alert('文件解析错误');
      } finally {
        setUploading(false);
        // Reset file input
        e.target.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleQrUpload = async () => {
    if (!newQrFile) return;
    setUploadingQr(true);

    try {
      const fileExt = newQrFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('wechat-groups')
        .upload(filePath, newQrFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('wechat-groups')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('wechat_group_qr')
        .insert({
          image_url: publicUrl,
          title: newQrTitle,
          remark: newQrRemark,
          status: 'inactive' // Default inactive
        });

      if (dbError) throw dbError;

      setNewQrFile(null);
      setNewQrTitle('');
      setNewQrRemark('');
      fetchQrs();

    } catch (err: any) {
      console.error('Error uploading QR:', err);
      alert('上传失败: ' + err.message);
    } finally {
      setUploadingQr(false);
    }
  };

  const toggleQrStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    // If setting to active, we might want to deactivate others? 
    // The requirement implies one active group.
    // Let's first deactivate all others if setting to active.
    
    if (newStatus === 'active') {
       await supabase
        .from('wechat_group_qr')
        .update({ status: 'inactive' })
        .neq('id', id); // Deactivate others (optional, but good practice)
       
       // Actually 'neq' id is tricky if we want to set ALL others. 
       // Just set all to inactive first is safer or just use the update.
       // But doing it in two steps is fine.
       // Ideally we use a transaction or just rely on client side logic for now.
       // Let's just update this one, but to be safe, let's update all others to inactive.
       await supabase.from('wechat_group_qr').update({ status: 'inactive' }).neq('id', '00000000-0000-0000-0000-000000000000'); // Update all
    }

    const { error } = await supabase
      .from('wechat_group_qr')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('更新状态失败');
    } else {
      fetchQrs();
    }
  };

  const deleteQr = async (id: string) => {
    if (!confirm('确定删除吗？')) return;
    const { error } = await supabase.from('wechat_group_qr').delete().eq('id', id);
    if (error) alert('删除失败');
    else fetchQrs();
  };

  return (
    <div className="container mx-auto py-10 px-4 space-y-10">
      <h1 className="text-3xl font-bold">后台管理</h1>

      {/* Member Management */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">付费会员管理</h2>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="outline" className="relative cursor-pointer">
              <input 
                type="file" 
                accept=".xlsx,.xls,.csv" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              上传 Excel/CSV 名单
            </Button>
            <span className="text-sm text-muted-foreground">
              支持包含“手机号”列的表格
            </span>
          </div>

          {uploadStats && (
            <div className="mb-4 p-4 bg-gray-50 rounded text-sm">
              <p>导入结果: 总数 {uploadStats.total}</p>
              <p className="text-green-600">成功/更新: {uploadStats.success}</p>
              <p className="text-red-600">失败/跳过: {uploadStats.failed}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">手机号</th>
                  <th className="p-2">姓名</th>
                  <th className="p-2">导入批次</th>
                  <th className="p-2">导入时间</th>
                </tr>
              </thead>
              <tbody>
                {loadingMembers ? (
                  <tr><td colSpan={4} className="p-4 text-center">加载中...</td></tr>
                ) : members.map((m) => (
                  <tr key={m.id} className="border-b">
                    <td className="p-2 font-mono">{m.phone}</td>
                    <td className="p-2">{m.name || '-'}</td>
                    <td className="p-2">{m.batch_name || '-'}</td>
                    <td className="p-2">{new Date(m.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* QR Code Management */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">微信群二维码管理</h2>
        <div className="bg-white p-6 rounded-lg shadow border space-y-6">
          
          {/* Upload Form */}
          <div className="grid gap-4 md:grid-cols-4 items-end bg-gray-50 p-4 rounded">
            <div className="space-y-2">
              <label className="text-sm font-medium">标题</label>
              <Input 
                value={newQrTitle} 
                onChange={e => setNewQrTitle(e.target.value)} 
                placeholder="例如: 2024-02期周课群"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">备注</label>
              <Input 
                value={newQrRemark} 
                onChange={e => setNewQrRemark(e.target.value)} 
                placeholder="例如: 2月1日开始失效"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">二维码图片</label>
              <Input 
                type="file" 
                accept="image/*"
                onChange={e => setNewQrFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button onClick={handleQrUpload} disabled={uploadingQr || !newQrFile}>
              {uploadingQr ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              上传并添加
            </Button>
          </div>

          {/* List */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loadingQrs ? (
              <p>加载中...</p>
            ) : qrs.map((qr) => (
              <div key={qr.id} className={`border rounded-lg p-4 relative ${qr.status === 'active' ? 'ring-2 ring-green-500 bg-green-50' : 'bg-gray-50 opacity-80'}`}>
                {qr.status === 'active' && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <Check className="w-3 h-3 mr-1" /> 当前启用
                  </div>
                )}
                <div className="aspect-square bg-gray-200 mb-4 rounded overflow-hidden relative">
                  <img src={qr.image_url} alt="QR Code" className="object-cover w-full h-full" />
                </div>
                <h3 className="font-semibold">{qr.title || '未命名'}</h3>
                <p className="text-sm text-gray-500 mb-4">{qr.remark}</p>
                <div className="flex space-x-2">
                  <Button 
                    variant={qr.status === 'active' ? "outline" : "default"} 
                    size="sm" 
                    className="flex-1"
                    onClick={() => toggleQrStatus(qr.id, qr.status)}
                  >
                    {qr.status === 'active' ? '停用' : '启用'}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteQr(qr.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
