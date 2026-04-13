import { NextRequest, NextResponse } from 'next/server';
import { trackPageView, trackClick } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, path, referrer, element } = body;
    if (type === 'pageview') {
      const ip = req.headers.get('x-forwarded-for') || '';
      const ua = req.headers.get('user-agent') || '';
      await trackPageView(path || '/', referrer, ip, ua);
    } else if (type === 'click') {
      await trackClick(element || 'unknown', path);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
