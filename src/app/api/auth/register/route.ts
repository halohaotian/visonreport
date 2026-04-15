import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { hashPassword, signToken } from '@/lib/auth';
import { trackRegistration } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !email.includes('@')) return NextResponse.json({ error: '请输入有效的邮箱' }, { status: 400 });
    if (!password || password.length < 6) return NextResponse.json({ error: '密码至少6位' }, { status: 400 });
    const sql = neon(process.env.BLASTOFF_DATABASE_URL!);
    const existing = await sql`SELECT id FROM vr_users WHERE email = ${email}`;
    if (existing.length > 0) return NextResponse.json({ error: '该邮箱已注册' }, { status: 409 });
    const hash = await hashPassword(password);
    const result = await sql`INSERT INTO vr_users (email, password, name) VALUES (${email}, ${hash}, ${name || null}) RETURNING id`;
    await trackRegistration();
    const token = signToken({ userId: result[0].id, email, role: 'user' });
    const response = NextResponse.json({ ok: true, user: { id: result[0].id, email, name } });
    response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
    return response;
  } catch { return NextResponse.json({ error: '服务器错误' }, { status: 500 }); }
}
