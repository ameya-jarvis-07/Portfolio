# Dynamic 3D Portfolio & Full-Stack Next.js CMS

A premium developer portfolio featuring a dynamic 3D background, smooth scroll transitions, and a built-in content management system (CMS) dashboard. Built natively using Next.js App Router and local file-based storage.

---

## 🚀 Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Vanilla CSS with HSL-based dynamic light/dark mode styling
- **3D Graphics**: Three.js integrated via React Three Fiber (`@react-three/fiber` & `@react-three/drei`)
- **Animations**: GSAP + ScrollTrigger
- **Database**: Local JSON database files under `data/`

---

## 📂 Architecture & Routing

- `/` (Root): Public-facing portfolio page serving server-rendered portfolio content.
- `/hellothere`: Secure admin login gateway to create/authenticate credentials.
- `/welcometocms`: Protected admin console dashboard to manage portfolio data, soft-delete items, and manage the recycle bin.
- `/api/portfolio`: JSON database read (GET) and write (POST) API endpoints.
- `/api/auth`: Authentication state, registration, login, and secure session management.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 💾 Local Storage Engine

No external databases are required. Your configuration files are stored locally in:
- `data/portfolioContent.json` (portfolio info, projects, skills, education, contact)
- `data/adminCredentials.json` (secure login hashed credentials)