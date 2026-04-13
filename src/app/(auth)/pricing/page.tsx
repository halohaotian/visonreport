'use client';
import { useState, useEffect } from 'react';

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  useEffect(() => { fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => d?.user && setUser(d.user)).catch(() => {}); }, []);
  const handleSubscribe = async (plan: string) => {
    if (!user) { window.location.href = '/register'; return; }
    setSubscribing(plan);
    try {
      const res = await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan }) });
      const data = await res.json();
      if (data.ok) setMessage(`${data.message} 订单号: ${data.tradeNo}`);
      else setMessage(data.error || '订阅失败');
    } catch { setMessage('网络错误'); }
    setSubscribing(null);
  };
  const plans = [
    { key: 'single', name: '单次使用', price: '¥9.9', unit: '/次', desc: '上传1份文档，生成全景图' },
    { key: 'personal_monthly', name: '个人版月付', price: '¥49', unit: '/月', desc: '无限文档，所有视图' },
    { key: 'personal_yearly', name: '个人版年付', price: '¥399', unit: '/年', desc: '省¥189，含所有功能' },
    { key: 'team_monthly', name: '团队版月付', price: '¥199', unit: '/月', desc: '5人协作，批注评论' },
    { key: 'team_yearly', name: '团队版年付', price: '¥1,899', unit: '/年', desc: '5人团队，最优性价比' },
    { key: 'enterprise', name: '企业版', price: '¥999', unit: '/月', desc: '私有部署，无限人数' },
  ];
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12"><h1 className="text-3xl font-bold mb-2">选择适合你的方案</h1><p className="text-gray-500">{!user ? '请先' : `你好，${user.email}`}{!user && <a href="/login" className="text-blue-600 hover:underline ml-1">登录</a>}</p></div>
        {message && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-center">{message}</div>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.key} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 transition">
              <h3 className="font-bold text-lg mb-1">{plan.name}</h3><p className="text-gray-400 text-sm mb-3">{plan.desc}</p>
              <div className="mb-4"><span className="text-2xl font-extrabold">{plan.price}</span><span className="text-gray-400 text-sm">{plan.unit}</span></div>
              <button onClick={() => handleSubscribe(plan.key)} disabled={subscribing === plan.key} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50 text-sm">{subscribing === plan.key ? '处理中...' : '订阅'}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
