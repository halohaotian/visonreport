'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (data.ok) window.location.href = data.user.role === 'admin' ? '/admin' : '/';
      else setError(data.error || '登录失败');
    } catch { setError('网络错误'); }
    setLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8"><a href="/" className="inline-block font-bold text-2xl mb-2"><span className="text-blue-600">Vison</span>Report</a><p className="text-gray-500">登录你的账户</p></div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-5">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
          <div><label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="name@example.com" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">密码</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="输入密码" /></div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50">{loading ? '登录中...' : '登录'}</button>
          <p className="text-center text-sm text-gray-500">还没有账户？ <a href="/register" className="text-blue-600 hover:underline">立即注册</a></p>
        </form>
      </div>
    </div>
  );
}
