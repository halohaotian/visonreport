import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL!;

export function getSql() {
  return neon(DATABASE_URL);
}

// 初始化数据库表（部署时调用一次）
export async function initDatabase() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      source TEXT DEFAULT 'landing',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS page_views (
      id SERIAL PRIMARY KEY,
      path TEXT NOT NULL,
      referrer TEXT,
      ip TEXT,
      user_agent TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS click_events (
      id SERIAL PRIMARY KEY,
      element TEXT NOT NULL,
      path TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      plan TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'active',
      trade_no TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS daily_stats (
      date TEXT PRIMARY KEY,
      page_views INTEGER DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      registrations INTEGER DEFAULT 0,
      subscriptions INTEGER DEFAULT 0
    )
  `;
}

const today = () => new Date().toISOString().split('T')[0];

export async function trackPageView(path: string, referrer?: string, ip?: string, userAgent?: string) {
  const sql = getSql();
  const d = today();
  await sql`INSERT INTO page_views (path, referrer, ip, user_agent) VALUES (${path}, ${referrer || null}, ${ip || null}, ${userAgent || null})`;
  await sql`
    INSERT INTO daily_stats (date, page_views) VALUES (${d}, 1)
    ON CONFLICT (date) DO UPDATE SET page_views = daily_stats.page_views + 1
  `;
}

export async function trackClick(element: string, path?: string) {
  const sql = getSql();
  const d = today();
  await sql`INSERT INTO click_events (element, path) VALUES (${element}, ${path || null})`;
  await sql`
    INSERT INTO daily_stats (date, clicks) VALUES (${d}, 1)
    ON CONFLICT (date) DO UPDATE SET clicks = daily_stats.clicks + 1
  `;
}

export async function trackRegistration() {
  const sql = getSql();
  const d = today();
  await sql`
    INSERT INTO daily_stats (date, registrations) VALUES (${d}, 1)
    ON CONFLICT (date) DO UPDATE SET registrations = daily_stats.registrations + 1
  `;
}

export async function trackSubscription() {
  const sql = getSql();
  const d = today();
  await sql`
    INSERT INTO daily_stats (date, subscriptions) VALUES (${d}, 1)
    ON CONFLICT (date) DO UPDATE SET subscriptions = daily_stats.subscriptions + 1
  `;
}

export async function getDailyStats(days: number = 30) {
  const sql = getSql();
  return sql`
    WITH RECURSIVE dates(date) AS (
      SELECT CURRENT_DATE - (${days}::int || ' days')::interval::date
      UNION ALL
      SELECT (date + 1)::date FROM dates WHERE date < CURRENT_DATE
    )
    SELECT
      d.date::text as date,
      COALESCE(s.page_views, 0) as page_views,
      COALESCE(s.clicks, 0) as clicks,
      COALESCE(s.registrations, 0) as registrations,
      COALESCE(s.subscriptions, 0) as subscriptions
    FROM dates d
    LEFT JOIN daily_stats s ON d.date::text = s.date
    ORDER BY d.date ASC
  `;
}

export async function getSummaryStats() {
  const sql = getSql();
  const [users, waitlist, subs, revenue] = await Promise.all([
    sql`SELECT COUNT(*)::int as count FROM users`,
    sql`SELECT COUNT(*)::int as count FROM waitlist`,
    sql`SELECT COUNT(*)::int as count FROM subscriptions WHERE status = 'active'`,
    sql`SELECT COALESCE(SUM(amount), 0)::float as total FROM subscriptions WHERE status = 'active'`,
  ]);
  return {
    totalUsers: users[0].count,
    totalWaitlist: waitlist[0].count,
    totalSubscriptions: subs[0].count,
    totalRevenue: revenue[0].total,
  };
}
