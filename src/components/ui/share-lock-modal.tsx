
import React, { useState, useEffect } from 'react';
import { Modal } from './modal';
import { Button } from './button';
import { Share2, Lock, CheckCircle2 } from 'lucide-react';

interface ShareLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
  title?: string;
}

export function ShareLockModal({ isOpen, onClose, onUnlock, title = "分享后解锁" }: ShareLockModalProps) {
  const [step, setStep] = useState<'share' | 'verify'>('share');
  const [isVerifying, setIsVerifying] = useState(false);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('share');
      setIsVerifying(false);
    }
  }, [isOpen]);

  const handleShareClick = () => {
    // 模拟调起分享或复制链接
    if (navigator.share) {
      navigator.share({
        title: '优尼克斯 AI 实验室',
        text: '我发现了一个超好用的 AI 工具，快来试试！',
        url: window.location.href,
      }).catch(console.error);
    } else {
      // 降级方案：复制链接
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制，请去微信粘贴分享给好友');
    }
    setStep('verify');
  };

  const handleVerifyClick = () => {
    setIsVerifying(true);
    // 模拟验证过程（假装在查后台数据）
    setTimeout(() => {
      setIsVerifying(false);
      onUnlock();
      onClose();
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description="本工具为会员专享，分享给好友即可免费使用"
    >
      <div className="flex flex-col items-center justify-center py-4 text-center space-y-6">
        {step === 'share' ? (
            <>
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                    <Lock className="w-10 h-10 text-blue-500" />
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">解锁今日无限次使用权</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">
                        将本工具分享给 <strong>1 位好友</strong> 或 <strong>朋友圈</strong>，即可立即解锁。
                    </p>
                </div>

                <Button onClick={handleShareClick} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
                    <Share2 className="w-5 h-5 mr-2" />
                    立即分享解锁
                </Button>
                
                <p className="text-xs text-slate-400">
                    * 每日 00:00 重置分享状态
                </p>
            </>
        ) : (
            <>
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                    {isVerifying ? (
                        <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin" />
                    ) : (
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">
                        {isVerifying ? '正在验证分享结果...' : '验证成功！'}
                    </h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">
                        {isVerifying ? '请稍候，系统正在确认您的分享状态' : '已为您解锁全部功能'}
                    </p>
                </div>

                <Button 
                    onClick={handleVerifyClick} 
                    className="w-full h-12 text-lg"
                    disabled={isVerifying}
                    variant={isVerifying ? "outline" : "default"}
                >
                    {isVerifying ? '验证中...' : '我已分享，立即解锁'}
                </Button>
                
                <button onClick={() => setStep('share')} className="text-sm text-slate-400 underline">
                    重新分享
                </button>
            </>
        )}
      </div>
    </Modal>
  );
}
