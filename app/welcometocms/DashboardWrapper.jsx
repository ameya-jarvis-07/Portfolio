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

  // Merge loaded database content with default structure to prevent form fields crashing on missing sections
  const mergedContent = initialContent && typeof initialContent === 'object' && initialContent.site && initialContent.hero
    ? {
        site: { ...defaults.site, ...initialContent.site },
        hero: { ...defaults.hero, ...initialContent.hero },
        about: { ...defaults.about, ...initialContent.about },
        projects: initialContent.projects || defaults.projects,
        contact: { ...defaults.contact, ...initialContent.contact },
        footer: { ...defaults.footer, ...initialContent.footer }
      }
    : defaults;

  const [content, setContent] = useState(mergedContent);
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
 
  // Sync draft content to preview iframe instantly on typing
  useEffect(() => {
    sendPreviewUpdate(content);
  }, [content, sendPreviewUpdate]);

  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    setErrorMessage('');
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });

      if (res.ok) {
        lastSavedContentRef.current = JSON.stringify(content);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        const errData = await res.json();
        setSaveStatus('error');
        setErrorMessage(errData.error || 'Failed to save changes.');
      }
    } catch (err) {
      setSaveStatus('error');
      setErrorMessage(err.message || 'Network error.');
    }
  }, [content]);
 
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
        saveStatus={saveStatus}
        errorMessage={errorMessage}
        onSave={handleSave}
      />
    </div>
  );
}
