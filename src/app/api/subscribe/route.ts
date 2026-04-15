import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';
import { trackSubscription } from '@/lib/db';

export async function POST(req: NextRequest) {
  const token = getTokenFromHeaders(req.headers);
  if (!token) return NextResponse.json({ error: '请先登录' }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: '登录已过期' }, { status: 401 });
  try {
    const { plan } = await req.json();
    const plans: Record<string, { name: string; price: number }> = {
      personal_monthly: { name: '个人版月付', price: 49 },
      personal_yearly: { name: '个人版年付', price: 399 },
      team_monthly: { name: '团队版月付', price: 199 },
      team_yearly: { name: '团队版年付', price: 1899 },
      enterprise: { name: '企业版', price: 999 },
      single: { name: '单次使用', price: 9.9 },
    };
    const selected = plans[plan];
    if (!selected) return NextResponse.json({ error: '无效的套餐' }, { status: 400 });
    const sql = neon(process.env.BLASTOFF_DATABASE_URL!);
    const tradeNo = `VR${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
    await sql`INSERT INTO subscriptions (user_id, plan, amount, status, trade_no) VALUES (${payload.userId}, ${plan}, ${selected.price}, 'active', ${tradeNo})`;
    await trackSubscription();
    return NextResponse.json({ ok: true, tradeNo, plan: selected.name, amount: selected.price, message: '订阅成功！（当前为模拟支付）' });
  } catch { return NextResponse.json({ error: '服务器错误' }, { status: 500 }); }
}
