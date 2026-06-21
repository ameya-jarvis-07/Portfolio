import crypto from 'crypto';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.SESSION_SECRET || 'fallback-local-only-super-secret-key-change-in-production';

/**
 * Sign a token statelessly using HMAC-SHA256
 * @param {object} payload 
 * @returns {string} base64 encoded token
 */
export function signToken(payload) {
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const data = JSON.stringify({ ...payload, expires });
  const hmac = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
  return Buffer.from(JSON.stringify({ data, hmac })).toString('base64');
}

/**
 * Verify token and return payload if valid, else null
 * @param {string} token base64 encoded token
 * @returns {object|null}
 */
export function verifyToken(token) {
  if (!token) return null;
  try {
    const raw = Buffer.from(token, 'base64').toString();
    const { data, hmac } = JSON.parse(raw);
    const calculatedHmac = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
    if (calculatedHmac !== hmac) {
      return null;
    }
    const payload = JSON.parse(data);
    if (payload.expires < Date.now()) {
      return null;
    }
    return payload;
  } catch (error) {
    return null;
  }
}

export function isAuthenticatedRequest(request) {
  // 1. Check Authorization header
  const authHeader = request?.headers?.get('Authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (payload) return true;
  }

  // 2. Check admin_session cookie using Next.js headers
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('admin_session');
    if (sessionCookie && sessionCookie.value) {
      const payload = verifyToken(sessionCookie.value);
      if (payload) return true;
    }
  } catch (error) {
    // Fallback to case-insensitive manual header check
    const cookieHeader = request?.headers?.get('Cookie') || request?.headers?.get('cookie') || '';
    const cookiesList = cookieHeader.split(';').map(c => c.trim());
    const sessionCookie = cookiesList.find(c => c.startsWith('admin_session='));
    if (sessionCookie) {
      const token = sessionCookie.split('=')[1];
      const payload = verifyToken(token);
      if (payload) return true;
    }
  }

  return false;
}
