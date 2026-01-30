import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { supabase } from '../../lib/supabase';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
  interestedCourse?: string;
}

export function LeadModal({ isOpen, onClose, source, interestedCourse }: LeadModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    wechat: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [successType, setSuccessType] = useState<'new' | 'paid'>('new');
  const [qrInfo, setQrInfo] = useState<{ imageUrl: string; title?: string; remark?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate phone number
    if (!/^\d{11}$/.test(formData.phone)) {
      setError('请输入正确的11位手机号码');
      setIsSubmitting(false);
      return;
    }

    try {
      // Use RPC call to submit lead and check membership
      const { data, error: submitError } = await supabase.rpc('submit_lead', {
        p_name: formData.name,
        p_phone: formData.phone,
        p_wechat: formData.wechat,
        p_interested_course: interestedCourse,
        p_source: source,
        p_page_url: window.location.href,
        p_user_agent: navigator.userAgent
      });

      if (submitError) throw submitError;

      // Check result from RPC
      const result = data as any;
      
      if (result.member_type === 'old_paid' && result.qr_info) {
        setSuccessType('paid');
        setQrInfo({
          imageUrl: result.qr_info.image_url,
          title: result.qr_info.title,
          remark: result.qr_info.remark
        });
      } else {
        setSuccessType('new');
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Submission error:', err);
      // Fallback to simple insert if RPC fails (e.g. function doesn't exist yet)
      try {
        const { error: fallbackError } = await supabase.from('leads').insert([
          {
            name: formData.name,
            phone: formData.phone,
            wechat: formData.wechat,
            source: source,
            interested_course: interestedCourse,
            page_url: window.location.href,
            user_agent: navigator.userAgent,
          },
        ]);
        if (fallbackError) throw fallbackError;
        setSuccessType('new');
        setIsSuccess(true);
      } catch (fallbackErr: any) {
         setError(err.message || '提交失败，请稍后重试');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFormData({ name: '', phone: '', wechat: '' });
    setError(null);
    setSuccessType('new');
    setQrInfo(null);
    onClose();
  };

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="报名成功">
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          
          {successType === 'paid' && qrInfo ? (
             <div className="space-y-4 w-full">
                <div>
                    <h3 className="text-lg font-medium">尊贵的会员，欢迎回来！</h3>
                    <p className="text-muted-foreground mt-2">
                        请扫描下方二维码加入本期课程专属群，<br/>直播链接将在群内发布。
                    </p>
                </div>
                <div className="flex justify-center">
                    <div className="p-2 bg-white rounded-lg shadow-sm border">
                         <img src={qrInfo.imageUrl} alt="Group QR" className="w-48 h-48 object-cover" />
                    </div>
                </div>
                {(qrInfo.title || qrInfo.remark) && (
                    <div className="text-sm text-gray-500">
                        {qrInfo.title && <p className="font-medium">{qrInfo.title}</p>}
                        {qrInfo.remark && <p>{qrInfo.remark}</p>}
                    </div>
                )}
             </div>
          ) : (
             <div>
                <h3 className="text-lg font-medium">感谢您的报名！</h3>
                <p className="text-muted-foreground mt-2">
                  我们将尽快安排助教与您联系，请保持手机/微信畅通。
                </p>
             </div>
          )}

          <Button onClick={handleClose} className="w-full mt-4">
            {successType === 'paid' ? '我已扫码，关闭' : '完成'}
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="立即报名"
      description="填写下方信息，获取本周公开课名额"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            姓名 <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            required
            placeholder="请输入您的姓名"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            手机号 <span className="text-red-500">*</span>
          </label>
          <Input
            id="phone"
            required
            type="tel"
            placeholder="请输入您的手机号"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="wechat" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            微信号 (选填)
          </label>
          <Input
            id="wechat"
            placeholder="方便助教添加好友"
            value={formData.wechat}
            onChange={(e) => setFormData({ ...formData, wechat: e.target.value })}
          />
        </div>

        {interestedCourse && (
          <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
            意向课程：{interestedCourse}
          </div>
        )}

        {error && (
          <div className="flex items-center text-sm text-red-500 bg-red-50 p-2 rounded">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={handleClose} className="mt-2 sm:mt-0">
            取消
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '提交中...' : '确认报名'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
