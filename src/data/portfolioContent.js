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

export function createDefaultPortfolioContent({ heroImage = '', resumeUrl = '' } = {}) {
  return {
    site: {
      brand: 'Portfolio',
      ownerName: '',
      role: '',
    },
    hero: {
      eyebrow: '',
      name: '',
      title: '',
      subtitle: '',
      image: heroImage,
      resumeUrl,
      buttons: {
        primaryLabel: 'Projects',
        secondaryLabel: 'Resume',
      },
      highlights: [],
      stats: [],
    },
    about: {
      profileName: '',
      profileTitle: '',
      bio: '',
      location: '',
      availability: '',
      technicalFocus: '',
      mapUrl: '',
      skillBars: [],
      education: [],
      certifications: [],
    },
    projects: [],
    contact: {
      eyebrow: '',
      title: '',
      subtitle: '',
      links: [],
      emailjs: {
        serviceId: '',
        templateId: '',
        publicKey: '',
      },
    },
    footer: {
      brand: '',
      name: '',
      tagline: '',
      quickLinks: [],
      socialLinks: [],
    },
  };
}
