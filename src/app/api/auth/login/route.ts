import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: '请输入邮箱和密码' }, { status: 400 });
    const sql = neon(process.env.DATABASE_URL!);
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (users.length === 0) return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    const user = users[0] as any;
    if (!(await comparePassword(password, user.password))) return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const response = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
    return response;
  } catch { return NextResponse.json({ error: '服务器错误' }, { status: 500 }); }
}
