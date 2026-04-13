'use client';
import { useState } from 'react';

export default function VisualizePage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleParse = async () => {
    if (!text.trim()) { setError('请输入需求文本'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/ai/parse', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const result = await res.json();
      if (result.ok) setData(result.data);
      else setError(result.error || '解析失败');
    } catch { setError('网络错误'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="font-bold text-xl"><span className="text-blue-600">Vison</span>Report</a>
          <span className="text-gray-400 text-sm">需求全景可视化</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!data ? (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">上传需求文档，生成全景图</h1>
            <p className="text-gray-500 mb-6">粘贴需求文本（Markdown 或纯文本格式），AI 自动解析并生成可视化</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`示例：\n# 电商平台 v2.0\n\n## 一、用户管理\n1.1 用户注册 - 支持手机号、邮箱注册\n1.2 用户登录 - 支持密码、验证码、第三方登录\n1.3 权限管理 - 基于RBAC模型\n\n## 二、订单管理\n2.1 创建订单 - 支持单品和多品\n2.2 订单支付 - 支持微信、支付宝`}
              className="w-full h-64 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
            />
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleParse}
              disabled={loading || !text.trim()}
              className="mt-4 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition disabled:opacity-50"
            >
              {loading ? 'AI 解析中...' : '生成需求全景图'}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">{data.projectName}</h1>
                <p className="text-gray-500 text-sm">共 {data.modules?.length || 0} 个模块，{data.modules?.reduce((a: number, m: any) => a + (m.requirements?.length || 0), 0) || 0} 条需求，{data.missingItems?.length || 0} 处可能遗漏</p>
              </div>
              <button onClick={() => setData(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">重新上传</button>
            </div>

            {/* Visual Map */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
              <div className="text-center mb-6">
                <div className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg">{data.projectName}</div>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                {data.modules?.map((mod: any, i: number) => {
                  const colors = ['blue', 'green', 'purple', 'orange', 'teal', 'pink'];
                  const color = colors[i % colors.length];
                  const bgMap: Record<string, string> = { blue: '#dbeafe', green: '#dcfce7', purple: '#f3e8ff', orange: '#ffedd5', teal: '#ccfbf1', pink: '#fce7f3' };
                  const textMap: Record<string, string> = { blue: '#1e40af', green: '#166534', purple: '#6b21a8', orange: '#9a3412', teal: '#115e59', pink: '#9d174d' };
                  return (
                    <div key={i} className="text-center min-w-[160px]">
                      <div className="px-4 py-2 rounded-lg font-bold text-sm mb-3" style={{ backgroundColor: bgMap[color], color: textMap[color] }}>{mod.name}</div>
                      <div className="space-y-1.5">
                        {mod.requirements?.map((req: any, j: number) => (
                          <div key={j} className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded text-xs border border-gray-100 text-left">{req.title}</div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Missing Items */}
            {data.missingItems?.length > 0 && (
              <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-6">
                <h3 className="font-bold text-yellow-800 mb-3">AI 检测到可能遗漏的需求</h3>
                <div className="space-y-2">
                  {data.missingItems.map((item: any, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-yellow-600 mt-0.5">⚠</span>
                      <div><span className="font-medium text-yellow-700">{item.category}：</span><span className="text-yellow-600">{item.description}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
