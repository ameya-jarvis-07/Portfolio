"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { createDefaultPortfolioContent } from '../../src/data/portfolioContent';

const CmsDashboard = dynamic(() => import('../../src/components/CmsDashboard'), {
  ssr: false,
  loading: () => (
    <div className="loader-container">
      <div className="loader-spinner"></div>
    </div>
  )
});

const heroImage = '/Assets/image.webp';
const resumeUrl = '/Assets/Resume.pdf';

export default function DashboardWrapper({ initialContent }) {
  const defaults = createDefaultPortfolioContent({ heroImage, resumeUrl });
  const [content, setContent] = useState(initialContent || defaults);
  const lastSavedContentRef = useRef(JSON.stringify(initialContent));
 
  // Preview states
  const [showPreview, setShowPreview] = useState(true);
  const [previewDevice, setPreviewDevice] = useState('landscape');
  const iframeRef = useRef(null);
 
  // Helper to send messages to the preview iframe
  const sendPreviewUpdate = useCallback((currentContent) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'PORTFOLIO_PREVIEW_UPDATE',
        content: currentContent
      }, window.location.origin);
    }
  }, []);
 
  // Auto-save content edits back to `/api/portfolio`
  useEffect(() => {
    const currentStr = JSON.stringify(content);
    
    // Instantly sync the draft content to the preview iframe (typing previews are immediate)
    sendPreviewUpdate(content);
 
    if (currentStr === lastSavedContentRef.current) return;
 
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: currentStr
        });
 
        if (res.ok) {
          lastSavedContentRef.current = currentStr;
        } else {
          console.error('Auto-save error response:', await res.json());
        }
      } catch (err) {
        console.error('Auto-save communication error:', err);
      }
    }, 1000); // 1s debounce
 
    return () => clearTimeout(timer);
  }, [content, sendPreviewUpdate]);
 
  const handleIframeLoad = useCallback(() => {
    sendPreviewUpdate(content);
  }, [content, sendPreviewUpdate]);
 
  const handleLogout = useCallback(async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      });
      if (res.ok) {
        window.location.href = '/hellothere';
      }
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }, []);
 
  const handleResetToDefaults = useCallback(() => {
    if (window.confirm('Reset all content to factory defaults on the server? This cannot be undone.')) {
      setContent(defaults);
    }
  }, [defaults]);
 
  const handleContentChange = useCallback((updater) => {
    setContent((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
  }, []);
 
  return (
    <div className="fullscreen-cms-container">
      <CmsDashboard
        open={true}
        authenticated={true}
        credentialsConfigured={true}
        content={content}
        onContentChange={handleContentChange}
        onAuthenticate={() => {}}
        onLogout={handleLogout}
        onClose={() => { window.location.href = '/'; }}
        onResetToDefaults={handleResetToDefaults}
        fullScreen={true}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview((p) => !p)}
        previewDevice={previewDevice}
        onPreviewDeviceChange={setPreviewDevice}
        iframeRef={iframeRef}
        onIframeLoad={handleIframeLoad}
      />
    </div>
  );
}
