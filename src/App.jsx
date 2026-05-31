import { useEffect, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  FileText,
  Heart,
  Sun,
  Users,
} from 'lucide-react';
import Scene3D from './components/Scene3D';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import useScrollAnimations from './hooks/useScrollAnimations';

const heroImage = new URL('../Assets/image.webp', import.meta.url).href;
const resumeUrl = new URL('../Assets/Resume.pdf', import.meta.url).href;

const skillBars = [
  { label: 'Python & AI/ML', value: 90, color: 'cyan' },
  { label: 'Data Analysis (SQL/EDA)', value: 85, color: 'purple' },
  { label: 'Web Dev (HTML/CSS/JS)', value: 80, color: 'pink' },
  { label: 'Cloud Architecture', value: 75, color: 'yellow' },
];

const projects = [
  {
    title: 'Resume-Checker',
    description: 'A system to parse, analyze, and score resumes, showing skills in data extraction and analysis.',
    tags: ['Python', 'NLP'],
    accent: 'cyan',
    icon: FileText,
    link: 'https://github.com/ameya-jarvis-07/Resume-Checker',
  },
  {
    title: 'Crime-Analysis-Demo',
    description: 'Crime dataset analysis to identify patterns and trends using Python and visualization techniques.',
    tags: ['Data Viz', 'Pandas'],
    accent: 'purple',
    icon: BarChart3,
    link: 'https://github.com/ameya-jarvis-07/Crime-Analysis-Demo',
  },
  {
    title: 'Account-Management',
    description: 'Full-stack CRUD app for user account management, demonstrating database and UI skills.',
    tags: ['Full Stack', 'SQL'],
    accent: 'green',
    icon: Users,
    link: 'https://github.com/ameya-jarvis-07/Account-Management-System',
  },
  {
    title: 'Hunger-Bridge',
    description: 'A socially focused project that connects food donors with organizations to reduce food waste.',
    tags: ['Social Good', 'Web App'],
    accent: 'yellow',
    icon: Heart,
    link: 'https://github.com/ameya-jarvis-07/Hunger-Bridge',
  },
  {
    title: 'Solar-Explorer',
    description: 'Interactive solar system exploration tool with real-time planetary data and 3D rendering.',
    tags: ['3D Graphics', 'Web Dev'],
    accent: 'orange',
    icon: Sun,
    link: 'https://ameya-jarvis-07.github.io/Solar-Explorer/',
  },
  {
    title: 'Neuro.Net',
    description: 'Youth-driven workshops on psychology and artificial intelligence.',
    tags: ['Education', 'Algorithms'],
    accent: 'blue',
    icon: BookOpen,
    link: 'https://neuronet.co.in',
  },
];

const education = [
  { title: 'B. Tech in AI & Data Science', place: 'Anjuman College of Engineering & Technology', status: 'Pursuing' },
  { title: 'HSC & SSC', place: 'Sandipani School / Essence International School', status: '' },
];

const certifications = [
  'GenAI Powered Data Analytics (TATA)',
  'Data Analytics Job Simulation (Deloitte)',
  'Solutions Architecture (AWS)',
  'Git & GitHub Workshop (ACET)',
];

function LoaderSkeleton() {
  return (
    <div id="loader" className="loader-container" role="status" aria-live="polite">
      <div className="loader-spinner"></div>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState('light');

  // Initialize GSAP scroll animations
  useScrollAnimations();

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('theme', theme);
  }, [theme]);


  useEffect(() => {
    const reveal = () => {
      window.setTimeout(() => setIsLoading(false), 150);
    };

    if (document.readyState === 'complete') {
      reveal();
      return undefined;
    }

    window.addEventListener('load', reveal, { once: true });
    const fallback = window.setTimeout(reveal, 4000);

    return () => {
      window.clearTimeout(fallback);
      window.removeEventListener('load', reveal);
    };
  }, []);

  useEffect(() => {
    const sectionIds = ['home', 'about', 'projects', 'contact'];

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      let currentSection = 'home';
      sectionIds.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (!element) return;

        const sectionTop = element.offsetTop - 150;
        const sectionBottom = sectionTop + element.offsetHeight;
        if (currentScrollY >= sectionTop && currentScrollY < sectionBottom) {
          currentSection = sectionId;
        }
      });

      setActiveSection(currentSection);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleToggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <>
      {isLoading ? <LoaderSkeleton /> : null}
      
      <Scene3D scrollY={scrollY} />
      
      <div className="app-container">
        <Navbar 
          activeSection={activeSection}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen(!menuOpen)}
          onCloseMenu={() => setMenuOpen(false)}
          resumeUrl={resumeUrl}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
        
        <main className="main-content">
          <HeroSection resumeUrl={resumeUrl} heroImage={heroImage} />
          <AboutSection
            skillBars={skillBars}
            education={education}
            certifications={certifications}
            heroImage={heroImage}
          />
          <ProjectsSection projects={projects} />
          <ContactSection />
        </main>
      </div>
    </>
  );
}