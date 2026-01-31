
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function ConversionSection() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 11) return;
    
    setStatus('submitting');
    try {
      // Simple quick lead submission
      const { error } = await supabase.from('leads').insert([
        {
          name: '快捷报名用户',
          phone: phone,
          source: 'home_conversion_section',
          page_url: window.location.href,
          user_agent: navigator.userAgent
        }
      ]);

      if (error) throw error;
      setStatus('success');
      setPhone('');
    } catch (error) {
      console.error('Quick signup error:', error);
      setStatus('idle');
      alert('提交失败，请重试');
    }
  };

  return (
    <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">准备好开启 AI 之旅了吗？</h2>
        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
          立即加入我们的学习社区，获取每周直播课提醒与独家学习资料。
        </p>
        
        {status === 'success' ? (
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl inline-flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="w-12 h-12 text-green-400 mb-2" />
            <h3 className="text-xl font-bold">提交成功！</h3>
            <p className="text-blue-100 text-sm">助教将尽快与您联系</p>
            <Button 
              variant="link" 
              className="text-white mt-2"
              onClick={() => setStatus('idle')}
            >
              再次提交
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="tel" 
              placeholder="请输入您的手机号" 
              className="bg-white text-gray-900 border-none h-12 text-lg"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Button 
              size="lg" 
              className="bg-gray-900 text-white hover:bg-gray-800 h-12 px-8 text-lg font-medium"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? '提交中...' : '立即加入'}
              {!status.startsWith('submit') && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>
        )}
        
        <p className="text-blue-200/60 text-xs mt-6">
          提交即代表您同意我们的隐私政策，我们会严格保密您的个人信息。
        </p>
      </div>
      
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
}
