import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // Simple auth check: query parameter matches service role key
  const { secret } = req.query;
  if (!secret || secret !== supabaseServiceKey) {
    return res.status(401).json({ error: 'Unauthorized. Please provide the service role key as a secret query param.' });
  }

  try {
    // Default seed content (hardcoded matching portfolioContent.js defaults)
    const seed = {
      site: {
        brand: 'JARVIS',
        ownerName: 'Ameya Ramteke',
        role: 'AI · Data · Web',
      },
      hero: {
        eyebrow: 'AI & Data Science',
        name: 'Ameya Ramteke',
        title: 'AI & DS Engineer',
        subtitle: 'Building intelligent solutions with Python, Machine Learning, and Cloud Architecture.',
        image: 'https://res.cloudinary.com/dlwj22t9e/image/upload/v1781444840/image_kysrq2.webp',
        resumeUrl: 'https://res.cloudinary.com/dlwj22t9e/raw/upload/v1781444843/Resume_krwrvk.pdf',
        buttons: {
          primaryLabel: 'View Projects',
          secondaryLabel: 'Download Resume',
        },
        highlights: [
          'AI/ML and data analysis focus',
          'Cloud architecture and full-stack builds',
          'Open to internships and collaborations',
        ],
        stats: [
          { id: 'stat-projects', value: '4+', label: 'Major Projects' },
          { id: 'stat-certs', value: '5+', label: 'Certifications' },
          { id: 'stat-lead', value: 'Team', label: 'Lead & Rep' },
          { id: 'stat-specialty', value: 'AI/DS', label: 'Specialization' },
        ],
      },
      about: {
        profileName: 'Ameya Ramteke',
        profileTitle: 'AI & Data Science Engineer',
        bio: 'AI/DS engineer building ML pipelines, data products, and cloud-native apps that ship fast.',
        location: 'Nagpur, India',
        availability: 'Open to work',
        technicalFocus: 'Focused on AI/ML, analytics, and production-ready full-stack builds with a cloud-first mindset.',
        mapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=79.0506%2C21.1200%2C79.1106%2C21.1800&layer=mapnik&marker=21.150037219633752%2C79.08060139999999',
        skillBars: [
          { id: 'skill-python', label: 'Python & AI/ML', value: 90, color: 'cyan' },
          { id: 'skill-data', label: 'Data Analysis (SQL/EDA)', value: 85, color: 'purple' },
          { id: 'skill-web', label: 'Web Dev (HTML/CSS/JS)', value: 80, color: 'pink' },
          { id: 'skill-cloud', label: 'Cloud Architecture', value: 75, color: 'yellow' },
        ],
        education: [
          { id: 'edu-degree', title: 'B. Tech in AI & Data Science', place: 'Anjuman College of Engineering & Technology', status: 'Pursuing' },
          { id: 'edu-school', title: 'HSC & SSC', place: 'Sandipani School / Essence International School', status: '' },
        ],
        certifications: [
          { id: 'cert-tata', label: 'GenAI Powered Data Analytics (TATA)' },
          { id: 'cert-deloitte', label: 'Data Analytics Job Simulation (Deloitte)' },
          { id: 'cert-aws', label: 'Solutions Architecture (AWS)' },
          { id: 'cert-git', label: 'Git & GitHub Workshop (ACET)' },
          { id: 'cert-sql', label: 'SQL and Relational Databases 101 (Cognitive Class)' },
          { id: 'cert-prompt', label: 'Prompt Engineering for Everyone (Cognitive Class)' },
          { id: 'cert-claude', label: 'Claude 101 (Anthropic)' },
        ],
      },
      projects: [
        {
          id: 'project-resume-checker',
          title: 'Resume-Checker',
          description: 'A system to parse, analyze, and score resumes, showing skills in data extraction and analysis.',
          tags: ['Python', 'NLP'],
          accent: 'cyan',
          iconKey: 'file-text',
          link: 'https://github.com/ameya-jarvis-07/Resume-Checker',
          image: '',
        },
        {
          id: 'project-crime-analysis',
          title: 'Crime-Analysis-Demo',
          description: 'Crime dataset analysis to identify patterns and trends using Python and visualization techniques.',
          tags: ['Data Viz', 'Pandas'],
          accent: 'purple',
          iconKey: 'bar-chart',
          link: 'https://github.com/ameya-jarvis-07/Crime-Analysis-Demo',
          image: '',
        },
        {
          id: 'project-account-management',
          title: 'Account-Management',
          description: 'Full-stack CRUD app for user account management, demonstrating database and UI skills.',
          tags: ['Full Stack', 'SQL'],
          accent: 'green',
          iconKey: 'users',
          link: 'https://github.com/ameya-jarvis-07/Account-Management-System',
          image: '',
        },
        {
          id: 'project-hunger-bridge',
          title: 'Hunger-Bridge',
          description: 'A socially focused project that connects food donors with organizations to reduce food waste.',
          tags: ['Social Good', 'Web App'],
          accent: 'yellow',
          iconKey: 'heart',
          link: 'https://github.com/ameya-jarvis-07/Hunger-Bridge',
          image: '',
        },
        {
          id: 'project-solar-explorer',
          title: 'Solar-Explorer',
          description: 'Interactive solar system exploration tool with real-time planetary data and 3D rendering.',
          tags: ['3D Graphics', 'Web Dev'],
          accent: 'orange',
          iconKey: 'sun',
          link: 'https://ameya-jarvis-07.github.io/Solar-Explorer/',
          image: '',
        },
        {
          id: 'project-neuronet',
          title: 'Neuro.Net',
          description: 'Youth-driven workshops on psychology and artificial intelligence.',
          tags: ['Education', 'Algorithms'],
          accent: 'blue',
          iconKey: 'book-open',
          link: 'https://neuronet.co.in',
          image: '',
        },
      ],
      contact: {
        eyebrow: 'Let’s talk',
        title: 'Get In Touch',
        subtitle: 'Have a project in mind or looking for a collaborator? Send a message and I’ll reply soon.',
        links: [
          { id: 'contact-linkedin', iconKey: 'linkedin', title: 'LinkedIn', text: 'ameya-ramteke', href: 'https://www.linkedin.com/in/ameya-ramteke' },
          { id: 'contact-email', iconKey: 'mail', title: 'Email Me', text: 'ameyaramteke07.work@gmail.com', href: 'mailto:ameyaramteke07.work@gmail.com' },
          { id: 'contact-phone', iconKey: 'phone', title: 'Call Me', text: '+91 9422651580', href: 'tel:+919422651580' },
          { id: 'contact-location', iconKey: 'map-pin', title: 'Location', text: 'Nagpur, India (440023)', href: '#contact' },
        ],
        emailjs: {
          serviceId: 'service_tbdm0d2',
          templateId: 'template_pch5iiw',
          publicKey: 'CtQwEFyX5Kq-7gqmJ',
        },
      },
      footer: {
        brand: 'JARVIS',
        name: 'Ameya Ramteke',
        tagline: 'AI · Data · Web',
        quickLinks: [
          { id: 'footer-home', label: 'Home', href: '#home' },
          { id: 'footer-about', label: 'About', href: '#about' },
          { id: 'footer-projects', label: 'Projects', href: '#projects' },
          { id: 'footer-contact', label: 'Contact', href: '#contact' },
          { id: 'footer-resume', label: 'Resume', href: '' },
        ],
        socialLinks: [
          { id: 'social-email', iconKey: 'mail', label: 'Email', href: 'mailto:ameyaramteke07.work@gmail.com' },
          { id: 'social-github', iconKey: 'github', label: 'GitHub', href: 'https://github.com/ameya-jarvis-07' },
          { id: 'social-linkedin', iconKey: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/ameya-jarvis-07/' },
          { id: 'social-linktree', iconKey: 'external-link', label: 'LinkTree', href: 'https://linktr.ee/ameya_jarvis' },
        ],
      },
    };

    // 1. Clear database tables
    await Promise.all([
      supabase.from('site_profile').delete().not('id', 'is', null),
      supabase.from('hero_stats').delete().not('id', 'is', null),
      supabase.from('hero_highlights').delete().not('id', 'is', null),
      supabase.from('skills').delete().not('id', 'is', null),
      supabase.from('education').delete().not('id', 'is', null),
      supabase.from('certifications').delete().not('id', 'is', null),
      supabase.from('projects').delete().not('id', 'is', null),
      supabase.from('contact_links').delete().not('id', 'is', null),
      supabase.from('footer_links').delete().not('id', 'is', null),
    ]);

    // 2. Insert site_profile
    const { error: errSite } = await supabase.from('site_profile').insert({
      id: 1,
      brand: seed.site.brand,
      owner_name: seed.site.ownerName,
      role: seed.site.role,
      hero_eyebrow: seed.hero.eyebrow,
      hero_name: seed.hero.name,
      hero_title: seed.hero.title,
      hero_subtitle: seed.hero.subtitle,
      hero_image: seed.hero.image,
      hero_resume_url: seed.hero.resumeUrl,
      hero_primary_btn: seed.hero.buttons.primaryLabel,
      hero_secondary_btn: seed.hero.buttons.secondaryLabel,
      about_profile_name: seed.about.profileName,
      about_profile_title: seed.about.profileTitle,
      about_bio: seed.about.bio,
      about_location: seed.about.location,
      about_availability: seed.about.availability,
      about_technical_focus: seed.about.technicalFocus,
      about_map_url: seed.about.mapUrl,
      contact_eyebrow: seed.contact.eyebrow,
      contact_title: seed.contact.title,
      contact_subtitle: seed.contact.subtitle,
      footer_brand: seed.footer.brand,
      footer_name: seed.footer.name,
      footer_tagline: seed.footer.tagline,
    });
    if (errSite) throw new Error('Site profile seed failed: ' + errSite.message);

    // 3. Insert other tables
    await Promise.all([
      supabase.from('hero_stats').insert(seed.hero.stats.map((s, idx) => ({ ...s, display_order: idx }))),
      supabase.from('hero_highlights').insert(seed.hero.highlights.map((h, idx) => ({ text: h, display_order: idx }))),
      supabase.from('skills').insert(seed.about.skillBars.map((s, idx) => ({ ...s, display_order: idx }))),
      supabase.from('education').insert(seed.about.education.map((e, idx) => ({ ...e, display_order: idx }))),
      supabase.from('certifications').insert(seed.about.certifications.map((c, idx) => ({ ...c, display_order: idx }))),
      supabase.from('projects').insert(seed.projects.map((p, idx) => ({ ...p, display_order: idx }))),
      supabase.from('contact_links').insert(seed.contact.links.map((c, idx) => ({ ...c, display_order: idx }))),
      supabase.from('footer_links').insert([
        ...seed.footer.quickLinks.map((f, idx) => ({ id: f.id, type: 'quick', label: f.label, href: f.href, display_order: idx })),
        ...seed.footer.socialLinks.map((f, idx) => ({ id: f.id, type: 'social', iconKey: f.iconKey, label: f.label, href: f.href, display_order: idx + seed.footer.quickLinks.length })),
      ]),
    ]);

    return res.status(200).json({ success: true, message: 'Database initialized and seeded successfully.' });
  } catch (error) {
    console.error('Seeding database error:', error);
    return res.status(500).json({ error: error.message });
  }
}
