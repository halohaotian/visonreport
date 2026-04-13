'use client';
import { useState, useEffect } from 'react';

interface DailyStat { date: string; page_views: number; clicks: number; registrations: number; subscriptions: number; }
interface Summary { totalUsers: number; totalWaitlist: number; totalSubscriptions: number; totalRevenue: number; }
interface WaitlistEntry { id: number; email: string; source: string; created_at: string; }

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState<DailyStat[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [tab, setTab] = useState<'overview' | 'waitlist'>('overview');

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(data => {
      if (data.user?.role === 'admin') { setAuthed(true); loadStats(); loadWaitlist(); }
      else window.location.href = '/login';
    }).catch(() => window.location.href = '/login').finally(() => setLoading(false));
  }, []);

  const loadStats = async () => { const res = await fetch('/api/admin/stats'); if (res.ok) { const d = await res.json(); setDaily(d.daily); setSummary(d.summary); } };
  const loadWaitlist = async () => { const res = await fetch('/api/admin/waitlist'); if (res.ok) { const d = await res.json(); setWaitlist(d.list); } };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">加载中...</p></div>;
  if (!authed) return null;

  const today = daily[daily.length - 1] || { page_views: 0, clicks: 0, registrations: 0, subscriptions: 0 };
  const yesterday = daily[daily.length - 2] || { page_views: 0, clicks: 0, registrations: 0, subscriptions: 0 };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4"><a href="/" className="font-bold text-lg"><span className="text-blue-600">Vison</span>Report</a><span className="text-gray-300">|</span><span className="text-gray-500 text-sm">管理后台</span></div>
          <a href="/" className="text-sm text-gray-500 hover:text-blue-600">返回首页</a>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8">
          <button onClick={() => setTab('overview')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'overview' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>数据概览</button>
          <button onClick={() => setTab('waitlist')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'waitlist' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>等候列表 ({summary?.totalWaitlist || 0})</button>
        </div>

        {tab === 'overview' && (<>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[{ t: '总用户数', v: summary?.totalUsers || 0, c: 'from-blue-500 to-blue-600' }, { t: '等候列表', v: summary?.totalWaitlist || 0, c: 'from-indigo-500 to-indigo-600' }, { t: '活跃订阅', v: summary?.totalSubscriptions || 0, c: 'from-green-500 to-green-600' }, { t: '总收入', v: `¥${(summary?.totalRevenue || 0).toFixed(0)}`, c: 'from-yellow-500 to-yellow-600' }].map((s, i) => (
              <div key={i} className={`bg-gradient-to-br ${s.c} rounded-xl p-6 text-white`}><p className="text-white/70 text-sm mb-1">{s.t}</p><p className="text-3xl font-bold">{s.v}</p></div>
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[{ t: '今日浏览', v: today.page_views, y: yesterday.page_views }, { t: '今日点击', v: today.clicks, y: yesterday.clicks }, { t: '今日注册', v: today.registrations, y: yesterday.registrations }, { t: '今日订阅', v: today.subscriptions, y: yesterday.subscriptions }].map((d, i) => {
              const pct = d.y === 0 ? (d.v > 0 ? '+100%' : '0%') : `${((d.v - d.y) / d.y * 100).toFixed(1)}%`;
              const up = pct.startsWith('+') || (pct !== '0%' && !pct.startsWith('-'));
              return <div key={i} className="bg-white rounded-xl border border-gray-200 p-5"><p className="text-gray-400 text-sm mb-1">{d.t}</p><div className="flex items-end gap-2"><p className="text-2xl font-bold">{d.v}</p><span className={`text-xs font-medium ${up ? 'text-green-500' : 'text-red-500'}`}>{pct}</span></div></div>;
            })}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100"><h3 className="font-bold text-lg">每日趋势（近30天）</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50"><th className="px-4 py-3 text-left text-gray-500 font-medium">日期</th><th className="px-4 py-3 text-right text-gray-500 font-medium">浏览量</th><th className="px-4 py-3 text-right text-gray-500 font-medium">点击量</th><th className="px-4 py-3 text-right text-gray-500 font-medium">注册数</th><th className="px-4 py-3 text-right text-gray-500 font-medium">订阅数</th></tr></thead>
                <tbody>{[...daily].reverse().map((d) => (<tr key={d.date} className="border-t border-gray-50 hover:bg-gray-50"><td className="px-4 py-2.5 text-gray-700">{d.date}</td><td className="px-4 py-2.5 text-right font-mono">{d.page_views}</td><td className="px-4 py-2.5 text-right font-mono">{d.clicks}</td><td className="px-4 py-2.5 text-right font-mono text-blue-600 font-medium">{d.registrations}</td><td className="px-4 py-2.5 text-right font-mono text-green-600 font-medium">{d.subscriptions}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        </>)}

        {tab === 'waitlist' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100"><h3 className="font-bold text-lg">等候列表用户</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50"><th className="px-4 py-3 text-left text-gray-500 font-medium">#</th><th className="px-4 py-3 text-left text-gray-500 font-medium">邮箱</th><th className="px-4 py-3 text-left text-gray-500 font-medium">来源</th><th className="px-4 py-3 text-left text-gray-500 font-medium">注册时间</th></tr></thead>
                <tbody>
                  {waitlist.length === 0 ? <tr><td colSpan={4} className="px-4 py-12 text-center text-gray-400">暂无等候列表用户</td></tr> : waitlist.map((w, i) => (
                    <tr key={w.id} className="border-t border-gray-50 hover:bg-gray-50"><td className="px-4 py-2.5 text-gray-400">{waitlist.length - i}</td><td className="px-4 py-2.5 text-gray-700">{w.email}</td><td className="px-4 py-2.5"><span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{w.source}</span></td><td className="px-4 py-2.5 text-gray-400">{String(w.created_at)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
