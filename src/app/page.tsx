'use client';
import { useState, useEffect } from 'react';

function trackClick(el: string) {
  fetch('/api/stats/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'click', element: el }) }).catch(() => {});
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetch('/api/stats/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'pageview', path: '/', referrer: document.referrer }) }).catch(() => {});
  }, []);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); trackClick('waitlist_submit');
    try {
      const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source: 'landing' }) });
      const data = await res.json(); setResult(data); if (data.ok) setEmail('');
    } catch { setResult({ error: '网络错误' }); }
    setLoading(false);
  };

  return (
    <main>
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="font-bold text-xl"><span className="text-blue-600">Vison</span>Report</a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-blue-600">功能</a>
            <a href="#demo" className="hover:text-blue-600">效果预览</a>
            <a href="#pricing" className="hover:text-blue-600">价格</a>
            <a href="/visualize" className="hover:text-blue-600 font-medium">上传体验</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="/login" className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600">登录</a>
            <a href="/register" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">注册</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto max-w-3xl">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">AI 驱动 · 一键生成 · 即将上线</div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">需求文档太多太乱？<br /><span className="text-blue-600">一分钟看懂整个项目</span></h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">上传需求文档，AI 自动解析并生成项目需求全景可视化图。<br />让产品经理、开发、测试、业务方在同一张图上对齐理解。</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/visualize" onClick={() => trackClick('hero_try')} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg transition shadow-lg shadow-blue-200 text-center">免费试用上传</a>
            <a href="#waitlist" onClick={() => trackClick('hero_waitlist')} className="px-8 py-4 border-2 border-gray-200 hover:border-blue-300 text-gray-700 font-bold rounded-xl text-lg transition text-center">加入等候列表</a>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">这些痛苦，你一定经历过</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '📋', title: '需求文档几十页，没人能看完', desc: '一个中型项目需求文档动辄几十页，团队成员根本看不完、记不住' },
              { icon: '🔀', title: '需求变更了，谁都不知道', desc: '改了哪个需求、影响哪些模块？没有全局视图，变更影响范围全靠猜' },
              { icon: '👥', title: '各说各话，理解不一致', desc: '产品、开发、测试对同一个需求理解不同，返工率高达 30% 以上' },
              { icon: '🔍', title: '需求遗漏到上线才发现', desc: '非功能性需求、边界条件、异常流程经常遗漏，测试阶段才暴露' },
            ].map((p, i) => (
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
          <h2 className="text-3xl font-bold text-center mb-12">核心功能</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'AI 智能解析', desc: '上传 Word/Markdown/纯文本需求文档，AI 自动提取功能需求、非功能需求、约束条件' },
              { title: '需求全景图', desc: '一张图展示项目所有需求的模块、层级、关系。支持缩放、折叠、搜索' },
              { title: '遗漏检测', desc: 'AI 自动检查需求覆盖度，识别可能遗漏的安全、性能、兼容性等维度' },
              { title: '多种视图', desc: '需求树、思维导图、模块分组……多种视图自由切换' },
              { title: '一键导出', desc: '导出为高清图片、PDF 或分享链接，发给团队和客户' },
              { title: '团队协作', desc: '多人实时在需求图上标注、评论、圈选（V2）' },
            ].map((f, i) => (
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
          <h2 className="text-3xl font-bold text-center mb-12">效果预览</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4"><div className="w-3 h-3 bg-red-400 rounded-full"></div><div className="w-3 h-3 bg-yellow-400 rounded-full"></div><div className="w-3 h-3 bg-green-400 rounded-full"></div><span className="text-xs text-gray-400 ml-2">需求文档.docx</span></div>
              <div className="space-y-2 text-sm text-gray-400 font-mono">
                <p className="text-gray-700 font-bold">一、用户管理模块</p><p>1.1 用户注册</p><p className="pl-4">支持手机号、邮箱注册...</p><p>1.2 用户登录</p><p className="pl-4">支持密码、验证码、第三方...</p><p className="text-gray-700 font-bold mt-3">二、订单管理模块</p><p>2.1 创建订单</p><p className="text-gray-300">... 还有 200 多条需求</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center gap-2 mb-4"><div className="w-3 h-3 bg-red-400 rounded-full"></div><div className="w-3 h-3 bg-yellow-400 rounded-full"></div><div className="w-3 h-3 bg-green-400 rounded-full"></div><span className="text-xs text-blue-400 ml-2">需求全景图 · 自动生成</span></div>
              <div className="text-center">
                <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-bold mb-4 text-sm">电商平台 v2.0</div>
                <div className="flex justify-center gap-4 flex-wrap">
                  {[{ name: '用户管理', items: ['用户注册', '用户登录', '权限管理', '+ 遗漏: 密码重置'], color: 'blue' }, { name: '订单管理', items: ['创建订单', '订单支付', '订单退款', '+ 遗漏: 订单超时'], color: 'green' }, { name: '商品管理', items: ['商品发布', '库存管理', '+ 遗漏: SKU管理'], color: 'purple' }].map((m, i) => (
                    <div key={i} className="text-center">
                      <div className={`bg-${m.color}-100 text-${m.color}-800 px-4 py-1.5 rounded-lg font-medium text-sm mb-3`} style={{ backgroundColor: m.color === 'blue' ? '#dbeafe' : m.color === 'green' ? '#dcfce7' : '#f3e8ff', color: m.color === 'blue' ? '#1e40af' : m.color === 'green' ? '#166534' : '#6b21a8' }}>{m.name}</div>
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
          <h2 className="text-3xl font-bold text-center mb-12">简洁透明的价格</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: '单次使用', price: '9.9', unit: '次', features: ['上传1份文档', '生成全景图', '导出图片', '基础遗漏检测'], cta: '按次购买', popular: false },
              { name: '个人版', price: '399', unit: '年', features: ['无限文档', '所有视图', 'AI遗漏检测', '导出PDF', '分享链接', '早鸟¥99/年'], cta: '立即订阅', popular: true },
              { name: '团队版', price: '1,899', unit: '年(5人)', features: ['个人版全部', '5人协作', '批注评论', '团队空间', '优先支持'], cta: '团队订阅', popular: false },
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl p-6 ${plan.popular ? 'bg-blue-600 text-white ring-4 ring-blue-200 scale-105' : 'bg-white border border-gray-200'} relative`}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">最受欢迎</div>}
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
          <h2 className="text-3xl font-bold mb-4">加入等候列表，抢先体验</h2>
          <p className="text-blue-100 mb-8 text-lg">早鸟价 ¥99/年（原价¥399/年），限前200名</p>
          {!result?.ok ? (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="输入你的邮箱" className="flex-1 px-5 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <button type="submit" disabled={loading} className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-lg transition disabled:opacity-50 whitespace-nowrap">{loading ? '提交中...' : '抢先注册'}</button>
            </form>
          ) : (
            <div className="bg-white/10 backdrop-blur rounded-xl p-8 max-w-lg mx-auto">
              <div className="text-5xl mb-4">&#10003;</div>
              <p className="text-xl font-bold mb-2">注册成功！</p>
              <p className="text-blue-100">你是第 <span className="text-yellow-300 font-bold text-2xl">{result.position}</span> 位等候用户</p>
            </div>
          )}
          {result?.error && <p className="mt-4 text-yellow-300">{result.error}</p>}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto text-center">
          <div className="font-bold text-xl text-white mb-4"><span className="text-blue-400">Vison</span>Report</div>
          <p className="mb-6">需求全景可视化 — 让需求看得见，让项目看得清</p>
          <p className="text-xs text-gray-600">&copy; 2026 VisonReport</p>
        </div>
      </footer>
    </main>
  );
}
