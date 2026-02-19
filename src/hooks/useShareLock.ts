
import { useState, useEffect } from 'react';

export function useShareLock(toolId: string) {
  const [isLocked, setIsLocked] = useState(true);
  const [showLockModal, setShowLockModal] = useState(false);

  useEffect(() => {
    checkLockStatus();
  }, [toolId]);

  const checkLockStatus = () => {
    // 强制每次都视为未解锁（用于测试或强制弹窗）
    // const today = new Date().toISOString().split('T')[0];
    // const lockKey = `share_unlock_${toolId}_${today}`;
    // const isUnlocked = localStorage.getItem(lockKey) === 'true';
    setIsLocked(true); 
  };

  const unlock = () => {
    // 解锁时不写入 localStorage，确保下次刷新后依然锁定
    // const today = new Date().toISOString().split('T')[0];
    // const lockKey = `share_unlock_${toolId}_${today}`;
    // localStorage.setItem(lockKey, 'true');
    setIsLocked(false);
    setShowLockModal(false);
  };

  const checkAccess = () => {
    if (isLocked) {
      setShowLockModal(true);
      return false;
    }
    return true;
  };

  return {
    isLocked,
    showLockModal,
    setShowLockModal,
    unlock,
    checkAccess
  };
}
