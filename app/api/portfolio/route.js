import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { createDefaultPortfolioContent } from '../../../src/data/portfolioContent';
import { isAuthenticatedRequest } from '../auth/crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'portfolioContent.json');

const useKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Ignore if directory exists
  }
}

export async function getPortfolioData() {
  const defaults = createDefaultPortfolioContent({
    heroImage: '/Assets/image.webp',
    resumeUrl: '/Assets/Resume.pdf'
  });

  let localData;
  try {
    const raw = await fs.readFile(CONTENT_FILE, 'utf-8');
    localData = JSON.parse(raw);
  } catch (error) {
    localData = defaults;
  }

  if (useKV) {
    try {
      const res = await fetch(`${process.env.KV_REST_API_URL}/get/portfolio_content`, {
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`
        },
        cache: 'no-store'
      });
      if (res.ok) {
        const body = await res.json();
        if (body.result) {
          let data = body.result;
          if (typeof data === 'string') {
            try {
              data = JSON.parse(data);
            } catch (e) {
              console.error('Failed first parse of KV result:', e);
            }
          }
          if (typeof data === 'string') {
            try {
              data = JSON.parse(data);
            } catch (e) {
              console.error('Failed second parse of KV result:', e);
            }
          }
          return data;
        }
      }
    } catch (error) {
      console.error('Failed to read from Vercel KV, falling back to local file:', error);
    }
    return localData;
  }

  return localData;
}

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch portfolio data: ' + error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!isAuthenticatedRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized: Access token is missing or invalid' }, { status: 401 });
    }

    const payload = await request.json();
    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
    }

    if (useKV) {
      const res = await fetch(`${process.env.KV_REST_API_URL}/set/portfolio_content`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error('KV Store returned non-OK response: ' + res.statusText);
      }
      return NextResponse.json(payload);
    }

    await ensureDataDir();
    await fs.writeFile(CONTENT_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save portfolio data: ' + error.message }, { status: 500 });
  }
}
