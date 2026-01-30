
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/admin/dashboard');
    } catch (err: any) {
      const msg: string = (err?.message || '').toLowerCase();
      if (msg.includes('invalid login') || msg.includes('invalid credentials')) {
        setError('邮箱或密码不正确，请重试');
      } else if (msg.includes('email not confirmed') || msg.includes('confirm your email')) {
        setError('邮箱尚未验证：请前往注册邮箱点击验证链接后再登录');
      } else if (msg.includes('network') || msg.includes('fetch')) {
        setError('网络异常：请检查网络或稍后重试');
      } else {
        setError(err.message || '登录失败，请重试');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('请先输入邮箱，再点击重新发送验证邮件');
      return;
    }

    try {
      setResending(true);
      setError('');
      setInfo('');

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;
      setInfo('验证邮件已发送，请检查邮箱（包括垃圾箱）');
    } catch (err: any) {
      setError(err.message || '发送失败，请稍后重试');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">管理员登录</h1>
          <p className="text-sm text-gray-500 mt-2">请输入您的管理账号</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {info && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
            {info}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">邮箱</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">密码</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={resending}
            onClick={handleResend}
          >
            {resending ? '发送中...' : '重新发送验证邮件'}
          </Button>
          <div className="text-xs text-gray-500 mt-2 space-y-1">
            <p>提示：</p>
            <p>· 如果提示“邮箱未验证”，请到注册邮箱点击确认邮件后再登录</p>
            <p>· 如忘记密码，可联系管理员重置密码</p>
          </div>
        </form>
      </Card>
    </div>
  );
}
