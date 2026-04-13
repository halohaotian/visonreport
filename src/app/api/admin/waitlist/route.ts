import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = getTokenFromHeaders(req.headers);
  if (!token) return NextResponse.json({ error: '未授权' }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'admin') return NextResponse.json({ error: '权限不足' }, { status: 403 });
  const sql = neon(process.env.DATABASE_URL!);
  const list = await sql`SELECT * FROM waitlist ORDER BY created_at DESC`;
  return NextResponse.json({ list });
}
