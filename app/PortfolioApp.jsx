"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FileText,
  BarChart,
  Users,
  Heart,
  Sun as SunIcon,
  BookOpen,
} from 'lucide-react';

import Navbar from '../src/components/Navbar';
import HeroSection from '../src/components/HeroSection';
import AboutSection from '../src/components/AboutSection';
import ProjectsSection from '../src/components/ProjectsSection';
import ContactSection from '../src/components/ContactSection';
import Footer from '../src/components/Footer';
import Scene3D from '../src/components/Scene3D';
import useScrollAnimations from '../src/hooks/useScrollAnimations';
import { createDefaultPortfolioContent } from '../src/data/portfolioContent';

/* ─── Icon registry ─── */
const ICON_MAP = {
  'file-text': FileText,
  'bar-chart': BarChart,
  users: Users,
  heart: Heart,
  sun: SunIcon,
  'book-open': BookOpen,
};

/* ─── Static Asset URLs ─── */
const heroImage = '/Assets/image.webp';
const resumeUrl = '/Assets/Resume.pdf';

/* ─── Enrich projects with icon components ─── */
function enrichProjects(projects) {
  return projects.map((p) => ({
    ...p,
    icon: ICON_MAP[p.iconKey] || FileText,
  }));
}

/* ============================================================
   PORTFOLIO APP (PUBLIC CLIENT COMPONENT)
   ============================================================ */
export default function PortfolioApp({ initialContent }) {
  /* ── Content state ── */
  const defaults = createDefaultPortfolioContent({ heroImage, resumeUrl });
  const [content, setContent] = useState(initialContent || defaults);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === 'PORTFOLIO_PREVIEW_UPDATE') {
        setContent(event.data.content);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  /* ── UI state ── */
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState('light');

  const mainRef = useRef(null);

  /* ── Scroll animations (GSAP) ── */
  useScrollAnimations();

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

  /* ── Filters for active (non-soft-deleted) items ── */
  const activeStats = (content.hero.stats || []).filter(s => !s.deleted);
  const activeHighlights = (content.hero.highlights || [])
    .filter(h => typeof h === 'string' ? true : !h.deleted)
    .map(h => typeof h === 'string' ? h : h.text);

  const activeSkills = (content.about.skillBars || []).filter(s => !s.deleted);
  const activeEducation = (content.about.education || []).filter(e => !e.deleted);
  const activeCertifications = (content.about.certifications || [])
    .filter(c => !c.deleted)
    .map((c) => c.label);

  const activeProjects = enrichProjects((content.projects || []).filter(p => !p.deleted));
  
  const activeContactLinks = (content.contact.links || []).filter(l => !l.deleted);
  
  const activeQuickLinks = (content.footer.quickLinks || []).filter(l => !l.deleted);
  const activeSocialLinks = (content.footer.socialLinks || []).filter(l => !l.deleted);

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
            hero={{
              ...content.hero,
              highlights: activeHighlights,
              stats: activeStats
            }}
            resumeUrl={content.hero.resumeUrl || resumeUrl}
            heroImage={content.hero.image || heroImage}
          />
          <AboutSection
            about={{
              ...content.about,
              skillBars: activeSkills,
              education: activeEducation,
              certifications: (content.about.certifications || [])
                .filter(c => !c.deleted)
            }}
            skillBars={activeSkills}
            education={activeEducation}
            certifications={activeCertifications}
            heroImage={content.hero.image || heroImage}
          />
          <ProjectsSection projects={activeProjects} />
          <ContactSection 
            contact={{
              ...content.contact,
              links: activeContactLinks
            }} 
          />
          <Footer 
            footer={{
              ...content.footer,
              quickLinks: activeQuickLinks,
              socialLinks: activeSocialLinks
            }} 
            resumeUrl={content.hero.resumeUrl || resumeUrl} 
          />
        </main>
      </div>
    </>
  );
}
