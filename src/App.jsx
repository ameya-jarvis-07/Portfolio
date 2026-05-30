import { useEffect, useMemo, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import {
  Award,
  BarChart3,
  BookOpen,
  Code2,
  ExternalLink,
  FileText,
  GraduationCap,
  Heart,
  Home,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  CheckCircle2,
  Sun,
  User,
  Users,
  X,
  Github,
} from 'lucide-react';
const heroImage = new URL('../Assets/image.webp', import.meta.url).href;
const resumeUrl = new URL('../Assets/Resume.pdf', import.meta.url).href;

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'projects', label: 'Work', icon: Code2 },
  { id: 'contact', label: 'Contact', icon: Mail },
];

const skillBars = [
  { label: 'Python & AI/ML', value: 90, color: 'bg-cyber-primary', text: 'text-cyber-primary' },
  { label: 'Data Analysis (SQL/EDA)', value: 85, color: 'bg-cyber-secondary', text: 'text-cyber-secondary' },
  { label: 'Web Dev (HTML/CSS/JS)', value: 80, color: 'bg-pink-500', text: 'text-pink-500' },
  { label: 'Cloud Architecture', value: 75, color: 'bg-yellow-400', text: 'text-yellow-400' },
];

const projects = [
  {
    title: 'Resume-Checker',
    description: 'A system to parse, analyze, and score resumes, showing skills in data extraction and analysis.',
    tags: ['Python', 'NLP'],
    accent: 'text-cyber-primary',
    pill: 'bg-cyber-primary/20',
    icon: FileText,
    link: 'https://github.com/ameya-jarvis-07/Resume-Checker',
  },
  {
    title: 'Crime-Analysis-Demo',
    description: 'Crime dataset analysis to identify patterns and trends using Python and visualization techniques.',
    tags: ['Data Viz', 'Pandas'],
    accent: 'text-cyber-secondary',
    pill: 'bg-cyber-secondary/20',
    icon: BarChart3,
    link: 'https://github.com/ameya-jarvis-07/Crime-Analysis-Demo',
  },
  {
    title: 'Account-Management',
    description: 'Full-stack CRUD app for user account management, demonstrating database and UI skills.',
    tags: ['Full Stack', 'SQL'],
    accent: 'text-green-400',
    pill: 'bg-green-500/20',
    icon: Users,
    link: 'https://github.com/ameya-jarvis-07/Account-Management-System',
  },
  {
    title: 'Hunger-Bridge',
    description: 'A socially focused project that connects food donors with organizations to reduce food waste.',
    tags: ['Social Good', 'Web App'],
    accent: 'text-yellow-400',
    pill: 'bg-yellow-500/20',
    icon: Heart,
    link: 'https://github.com/ameya-jarvis-07/Hunger-Bridge',
  },
  {
    title: 'Solar-Explorer',
    description: 'Interactive solar system exploration tool with real-time planetary data and 3D rendering.',
    tags: ['3D Graphics', 'Web Dev'],
    accent: 'text-orange-400',
    pill: 'bg-orange-500/20',
    icon: Sun,
    link: 'https://ameya-jarvis-07.github.io/Solar-Explorer/',
  },
  {
    title: 'Neuro.Net',
    description: 'Youth-driven workshops on psychology and artificial intelligence.',
    tags: ['Education', 'Algorithms'],
    accent: 'text-blue-400',
    pill: 'bg-blue-500/20',
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
    <div id="loader" role="status" aria-live="polite">
      <div className="loader-overlay flex flex-col items-center justify-start">
        <div className="skeleton-nav w-full h-16 mb-6" />
        <div className="skeleton-hero w-full max-w-3xl mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="skeleton-circle mb-6" />
            <div className="skeleton-line title mb-3" />
            <div className="skeleton-line subtitle mb-6" />
            <div className="skeleton-buttons flex gap-4 mb-8">
              <div className="skeleton-button" />
              <div className="skeleton-button small" />
            </div>
            <div className="skeleton-stats grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <div className="skeleton-stat" />
              <div className="skeleton-stat" />
              <div className="skeleton-stat" />
              <div className="skeleton-stat" />
            </div>
          </div>
        </div>
        <div className="skeleton-projects w-full max-w-6xl mx-auto mt-10 px-4 grid md:grid-cols-2 gap-8">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
        <span className="sr-only">Loading content...</span>
      </div>
    </div>
  );
}

