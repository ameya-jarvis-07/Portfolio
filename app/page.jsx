import fs from 'fs/promises';
import path from 'path';
import dynamic from 'next/dynamic';
import { createDefaultPortfolioContent } from '../src/data/portfolioContent';

// Dynamically import the client-side portfolio wrapper to avoid SSR issues with Three.js/GSAP
const PortfolioApp = dynamic(() => import('./PortfolioApp'), { ssr: false });

async function getInitialContent() {
  const dataDir = path.join(process.cwd(), 'data');
  const contentFile = path.join(dataDir, 'portfolioContent.json');

  try {
    const raw = await fs.readFile(contentFile, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    // If file doesn't exist, return default content
    return createDefaultPortfolioContent({
      heroImage: '/Assets/image.webp',
      resumeUrl: '/Assets/Resume.pdf',
    });
  }
}

export default async function Home() {
  const initialContent = await getInitialContent();
  return <PortfolioApp initialContent={initialContent} />;
}
