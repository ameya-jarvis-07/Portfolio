-- Schema initialization script for Supabase/PostgreSQL SQL Editor

-- 1. DROP existing tables if they exist
DROP TABLE IF EXISTS footer_links CASCADE;
DROP TABLE IF EXISTS contact_links CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS education CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS hero_highlights CASCADE;
DROP TABLE IF EXISTS hero_stats CASCADE;
DROP TABLE IF EXISTS site_profile CASCADE;

-- 2. CREATE site_profile table
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

-- 3. CREATE hero_stats table
CREATE TABLE hero_stats (
    id text PRIMARY KEY,
    value text NOT NULL,
    label text NOT NULL,
    display_order integer NOT NULL DEFAULT 0
);

-- 4. CREATE hero_highlights table
CREATE TABLE hero_highlights (
    id serial PRIMARY KEY,
    text text NOT NULL,
    display_order integer NOT NULL DEFAULT 0
);

-- 5. CREATE skills table
CREATE TABLE skills (
    id text PRIMARY KEY,
    label text NOT NULL,
    value integer NOT NULL,
    color text NOT NULL,
    display_order integer NOT NULL DEFAULT 0
);

-- 6. CREATE education table
CREATE TABLE education (
    id text PRIMARY KEY,
    title text NOT NULL,
    place text NOT NULL,
    status text NOT NULL DEFAULT '',
    display_order integer NOT NULL DEFAULT 0
);

-- 7. CREATE certifications table
CREATE TABLE certifications (
    id text PRIMARY KEY,
    label text NOT NULL,
    display_order integer NOT NULL DEFAULT 0
);

-- 8. CREATE projects table
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

-- 9. CREATE contact_links table
CREATE TABLE contact_links (
    id text PRIMARY KEY,
    iconKey text NOT NULL,
    title text NOT NULL,
    text text NOT NULL,
    href text NOT NULL,
    display_order integer NOT NULL DEFAULT 0
);

-- 10. CREATE footer_links table
CREATE TABLE footer_links (
    id text PRIMARY KEY,
    type text NOT NULL CHECK (type IN ('quick', 'social')),
    iconKey text NOT NULL DEFAULT '',
    label text NOT NULL,
    href text NOT NULL,
    display_order integer NOT NULL DEFAULT 0
);
