
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
    <section className="py-20 bg-blue-600 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight">准备好开启 AI 之旅了吗？</h2>
        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
          立即加入我们的学习社区，获取每周直播课提醒与独家学习资料。
        </p>
        
        {status === 'success' ? (
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl inline-flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="w-12 h-12 text-blue-200 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">提交成功！</h3>
            <p className="text-blue-100">助教将尽快与您联系</p>
            <button 
              className="text-white underline mt-6 text-sm opacity-80 hover:opacity-100 transition-opacity"
              onClick={() => setStatus('idle')}
            >
              再次提交
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto bg-white/10 p-2 rounded-2xl backdrop-blur-sm border border-white/20">
            <input 
              type="tel" 
              placeholder="请输入您的手机号" 
              className="flex-1 bg-transparent text-white border-none h-14 px-6 text-lg focus:ring-0 focus:outline-none placeholder:text-blue-200/60"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <button 
              className="bg-white text-blue-600 hover:bg-blue-50 h-14 px-10 rounded-xl text-lg font-bold transition-all active:scale-95"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? '提交中...' : '立即加入'}
              {!status.startsWith('submit') && <ArrowRight className="w-5 h-5 ml-2" />}
            </button>
          </form>
        )}
        
        <p className="text-blue-200/50 text-xs mt-8 font-medium">
          PRIVACY PROTECTED • SECURE SUBMISSION • NO SPAM
        </p>
      </div>
      
      {/* Background Subtle Shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
    </section>
  );
}
