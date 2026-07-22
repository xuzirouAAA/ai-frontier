'use client';

import { useEffect, useState } from 'react';

/**
 * 广告拦截器检测组件
 * 检测用户是否启用了广告拦截器，显示友好的提示
 */
export default function AdBlockerDetect() {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    // 通过检测 AdSense 容器是否被正确加载来判断
    const check = () => {
      const adElements = document.querySelectorAll('.adsbygoogle');
      if (adElements.length === 0) return;

      // 检查是否有广告被拦截（AdSense 脚本加载但容器为空）
      const allBlocked = Array.from(adElements).every((el) => {
        return !el.querySelector('ins[data-ad-status="filled"]') &&
               el.children.length === 0;
      });

      if (allBlocked) {
        setBlocked(true);
      }
    };

    // 给 AdSense 一些时间来加载
    setTimeout(check, 3000);
  }, []);

  if (!blocked) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-yellow-200 bg-yellow-50 px-4 py-3 text-center text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
      <p>
        检测到您可能使用了广告拦截器。广告收入是维持本站运营的重要来源，
        如果您喜欢我们的内容，请考虑将本站加入白名单。感谢您的支持！
      </p>
      <button
        onClick={() => setBlocked(false)}
        className="mt-1 text-xs underline"
      >
        关闭
      </button>
    </div>
  );
}
