import { NextResponse } from 'next/server';
import { getDailyStats, getSummaryStats } from '@/lib/db';

export async function GET() {
  const [daily, summary] = await Promise.all([getDailyStats(30), getSummaryStats()]);
  return NextResponse.json({ daily, summary });
}
