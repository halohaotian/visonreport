'use client';
import { useState, use } from 'react';
import { useTranslations } from '@/components/TranslationProvider';

export default function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name }) });
      const data = await res.json();
      if (data.ok) window.location.href = `/${locale}`;
      else setError(data.error || t.registerFailed);
    } catch { setError(t.networkError); }
    setLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><a href={`/${locale}`} className="inline-block font-bold text-2xl mb-2"><span className="text-blue-600">Vison</span>Report</a><p className="text-gray-500">{t.title}</p></div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-5">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
          <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={t.namePlaceholder} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="name@example.com" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.password}</label><input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={t.passwordPlaceholder} /></div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50">{loading ? t.submitting : t.submit}</button>
          <p className="text-center text-sm text-gray-500">{t.hasAccount} <a href={`/${locale}/login`} className="text-blue-600 hover:underline">{t.loginLink}</a></p>
        </form>
      </div>
    </div>
  );
}
