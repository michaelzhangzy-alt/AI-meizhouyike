
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

declare global {
  interface Window {
    wx: any;
  }
}

export function useWeChatShare() {
  const location = useLocation();

  useEffect(() => {
    const initWeChat = async () => {
      // Skip if localhost
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Local environment detected, skipping WeChat signature fetch.');
        return;
      }

      // 1. Get current URL (remove hash if needed)
      const url = window.location.href.split('#')[0];

      try {
        // 2. Get signature from backend
        const { data, error } = await supabase.functions.invoke('wechat-signature', {
          body: { url }
        });

        if (error || !data) {
            console.log('WeChat signature fetch failed (expected in dev/local environment)', error);
            return;
        }

        // 3. Config WeChat
        if (window.wx) {
          window.wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
          });

          // 4. Get Share Config for current page
          const { data: shareConfig } = await supabase
            .from('share_configs')
            .select('*')
            .eq('page_path', location.pathname)
            .eq('is_active', true)
            .single();

          const title = shareConfig?.title || '优尼克斯教育';
          const desc = shareConfig?.description || 'AI赋能未来，每周一课';
          const imgUrl = shareConfig?.image_url || 'https://your-default-logo-url.com/logo.png';
          const link = window.location.href;

          window.wx.ready(() => {
            window.wx.updateAppMessageShareData({ 
              title, desc, link, imgUrl,
              success: function () { console.log('Shared to friend'); }
            });
            window.wx.updateTimelineShareData({ 
              title, link, imgUrl,
              success: function () { console.log('Shared to timeline'); }
            });
          });
        }
      } catch (e) {
        console.error('WeChat init error:', e);
      }
    };

    // Load WeChat JS-SDK script if not loaded
    if (!document.getElementById('wx-jssdk')) {
      const script = document.createElement('script');
      script.id = 'wx-jssdk';
      script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
      script.onload = initWeChat;
      document.body.appendChild(script);
    } else {
      initWeChat();
    }

  }, [location.pathname]);
}
