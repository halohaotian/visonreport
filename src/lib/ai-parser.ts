// AI 需求解析引擎
// 将需求文档（纯文本/Markdown）解析为结构化需求

interface ParsedRequirement {
  id: string;
  title: string;
  type: 'functional' | 'non-functional' | 'constraint' | 'business-rule';
  module: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  children?: ParsedRequirement[];
}

interface ParseResult {
  projectName: string;
  modules: {
    name: string;
    requirements: ParsedRequirement[];
  }[];
  missingItems: {
    category: string;
    description: string;
  }[];
}

export async function parseRequirements(content: string): Promise<ParseResult> {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return mockParse(content);
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `你是一个专业的需求分析师。请分析以下需求文档，提取所有需求条目，并按模块分组。

请以 JSON 格式返回，结构如下：
{
  "projectName": "项目名称",
  "modules": [
    {
      "name": "模块名",
      "requirements": [
        {
          "id": "R001",
          "title": "需求标题",
          "type": "functional/non-functional/constraint/business-rule",
          "module": "所属模块",
          "description": "需求描述",
          "priority": "high/medium/low"
        }
      ]
    }
  ],
  "missingItems": [
    {
      "category": "安全性/性能/兼容性/异常处理/数据备份",
      "description": "可能遗漏的需求描述"
    }
  ]
}

需求文档内容：
${content}`
      }],
    }),
  });

  if (!response.ok) {
    return mockParse(content);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || '';

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {}

  return mockParse(content);
}

function mockParse(content: string): ParseResult {
  // 本地 fallback 解析（无 API key 时使用）
  const lines = content.split('\n').filter(l => l.trim());
  const modules: ParseResult['modules'] = [];
  let currentModule = '默认模块';
  let reqCount = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.match(/^[一二三四五六七八九十\d]+[、.．]/) || trimmed.match(/^#+\s/)) {
      currentModule = trimmed.replace(/^[一二三四五六七八九十\d]+[、.．\s#]+/, '').trim();
      if (!modules.find(m => m.name === currentModule)) {
        modules.push({ name: currentModule, requirements: [] });
      }
    } else if (trimmed.match(/^\d+\.\d+/) || trimmed.match(/^[•\-]\s/)) {
      const title = trimmed.replace(/^\d+\.\d+\s*/, '').replace(/^[•\-]\s*/, '').slice(0, 50);
      if (title && title.length > 3) {
        const mod = modules.find(m => m.name === currentModule);
        if (mod) {
          mod.requirements.push({
            id: `R${String(++reqCount).padStart(3, '0')}`,
            title,
            type: 'functional',
            module: currentModule,
            description: title,
            priority: 'medium',
          });
        }
      }
    }
  }

  if (modules.length === 0) {
    modules.push({
      name: '项目需求',
      requirements: [{
        id: 'R001', title: '请上传更详细的需求文档', type: 'functional',
        module: '项目需求', description: '文档内容不足以提取需求', priority: 'high',
      }],
    });
  }

  return {
    projectName: '解析结果（本地模式）',
    modules,
    missingItems: [
      { category: '安全性', description: '建议补充安全相关需求' },
      { category: '性能', description: '建议补充性能指标需求' },
    ],
  };
}
