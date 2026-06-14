import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FileText,
  BarChart,
  Users,
  Heart,
  Sun as SunIcon,
  BookOpen,
} from 'lucide-react';
import { auth } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import Scene3D from './components/Scene3D';
import CmsDashboard from './components/CmsDashboard';
import useScrollAnimations from './hooks/useScrollAnimations';
import { createDefaultPortfolioContent, STORAGE_KEYS } from './data/portfolioContent';

/* ─── Icon registry ─── */
const ICON_MAP = {
  'file-text': FileText,
  'bar-chart': BarChart,
  users: Users,
  heart: Heart,
  sun: SunIcon,
  'book-open': BookOpen,
};

/* ─── Asset URLs ─── */
const heroImage = 'https://res.cloudinary.com/dlwj22t9e/image/upload/v1781444840/image_kysrq2.webp';
const resumeUrl = 'https://res.cloudinary.com/dlwj22t9e/raw/upload/v1781444843/Resume_krwrvk.pdf';

/* ─── LocalStorage helpers (Fallback) ─── */
function loadContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.content);
    if (raw) return JSON.parse(raw);
  } catch {
    /* corrupted — fall back to defaults */
  }
  return null;
}

function saveContent(content) {
  try {
    localStorage.setItem(STORAGE_KEYS.content, JSON.stringify(content));
  } catch {
    /* quota exceeded — silent */
  }
}

/* ─── Route helper ─── */
function getHashRoute() {
  const hash = window.location.hash;
  if (hash === '#/admin' || hash === '#/admin/') return 'admin';
  return 'portfolio';
}

/* ─── Enrich projects with icon components ─── */
function enrichProjects(projects) {
  return (projects || []).map((p) => ({
    ...p,
    icon: ICON_MAP[p.iconKey] || FileText,
  }));
}

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  /* ── Content state ── */
  const defaults = createDefaultPortfolioContent({ heroImage, resumeUrl });
  defaults.contact.emailjs = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  };

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── Auth state ── */
  const [authenticated, setAuthenticated] = useState(false);

  /* ── UI state ── */
  const [route, setRoute] = useState(getHashRoute);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState('light');

  const mainRef = useRef(null);

  /* ── Scroll animations (GSAP) ── */
  useScrollAnimations();

  /* ── Listen for Firebase Auth Changes ── */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
    });
    return unsubscribe;
  }, []);

  /* ── Fetch portfolio data from database API ── */
  useEffect(() => {
    async function loadPortfolio() {
      try {
        const res = await fetch('/api/portfolio');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (data.uninitialized) {
          setContent(defaults);
        } else {
          // Merge EmailJS values from env
          data.contact.emailjs = {
            serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
            templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
            publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
          };
          setContent(data);
        }
      } catch (err) {
        console.error('Error fetching portfolio from database API:', err);
        const local = loadContent();
        if (local) {
          local.contact.emailjs = {
            serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
            templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
            publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
          };
        }
        setContent(local || defaults);
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, [defaults]);

  /* ── Persist content whenever it changes (Local Storage fallback) ── */
  useEffect(() => {
    if (content) {
      saveContent(content);
    }
  }, [content]);

  /* ── Hash routing ── */
  useEffect(() => {
    const handleHashChange = () => setRoute(getHashRoute());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  /* ── Scroll tracking ── */
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      const sections = document.querySelectorAll('section[id]');
      let current = 'home';
      for (const section of sections) {
        const top = section.offsetTop - 150;
        if (window.scrollY >= top) {
          current = section.getAttribute('id');
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Theme ── */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  /* ── Database save helper ── */
  const saveContentToDb = useCallback(async (updatedContent) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Not authenticated');

      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedContent),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save to database');
      }
      return true;
    } catch (err) {
      console.error('Error saving content to database API:', err);
      alert('Failed to save to database: ' + err.message);
      return false;
    }
  }, []);

  /* ── Auth handlers using Firebase Auth ── */
  const handleAuthenticate = useCallback(async (form) => {
    if (!form.email.trim()) throw new Error('Email is required.');
    if (form.password.length < 6) throw new Error('Password must be at least 6 characters.');

    await signInWithEmailAndPassword(auth, form.email, form.password);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }, []);

  /* ── Content change handler ── */
  const handleContentChange = useCallback((updater) => {
    setContent((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      // Trigger database save asynchronously
      saveContentToDb(next);
      return next;
    });
  }, [saveContentToDb]);

  /* ── CMS helpers ── */
  const handleCmsClose = useCallback(() => {
    window.location.hash = '#/';
  }, []);

  const handleResetToDefaults = useCallback(() => {
    if (window.confirm('Reset all content to factory defaults? This cannot be undone.')) {
      setContent(defaults);
      saveContentToDb(defaults);
    }
  }, [defaults, saveContentToDb]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'system-ui, sans-serif',
        background: '#0a0b10',
        color: '#fff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{
            border: '4px solid rgba(255,255,255,0.1)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            borderLeftColor: '#00f2fe',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 15px'
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  /* ── Enriched projects for rendering ── */
  const projects = enrichProjects(content.projects);

  /* ── Render ── */
  return (
    <>
      {/* 3D background */}
      <Scene3D scrollY={scrollY} />

      {/* Portfolio */}
      <div className="app-container" ref={mainRef}>
        <Navbar
          activeSection={activeSection}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((o) => !o)}
          onCloseMenu={() => setMenuOpen(false)}
          resumeUrl={content.hero.resumeUrl || resumeUrl}
          theme={theme}
          onToggleTheme={toggleTheme}
          brand={content.site.brand}
        />

        <main className="main-content">
          <HeroSection
            hero={content.hero}
            resumeUrl={content.hero.resumeUrl || resumeUrl}
            heroImage={content.hero.image || heroImage}
          />
          <AboutSection
            about={content.about}
            skillBars={content.about.skillBars}
            education={content.about.education}
            certifications={content.about.certifications.map((c) => c.label)}
            heroImage={content.hero.image || heroImage}
          />
          <ProjectsSection projects={projects} />
          <ContactSection contact={content.contact} />
          <Footer footer={content.footer} resumeUrl={content.hero.resumeUrl || resumeUrl} />
        </main>
      </div>

      {/* CMS Dashboard — only renders on /#/admin */}
      <CmsDashboard
        open={route === 'admin'}
        authenticated={authenticated}
        credentialsConfigured={true}
        content={content}
        onContentChange={handleContentChange}
        onAuthenticate={handleAuthenticate}
        onLogout={handleLogout}
        onClose={handleCmsClose}
        onResetToDefaults={handleResetToDefaults}
      />
    </>
  );
}

