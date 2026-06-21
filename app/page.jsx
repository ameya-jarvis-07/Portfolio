import dynamic from 'next/dynamic';
import { getPortfolioData } from './api/portfolio/route';

// Dynamically import the client-side portfolio wrapper to avoid SSR issues with Three.js/GSAP
const PortfolioApp = dynamic(() => import('./PortfolioApp'), { ssr: false });

export default async function Home() {
  const initialContent = await getPortfolioData();
  return <PortfolioApp initialContent={initialContent} />;
}
