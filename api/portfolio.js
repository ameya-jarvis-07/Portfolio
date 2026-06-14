import { createClient } from '@supabase/supabase-js';
import admin from 'firebase-admin';

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  });
}

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper to authenticate Firebase token
async function authenticate(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header');
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Authentication failed: ' + error.message);
  }
}

export default async function handler(req, res) {
  // CORS Headers for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      // Fetch data from all tables in parallel
      const [
        { data: siteProfile, error: errSite },
        { data: heroStats, error: errStats },
        { data: heroHighlights, error: errHighlights },
        { data: skills, error: errSkills },
        { data: education, error: errEducation },
        { data: certifications, error: errCerts },
        { data: projects, error: errProjects },
        { data: contactLinks, error: errContact },
        { data: footerLinks, error: errFooter }
      ] = await Promise.all([
        supabase.from('site_profile').select('*').eq('id', 1).single(),
        supabase.from('hero_stats').select('*').order('display_order', { ascending: true }),
        supabase.from('hero_highlights').select('*').order('display_order', { ascending: true }),
        supabase.from('skills').select('*').order('display_order', { ascending: true }),
        supabase.from('education').select('*').order('display_order', { ascending: true }),
        supabase.from('certifications').select('*').order('display_order', { ascending: true }),
        supabase.from('projects').select('*').order('display_order', { ascending: true }),
        supabase.from('contact_links').select('*').order('display_order', { ascending: true }),
        supabase.from('footer_links').select('*').order('display_order', { ascending: true })
      ]);

      // Handle errors
      if (errSite || errStats || errHighlights || errSkills || errEducation || errCerts || errProjects || errContact || errFooter) {
        throw new Error(
          JSON.stringify({
            errSite, errStats, errHighlights, errSkills, errEducation, errCerts, errProjects, errContact, errFooter
          })
        );
      }

      // Check if DB is uninitialized
      if (!siteProfile) {
        return res.status(200).json({ uninitialized: true });
      }

      // Assemble portfolio JSON
      const content = {
        site: {
          brand: siteProfile.brand,
          ownerName: siteProfile.owner_name,
          role: siteProfile.role,
        },
        hero: {
          eyebrow: siteProfile.hero_eyebrow,
          name: siteProfile.hero_name,
          title: siteProfile.hero_title,
          subtitle: siteProfile.hero_subtitle,
          image: siteProfile.hero_image,
          resumeUrl: siteProfile.hero_resume_url,
          buttons: {
            primaryLabel: siteProfile.hero_primary_btn,
            secondaryLabel: siteProfile.hero_secondary_btn,
          },
          highlights: heroHighlights.map((h) => h.text),
          stats: heroStats.map((s) => ({ id: s.id, value: s.value, label: s.label })),
        },
        about: {
          profileName: siteProfile.about_profile_name,
          profileTitle: siteProfile.about_profile_title,
          bio: siteProfile.about_bio,
          location: siteProfile.about_location,
          availability: siteProfile.about_availability,
          technicalFocus: siteProfile.about_technical_focus,
          mapUrl: siteProfile.about_map_url,
          skillBars: skills.map((s) => ({ id: s.id, label: s.label, value: s.value, color: s.color })),
          education: education.map((e) => ({ id: e.id, title: e.title, place: e.place, status: e.status })),
          certifications: certifications.map((c) => ({ id: c.id, label: c.label })),
        },
        projects: projects.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          tags: p.tags,
          accent: p.accent,
          iconKey: p.iconKey,
          link: p.link,
          image: p.image,
        })),
        contact: {
          eyebrow: siteProfile.contact_eyebrow,
          title: siteProfile.contact_title,
          subtitle: siteProfile.contact_subtitle,
          links: contactLinks.map((c) => ({ id: c.id, iconKey: c.iconKey, title: c.title, text: c.text, href: c.href })),
          emailjs: {
            serviceId: '',
            templateId: '',
            publicKey: '',
          },
        },
        footer: {
          brand: siteProfile.footer_brand,
          name: siteProfile.footer_name,
          tagline: siteProfile.footer_tagline,
          quickLinks: footerLinks.filter((f) => f.type === 'quick').map((f) => ({ id: f.id, label: f.label, href: f.href })),
          socialLinks: footerLinks.filter((f) => f.type === 'social').map((f) => ({ id: f.id, iconKey: f.iconKey, label: f.label, href: f.href })),
        },
      };

      return res.status(200).json(content);
    } catch (error) {
      console.error('Error fetching portfolio content:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      // 1. Authenticate with Firebase
      await authenticate(req);

      const content = req.body;
      if (!content || !content.site || !content.hero || !content.about || !content.projects || !content.contact || !content.footer) {
        return res.status(400).json({ error: 'Invalid payload structure' });
      }

      // 2. Perform database updates
      // Update site_profile
      const { error: errSite } = await supabase.from('site_profile').upsert({
        id: 1,
        brand: content.site.brand,
        owner_name: content.site.ownerName,
        role: content.site.role,
        hero_eyebrow: content.hero.eyebrow,
        hero_name: content.hero.name,
        hero_title: content.hero.title,
        hero_subtitle: content.hero.subtitle,
        hero_image: content.hero.image,
        hero_resume_url: content.hero.resumeUrl,
        hero_primary_btn: content.hero.buttons.primaryLabel,
        hero_secondary_btn: content.hero.buttons.secondaryLabel,
        about_profile_name: content.about.profileName,
        about_profile_title: content.about.profileTitle,
        about_bio: content.about.bio,
        about_location: content.about.location,
        about_availability: content.about.availability,
        about_technical_focus: content.about.technicalFocus,
        about_map_url: content.about.mapUrl,
        contact_eyebrow: content.contact.eyebrow,
        contact_title: content.contact.title,
        contact_subtitle: content.contact.subtitle,
        footer_brand: content.footer.brand,
        footer_name: content.footer.name,
        footer_tagline: content.footer.tagline,
      });

      if (errSite) throw new Error('Site profile update failed: ' + errSite.message);

      // Helper to clear table and insert fresh rows with display_order
      const syncTable = async (tableName, items, mapper) => {
        const { error: delErr } = await supabase.from(tableName).delete().not('id', 'is', null);
        if (delErr) throw new Error(`Deleting ${tableName} failed: ${delErr.message}`);

        if (items && items.length > 0) {
          const rows = items.map((item, index) => mapper(item, index));
          const { error: insErr } = await supabase.from(tableName).insert(rows);
          if (insErr) throw new Error(`Inserting into ${tableName} failed: ${insErr.message}`);
        }
      };

      await Promise.all([
        // Hero Stats
        syncTable('hero_stats', content.hero.stats, (item, index) => ({
          id: item.id,
          value: item.value,
          label: item.label,
          display_order: index,
        })),

        // Hero Highlights
        syncTable('hero_highlights', content.hero.highlights, (item, index) => ({
          text: item,
          display_order: index,
        })),

        // Skills
        syncTable('skills', content.about.skillBars, (item, index) => ({
          id: item.id,
          label: item.label,
          value: item.value,
          color: item.color,
          display_order: index,
        })),

        // Education
        syncTable('education', content.about.education, (item, index) => ({
          id: item.id,
          title: item.title,
          place: item.place,
          status: item.status || '',
          display_order: index,
        })),

        // Certifications
        syncTable('certifications', content.about.certifications, (item, index) => ({
          id: item.id,
          label: item.label,
          display_order: index,
        })),

        // Projects
        syncTable('projects', content.projects, (item, index) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          tags: item.tags,
          accent: item.accent,
          iconKey: item.iconKey,
          link: item.link,
          image: item.image || '',
          display_order: index,
        })),

        // Contact Links
        syncTable('contact_links', content.contact.links, (item, index) => ({
          id: item.id,
          iconKey: item.iconKey,
          title: item.title,
          text: item.text,
          href: item.href,
          display_order: index,
        })),

        // Footer Links (Quick & Social combined)
        (async () => {
          const quickRows = (content.footer.quickLinks || []).map((item, index) => ({
            id: item.id,
            type: 'quick',
            iconKey: '',
            label: item.label,
            href: item.href,
            display_order: index,
          }));

          const socialRows = (content.footer.socialLinks || []).map((item, index) => ({
            id: item.id,
            type: 'social',
            iconKey: item.iconKey,
            label: item.label,
            href: item.href,
            display_order: index + quickRows.length,
          }));

          const allFooterLinks = [...quickRows, ...socialRows];

          const { error: delErr } = await supabase.from('footer_links').delete().not('id', 'is', null);
          if (delErr) throw new Error(`Deleting footer_links failed: ${delErr.message}`);

          if (allFooterLinks.length > 0) {
            const { error: insErr } = await supabase.from('footer_links').insert(allFooterLinks);
            if (insErr) throw new Error(`Inserting into footer_links failed: ${insErr.message}`);
          }
        })()
      ]);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error saving portfolio content:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