function StatCard({ value, label, className }) {
  return (
    <div className="glass-panel p-4 rounded-xl text-center">
      <div className={`text-3xl font-bold ${className}`}>{value}</div>
      <div className="text-xs uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}

function ProjectCard({ project }) {
  const Icon = project.icon;

  return (
    <a href={project.link} target="_blank" rel="noreferrer" className="block h-full">
      <article className="glass-panel p-6 rounded-2xl card-3d group relative overflow-hidden h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 opacity-60" />
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${project.pill} ${project.accent}`}>
              <Icon className="w-5 h-5" />
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
          <p className="text-gray-300 text-sm mb-4 flex-1">{project.description}</p>
          <div className="flex gap-2 flex-wrap">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className={`text-xs bg-black/50 px-2 py-1 rounded ${project.accent} border border-current/30`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </a>
  );
}

function SectionHeading({ children, className = '' }) {
  return <h2 className={`text-4xl font-bold mb-8 text-center mt-8 ${className}`}>{children}</h2>;
}

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ kind: '', message: '' });
  const [reduceMotion, setReduceMotion] = useState(false);
  const contactFormRef = useRef(null);
  const canvasRef = useRef(null);
  const threeStateRef = useRef(null);

  const savedTheme = useMemo(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduceMotion(media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    setIsDark(savedTheme === 'dark');
  }, [savedTheme]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('dark', isDark);
    html.classList.toggle('light', !isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

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

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY;
      let currentSection = 'home';

      sectionIds.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (!element) return;

        const sectionTop = element.offsetTop - 150;
        const sectionBottom = sectionTop + element.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentSection = sectionId;
        }
      });

      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
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

  useEffect(() => {
    if (reduceMotion || !canvasRef.current) return undefined;
    let cancelled = false;
    let frameId = 0;
    let disposeScene = () => {};

    (async () => {
      const THREE = await import('three');
      if (cancelled || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 2500;
      const posArray = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i += 1) {
        posArray[i] = (Math.random() - 0.5) * 20;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

      const material = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x00f3ff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        fog: false,
      });

      const particlesMesh = new THREE.Points(particlesGeometry, material);
      scene.add(particlesMesh);

      const gridHelper = new THREE.GridHelper(30, 30, 0xbc13fe, 0x222222);
      gridHelper.position.y = -3;
      gridHelper.rotation.x = 0.3;
      gridHelper.scale.set(1.5, 1.5, 1.5);
      scene.add(gridHelper);

      const torusGeometry = new THREE.TorusGeometry(5, 0.5, 32, 64);
      const torusMaterial = new THREE.MeshStandardMaterial({
        color: 0x00f3ff,
        metalness: 0.7,
        roughness: 0.2,
        wireframe: true,
        emissive: 0x00f3ff,
        emissiveIntensity: 0.3,
      });
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);
      torus.rotation.x = 0.5;
      torus.rotation.z = 0.3;
      torus.position.z = -5;
      scene.add(torus);

      const torusGeometry2 = new THREE.TorusGeometry(3, 0.3, 32, 64);
      const torusMaterial2 = new THREE.MeshStandardMaterial({
        color: 0xbc13fe,
        metalness: 0.6,
        roughness: 0.3,
        wireframe: true,
        emissive: 0xbc13fe,
        emissiveIntensity: 0.2,
      });
      const torus2 = new THREE.Mesh(torusGeometry2, torusMaterial2);
      torus2.rotation.y = 0.5;
      torus2.rotation.x = 0.2;
      torus2.position.z = -8;
      torus2.position.x = 2;
      scene.add(torus2);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0x00f3ff, 1.5);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      const pointLight2 = new THREE.PointLight(0xbc13fe, 1);
      pointLight2.position.set(-5, -5, 5);
      scene.add(pointLight2);

      camera.position.z = 5;

      const applyTheme = (dark) => {
        if (dark) {
          material.color.setHex(0x00f3ff);
          material.opacity = 0.9;
          gridHelper.material.opacity = 0.4;
          gridHelper.material.color.setHex(0xbc13fe);
          torusMaterial.color.setHex(0x00f3ff);
          torusMaterial.emissive.setHex(0x00f3ff);
          torusMaterial.emissiveIntensity = 0.3;
          torusMaterial2.color.setHex(0xbc13fe);
          torusMaterial2.emissive.setHex(0xbc13fe);
          torusMaterial2.emissiveIntensity = 0.2;
          ambientLight.intensity = 0.4;
          pointLight.intensity = 1.5;
          pointLight2.intensity = 1.0;
          renderer.setClearColor(0x000000, 0);
          canvas.style.filter = 'invert(0)';
        } else {
          material.color.setHex(0x0055ff);
          material.opacity = 1.0;
          material.size = 0.08;
          gridHelper.material.opacity = 1.0;
          gridHelper.material.color.setHex(0x001a66);
          torusMaterial.color.setHex(0x0055ff);
          torusMaterial.emissive.setHex(0x0055ff);
          torusMaterial.emissiveIntensity = 1.2;
          torusMaterial2.color.setHex(0x6600ff);
          torusMaterial2.emissive.setHex(0x6600ff);
          torusMaterial2.emissiveIntensity = 1.0;
          ambientLight.intensity = 1.5;
          pointLight.intensity = 3.5;
          pointLight2.intensity = 2.5;
          renderer.setClearColor(0xc3e0fa, 1);
          canvas.style.filter = 'invert(0)';
        }
      };

      applyTheme(isDark);
      threeStateRef.current = { applyTheme };

      let mouseX = 0;
      let mouseY = 0;
      const clock = new THREE.Clock();

      const onMouseMove = (event) => {
        mouseX = event.clientX - window.innerWidth / 2;
        mouseY = event.clientY - window.innerHeight / 2;
      };

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        const targetX = mouseX * 0.0008;
        const targetY = mouseY * 0.0008;

        particlesMesh.rotation.y += 0.3 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.3 * (targetY - particlesMesh.rotation.x);
        particlesMesh.rotation.z = elapsedTime * 0.03;

        gridHelper.position.z = Math.sin(elapsedTime * 0.3) * 2;
        gridHelper.rotation.z = elapsedTime * 0.05;

        torus.rotation.x += 0.001;
        torus.rotation.y += 0.002;
        torus.position.z = -5 + Math.sin(elapsedTime * 0.5) * 2;
        torus.scale.set(
          1 + Math.sin(elapsedTime * 0.4) * 0.1,
          1 + Math.sin(elapsedTime * 0.4 + 1) * 0.1,
          1 + Math.sin(elapsedTime * 0.4 + 2) * 0.1,
        );

        torus2.rotation.x -= 0.0015;
        torus2.rotation.y -= 0.0025;
        torus2.rotation.z += 0.001;
        torus2.position.z = -8 + Math.cos(elapsedTime * 0.4) * 2;
        torus2.position.y = Math.sin(elapsedTime * 0.3) * 1.5;

        pointLight.position.x = Math.sin(elapsedTime * 0.5) * 8;
        pointLight.position.y = Math.cos(elapsedTime * 0.4) * 5;
        gridHelper.material.opacity = 0.3 + Math.sin(elapsedTime * 0.6) * 0.2;

        renderer.render(scene, camera);
        frameId = window.requestAnimationFrame(animate);
      };

      document.addEventListener('mousemove', onMouseMove);
      window.addEventListener('resize', onResize);
      animate();

      disposeScene = () => {
        document.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
        particlesGeometry.dispose();
        torusGeometry.dispose();
        torusGeometry2.dispose();
        material.dispose();
        torusMaterial.dispose();
        torusMaterial2.dispose();
        renderer.dispose();
        threeStateRef.current = null;
      };
    })();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
      disposeScene();
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (threeStateRef.current) {
      threeStateRef.current.applyTheme(isDark);
    }
  }, [isDark]);

  useEffect(() => {
    emailjs.init('CtQwEFyX5Kq-7gqmJ');
  }, []);

  const handleThemeToggle = () => {
    setIsDark((current) => !current);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ kind: '', message: '' });

    try {
      await emailjs.sendForm('service_tbdm0d2', 'template_pch5iiw', contactFormRef.current);
      setStatus({ kind: 'success', message: "Thanks! I'll get back to you soon." });
      contactFormRef.current?.reset();
    } catch (error) {
      setStatus({ kind: 'error', message: 'Message failed to send. Please try email or LinkedIn directly.' });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isLoading ? <LoaderSkeleton /> : null}
      <div className="bg-aurora bg-aurora-1" aria-hidden="true" />
      <div className="bg-aurora bg-aurora-2" aria-hidden="true" />
      <div className="bg-aurora bg-aurora-3" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />
      <canvas ref={canvasRef} id="bg-canvas" aria-hidden="true" />
      <nav className="fixed top-0 left-0 right-0 z-50 w-full">
        <div className="glass-panel px-4 py-3 md:px-8 md:py-4 flex items-center justify-between shadow-2xl bg-black/70 backdrop-blur-xl border-b border-cyber-primary/20">
          <div className="text-xl md:text-2xl font-bold font-mono tracking-tighter">
            <span className="text-cyber-primary">&lt;</span>
            AMEYA_RAMTEKE
            <span className="text-cyber-primary">/&gt;</span>
          </div>
          <button
            type="button"
            className="md:hidden text-gray-200 hover:text-cyber-primary transition-colors p-2"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden md:flex items-center gap-2 md:gap-8">
            {navItems.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`nav-btn ${activeSection === id ? 'active text-cyber-primary scale-110' : 'text-gray-200'} hover:text-cyber-primary transition-colors flex items-center gap-1 md:gap-2`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden md:inline text-sm uppercase font-bold">{label}</span>
              </a>
            ))}
            <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-gray-200 hover:text-cyber-primary transition-colors flex items-center gap-1 md:gap-2">
              <FileText className="w-5 h-5" />
              <span className="hidden md:inline text-sm uppercase font-bold">Resume</span>
            </a>
            <button
              type="button"
              className="text-gray-200 hover:text-cyber-primary transition-colors flex items-center justify-center group p-1"
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-90 transition-transform" /> : <Moon className="w-5 h-5 text-cyber-secondary group-hover:-rotate-12 transition-transform" />}
            </button>
          </div>
        </div>
      </nav>
      <div className={`fixed top-0 right-0 h-full w-64 bg-black/90 backdrop-blur-xl border-l border-cyber-primary/30 z-[60] md:hidden transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b border-cyber-primary/20">
          <div className="text-lg font-bold font-mono tracking-tighter text-white">
            <span className="text-cyber-primary">&lt;</span>
            MENU
            <span className="text-cyber-primary">/&gt;</span>
          </div>
          <button type="button" className="text-gray-200 hover:text-cyber-primary transition-colors p-2" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col p-4 space-y-4">
          {navItems.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMenuOpen(false)}
              className={`mobile-nav-btn nav-btn ${activeSection === id ? 'active text-cyber-primary' : 'text-gray-200'} hover:text-cyber-primary transition-colors flex items-center gap-3 p-3 rounded-lg hover:bg-cyber-primary/10`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm uppercase font-bold">{label}</span>
            </a>
          ))}
          <a href={resumeUrl} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)} className="mobile-nav-btn text-gray-200 hover:text-cyber-primary transition-colors flex items-center gap-3 p-3 rounded-lg hover:bg-cyber-primary/10">
            <FileText className="w-5 h-5" />
            <span className="text-sm uppercase font-bold">Resume</span>
          </a>
          <div className="border-t border-cyber-primary/20 pt-4 mt-2">
            <button type="button" className="text-gray-200 hover:text-cyber-primary transition-colors flex items-center gap-3 p-3 rounded-lg hover:bg-cyber-primary/10 w-full" onClick={handleThemeToggle}>
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-cyber-secondary" />}
              <span className="text-sm uppercase font-bold">Toggle Theme</span>
            </button>
          </div>
        </div>
      </div>
      <div
        id="mobile-menu-overlay"
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] md:hidden transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <main className="relative z-10 pb-24 px-4 md:px-8 max-w-7xl mx-auto pt-24">
        <section id="home" className="text-center mb-20">
          <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8 mx-auto group perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyber-primary to-cyber-secondary rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
            <img
              src={heroImage}
              alt="Ameya Ramteke"
              className="relative w-full h-full object-cover rounded-full border-4 border-cyber-primary/50 shadow-2xl transform transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyber-primary via-white to-cyber-secondary animate-float">
            AI & DS Engineer
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-100 max-w-2xl mx-auto mb-8 font-normal">
            Building intelligent solutions with Python, Machine Learning, and Cloud Architecture.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#projects" className="px-8 py-3 rounded-full bg-cyber-primary text-black font-bold hover:bg-white hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] transition-all transform hover:-translate-y-1">
              View Projects
            </a>
            <a href={resumeUrl} target="_blank" rel="noreferrer" className="px-8 py-3 rounded-full border-2 border-cyber-primary text-cyber-primary hover:bg-cyber-primary/20 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all font-bold">
              Download Resume
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 w-full max-w-4xl mx-auto">
            <StatCard value="4+" label="Major Projects" className="text-cyber-secondary" />
            <StatCard value="5+" label="Certifications" className="text-cyber-primary" />
            <StatCard value="Team" label="Lead & Rep" className="text-yellow-400" />
            <StatCard value="AI/DS" label="Specialization" className="text-green-400" />
          </div>
        </section>
        <section id="about" className="mb-20">
          <SectionHeading className="border-b-2 border-cyber-primary/30 pb-4 inline-block mx-auto w-full mt-8">About Me & Skills</SectionHeading>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group card-3d">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <User className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cyber-primary">Professional Profile</h3>
              <p className="mb-4 leading-relaxed">
                Detail-oriented Artificial Intelligence and Data Science student with practical, hands-on experience in data analysis, machine learning, and cloud architecture design.
              </p>
              <p className="mb-4 leading-relaxed">
                Proven ability to build and manage full-stack projects, analyze data, and implement AI-driven strategies. A proactive team leader and Class Representative eager to apply technical skills in Python, SQL, and GenAI to solve complex problems.
              </p>
              <div className="flex gap-2 mt-6 flex-wrap">
                <div className="px-3 py-1 rounded bg-blue-500/20 text-blue-400 text-sm">Nagpur, India</div>
                <div className="px-3 py-1 rounded bg-green-500/20 text-green-400 text-sm">Available for Work</div>
              </div>
            </div>
            <div className="glass-panel p-8 rounded-2xl card-3d">
              <h3 className="text-2xl font-bold mb-6 text-cyber-secondary">Technical Arsenal</h3>
              <div className="space-y-4">
                {skillBars.map((skill) => (
                  <div key={skill.label}>
                    <div className="flex justify-between mb-1">
                      <span className="font-mono">{skill.label}</span>
                      <span className={skill.text}>{skill.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full ${skill.color}`} style={{ width: `${skill.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {['Java', 'C', 'Git & GitHub', 'OOP', 'Forensic Tech'].map((item) => (
                  <span key={item} className="px-3 py-1 bg-gray-800 rounded-full border border-gray-600 text-xs hover:border-cyber-primary transition-colors">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" /> Education
              </h3>
              <ul className="space-y-4">
                {education.map((item, index) => (
                  <li key={item.title} className={`border-l-2 ${index === 0 ? 'border-cyber-primary' : 'border-gray-600'} pl-4`}>
                    <div className="font-bold">{item.title}</div>
                    <div className="text-sm text-gray-400">{item.place}</div>
                    {item.status ? <div className="text-xs text-cyber-primary mt-1">{item.status}</div> : null}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" /> Certifications
              </h3>
              <ul className="space-y-2 text-sm">
                {certifications.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section id="projects" className="mb-20">
          <SectionHeading className="text-cyber-primary mt-8">Featured Projects</SectionHeading>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>
        <section id="contact" className="mb-20">
          <SectionHeading className="mt-8">Get In Touch</SectionHeading>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <a href="https://www.linkedin.com/in/ameya-ramteke" target="_blank" rel="noreferrer" className="glass-panel p-6 rounded-2xl transform transition hover:-translate-y-2 block">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-cyber-primary/20 rounded-full text-cyber-primary">
                    <Linkedin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">LinkedIn</h3>
                    <p className="text-gray-400">ameya-ramteke</p>
                  </div>
                </div>
              </a>
              <a href="mailto:ameyaramteke07.work@gmail.com" className="glass-panel p-6 rounded-2xl transform transition hover:-translate-y-2 block">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-cyber-primary/20 rounded-full text-cyber-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Email Me</h3>
                    <p className="text-gray-400">ameyaramteke07.work@gmail.com</p>
                  </div>
                </div>
              </a>
              <a href="tel:+919422651580" className="glass-panel p-6 rounded-2xl transform transition hover:-translate-y-2 block">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-cyber-secondary/20 rounded-full text-cyber-secondary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Call Me</h3>
                    <p className="text-gray-400">+91 9422651580</p>
                  </div>
                </div>
              </a>
              <div className="glass-panel p-6 rounded-2xl transform transition hover:-translate-y-2">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-purple-500/20 rounded-full text-purple-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Location</h3>
                    <p className="text-gray-400">Nagpur, India (440023)</p>
                  </div>
                </div>
              </div>
            </div>
            <form ref={contactFormRef} onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-primary blur-[80px] opacity-20 pointer-events-none" />
              <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2 ml-1" htmlFor="from_name">Your Name</label>
                  <input id="from_name" type="text" name="from_name" required className="w-full bg-black/20 border border-gray-600 rounded-xl px-4 py-3 focus:border-cyber-primary focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 ml-1" htmlFor="from_email">Your Email</label>
                  <input id="from_email" type="email" name="from_email" required className="w-full bg-black/20 border border-gray-600 rounded-xl px-4 py-3 focus:border-cyber-primary focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 ml-1" htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="4" required className="w-full bg-black/20 border border-gray-600 rounded-xl px-4 py-3 focus:border-cyber-primary focus:outline-none transition-colors" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-cyber-primary to-blue-600 text-black font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
              <div id="form-status" aria-live="polite" className={`mt-4 text-center text-sm font-bold ${status.kind ? '' : 'hidden'} ${status.kind === 'success' ? 'text-green-400' : 'text-red-500'}`}>
                {status.message}
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}