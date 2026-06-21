import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '../api/auth/crypto';
import { getPortfolioData } from '../api/portfolio/route';
import DashboardWrapper from './DashboardWrapper';

export default async function CMSDashboardPage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');
  const token = sessionCookie ? sessionCookie.value : null;

  const payload = verifyToken(token);
  if (!payload) {
    redirect('/hellothere');
  }

  const initialContent = await getPortfolioData();

  return <DashboardWrapper initialContent={initialContent} />;
}
