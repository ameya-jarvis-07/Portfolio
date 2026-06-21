import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { createDefaultPortfolioContent } from '../../../src/data/portfolioContent';
import { isAuthenticatedRequest } from '../auth/crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'portfolioContent.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Ignore if directory exists
  }
}

async function getPortfolioData() {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(CONTENT_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    // File doesn't exist or is invalid, initialize with defaults
    const defaults = createDefaultPortfolioContent({
      heroImage: '/Assets/image.webp',
      resumeUrl: '/Assets/Resume.pdf'
    });
    await fs.writeFile(CONTENT_FILE, JSON.stringify(defaults, null, 2), 'utf-8');
    return defaults;
  }
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

    await ensureDataDir();
    await fs.writeFile(CONTENT_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save portfolio data: ' + error.message }, { status: 500 });
  }
}
