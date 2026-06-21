import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import { verifyToken } from '../api/auth/crypto';
import { createDefaultPortfolioContent } from '../../src/data/portfolioContent';
import DashboardWrapper from './DashboardWrapper';

async function getPortfolioContent() {
  const dataDir = path.join(process.cwd(), 'data');
  const contentFile = path.join(dataDir, 'portfolioContent.json');

  try {
    const raw = await fs.readFile(contentFile, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    // Return default content if file not found
    return createDefaultPortfolioContent({
      heroImage: '/Assets/image.webp',
      resumeUrl: '/Assets/Resume.pdf',
    });
  }
}

export default async function CMSDashboardPage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');
  const token = sessionCookie ? sessionCookie.value : null;

  const payload = verifyToken(token);
  if (!payload) {
    redirect('/hellothere');
  }

  const initialContent = await getPortfolioContent();

  return <DashboardWrapper initialContent={initialContent} />;
}
