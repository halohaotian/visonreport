import { NextRequest, NextResponse } from 'next/server';
import { parseRequirements } from '@/lib/ai-parser';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const text = formData.get('text') as string | null;
    let content = text || '';
    if (file) {
      content = await file.text();
    }
    if (!content || content.trim().length < 10) {
      return NextResponse.json({ error: '请上传需求文档或输入需求文本' }, { status: 400 });
    }
    const result = await parseRequirements(content);
    return NextResponse.json({ ok: true, data: result });
  } catch {
    return NextResponse.json({ error: '解析失败' }, { status: 500 });
  }
}
