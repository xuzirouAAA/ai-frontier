/**
 * 计算器注册表 - 30 个首批工具
 *
 * 每个计算器包含：slug、分类、标题、描述、公式、输入项、示例、FAQ、相关工具
 * 模板中所有数字占位符为占位/示例值，业务上线前请由人工校准。
 */

import type { Calculator, CalculatorCategory } from '@/types/calculator';

export const CALCULATOR_CATEGORIES: CalculatorCategory[] = [
  { slug: 'ai-cost', name: 'AI 成本', description: 'AI 模型 API、图片、视频、GPU 成本估算', icon: 'cpu' },
  { slug: 'programming', name: '编程开发', description: 'JSON、Base64、正则、URL 等开发工具', icon: 'code' },
  { slug: 'math', name: '数学计算', description: '百分比、单位转换、BMI 等日常计算', icon: 'sigma' },
  { slug: 'finance', name: '金融财务', description: '贷款、汇率、工资、投资回报计算', icon: 'dollar' },
  { slug: 'health', name: '健康生活', description: '卡路里、营养、孕产、年龄计算', icon: 'heart' },
  { slug: 'text', name: '文本工具', description: '字数、阅读时间、大小写转换', icon: 'type' },
];

export const CALCULATORS: Calculator[] = [
  // ============================================================
  // 分类 1: AI 成本计算 (5)
  // ============================================================
  {
    slug: 'ai-token-cost',
    category: 'ai-cost',
    title: 'AI Token 用量与费用计算器',
    description: '估算 ChatGPT、Claude、Gemini 等大模型的 Token 用量与 API 费用，支持输入与输出 Token 分别计费。',
    formula: '总费用 = 输入Token × 输入单价 + 输出Token × 输出单价',
    inputs: [
      { label: '输入 Token 数', type: 'number', value: 1000 },
      { label: '输出 Token 数', type: 'number', value: 500 },
      { label: '模型', type: 'select', options: ['GPT-4o', 'Claude Sonnet 4', 'Gemini 1.5 Pro', 'DeepSeek V3'] },
    ],
    result: '估算费用',
    examples: [
      { label: '客服对话', inputs: { tokensIn: 800, tokensOut: 400, model: 'GPT-4o' }, output: '约 ¥0.05' },
      { label: '代码生成', inputs: { tokensIn: 2000, tokensOut: 1500, model: 'Claude Sonnet 4' }, output: '约 ¥0.18' },
    ],
    faq: [
      { question: '什么是 Token？', answer: 'Token 是大模型处理文本的最小单位。中文约 1-2 字/Token，英文约 0.75 词/Token。' },
      { question: '为什么输入输出价格不同？', answer: '通常输出 Token 价格为输入的 3-5 倍，因为生成内容的算力消耗更高。' },
    ],
    relatedCalculators: ['ai-api-monthly', 'token-counter', 'ai-image-cost'],
  },
  {
    slug: 'ai-api-monthly',
    category: 'ai-cost',
    title: 'AI API 月度成本估算器',
    description: '根据日均调用量、每次调用 Token 消耗，估算每月 API 费用，并对比多个模型的价格。',
    formula: '月度费用 = 日均调用 × 每次费用 × 30',
    inputs: [
      { label: '日均调用次数', type: 'number', value: 100 },
      { label: '每次输入 Token', type: 'number', value: 1500 },
      { label: '每次输出 Token', type: 'number', value: 800 },
      { label: '模型', type: 'select', options: ['GPT-4o', 'Claude Sonnet 4', 'Gemini 1.5 Pro', 'DeepSeek V3'] },
    ],
    result: '月度总费用',
    examples: [
      { label: '小型应用', inputs: { calls: 50, in: 1000, out: 500, model: 'GPT-4o' }, output: '约 ¥75/月' },
      { label: '中型应用', inputs: { calls: 500, in: 1500, out: 800, model: 'Claude Sonnet 4' }, output: '约 ¥4,500/月' },
    ],
    faq: [
      { question: '实际费用会与估算差多少？', answer: '误差通常在 10-20% 以内。缓存命中、batch 调用、上下文长度等都会影响实际账单。' },
    ],
    relatedCalculators: ['ai-token-cost', 'ai-image-cost', 'gpu-rental-cost'],
  },
  {
    slug: 'ai-image-cost',
    category: 'ai-cost',
    title: 'AI 图片生成成本计算器',
    description: '估算 Midjourney、DALL·E 3、Stable Diffusion 等图片生成服务的单张成本与月度成本。',
    formula: '月度成本 = 单张成本 × 日均张数 × 30',
    inputs: [
      { label: '日均生成张数', type: 'number', value: 20 },
      { label: '服务', type: 'select', options: ['Midjourney Pro', 'DALL·E 3', 'Stable Diffusion Cloud', 'Flux Pro'] },
      { label: '图片分辨率', type: 'select', options: ['1024×1024', '2048×2048', '4096×4096'] },
    ],
    result: '月度总成本',
    examples: [
      { label: '个人创作者', inputs: { images: 10, service: 'Midjourney Pro', size: '1024×1024' }, output: '约 $30/月' },
      { label: '电商产品图', inputs: { images: 100, service: 'DALL·E 3', size: '2048×2048' }, output: '约 $120/月' },
    ],
    faq: [
      { question: '哪种服务最便宜？', answer: 'Stable Diffusion Cloud 自托管成本最低，但需要技术能力。Midjourney 质量最好但价格较高。' },
    ],
    relatedCalculators: ['ai-token-cost', 'ai-video-cost', 'ai-api-monthly'],
  },
  {
    slug: 'ai-video-cost',
    category: 'ai-cost',
    title: 'AI 视频生成成本计算器',
    description: '估算 Sora、Runway Gen-4、Pika 等 AI 视频生成工具的成本，按分辨率和时长计算。',
    formula: '总成本 = 单秒成本 × 视频时长(秒) × 生成条数',
    inputs: [
      { label: '视频时长（秒）', type: 'number', value: 10 },
      { label: '生成条数', type: 'number', value: 5 },
      { label: '服务', type: 'select', options: ['Sora', 'Runway Gen-4', 'Pika', 'Kling'] },
      { label: '分辨率', type: 'select', options: ['720p', '1080p', '4K'] },
    ],
    result: '总成本',
    examples: [
      { label: '短视频片段', inputs: { duration: 5, count: 10, service: 'Runway Gen-4', res: '1080p' }, output: '约 $50' },
      { label: '广告级内容', inputs: { duration: 30, count: 3, service: 'Sora', res: '1080p' }, output: '约 $300' },
    ],
    faq: [
      { question: '视频生成成本为什么这么高？', answer: '视频生成需要数百帧连续画面，计算量是图片的 50-200 倍，因此单价显著高于图片生成。' },
    ],
    relatedCalculators: ['ai-image-cost', 'ai-token-cost'],
  },
  {
    slug: 'gpu-rental-cost',
    category: 'ai-cost',
    title: 'GPU 租赁成本计算器',
    description: '对比 AWS、Lambda Labs、RunPod 等云 GPU 租赁价格，估算训练/推理的硬件成本。',
    formula: '总成本 = 每小时单价 × 使用时长(小时) × GPU 数量',
    inputs: [
      { label: 'GPU 型号', type: 'select', options: ['A100 80G', 'H100 80G', 'RTX 4090', 'L40S'] },
      { label: 'GPU 数量', type: 'number', value: 4 },
      { label: '使用时长（小时）', type: 'number', value: 100 },
      { label: '服务商', type: 'select', options: ['AWS', 'Lambda Labs', 'RunPod', 'Vast.ai'] },
    ],
    result: '总成本',
    examples: [
      { label: '小模型微调', inputs: { gpu: 'A100 80G', count: 4, hours: 24, provider: 'RunPod' }, output: '约 $460' },
      { label: '大模型预训练', inputs: { gpu: 'H100 80G', count: 32, hours: 720, provider: 'Lambda Labs' }, output: '约 $138,000' },
    ],
    faq: [
      { question: '自建 vs 云租赁哪个划算？', answer: '如果年使用时长超过 4000 小时，自建 GPU 集群更划算；反之云租赁更灵活。' },
    ],
    relatedCalculators: ['ai-api-monthly', 'ai-training-cost'],
  },

  // ============================================================
  // 分类 2: 编程开发 (5)
  // ============================================================
  {
    slug: 'token-counter',
    category: 'programming',
    title: 'Token 计数器',
    description: '统计文本的 Token 数量，支持中英文混合估算，适用于 GPT、Claude、Gemini 等主流模型。',
    formula: '中文 Token ≈ 字数 × 1.5；英文 Token ≈ 词数 × 1.3',
    inputs: [
      { label: '输入文本', type: 'text', value: '请输入要统计的文本' },
      { label: '主要语言', type: 'select', options: ['中文', '英文', '中英混合', '代码'] },
    ],
    result: 'Token 数量',
    examples: [
      { label: '1000 字中文', inputs: { text: '示例文本', lang: '中文' }, output: '约 1500 tokens' },
      { label: '1000 词英文', inputs: { text: 'sample text', lang: '英文' }, output: '约 1300 tokens' },
    ],
    faq: [
      { question: '为什么需要统计 Token？', answer: 'Token 直接影响 API 费用、上下文窗口限制和模型响应速度，是 AI 应用开发的基础指标。' },
    ],
    relatedCalculators: ['ai-token-cost', 'json-formatter', 'base64-encoder'],
  },
  {
    slug: 'json-formatter',
    category: 'programming',
    title: 'JSON 格式化与校验',
    description: '在线格式化、校验、压缩 JSON 数据，支持语法高亮和错误定位。',
    formula: '格式化 = 美化缩进；压缩 = 删除空白字符',
    inputs: [
      { label: 'JSON 输入', type: 'text', value: '{"name":"test","value":123}' },
      { label: '操作', type: 'select', options: ['格式化', '压缩', '转义', '反转义'] },
    ],
    result: '处理结果',
    examples: [
      { label: '格式化示例', inputs: { json: '{"a":1,"b":2}', op: '格式化' }, output: '{\n  "a": 1,\n  "b": 2\n}' },
      { label: '压缩示例', inputs: { json: '{ "a": 1, "b": 2 }', op: '压缩' }, output: '{"a":1,"b":2}' },
    ],
    faq: [
      { question: 'JSON 校验失败怎么办？', answer: '检查逗号、引号、括号是否匹配；工具会标注错误位置。' },
    ],
    relatedCalculators: ['base64-encoder', 'regex-tester', 'url-encoder'],
  },
  {
    slug: 'base64-encoder',
    category: 'programming',
    title: 'Base64 编码解码器',
    description: '在线进行 Base64 编码与解码，支持中英文、URL Safe 模式。',
    formula: 'Base64 = 将字节流编码为 64 个可打印字符',
    inputs: [
      { label: '输入文本', type: 'text', value: 'Hello World' },
      { label: '操作', type: 'select', options: ['编码', '解码'] },
      { label: 'URL Safe 模式', type: 'toggle' },
    ],
    result: '输出结果',
    examples: [
      { label: '编码', inputs: { text: 'Hello', op: '编码' }, output: 'SGVsbG8=' },
      { label: '解码', inputs: { text: '5L2g5aW9', op: '解码' }, output: '中文' },
    ],
    faq: [
      { question: 'Base64 是加密吗？', answer: '不是。Base64 只是编码方式，任何人都能解码，不应用于敏感信息。' },
    ],
    relatedCalculators: ['json-formatter', 'url-encoder', 'hash-generator'],
  },
  {
    slug: 'regex-tester',
    category: 'programming',
    title: '正则表达式测试器',
    description: '在线测试正则表达式，实时显示匹配结果，支持捕获组和多行模式。',
    formula: '正则 = 模式 + 修饰符（i/g/m/s）',
    inputs: [
      { label: '正则表达式', type: 'text', value: '\\d+' },
      { label: '测试文本', type: 'text', value: 'abc 123 def 456' },
      { label: '修饰符', type: 'select', options: ['无', 'g (全局)', 'i (忽略大小写)', 'gi (全局+忽略大小写)'] },
    ],
    result: '匹配结果',
    examples: [
      { label: '匹配数字', inputs: { pattern: '\\d+', text: 'a1b22c333', flags: 'g' }, output: '["1", "22", "333"]' },
      { label: '邮箱校验', inputs: { pattern: '[\\w.-]+@[\\w.-]+', text: 'test@example.com', flags: 'g' }, output: '["test@example.com"]' },
    ],
    faq: [
      { question: '贪婪匹配和懒惰匹配的区别？', answer: '默认贪婪（.*）会匹配最长；懒惰（.*?）匹配最短。在量词后加 ? 即可。' },
    ],
    relatedCalculators: ['json-formatter', 'url-encoder'],
  },
  {
    slug: 'url-encoder',
    category: 'programming',
    title: 'URL 编码解码器',
    description: '在线进行 URL 编码（encodeURIComponent）与解码，支持查询字符串解析。',
    formula: 'URL Encode = 将不安全字符转为 %XX 形式',
    inputs: [
      { label: '输入文本', type: 'text', value: 'https://example.com/?q=中文' },
      { label: '操作', type: 'select', options: ['编码', '解码'] },
    ],
    result: '输出结果',
    examples: [
      { label: '编码', inputs: { text: 'hello world', op: '编码' }, output: 'hello%20world' },
      { label: '解码', inputs: { text: '%E4%B8%AD%E6%96%87', op: '解码' }, output: '中文' },
    ],
    faq: [
      { question: '什么时候需要 URL 编码？', answer: 'URL 中包含中文、空格、&、= 等特殊字符时必须编码，否则会导致解析错误。' },
    ],
    relatedCalculators: ['json-formatter', 'base64-encoder'],
  },

  // ============================================================
  // 分类 3: 数学计算 (5)
  // ============================================================
  {
    slug: 'percentage-calculator',
    category: 'math',
    title: '百分比计算器',
    description: '在线计算百分比、增长率、折扣率，支持多种百分比运算场景。',
    formula: '百分比 = (部分 / 整体) × 100%',
    inputs: [
      { label: '计算类型', type: 'select', options: ['求百分比', '求部分', '求整体', '求增减'] },
      { label: '数值 1', type: 'number', value: 25 },
      { label: '数值 2', type: 'number', value: 200 },
    ],
    result: '计算结果',
    examples: [
      { label: '求百分比', inputs: { type: '求百分比', a: 25, b: 200 }, output: '12.5%' },
      { label: '求部分', inputs: { type: '求部分', a: 15, b: 200 }, output: '30' },
    ],
    faq: [
      { question: '百分比和百分点有什么区别？', answer: '百分点是绝对差（如 5%→7% 增 2 个百分点），百分比是相对变化（增长 40%）。' },
    ],
    relatedCalculators: ['discount-calculator', 'compound-interest'],
  },
  {
    slug: 'discount-calculator',
    category: 'math',
    title: '折扣计算器',
    description: '计算商品打折后的最终价格，支持叠加优惠券、满减等多重优惠。',
    formula: '折后价 = 原价 × 折扣率',
    inputs: [
      { label: '原价', type: 'number', value: 299 },
      { label: '折扣（如 8.5 折）', type: 'number', value: 8.5 },
      { label: '额外满减', type: 'number', value: 20 },
    ],
    result: '最终价格',
    examples: [
      { label: '简单折扣', inputs: { price: 100, discount: 8, extra: 0 }, output: '¥80' },
      { label: '叠加满减', inputs: { price: 299, discount: 8.5, extra: 20 }, output: '¥234.15' },
    ],
    faq: [
      { question: '满减和折扣能叠加吗？', answer: '大部分电商支持，但要在折扣后金额上满减。例如 8.5 折后再满 200-20。' },
    ],
    relatedCalculators: ['percentage-calculator', 'compound-interest'],
  },
  {
    slug: 'compound-interest',
    category: 'math',
    title: '复利计算器',
    description: '计算投资复利收益，支持月供、年化收益率、不同计息周期。',
    formula: '本息和 = 本金 × (1 + 年利率/计息次数)^(计息次数×年数)',
    inputs: [
      { label: '本金', type: 'number', value: 10000 },
      { label: '年利率 (%)', type: 'number', value: 5 },
      { label: '年限', type: 'number', value: 10 },
      { label: '计息频率', type: 'select', options: ['年', '月', '日'] },
      { label: '每月追加', type: 'number', value: 0 },
    ],
    result: '本息和',
    examples: [
      { label: '10 年复利', inputs: { principal: 10000, rate: 5, years: 10, freq: '年', monthly: 0 }, output: '¥16,288.95' },
      { label: '定投复利', inputs: { principal: 10000, rate: 8, years: 20, freq: '月', monthly: 1000 }, output: '¥611,529' },
    ],
    faq: [
      { question: '复利和单利的区别？', answer: '单利只对本金计息，复利会将每期利息加入下期本金。长期投资复利收益远高于单利。' },
    ],
    relatedCalculators: ['loan-calculator', 'percentage-calculator'],
  },
  {
    slug: 'unit-converter',
    category: 'math',
    title: '单位转换器',
    description: '长度、重量、温度、面积、体积等单位在线转换，支持公制和英制。',
    formula: '换算 = 原值 × 换算系数',
    inputs: [
      { label: '类别', type: 'select', options: ['长度', '重量', '温度', '面积', '体积'] },
      { label: '源单位', type: 'select', options: ['米', '厘米', '英寸', '英尺', '公里', '英里'] },
      { label: '目标单位', type: 'select', options: ['米', '厘米', '英寸', '英尺', '公里', '英里'] },
      { label: '数值', type: 'number', value: 100 },
    ],
    result: '转换结果',
    examples: [
      { label: '公里转英里', inputs: { cat: '长度', from: '公里', to: '英里', value: 100 }, output: '62.14 英里' },
      { label: '华氏转摄氏', inputs: { cat: '温度', from: '华氏', to: '摄氏', value: 100 }, output: '37.78°C' },
    ],
    faq: [
      { question: '公制和英制怎么换算？', answer: '1 公里 = 0.6214 英里；1 公斤 = 2.205 磅。温度公式较复杂：°C = (°F - 32) × 5/9。' },
    ],
    relatedCalculators: ['currency-converter', 'percentage-calculator'],
  },
  {
    slug: 'bmi-calculator',
    category: 'math',
    title: 'BMI 身体质量指数计算器',
    description: '计算身体质量指数（BMI），评估体重是否在健康范围内，支持公制和英制。',
    formula: 'BMI = 体重(kg) / 身高(m)²',
    inputs: [
      { label: '体重 (kg)', type: 'number', value: 65 },
      { label: '身高 (cm)', type: 'number', value: 170 },
    ],
    result: 'BMI 指数',
    examples: [
      { label: '正常 BMI', inputs: { weight: 65, height: 170 }, output: '22.5 (正常)' },
      { label: '超重 BMI', inputs: { weight: 80, height: 170 }, output: '27.7 (超重)' },
    ],
    faq: [
      { question: 'BMI 准确吗？', answer: 'BMI 是群体统计工具，对个体可能不准确（如肌肉量大的人会被判为超重）。需结合体脂率综合判断。' },
    ],
    relatedCalculators: ['unit-converter', 'calorie-calculator'],
  },

  // ============================================================
  // 分类 4: 金融财务 (5)
  // ============================================================
  {
    slug: 'loan-calculator',
    category: 'finance',
    title: '贷款计算器',
    description: '计算等额本息/等额本金月供、总利息，支持房贷、车贷、消费贷。',
    formula: '月供 = 本金 × 月利率 × (1+r)^n / ((1+r)^n - 1)',
    inputs: [
      { label: '贷款金额', type: 'number', value: 500000 },
      { label: '年利率 (%)', type: 'number', value: 4.2 },
      { label: '贷款年限', type: 'number', value: 30 },
      { label: '还款方式', type: 'select', options: ['等额本息', '等额本金'] },
    ],
    result: '每月还款',
    examples: [
      { label: '房贷 30 年', inputs: { amount: 1000000, rate: 4.2, years: 30, type: '等额本息' }, output: '¥4,888/月' },
      { label: '车贷 3 年', inputs: { amount: 200000, rate: 5.5, years: 3, type: '等额本息' }, output: '¥6,021/月' },
    ],
    faq: [
      { question: '等额本息 vs 等额本金？', answer: '等额本息每月还款额相同；等额本金每月本金相同，利息递减，前期压力大但总利息少。' },
    ],
    relatedCalculators: ['compound-interest', 'mortgage-calculator'],
  },
  {
    slug: 'mortgage-calculator',
    category: 'finance',
    title: '房贷计算器',
    description: '计算房贷月供、总利息、首付比例，支持商业贷款和公积金贷款组合。',
    formula: '月供 = 贷款本金 × 月利率 × (1+r)^n / ((1+r)^n - 1)',
    inputs: [
      { label: '房屋总价', type: 'number', value: 3000000 },
      { label: '首付比例 (%)', type: 'number', value: 30 },
      { label: '商业贷款利率 (%)', type: 'number', value: 4.2 },
      { label: '公积金利率 (%)', type: 'number', value: 3.1 },
      { label: '贷款年限', type: 'number', value: 30 },
    ],
    result: '月供总额',
    examples: [
      { label: '首套房贷', inputs: { price: 3000000, down: 30, commercial: 4.2, fund: 3.1, years: 30 }, output: '约 ¥11,500/月' },
    ],
    faq: [
      { question: 'LPR 是什么？', answer: '贷款市场报价利率，由央行公布，是房贷利率的基准。2025 年 5 年期 LPR 约为 3.5%。' },
    ],
    relatedCalculators: ['loan-calculator', 'compound-interest'],
  },
  {
    slug: 'currency-converter',
    category: 'finance',
    title: '汇率转换器',
    description: '人民币、美元、欧元、日元等主流货币实时汇率转换。',
    formula: '换算 = 金额 × 汇率',
    inputs: [
      { label: '源货币', type: 'select', options: ['CNY', 'USD', 'EUR', 'JPY', 'GBP', 'HKD'] },
      { label: '目标货币', type: 'select', options: ['CNY', 'USD', 'EUR', 'JPY', 'GBP', 'HKD'] },
      { label: '金额', type: 'number', value: 100 },
    ],
    result: '转换后金额',
    examples: [
      { label: '美元换人民币', inputs: { from: 'USD', to: 'CNY', amount: 100 }, output: '约 ¥720' },
      { label: '人民币换日元', inputs: { from: 'CNY', to: 'JPY', amount: 1000 }, output: '约 ¥20,400' },
    ],
    faq: [
      { question: '汇率是实时的吗？', answer: '工具显示的是参考汇率，实际交易需以银行汇率为准，通常会有 0.5-2% 的点差。' },
    ],
    relatedCalculators: ['unit-converter', 'compound-interest'],
  },
  {
    slug: 'salary-calculator',
    category: 'finance',
    title: '税后工资计算器',
    description: '根据税前工资计算五险一金、个人所得税和税后到手工资。',
    formula: '税后工资 = 税前 - 五险一金 - 个人所得税',
    inputs: [
      { label: '税前月薪', type: 'number', value: 20000 },
      { label: '城市', type: 'select', options: ['北京', '上海', '深圳', '杭州', '成都'] },
      { label: '社保基数', type: 'number', value: 20000 },
      { label: '公积金比例 (%)', type: 'number', value: 12 },
    ],
    result: '税后到手',
    examples: [
      { label: '一线城市 2 万', inputs: { salary: 20000, city: '北京', base: 20000, fund: 12 }, output: '约 ¥14,500' },
      { label: '新一线 1.5 万', inputs: { salary: 15000, city: '杭州', base: 15000, fund: 12 }, output: '约 ¥11,200' },
    ],
    faq: [
      { question: '年终奖怎么算税？', answer: '2027 年前，年终奖可单独计税（单独算法 vs 综合算法可能差几千）。建议两种都算比较。' },
    ],
    relatedCalculators: ['currency-converter', 'compound-interest'],
  },
  {
    slug: 'roi-calculator',
    category: 'finance',
    title: '投资回报率（ROI）计算器',
    description: '计算投资项目的年化回报率、回收期，支持多次投入和收益。',
    formula: 'ROI = (收益 - 成本) / 成本 × 100%',
    inputs: [
      { label: '初始投资', type: 'number', value: 100000 },
      { label: '最终价值', type: 'number', value: 150000 },
      { label: '持有年限', type: 'number', value: 3 },
    ],
    result: '年化回报率',
    examples: [
      { label: '股票 3 年', inputs: { initial: 100000, final: 150000, years: 3 }, output: '年化 14.5%' },
      { label: '房产 5 年', inputs: { initial: 1000000, final: 1300000, years: 5 }, output: '年化 5.4%' },
    ],
    faq: [
      { question: 'ROI 和 IRR 有什么区别？', answer: 'ROI 是总回报率，IRR 是考虑资金时间价值的内部收益率，多次投入时建议用 IRR。' },
    ],
    relatedCalculators: ['compound-interest', 'loan-calculator'],
  },

  // ============================================================
  // 分类 5: 健康生活 (5)
  // ============================================================
  {
    slug: 'calorie-calculator',
    category: 'health',
    title: '每日卡路里需求计算器',
    description: '基于 Mifflin-St Jeor 公式计算基础代谢率（BMR）和每日总能量消耗（TDEE）。',
    formula: 'BMR = 10×体重 + 6.25×身高 - 5×年龄 + 性别系数',
    inputs: [
      { label: '性别', type: 'select', options: ['男', '女'] },
      { label: '年龄', type: 'number', value: 30 },
      { label: '身高 (cm)', type: 'number', value: 170 },
      { label: '体重 (kg)', type: 'number', value: 65 },
      { label: '活动水平', type: 'select', options: ['久坐', '轻度', '中度', '高度', '极重'] },
    ],
    result: '每日卡路里',
    examples: [
      { label: '久坐女性', inputs: { gender: '女', age: 30, height: 165, weight: 55, activity: '久坐' }, output: '约 1,580 kcal' },
      { label: '运动男性', inputs: { gender: '男', age: 28, height: 178, weight: 75, activity: '中度' }, output: '约 2,800 kcal' },
    ],
    faq: [
      { question: '减肥每天要少吃多少？', answer: '建议每天减少 300-500 kcal，既能稳步减重，又不会影响基础代谢。' },
    ],
    relatedCalculators: ['bmi-calculator', 'macro-calculator'],
  },
  {
    slug: 'macro-calculator',
    category: 'health',
    title: '宏量营养素计算器',
    description: '根据热量目标和饮食偏好，计算每日蛋白质、碳水、脂肪摄入量。',
    formula: '蛋白质 = 体重 × g/kg；碳水 = (剩余热量) / 4；脂肪 = (剩余热量) / 9',
    inputs: [
      { label: '每日总热量', type: 'number', value: 2000 },
      { label: '目标', type: 'select', options: ['减脂', '增肌', '维持'] },
      { label: '蛋白质 g/kg', type: 'number', value: 1.6 },
    ],
    result: '三大营养素',
    examples: [
      { label: '减脂', inputs: { calories: 1800, goal: '减脂', protein: 2 }, output: 'P 140g / C 130g / F 70g' },
      { label: '增肌', inputs: { calories: 2800, goal: '增肌', protein: 2 }, output: 'P 160g / C 320g / F 90g' },
    ],
    faq: [
      { question: '蛋白质吃太多伤肾吗？', answer: '健康人群 1.6-2.2 g/kg 体重安全。已有肾病者需遵医嘱。' },
    ],
    relatedCalculators: ['calorie-calculator', 'bmi-calculator'],
  },
  {
    slug: 'pregnancy-calculator',
    category: 'health',
    title: '预产期计算器',
    description: '根据末次月经日期计算预产期和当前孕周。',
    formula: '预产期 = 末次月经 + 280 天',
    inputs: [
      { label: '末次月经日期', type: 'text', value: '2026-01-01' },
      { label: '周期天数', type: 'number', value: 28 },
    ],
    result: '预产期',
    examples: [
      { label: '标准周期', inputs: { lastPeriod: '2026-01-01', cycle: 28 }, output: '2026-10-08' },
    ],
    faq: [
      { question: '预产期准吗？', answer: '仅 5% 宝宝在预产期当天出生，大多数在预产期前后 2 周内分娩。' },
    ],
    relatedCalculators: ['date-calculator', 'bmi-calculator'],
  },
  {
    slug: 'date-calculator',
    category: 'health',
    title: '日期差计算器',
    description: '计算两个日期之间的天数差，支持工作日计算和节假日排除。',
    formula: '天数差 = 结束日期 - 开始日期',
    inputs: [
      { label: '开始日期', type: 'text', value: '2026-01-01' },
      { label: '结束日期', type: 'text', value: '2026-12-31' },
      { label: '排除周末', type: 'toggle' },
    ],
    result: '天数差',
    examples: [
      { label: '完整年度', inputs: { start: '2026-01-01', end: '2026-12-31', weekend: false }, output: '365 天' },
      { label: '项目周期', inputs: { start: '2026-09-01', end: '2026-12-31', weekend: true }, output: '约 88 工作日' },
    ],
    faq: [
      { question: '工作日计算包含节假日吗？', answer: '默认不包含中国法定节假日。如需精确，建议用专业考勤系统。' },
    ],
    relatedCalculators: ['age-calculator', 'pregnancy-calculator'],
  },
  {
    slug: 'age-calculator',
    category: 'health',
    title: '年龄计算器',
    description: '根据出生日期计算精确年龄（年/月/日），支持星座、生肖查询。',
    formula: '年龄 = 当前日期 - 出生日期',
    inputs: [
      { label: '出生日期', type: 'text', value: '1990-05-15' },
      { label: '计算日期', type: 'text', value: '2026-09-04' },
    ],
    result: '精确年龄',
    examples: [
      { label: '30+ 人士', inputs: { birth: '1990-05-15', current: '2026-09-04' }, output: '36 岁 3 月 20 天' },
    ],
    faq: [
      { question: '周岁和虚岁的区别？', answer: '周岁从 0 开始，按生日增长；虚岁出生即 1 岁，每过年加 1。中国法律采用周岁。' },
    ],
    relatedCalculators: ['date-calculator', 'bmi-calculator'],
  },

  // ============================================================
  // 分类 6: 文本工具 (5)
  // ============================================================
  {
    slug: 'word-counter',
    category: 'text',
    title: '字数统计器',
    description: '在线统计文本字数（中英文）、字符数、行数、段落数，支持多种格式统计。',
    formula: '字数 = 中文字 + 英文单词数',
    inputs: [
      { label: '输入文本', type: 'text', value: '请输入文本' },
      { label: '统计方式', type: 'select', options: ['含空格', '不含空格', '仅中文', '仅英文'] },
    ],
    result: '统计结果',
    examples: [
      { label: '1000 字作文', inputs: { text: '示例', mode: '含空格' }, output: '1000 字 / 5800 字符' },
    ],
    faq: [
      { question: '为什么中文字数计算不同？', answer: 'Word 按字符计算，1 个中文 = 1 字符；中文写作常按字数（含标点）算；不同工具规则不同。' },
    ],
    relatedCalculators: ['reading-time', 'char-counter'],
  },
  {
    slug: 'reading-time',
    category: 'text',
    title: '阅读时间计算器',
    description: '根据文本字数估算阅读时间，支持中英文不同阅读速度。',
    formula: '阅读时间 = 字数 / 阅读速度',
    inputs: [
      { label: '字数', type: 'number', value: 2000 },
      { label: '语言', type: 'select', options: ['中文', '英文'] },
      { label: '阅读速度', type: 'select', options: ['慢速 (200字/分)', '正常 (300字/分)', '快速 (500字/分)'] },
    ],
    result: '阅读时间',
    examples: [
      { label: '中文长文', inputs: { words: 3000, lang: '中文', speed: '正常 (300字/分)' }, output: '10 分钟' },
      { label: '英文文章', inputs: { words: 1000, lang: '英文', speed: '正常 (250词/分)' }, output: '4 分钟' },
    ],
    faq: [
      { question: '阅读速度多少算快？', answer: '中文 300 字/分钟为平均水平，技术内容约 200 字/分钟，熟练读者可达 500+。' },
    ],
    relatedCalculators: ['word-counter', 'char-counter'],
  },
  {
    slug: 'char-counter',
    category: 'text',
    title: '字符计数器',
    description: '统计文本的字符数（含/不含空格），支持中英文字符分类统计。',
    formula: '总字符 = 含空格字符 + 数字 + 标点',
    inputs: [
      { label: '输入文本', type: 'text', value: '示例文本' },
      { label: '是否含空格', type: 'toggle' },
    ],
    result: '字符数',
    examples: [
      { label: '微博字数', inputs: { text: '示例', space: true }, output: '字符数 4' },
    ],
    faq: [
      { question: '微博 140 字限制按什么算？', answer: '按字符数（含中英文标点），每个汉字算 1 字符。' },
    ],
    relatedCalculators: ['word-counter', 'reading-time'],
  },
  {
    slug: 'case-converter',
    category: 'text',
    title: '大小写转换器',
    description: '在线转换文本大小写，支持全大写、全小写、驼峰、蛇形命名等多种格式。',
    formula: '驼峰 = 首词小写 + 后续词首字母大写',
    inputs: [
      { label: '输入文本', type: 'text', value: 'hello world' },
      { label: '转换类型', type: 'select', options: ['全大写', '全小写', '首字母大写', '驼峰', '帕斯卡', '蛇形', '烤串'] },
    ],
    result: '转换结果',
    examples: [
      { label: '转驼峰', inputs: { text: 'hello world example', type: '驼峰' }, output: 'helloWorldExample' },
      { label: '转蛇形', inputs: { text: 'HelloWorldExample', type: '蛇形' }, output: 'hello_world_example' },
    ],
    faq: [
      { question: '什么时候用哪种命名？', answer: 'JS 变量用驼峰；Python 用蛇形；React 组件用帕斯卡；数据库字段用蛇形。' },
    ],
    relatedCalculators: ['json-formatter', 'base64-encoder'],
  },
  {
    slug: 'markdown-preview',
    category: 'text',
    title: 'Markdown 预览编辑器',
    description: '在线编辑 Markdown 文本，实时预览渲染效果，支持导出 HTML。',
    formula: 'Markdown = 轻量级标记语言',
    inputs: [
      { label: 'Markdown 内容', type: 'text', value: '# 标题\n**粗体** 文本' },
    ],
    result: '预览效果',
    examples: [
      { label: '基础语法', inputs: { md: '# 标题\n- 列表项\n- 列表项' }, output: '渲染 HTML' },
    ],
    faq: [
      { question: 'Markdown 和 HTML 怎么选？', answer: 'Markdown 适合写作（博客、README、笔记），HTML 适合网页布局。' },
    ],
    relatedCalculators: ['word-counter', 'json-formatter'],
  },
];

export function getCalculatorBySlug(slug: string): Calculator | null {
  return CALCULATORS.find((c) => c.slug === slug) || null;
}

export function getCalculatorsByCategory(category: string): Calculator[] {
  return CALCULATORS.filter((c) => c.category === category);
}

export function getAllCalculatorSlugs(): string[] {
  return CALCULATORS.map((c) => c.slug);
}

export function getRelatedCalculators(slug: string, limit = 3): Calculator[] {
  const calc = getCalculatorBySlug(slug);
  if (!calc) return [];
  if (calc.relatedCalculators && calc.relatedCalculators.length > 0) {
    return calc.relatedCalculators
      .map((s) => getCalculatorBySlug(s))
      .filter((c): c is Calculator => c !== null)
      .slice(0, limit);
  }
  return CALCULATORS.filter((c) => c.category === calc.category && c.slug !== slug).slice(0, limit);
}
