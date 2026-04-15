'use client';
import { useState, useEffect, use } from 'react';
import { useTranslations } from '@/components/TranslationProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

function trackClick(el: string) {
  fetch('/api/stats/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'click', element: el }) }).catch(() => {});
}

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const nav = useTranslations('nav');
  const hero = useTranslations('hero');
  const pp = useTranslations('painPoints');
  const feat = useTranslations('features');
  const demo = useTranslations('demo');
  const lp = useTranslations('landingPricing');
  const wl = useTranslations('waitlist');
  const ft = useTranslations('footer');

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetch('/api/stats/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'pageview', path: window.location.pathname, referrer: document.referrer }) }).catch(() => {});
  }, []);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); trackClick('waitlist_submit');
    try {
      const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source: 'landing' }) });
      const data = await res.json(); setResult(data); if (data.ok) setEmail('');
    } catch { setResult({ error: 'Network error' }); }
    setLoading(false);
  };

  const painPoints = [
    { icon: '📋', title: pp.p1Title, desc: pp.p1Desc },
    { icon: '🔀', title: pp.p2Title, desc: pp.p2Desc },
    { icon: '👥', title: pp.p3Title, desc: pp.p3Desc },
    { icon: '🔍', title: pp.p4Title, desc: pp.p4Desc },
  ];

  const features = [
    { title: feat.f1Title, desc: feat.f1Desc },
    { title: feat.f2Title, desc: feat.f2Desc },
    { title: feat.f3Title, desc: feat.f3Desc },
    { title: feat.f4Title, desc: feat.f4Desc },
    { title: feat.f5Title, desc: feat.f5Desc },
    { title: feat.f6Title, desc: feat.f6Desc },
  ];

  const plans = [
    { name: lp.singleName, price: lp.singlePrice, unit: lp.singleUnit, features: [lp.singleF1, lp.singleF2, lp.singleF3, lp.singleF4], cta: lp.singleCta, popular: false },
    { name: lp.personalName, price: lp.personalPrice, unit: lp.personalUnit, features: [lp.personalF1, lp.personalF2, lp.personalF3, lp.personalF4, lp.personalF5, lp.personalF6], cta: lp.personalCta, popular: true },
    { name: lp.teamName, price: lp.teamPrice, unit: lp.teamUnit, features: [lp.teamF1, lp.teamF2, lp.teamF3, lp.teamF4, lp.teamF5], cta: lp.teamCta, popular: false },
  ];

  const demoModules = [
    { name: demo.userMgmt, items: [demo.userReg, demo.userLogin, demo.permMgmt, demo.missPwdReset], color: 'blue' },
    { name: demo.orderMgmt, items: [demo.createOrder, demo.payOrder, demo.refundOrder, demo.missTimeout], color: 'green' },
    { name: demo.productMgmt, items: [demo.publishProduct, demo.inventory, demo.missSku], color: 'purple' },
  ];

  return (
    <main>
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href={`/${locale}`} className="font-bold text-xl"><span className="text-blue-600">Vison</span>Report</a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-blue-600">{nav.features}</a>
            <a href="#demo" className="hover:text-blue-600">{nav.demo}</a>
            <a href="#pricing" className="hover:text-blue-600">{nav.pricing}</a>
            <a href={`/${locale}/visualize`} className="hover:text-blue-600 font-medium">{nav.tryDemo}</a>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher locale={locale} />
            <a href={`/${locale}/login`} className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600">{nav.login}</a>
            <a href={`/${locale}/register`} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">{nav.register}</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto max-w-3xl">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">{hero.badge}</div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">{hero.title1}<br /><span className="text-blue-600">{hero.title2}</span></h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">{hero.desc}<br />{hero.desc2}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={`/${locale}/visualize`} onClick={() => trackClick('hero_try')} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg transition shadow-lg shadow-blue-200 text-center">{hero.tryButton}</a>
            <a href="#waitlist" onClick={() => trackClick('hero_waitlist')} className="px-8 py-4 border-2 border-gray-200 hover:border-blue-300 text-gray-700 font-bold rounded-xl text-lg transition text-center">{hero.waitlistButton}</a>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{pp.title}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {painPoints.map((p, i) => (
              <div key={i} className="p-6 bg-red-50 rounded-2xl border border-red-100">
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-red-900">{p.title}</h3>
                <p className="text-red-700/80">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{feat.title}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition group">
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section id="demo" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{demo.title}</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4"><div className="w-3 h-3 bg-red-400 rounded-full"></div><div className="w-3 h-3 bg-yellow-400 rounded-full"></div><div className="w-3 h-3 bg-green-400 rounded-full"></div><span className="text-xs text-gray-400 ml-2">{demo.docLabel}</span></div>
              <div className="space-y-2 text-sm text-gray-400 font-mono">
                <p className="text-gray-700 font-bold">{demo.moduleUser}</p><p>1.1 {demo.userReg}</p><p className="pl-4">{demo.userPhone}</p><p>1.2 {demo.userLogin}</p><p className="pl-4">{demo.userPwd}</p><p className="text-gray-700 font-bold mt-3">{demo.moduleOrder}</p><p>2.1 {demo.createOrder}</p><p className="text-gray-300">{demo.more}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center gap-2 mb-4"><div className="w-3 h-3 bg-red-400 rounded-full"></div><div className="w-3 h-3 bg-yellow-400 rounded-full"></div><div className="w-3 h-3 bg-green-400 rounded-full"></div><span className="text-xs text-blue-400 ml-2">{demo.mapLabel}</span></div>
              <div className="text-center">
                <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-bold mb-4 text-sm">{demo.projectName}</div>
                <div className="flex justify-center gap-4 flex-wrap">
                  {demoModules.map((m, i) => (
                    <div key={i} className="text-center">
                      <div className={`px-4 py-1.5 rounded-lg font-medium text-sm mb-3`} style={{ backgroundColor: m.color === 'blue' ? '#dbeafe' : m.color === 'green' ? '#dcfce7' : '#f3e8ff', color: m.color === 'blue' ? '#1e40af' : m.color === 'green' ? '#166534' : '#6b21a8' }}>{m.name}</div>
                      <div className="space-y-1.5">{m.items.map((item, j) => <div key={j} className={`px-3 py-1 rounded text-xs border ${item.startsWith('+') ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-white text-gray-600'}`}>{item}</div>)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{lp.title}</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className={`rounded-2xl p-6 ${plan.popular ? 'bg-blue-600 text-white ring-4 ring-blue-200 scale-105' : 'bg-white border border-gray-200'} relative`}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">{lp.popular}</div>}
                <h3 className={`font-bold text-lg mb-1 ${plan.popular ? '' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className="mb-4"><span className="text-3xl font-extrabold">¥{plan.price}</span><span className={`text-sm ml-1 ${plan.popular ? 'text-blue-200' : 'text-gray-400'}`}>/{plan.unit}</span></div>
                <ul className="space-y-2 mb-6">{plan.features.map((f, j) => <li key={j} className={`flex items-center gap-2 text-sm ${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}><span className={plan.popular ? 'text-yellow-300' : 'text-blue-500'}>&#10003;</span>{f}</li>)}</ul>
                <a href="#waitlist" onClick={() => trackClick(`pricing_${plan.name}`)} className={`block text-center py-3 rounded-xl font-bold transition ${plan.popular ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>{plan.cta}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">{wl.title}</h2>
          <p className="text-blue-100 mb-8 text-lg">{wl.desc}</p>
          {!result?.ok ? (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={wl.placeholder} className="flex-1 px-5 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <button type="submit" disabled={loading} className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-lg transition disabled:opacity-50 whitespace-nowrap">{loading ? wl.submitting : wl.submitButton}</button>
            </form>
          ) : (
            <div className="bg-white/10 backdrop-blur rounded-xl p-8 max-w-lg mx-auto">
              <div className="text-5xl mb-4">&#10003;</div>
              <p className="text-xl font-bold mb-2">{wl.success}</p>
              <p className="text-blue-100">{wl.positionBefore}<span className="text-yellow-300 font-bold text-2xl">{result.position}</span>{wl.positionAfter}</p>
            </div>
          )}
          {result?.error && <p className="mt-4 text-yellow-300">{result.error}</p>}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto text-center">
          <div className="font-bold text-xl text-white mb-4"><span className="text-blue-400">Vison</span>Report</div>
          <p className="mb-6">{ft.tagline}</p>
          <p className="text-xs text-gray-600">{ft.copyright}</p>
        </div>
      </footer>
    </main>
  );
}
