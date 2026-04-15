import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: '请输入有效的邮箱地址' }, { status: 400 });
    }
    const sql = neon(process.env.BLASTOFF_DATABASE_URL!);
    const existing = await sql`SELECT id FROM vr_waitlist WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: '该邮箱已在等候列表中' }, { status: 409 });
    }
    await sql`INSERT INTO vr_waitlist (email, source) VALUES (${email}, ${source || 'landing'})`;
    const count = await sql`SELECT COUNT(*)::int as c FROM vr_waitlist`;
    return NextResponse.json({ ok: true, position: count[0].c });
  } catch {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
