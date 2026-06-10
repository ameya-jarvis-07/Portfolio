export const STORAGE_KEYS = {
  content: 'portfolio-content-v1',
  credentials: 'portfolio-admin-credentials-v1',
  session: 'portfolio-admin-session-v1',
};

export const PROJECT_ICON_OPTIONS = [
  { value: 'file-text', label: 'File Text' },
  { value: 'bar-chart', label: 'Bar Chart' },
  { value: 'users', label: 'Users' },
  { value: 'heart', label: 'Heart' },
  { value: 'sun', label: 'Sun' },
  { value: 'book-open', label: 'Book Open' },
];

export const PROJECT_ACCENT_OPTIONS = [
  { value: 'cyan', label: 'Cyan' },
  { value: 'purple', label: 'Purple' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'orange', label: 'Orange' },
  { value: 'blue', label: 'Blue' },
];

export const SKILL_COLOR_OPTIONS = [
  { value: 'cyan', label: 'Cyan' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'green', label: 'Green' },
  { value: 'orange', label: 'Orange' },
  { value: 'blue', label: 'Blue' },
];

export const CONTACT_ICON_OPTIONS = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'mail', label: 'Mail' },
  { value: 'phone', label: 'Phone' },
  { value: 'map-pin', label: 'Map Pin' },
  { value: 'github', label: 'GitHub' },
  { value: 'external-link', label: 'External Link' },
];

function createProject(id, title, description, tags, accent, iconKey, link, image = '') {
  return { id, title, description, tags, accent, iconKey, link, image };
}

function createSkill(id, label, value, color) {
  return { id, label, value, color };
}

function createEducation(id, title, place, status = '') {
  return { id, title, place, status };
}

function createCertification(id, label) {
  return { id, label };
}

function createContactLink(id, iconKey, title, text, href) {
  return { id, iconKey, title, text, href };
}

function createFooterLink(id, label, href) {
  return { id, label, href };
}

function createSocialLink(id, iconKey, label, href) {
  return { id, iconKey, label, href };
}

export function createDefaultPortfolioContent({ heroImage, resumeUrl }) {
  return {
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
      image: heroImage,
      resumeUrl,
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
      locationCity: 'Nagpur',
      timezone: 'GMT+5:30',
      mapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=79.0506%2C21.1200%2C79.1106%2C21.1800&layer=mapnik&marker=21.150037219633752%2C79.08060139999999',
      skillBars: [
        createSkill('skill-python', 'Python & AI/ML', 90, 'cyan'),
        createSkill('skill-data', 'Data Analysis (SQL/EDA)', 85, 'purple'),
        createSkill('skill-web', 'Web Dev (HTML/CSS/JS)', 80, 'pink'),
        createSkill('skill-cloud', 'Cloud Architecture', 75, 'yellow'),
      ],
      education: [
        createEducation('edu-degree', 'B. Tech in AI & Data Science', 'Anjuman College of Engineering & Technology', 'Pursuing'),
        createEducation('edu-school', 'HSC & SSC', 'Sandipani School / Essence International School', ''),
      ],
      certifications: [
        createCertification('cert-tata', 'GenAI Powered Data Analytics (TATA)'),
        createCertification('cert-deloitte', 'Data Analytics Job Simulation (Deloitte)'),
        createCertification('cert-aws', 'Solutions Architecture (AWS)'),
        createCertification('cert-git', 'Git & GitHub Workshop (ACET)'),
        createCertification('cert-sql', 'SQL and Relational Databases 101 (Cognitive Class)'),
        createCertification('cert-prompt', 'Prompt Engineering for Everyone (Cognitive Class)'),
        createCertification('cert-claude', 'Claude 101 (Anthropic)'),
      ],
    },
    projects: [
      createProject(
        'project-resume-checker',
        'Resume-Checker',
        'A system to parse, analyze, and score resumes, showing skills in data extraction and analysis.',
        ['Python', 'NLP'],
        'cyan',
        'file-text',
        'https://github.com/ameya-jarvis-07/Resume-Checker',
      ),
      createProject(
        'project-crime-analysis',
        'Crime-Analysis-Demo',
        'Crime dataset analysis to identify patterns and trends using Python and visualization techniques.',
        ['Data Viz', 'Pandas'],
        'purple',
        'bar-chart',
        'https://github.com/ameya-jarvis-07/Crime-Analysis-Demo',
      ),
      createProject(
        'project-account-management',
        'Account-Management',
        'Full-stack CRUD app for user account management, demonstrating database and UI skills.',
        ['Full Stack', 'SQL'],
        'green',
        'users',
        'https://github.com/ameya-jarvis-07/Account-Management-System',
      ),
      createProject(
        'project-hunger-bridge',
        'Hunger-Bridge',
        'A socially focused project that connects food donors with organizations to reduce food waste.',
        ['Social Good', 'Web App'],
        'yellow',
        'heart',
        'https://github.com/ameya-jarvis-07/Hunger-Bridge',
      ),
      createProject(
        'project-solar-explorer',
        'Solar-Explorer',
        'Interactive solar system exploration tool with real-time planetary data and 3D rendering.',
        ['3D Graphics', 'Web Dev'],
        'orange',
        'sun',
        'https://ameya-jarvis-07.github.io/Solar-Explorer/',
      ),
      createProject(
        'project-neuronet',
        'Neuro.Net',
        'Youth-driven workshops on psychology and artificial intelligence.',
        ['Education', 'Algorithms'],
        'blue',
        'book-open',
        'https://neuronet.co.in',
      ),
    ],
    contact: {
      eyebrow: 'Let’s talk',
      title: 'Get In Touch',
      subtitle: 'Have a project in mind or looking for a collaborator? Send a message and I’ll reply soon.',
      links: [
        createContactLink('contact-linkedin', 'linkedin', 'LinkedIn', 'ameya-ramteke', 'https://www.linkedin.com/in/ameya-ramteke'),
        createContactLink('contact-email', 'mail', 'Email Me', 'ameyaramteke07.work@gmail.com', 'mailto:ameyaramteke07.work@gmail.com'),
        createContactLink('contact-phone', 'phone', 'Call Me', '+91 9422651580', 'tel:+919422651580'),
        createContactLink('contact-location', 'map-pin', 'Location', 'Nagpur, India (440023)', '#contact'),
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
        createFooterLink('footer-home', 'Home', '#home'),
        createFooterLink('footer-about', 'About', '#about'),
        createFooterLink('footer-projects', 'Projects', '#projects'),
        createFooterLink('footer-contact', 'Contact', '#contact'),
        createFooterLink('footer-resume', 'Resume', resumeUrl),
      ],
      socialLinks: [
        createSocialLink('social-email', 'mail', 'Email', 'mailto:ameyaramteke07.work@gmail.com'),
        createSocialLink('social-github', 'github', 'GitHub', 'https://github.com/ameya-jarvis-07'),
        createSocialLink('social-linkedin', 'linkedin', 'LinkedIn', 'https://www.linkedin.com/in/ameya-jarvis-07/'),
        createSocialLink('social-linktree', 'external-link', 'LinkTree', 'https://linktr.ee/ameya_jarvis'),
      ],
    },
  };
}
