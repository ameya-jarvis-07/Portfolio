# Master Tutorial: Static Portfolio to Full-Stack CMS Migration

This guide details the step-by-step process, database schema, and exact code files required to convert a static React + Vite portfolio (which stores data in local state/LocalStorage) into a secure, database-backed full-stack application.

---

## 🛠️ Step 1: Install Dependencies
Run the following command in your project root to install the required client and server libraries:
```bash
npm install firebase @supabase/supabase-js firebase-admin pg
```

---

## 💾 Step 2: Set up the Database Schema (Supabase)
Log in to your **Supabase Dashboard**, open the **SQL Editor**, and run the following script to create the relational PostgreSQL tables:

```sql
-- DROP existing tables if they exist
DROP TABLE IF EXISTS footer_links CASCADE;
DROP TABLE IF EXISTS contact_links CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS education CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS hero_highlights CASCADE;
DROP TABLE IF EXISTS hero_stats CASCADE;
DROP TABLE IF EXISTS site_profile CASCADE;

-- CREATE site_profile table (Single row configuration)
CREATE TABLE site_profile (
    id integer PRIMARY KEY DEFAULT 1,
    brand text NOT NULL,
    owner_name text NOT NULL,
    role text NOT NULL,
    hero_eyebrow text NOT NULL,
    hero_name text NOT NULL,
    hero_title text NOT NULL,
    hero_subtitle text NOT NULL,
    hero_image text NOT NULL,
    hero_resume_url text NOT NULL,
    hero_primary_btn text NOT NULL,
    hero_secondary_btn text NOT NULL,
    about_profile_name text NOT NULL,
    about_profile_title text NOT NULL,
    about_bio text NOT NULL,
    about_location text NOT NULL,
    about_availability text NOT NULL,
    about_technical_focus text NOT NULL,
    about_map_url text NOT NULL,
    contact_eyebrow text NOT NULL,
    contact_title text NOT NULL,
    contact_subtitle text NOT NULL,
    footer_brand text NOT NULL,
    footer_name text NOT NULL,
    footer_tagline text NOT NULL,
    CONSTRAINT single_row CHECK (id = 1)
);

-- CREATE hero_stats table
CREATE TABLE hero_stats (
    id text PRIMARY KEY,
    value text NOT NULL,
    label text NOT NULL,
    display_order integer NOT NULL DEFAULT 0
);

-- CREATE hero_highlights table
CREATE TABLE hero_highlights (
    id serial PRIMARY KEY,
    text text NOT NULL,
    display_order integer NOT NULL DEFAULT 0
);

-- CREATE skills table
CREATE TABLE skills (
    id text PRIMARY KEY,
    label text NOT NULL,
    value integer NOT NULL,
    color text NOT NULL,
    display_order integer NOT NULL DEFAULT 0
);

-- CREATE education table
CREATE TABLE education (
    id text PRIMARY KEY,
    title text NOT NULL,
    place text NOT NULL,
    status text NOT NULL DEFAULT '',
    display_order integer NOT NULL DEFAULT 0
);

-- CREATE certifications table
CREATE TABLE certifications (
    id text PRIMARY KEY,
    label text NOT NULL,
    display_order integer NOT NULL DEFAULT 0
);

-- CREATE projects table
CREATE TABLE projects (
    id text PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    tags text[] NOT NULL,
    accent text NOT NULL,
    iconKey text NOT NULL,
    link text NOT NULL,
    image text NOT NULL DEFAULT '',
    display_order integer NOT NULL DEFAULT 0
);

-- CREATE contact_links table
CREATE TABLE contact_links (
    id text PRIMARY KEY,
    iconKey text NOT NULL,
    title text NOT NULL,
    text text NOT NULL,
    href text NOT NULL,
    display_order integer NOT NULL DEFAULT 0
);

-- CREATE footer_links table
CREATE TABLE footer_links (
    id text PRIMARY KEY,
    type text NOT NULL CHECK (type IN ('quick', 'social')),
    iconKey text NOT NULL DEFAULT '',
    label text NOT NULL,
    href text NOT NULL,
    display_order integer NOT NULL DEFAULT 0
);
```

---

## 🔒 Step 3: Configure Environment Variables
Create or update your `.env` file in the root directory:
```bash
# Firebase Client SDK Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cloudinary Unsigned Upload Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset

# EmailJS Client-Side Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Supabase Server Settings (Backend API)
SUPABASE_URL=https://your_project_ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_private_service_role_key
DATABASE_URL=postgresql://postgres:your_password@db.your_project_ref.supabase.co:5432/postgres
```

