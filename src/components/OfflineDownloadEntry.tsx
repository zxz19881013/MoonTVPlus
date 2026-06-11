'use client';

import React, { useEffect, useState } from 'react';
import { OfflineDownloadPanel } from './OfflineDownloadPanel';

/**
 * 全局离线下载入口
 * - 在 layout 渲染，挂一个右下角小按钮
 * - 仅在 RUNTIME_CONFIG.ENABLE_OFFLINE_DOWNLOAD=true 且用户是 owner/admin 时显示
 * - 点击后打开 OfflineDownloadPanel（自带任务列表 + 进度条 + 重试/删除）
 *
 * 这样做的目的：
 * 1. 让 webpack 把 OfflineDownloadPanel 编译进 client bundle
 * 2. 给所有页面一个统一的入口，无需进 play 页才能管理下载
 */
export function OfflineDownloadEntry() {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const cfg = (window as any).RUNTIME_CONFIG || {};
    setEnabled(cfg.ENABLE_OFFLINE_DOWNLOAD === true);
    try {
      // 简化处理：从 localStorage 读 authInfo（MoonTV 实际是这么存的）
      const authInfo = JSON.parse(localStorage.getItem('authInfo') || '{}');
      const role = authInfo?.role || authInfo?.data?.role;
      setHasPermission(role === 'owner' || role === 'admin');
    } catch {
      setHasPermission(false);
    }
  }, []);

  if (!mounted || !enabled || !hasPermission) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        title="离线下载管理"
        aria-label="离线下载"
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          cursor: 'pointer',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}
      >
        {/* 简单的下载图标 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </button>
      <OfflineDownloadPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
