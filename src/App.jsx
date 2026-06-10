import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FileText,
  BarChart,
  Users,
  Heart,
  Sun as SunIcon,
  BookOpen,
} from 'lucide-react';

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
const heroImage = new URL('../Assets/image.webp', import.meta.url).href;
const resumeUrl = new URL('../Assets/Resume.pdf', import.meta.url).href;

/* ─── Crypto helpers ─── */
async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function generateSessionToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/* ─── LocalStorage helpers ─── */
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

function isSessionValid() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.session);
    if (!raw) return false;
    const session = JSON.parse(raw);
    // Session expires after 24 hours
    return session.token && Date.now() - session.created < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function credentialsExist() {
  return !!localStorage.getItem(STORAGE_KEYS.credentials);
}

/* ─── Route helper ─── */
function getHashRoute() {
  const hash = window.location.hash;
  if (hash === '#/admin' || hash === '#/admin/') return 'admin';
  return 'portfolio';
}

/* ─── Enrich projects with icon components ─── */
function enrichProjects(projects) {
  return projects.map((p) => ({
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
  const [content, setContent] = useState(() => loadContent() || defaults);

  /* ── Auth state ── */
  const [authenticated, setAuthenticated] = useState(isSessionValid);
  const [credentialsConfigured, setCredentialsConfigured] = useState(credentialsExist);

  /* ── UI state ── */
  const [route, setRoute] = useState(getHashRoute);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState('light');

  const mainRef = useRef(null);

  /* ── Scroll animations (GSAP) ── */
  useScrollAnimations();

  /* ── Persist content whenever it changes ── */
  useEffect(() => {
    saveContent(content);
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

  /* ── Auth handlers ── */
  const handleAuthenticate = useCallback(async (form, isSetup) => {
    if (isSetup) {
      if (!form.username.trim()) throw new Error('Username is required.');
      if (form.password.length < 6) throw new Error('Password must be at least 6 characters.');
      if (form.password !== form.confirmPassword) throw new Error('Passwords do not match.');

      const hash = await sha256(form.username + ':' + form.password);
      localStorage.setItem(STORAGE_KEYS.credentials, JSON.stringify({ hash }));
      setCredentialsConfigured(true);

      const token = generateSessionToken();
      localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ token, created: Date.now() }));
      setAuthenticated(true);
      return;
    }

    // Login
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.credentials) || '{}');
    const hash = await sha256(form.username + ':' + form.password);
    if (hash !== stored.hash) throw new Error('Invalid username or password.');

    const token = generateSessionToken();
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ token, created: Date.now() }));
    setAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.session);
    setAuthenticated(false);
  }, []);

  /* ── Content change handler ── */
  const handleContentChange = useCallback((updater) => {
    setContent((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
  }, []);

  /* ── CMS helpers ── */
  const handleCmsClose = useCallback(() => {
    window.location.hash = '#/';
  }, []);

  const handleResetToDefaults = useCallback(() => {
    if (window.confirm('Reset all content to factory defaults? This cannot be undone.')) {
      setContent(defaults);
    }
  }, [defaults]);

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
        credentialsConfigured={credentialsConfigured}
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