---

## 📂 Step 4: Create Backend API Endpoints (Vercel Serverless)

Create the following files in a folder named `/api` at the root of your repository.

### 1. `api/setup-db.js` (Database Seeder)
This endpoint initializes and seeds default content into the PostgreSQL database.
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  const { secret } = req.query;
  if (!secret || secret !== supabaseServiceKey) {
    return res.status(401).json({ error: 'Unauthorized. Please provide the service role key as a secret query param.' });
  }

  try {
    const seed = {
      site: { brand: 'Portfolio', ownerName: '', role: '' },
      hero: {
        eyebrow: '', name: '', title: '', subtitle: '',
        image: 'https://res.cloudinary.com/your-cloud/image/upload/v1/default.webp',
        resumeUrl: 'https://res.cloudinary.com/your-cloud/raw/upload/v1/resume.pdf',
        buttons: { primaryLabel: 'Projects', secondaryLabel: 'Resume' },
        highlights: [], stats: []
      },
      about: { profileName: '', profileTitle: '', bio: '', location: '', availability: '', technicalFocus: '', mapUrl: '', skillBars: [], education: [], certifications: [] },
      projects: [],
      contact: { eyebrow: '', title: '', subtitle: '', links: [] },
      footer: { brand: '', name: '', tagline: '', quickLinks: [], socialLinks: [] }
    };

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

    await supabase.from('site_profile').insert({ id: 1, ...seed.site, ...seed.hero, ...seed.about, ...seed.contact, ...seed.footer });
    return res.status(200).json({ success: true, message: 'Database seeded.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

### 2. `api/portfolio.js` (Main Fetch/Save Router)
Handles fetching public data (`GET`) and updating tables (`POST`) protected by Firebase Auth token validation.
```javascript
import { createClient } from '@supabase/supabase-js';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({ projectId: process.env.VITE_FIREBASE_PROJECT_ID });
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function authenticate(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error('Unauthorized');
  const token = authHeader.split('Bearer ')[1];
  return await admin.auth().verifyIdToken(token);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [
        { data: siteProfile }, { data: stats }, { data: highlights }, { data: skills },
        { data: education }, { data: certs }, { data: projects }, { data: contacts }, { data: footers }
      ] = await Promise.all([
        supabase.from('site_profile').select('*').eq('id', 1).single(),
        supabase.from('hero_stats').select('*').order('display_order'),
        supabase.from('hero_highlights').select('*').order('display_order'),
        supabase.from('skills').select('*').order('display_order'),
        supabase.from('education').select('*').order('display_order'),
        supabase.from('certifications').select('*').order('display_order'),
        supabase.from('projects').select('*').order('display_order'),
        supabase.from('contact_links').select('*').order('display_order'),
        supabase.from('footer_links').select('*').order('display_order')
      ]);

      if (!siteProfile) return res.status(200).json({ uninitialized: true });

      return res.status(200).json({
        site: { brand: siteProfile.brand, ownerName: siteProfile.owner_name, role: siteProfile.role },
        hero: {
          eyebrow: siteProfile.hero_eyebrow, name: siteProfile.hero_name, title: siteProfile.hero_title, subtitle: siteProfile.hero_subtitle,
          image: siteProfile.hero_image, resumeUrl: siteProfile.hero_resume_url,
          buttons: { primaryLabel: siteProfile.hero_primary_btn, secondaryLabel: siteProfile.hero_secondary_btn },
          highlights: highlights.map(h => h.text), stats: stats.map(s => ({ id: s.id, value: s.value, label: s.label }))
        },
        about: {
          profileName: siteProfile.about_profile_name, profileTitle: siteProfile.about_profile_title, bio: siteProfile.about_bio,
          location: siteProfile.about_location, availability: siteProfile.about_availability, technicalFocus: siteProfile.about_technical_focus, mapUrl: siteProfile.about_map_url,
          skillBars: skills, education, certifications: certs
        },
        projects,
        contact: {
          eyebrow: siteProfile.contact_eyebrow, title: siteProfile.contact_title, subtitle: siteProfile.contact_subtitle,
          links: contacts, emailjs: { serviceId: '', templateId: '', publicKey: '' }
        },
        footer: {
          brand: siteProfile.footer_brand, name: siteProfile.footer_name, tagline: siteProfile.footer_tagline,
          quickLinks: footers.filter(f => f.type === 'quick'), socialLinks: footers.filter(f => f.type === 'social')
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      await authenticate(req);
      const content = req.body;

      await supabase.from('site_profile').upsert({
        id: 1,
        brand: content.site.brand, owner_name: content.site.ownerName, role: content.site.role,
        hero_eyebrow: content.hero.eyebrow, hero_name: content.hero.name, hero_title: content.hero.title, hero_subtitle: content.hero.subtitle, hero_image: content.hero.image, hero_resume_url: content.hero.resumeUrl, hero_primary_btn: content.hero.buttons.primaryLabel, hero_secondary_btn: content.hero.buttons.secondaryLabel,
        about_profile_name: content.about.profileName, about_profile_title: content.about.profileTitle, about_bio: content.about.bio, about_location: content.about.location, about_availability: content.about.availability, about_technical_focus: content.about.technicalFocus, about_map_url: content.about.mapUrl,
        contact_eyebrow: content.contact.eyebrow, contact_title: content.contact.title, contact_subtitle: content.contact.subtitle,
        footer_brand: content.footer.brand, footer_name: content.footer.name, footer_tagline: content.footer.tagline
      });

      const syncTable = async (tableName, items, mapper) => {
        await supabase.from(tableName).delete().not('id', 'is', null);
        if (items && items.length > 0) {
          await supabase.from(tableName).insert(items.map((item, idx) => mapper(item, idx)));
        }
      };

      await Promise.all([
        syncTable('hero_stats', content.hero.stats, (item, idx) => ({ id: item.id, value: item.value, label: item.label, display_order: idx })),
        syncTable('hero_highlights', content.hero.highlights, (item, idx) => ({ text: item, display_order: idx })),
        syncTable('skills', content.about.skillBars, (item, idx) => ({ id: item.id, label: item.label, value: item.value, color: item.color, display_order: idx })),
        syncTable('education', content.about.education, (item, idx) => ({ id: item.id, title: item.title, place: item.place, status: item.status, display_order: idx })),
        syncTable('certifications', content.about.certifications, (item, idx) => ({ id: item.id, label: item.label, display_order: idx })),
        syncTable('projects', content.projects, (item, idx) => ({ id: item.id, title: item.title, description: item.description, tags: item.tags, accent: item.accent, iconKey: item.iconKey, link: item.link, image: item.image, display_order: idx })),
        syncTable('contact_links', content.contact.links, (item, idx) => ({ id: item.id, iconKey: item.iconKey, title: item.title, text: item.text, href: item.href, display_order: idx })),
        (async () => {
          const quick = (content.footer.quickLinks || []).map((f, idx) => ({ id: f.id, type: 'quick', label: f.label, href: f.href, display_order: idx }));
          const social = (content.footer.socialLinks || []).map((f, idx) => ({ id: f.id, type: 'social', iconKey: f.iconKey, label: f.label, href: f.href, display_order: idx + quick.length }));
          await supabase.from('footer_links').delete().not('id', 'is', null);
          if (quick.length || social.length) {
            await supabase.from('footer_links').insert([...quick, ...social]);
          }
        })()
      ]);

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}
```

---

## 🖥️ Step 5: Frontend File Integration

### 1. Initialize Firebase Auth (`src/firebase.js`)
Create a file at `src/firebase.js` to register the client SDK:
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### 2. Update `src/App.jsx`
- Replace static default state imports.
- Inject dynamic loaders querying the Vercel API `/api/portfolio` on load.
- Handle state updates by sending authorized `POST` requests.
- Bind listeners to Firebase Auth via `onAuthStateChanged`.
- Remove registration handles to enforce restricted admin logins.

### 3. Update `src/components/CmsDashboard.jsx`
- Replace username/password checks with Firebase authentication.
- Remove all "Confirm Password" and "Set up access" buttons/flows so registration can only be done directly through the Firebase Console dashboard.
- Create a Cloudinary direct image upload group next to the project image fields:
```javascript
const handleImageUpload = async (event, index, item) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  updateArrayItem(['projects'], index, { ...item, image: data.secure_url });
};
```
- Render a file input trigger next to the Project Image URL field for easy image uploading.

---

## 🚀 Step 6: Create Admin User & Deploy
1. Open your **Firebase Console**, navigate to your project -> **Authentication** -> **Users**.
2. Click **Add User**, register your secure admin email & password, and click save.
3. Deploy your project to **Vercel**, making sure to add all configurations in the Vercel Dashboard env settings.
4. Visit `https://your-vercel-domain.vercel.app/api/setup-db?secret=YOUR_SERVICE_ROLE_KEY` to seed your initial tables!
