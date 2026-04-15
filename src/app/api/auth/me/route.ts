import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = getTokenFromHeaders(req.headers);
  if (!token) return NextResponse.json({ error: '未登录' }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: '登录已过期' }, { status: 401 });
  const sql = neon(process.env.BLASTOFF_DATABASE_URL!);
  const users = await sql`SELECT id, email, name, role, created_at FROM users WHERE id = ${payload.userId}`;
  if (users.length === 0) return NextResponse.json({ error: '用户不存在' }, { status: 404 });
  return NextResponse.json({ user: users[0] });
}
