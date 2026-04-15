'use client';
import { useState, useEffect, use } from 'react';
import { useTranslations } from '@/components/TranslationProvider';

export default function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('pricing');
  const [user, setUser] = useState<any>(null);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  useEffect(() => { fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => d?.user && setUser(d.user)).catch(() => {}); }, []);
  const handleSubscribe = async (plan: string) => {
    if (!user) { window.location.href = `/${locale}/register`; return; }
    setSubscribing(plan);
    try {
      const res = await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan }) });
      const data = await res.json();
      if (data.ok) setMessage(`${data.message} Order: ${data.tradeNo}`);
      else setMessage(data.error || t.subscribeFailed);
    } catch { setMessage(t.networkError); }
    setSubscribing(null);
  };
  const plans = [
    { key: 'single', ...t.single as any },
    { key: 'personal_monthly', ...t.personalMonthly as any },
    { key: 'personal_yearly', ...t.personalYearly as any },
    { key: 'team_monthly', ...t.teamMonthly as any },
    { key: 'team_yearly', ...t.teamYearly as any },
    { key: 'enterprise', ...t.enterprise as any },
  ];
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12"><h1 className="text-3xl font-bold mb-2">{t.title}</h1><p className="text-gray-500">{!user ? t.pleaseLogin : `${t.hello}${user.email}`}{!user && <a href={`/${locale}/login`} className="text-blue-600 hover:underline ml-1">{t.loginLink}</a>}</p></div>
        {message && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-center">{message}</div>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.key} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 transition">
              <h3 className="font-bold text-lg mb-1">{plan.name}</h3><p className="text-gray-400 text-sm mb-3">{plan.desc}</p>
              <div className="mb-4"><span className="text-2xl font-extrabold">{plan.price}</span><span className="text-gray-400 text-sm">{plan.unit}</span></div>
              <button onClick={() => handleSubscribe(plan.key)} disabled={subscribing === plan.key} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50 text-sm">{subscribing === plan.key ? t.processing : t.subscribe}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
