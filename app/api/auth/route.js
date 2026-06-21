import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, signToken } from './crypto';
import crypto from 'crypto';

const CMS_PASSWORD = process.env.CMS_PASSWORD || 'tonySTARK@85';
const EXPECTED_HASH = crypto.createHash('sha256').update(CMS_PASSWORD).digest('hex');

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('admin_session');
    const token = sessionCookie ? sessionCookie.value : null;
    const authenticated = !!verifyToken(token);

    return NextResponse.json({
      credentialsConfigured: !!CMS_PASSWORD,
      authenticated
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve auth status: ' + error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { action, hash } = await request.json();

    if (action === 'logout') {
      const cookieStore = cookies();
      cookieStore.set('admin_session', '', {
        maxAge: -1,
        path: '/'
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'login') {
      if (!CMS_PASSWORD) {
        return NextResponse.json({ error: 'Server Configuration Error: CMS_PASSWORD is not set' }, { status: 500 });
      }

      if (!hash) {
        return NextResponse.json({ error: 'Bad Request: Credentials hash is missing' }, { status: 400 });
      }

      if (hash !== EXPECTED_HASH) {
        return NextResponse.json({ error: 'Unauthorized: Invalid password' }, { status: 401 });
      }

      // Sign token & set HttpOnly cookie
      const token = signToken({ role: 'admin' });
      const cookieStore = cookies();
      cookieStore.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/'
      });

      return NextResponse.json({ token, success: true });
    }

    return NextResponse.json({ error: 'Bad Request: Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication action failed: ' + error.message }, { status: 500 });
  }
}
