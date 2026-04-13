import { NextRequest, NextResponse } from 'next/server';
import { parseRequirements } from '@/lib/ai-parser';

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    if (!content) return NextResponse.json({ error: '请提供需求内容' }, { status: 400 });
    const result = await parseRequirements(content);
    return NextResponse.json({ ok: true, missingItems: result.missingItems });
  } catch {
    return NextResponse.json({ error: '检测失败' }, { status: 500 });
  }
}
