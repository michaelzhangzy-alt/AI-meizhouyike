
import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from './modal';
import { Button } from './button';
import { generatePoster, downloadImage } from '../../lib/canvas-utils';
import { Download, Loader2 } from 'lucide-react';

interface SharePosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
  title: string;
  shareUrl?: string;
}

export function SharePosterModal({ isOpen, onClose, onUnlock, title, shareUrl = window.location.href }: SharePosterModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // 这里的 'share-poster-content' 必须与下面 div 的 id 一致
      const dataUrl = await generatePoster('share-poster-content');
      downloadImage(dataUrl, `unixtech-share-${Date.now()}.png`);
      
      // 下载完成后，视为已分享，执行解锁逻辑
      setTimeout(() => {
        onUnlock();
      }, 1000);
    } catch (error) {
      alert('海报生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="分享解锁黑科技"
      description="生成专属海报，分享给好友即可永久解锁"
    >
      <div className="flex flex-col items-center space-y-6">
        {/* 海报预览区域 (这也是 html2canvas 截图的目标) */}
        <div 
          id="share-poster-content"
          className="relative w-[280px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-2xl text-white p-6 flex flex-col items-center text-center"
        >
          {/* 装饰背景 */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />

          {/* 内容 */}
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
               <span className="text-2xl">🧪</span>
            </div>
            
            <div>
                <h3 className="font-bold text-lg leading-tight mb-1">UNIXTECH AI LAB</h3>
                <p className="text-xs text-slate-400">发现未来的力量</p>
            </div>

            <div className="py-4 border-y border-white/10 my-2">
                <p className="text-sm font-medium text-blue-200 mb-1">推荐工具</p>
                <h2 className="text-xl font-bold">{title}</h2>
            </div>

            <div className="bg-white p-2 rounded-lg inline-block">
               <QRCodeSVG value={shareUrl} size={100} />
            </div>
            
            <p className="text-[10px] text-slate-400">长按识别二维码 · 免费体验黑科技</p>
          </div>
        </div>

        {/* 操作按钮区 */}
        <div className="w-full space-y-3">
            <Button 
                onClick={handleDownload} 
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
                disabled={isGenerating}
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        生成中...
                    </>
                ) : (
                    <>
                        <Download className="w-5 h-5 mr-2" />
                        保存海报并解锁
                    </>
                )}
            </Button>
            
            <p className="text-xs text-center text-slate-500">
                保存图片后分享给好友，系统将自动为您解锁
            </p>
        </div>
      </div>
    </Modal>
  );
}
