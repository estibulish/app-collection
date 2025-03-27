/**
 * @typedef {Object} Tool
 * @property {string} id - 工具唯一标识
 * @property {string} name - 工具名称
 * @property {string} path - 工具路由路径
 * @property {string} icon - 工具图标
 * @property {string} description - 工具描述
 * @property {string[]} categories - 工具分类
 * @property {string[]} tags - 工具标签
 * @property {boolean} isHot - 是否热门
 * @property {boolean} isNew - 是否新功能
 * @property {string} updateTime - 最后更新时间
 */

/**
 * 工具分类
 */
export const categories = [
  {
    id: 'format',
    name: '格式化工具',
    icon: '📝',
    description: '各类数据格式化美化工具'
  },
  {
    id: 'encode',
    name: '编解码转换',
    icon: '🔄',
    description: '编码解码和格式转换工具'
  },
  {
    id: 'time',
    name: '时间日期',
    icon: '⏰',
    description: '时间日期相关处理工具'
  },
  {
    id: 'image',
    name: '图片处理',
    icon: '🖼',
    description: '图片处理和转换工具'
  },
  {
    id: 'pdf',
    name: 'PDF工具',
    icon: '📄',
    description: 'PDF处理和转换工具'
  },
  {
    id: 'dev',
    name: '开发工具',
    icon: '💻',
    description: '开发辅助工具集合'
  },
  {
    id: 'text',
    name: '文本处理',
    icon: '📝',
    description: '文本处理和转换工具'
  },
  {
    id: 'calc',
    name: '计算工具',
    icon: '🔢',
    description: '各类计算和换算工具'
  },
  {
    id: 'media',
    name: '媒体工具',
    icon: '🎨',
    description: '图片、音视频等媒体处理工具'
  },
  {
    id: 'convert',
    name: '单位换算',
    icon: '��',
    description: '在线单位换算工具'
  },
  {
    id: 'data',
    name: '数据处理',
    icon: '📊',
    description: '数据处理和分析工具'
  },
  {
    id: 'number',
    name: '数字工具',
    icon: '🔢',
    description: '数字处理和转换工具'
  },
  {
    id: 'office',
    name: '办公工具',
    icon: '📁',
    description: '办公辅助工具集合'
  },
  {
    id: 'ppt-to-pdf',
    name: 'PPT 转 PDF',
    icon: '📊',
    route: '/tools/office/ppt-to-pdf',
    description: '将 PowerPoint 演示文稿转换为 PDF 格式'
  },
  {
    id: 'pdf-merge',
    name: 'PDF 合并',
    icon: '📑',
    route: '/tools/office/pdf-merge',
    description: '合并多个 PDF 文件为一个文件'
  },
  {
    id: 'pdf-split',
    name: 'PDF 拆分',
    icon: '✂️',
    route: '/tools/office/pdf-split',
    description: '将 PDF 文件拆分为多个文件'
  },
  {
    id: 'entertainment',
    name: '娱乐工具',
    icon: '🎮',
    description: '各类娱乐和休闲工具'
  }
]

/**
 * 工具列表
 * @type {Tool[]}
 */
export const tools = [
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    icon: '{ }',
    description: '在线 JSON 格式化、压缩、校验工具，支持语法高亮和错误提示',
    path: '/tools/data/json-formatter',
    categories: ['data'],
    tags: ['JSON', '格式化', '压缩', '校验'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'base64',
    name: 'Base64编解码',
    path: '/tools/base64',
    icon: '🔄',
    description: '文本内容、图片、文件的Base64编码和解码',
    categories: ['encode', 'dev'],
    tags: ['Base64', '编码', '解码', '图片转换'],
    isHot: true,
    isNew: false,
    updateTime: '2024-03-15'
  },
  {
    id: 'timestamp',
    name: '时间戳转换',
    path: '/tools/timestamp',
    icon: '⏰',
    description: '时间戳与日期格式在线转换工具',
    categories: ['time', 'dev'],
    tags: ['时间戳', '日期', '转换', 'Unix时间戳'],
    isHot: true,
    isNew: false,
    updateTime: '2024-03-15'
  },
  {
    id: 'image-compress',
    name: '图片压缩',
    path: '/tools/image-compress',
    icon: '📦',
    description: '在线图片压缩工具，支持批量压缩、自定义压缩质量，快速减小图片体积',
    categories: ['image'],
    tags: ['图片', '压缩', '优化', 'JPG', 'PNG'],
    isHot: true,
    isNew: false,
    updateTime: '2024-03-15'
  },
  {
    id: 'pdf-convert',
    name: 'PDF转换',
    path: '/tools/pdf-convert',
    icon: '📄',
    description: 'PDF格式在线转换工具',
    categories: ['pdf'],
    tags: ['PDF', '转换', '文档', 'Word', 'Excel'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-15'
  },
  {
    id: 'qr-code',
    name: '二维码生成',
    path: '/tools/qr-code',
    icon: '📱',
    description: '在线二维码生成与解析工具',
    categories: ['encode'],
    tags: ['二维码', 'QR Code', '扫码'],
    isHot: true,
    isNew: false,
    updateTime: '2024-03-15'
  },
  {
    id: 'url-encode',
    name: 'URL编解码',
    path: '/tools/url-encode',
    icon: '🔗',
    description: 'URL编码/解码转换工具',
    categories: ['encode', 'dev'],
    tags: ['URL', '编码', '解码', 'URI'],
    isHot: false,
    isNew: false,
    updateTime: '2024-03-15'
  },
  {
    id: 'html-escape',
    name: 'HTML转义',
    path: '/tools/html-escape',
    icon: '📋',
    description: 'HTML特殊字符转义工具',
    categories: ['encode', 'dev'],
    tags: ['HTML', '转义', '特殊字符'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-15'
  },
  {
    id: 'markdown',
    name: 'Markdown编辑器',
    path: '/tools/markdown',
    icon: '��',
    description: '在线Markdown编辑预览工具',
    categories: ['format', 'text'],
    tags: ['Markdown', '编辑器', '预览'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-15'
  },
  {
    id: 'regex-test',
    name: '正则测试',
    path: '/tools/regex-test',
    icon: '🔍',
    description: '正则表达式在线测试工具',
    categories: ['dev', 'text'],
    tags: ['正则', '测试', '匹配'],
    isHot: true,
    isNew: false,
    updateTime: '2024-03-15'
  },
  {
    id: 'image-editor',
    name: '图片编辑器',
    icon: '🖼️',
    description: '在线图片编辑工具，支持裁剪、滤镜、文字、贴纸等多种编辑功能',
    path: '/tools/image-editor',
    categories: ['media', 'image'],
    tags: ['图片编辑', '裁剪', '旋转', '调整大小'],
    isHot: true,
    isNew: true,
    updateTime: '2024-03-20'
  },
  {
    id: 'image-convert',
    name: '图片格式转换',
    icon: '🔄',
    description: '在线图片格式转换工具，支持 JPG、PNG、WEBP、GIF 等格式互转',
    path: '/tools/image-convert',
    categories: ['image', 'media'],
    tags: ['图片转换', '格式转换', 'JPG', 'PNG', 'WEBP'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-20'
  },
  {
    id: 'image-watermark',
    name: '图片水印',
    icon: '💧',
    description: '在线图片水印工具，支持文字水印、图片水印，可调整位置、透明度等',
    path: '/tools/image-watermark',
    categories: ['image', 'media'],
    tags: ['图片水印', '水印', '版权保护'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-20'
  },
  {
    id: 'image-merge',
    name: '图片拼接',
    icon: '��',
    description: '在线图片拼接工具，支持横向、纵向拼接，可调整间距和背景',
    path: '/tools/image-merge',
    categories: ['image', 'media'],
    tags: ['图片拼接', '图片合并', '拼图'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-20'
  },
  {
    id: 'image-background',
    name: '图片背景移除',
    icon: '✂️',
    description: '在线图片背景移除工具，智能识别前景，一键移除背景',
    path: '/tools/image-background',
    categories: ['image', 'media'],
    tags: ['背景移除', '抠图', 'AI抠图'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-20'
  },
  {
    id: 'css-effects',
    name: 'CSS 效果合集',
    description: '常用 CSS 效果展示和代码片段',
    icon: '🎨',
    path: '/tools/css-effects',
    categories: ['dev', 'frontend'],
    tags: ['CSS', '动画', '特效', '样式'],
    isHot: true,
    isNew: true,
    updateTime: '2024-03-20'
  },
  {
    id: 'hash-generator',
    name: '哈希生成器',
    icon: '🔐',
    description: '在线哈希生成工具，支持 MD5、SHA-1、SHA-256、SHA-512 等多种哈希算法',
    path: '/tools/hash-generator',
    categories: ['encode', 'dev'],
    tags: ['哈希', 'MD5', 'SHA', '加密'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'aes-encrypt',
    name: 'AES 加解密',
    icon: '🔒',
    description: '在线 AES 加密解密工具，支持多种加密模式和填充方式',
    path: '/tools/aes-encrypt',
    categories: ['encode', 'dev'],
    tags: ['AES', '加密', '解密', '对称加密'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'rsa-encrypt',
    name: 'RSA 加解密',
    icon: '🔑',
    description: '在线 RSA 加密解密工具，支持密钥生成、加密解密和签名验证',
    path: '/tools/rsa-encrypt',
    categories: ['encode', 'dev'],
    tags: ['RSA', '加密', '解密', '非对称加密', '数字签名'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'jwt-decoder',
    name: 'JWT 解析器',
    icon: '��',
    description: '在线 JWT 解析和验证工具，可查看 JWT 的头部、载荷和签名',
    path: '/tools/jwt-decoder',
    categories: ['encode', 'dev'],
    tags: ['JWT', '解析', '验证', 'Token'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'length-converter',
    name: '长度单位换算',
    icon: '📏',
    description: '在线长度单位换算工具，支持米、厘米、英寸、英尺等单位互转',
    path: '/tools/length-converter',
    categories: ['convert'],
    tags: ['长度', '单位换算', '米', '厘米', '英寸'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'area-converter',
    name: '面积单位换算',
    icon: '⬜',
    description: '在线面积单位换算工具，支持平方米、平方厘米、亩、公顷等单位互转',
    path: '/tools/area-converter',
    categories: ['convert'],
    tags: ['面积', '单位换算', '平方米', '亩', '公顷'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'weight-converter',
    name: '重量单位换算',
    icon: '⚖️',
    description: '在线重量单位换算工具，支持千克、克、磅、盎司等单位互转',
    path: '/tools/weight-converter',
    categories: ['convert'],
    tags: ['重量', '单位换算', '千克', '克', '磅'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'temperature-converter',
    name: '温度单位换算',
    icon: '🌡️',
    description: '在线温度单位换算工具，支持摄氏度、华氏度、开尔文等单位互转',
    path: '/tools/temperature-converter',
    categories: ['convert'],
    tags: ['温度', '单位换算', '摄氏度', '华氏度'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'number-base',
    name: '进制转换',
    icon: '🔢',
    description: '在线进制转换工具，支持二进制、八进制、十进制、十六进制等互转',
    path: '/tools/number/base-converter',
    categories: ['number'],
    tags: ['进制', '转换', '二进制', '十六进制'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'calculator',
    name: '科学计算器',
    icon: '��',
    description: '在线科学计算器，支持基础运算、三角函数、对数等高级计算功能',
    path: '/tools/number/calculator',
    categories: ['number'],
    tags: ['计算器', '科学', '数学'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'random-number',
    name: '随机数生成器',
    icon: '🎲',
    description: '在线随机数生成工具，支持整数、小数、范围、数量等多种生成方式',
    path: '/tools/number/random',
    categories: ['number'],
    tags: ['随机数', '生成器'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'unit-price',
    name: '单价计算器',
    icon: '💰',
    description: '在线单价计算工具，帮助您比较不同规格商品的性价比',
    path: '/tools/number/unit-price',
    categories: ['number'],
    tags: ['单价', '计算器', '比价'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'percent-calculator',
    name: '百分比计算器',
    icon: '💯',
    description: '在线百分比计算工具，支持多种百分比计算场景',
    path: '/tools/number/percent',
    categories: ['number'],
    tags: ['百分比', '计算器', '增长率'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'loan-calculator',
    name: '贷款计算器',
    icon: '💰',
    description: '在线贷款计算工具，支持等额本息和等额本金两种还款方式',
    path: '/tools/number/loan',
    categories: ['number'],
    tags: ['贷款', '计算器', '房贷', '车贷'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'text-diff',
    name: '文本对比工具',
    icon: '📝',
    description: '在线文本对比工具，帮助您快速找出两段文本的差异',
    path: '/tools/text/diff',
    categories: ['text'],
    tags: ['文本', '对比', '差异'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'text-stats',
    name: '文本统计工具',
    icon: '📊',
    description: '在线文本统计工具，帮助您快速统计字数、行数、字符数等信息',
    path: '/tools/text/stats',
    categories: ['text'],
    tags: ['文本', '统计', '字数'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'text-case',
    name: '文本转换工具',
    icon: '🔄',
    description: '在线文本格式转换工具，支持大小写转换、驼峰命名、下划线命名等多种格式',
    path: '/tools/text/case',
    categories: ['text'],
    tags: ['文本', '转换', '大小写', '驼峰'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'text-dedupe',
    name: '文本去重工具',
    icon: '🔍',
    description: '在线文本去重工具，帮助您快速去除重复的行或内容',
    path: '/tools/text/dedupe',
    categories: ['text'],
    tags: ['文本', '去重', '重复'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'text-sort',
    name: '文本排序工具',
    icon: '📊',
    description: '在线文本排序工具，支持按字母、数字、长度等多种方式排序',
    path: '/tools/text/sort',
    categories: ['text'],
    tags: ['文本', '排序', '字母', '数字'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'text-replace',
    name: '文本替换工具',
    icon: '🔄',
    description: '在线文本替换工具，支持普通替换和正则表达式替换',
    path: '/tools/text/replace',
    categories: ['text'],
    tags: ['文本', '替换', '正则'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'text-format',
    name: '文本格式化工具',
    icon: '🎨',
    description: '在线文本格式化工具，支持 JSON、XML、SQL、HTML 等多种格式的美化和压缩',
    path: '/tools/text/format',
    categories: ['text'],
    tags: ['文本', '格式化', 'JSON', 'XML', 'SQL', 'HTML'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'text-to-table',
    name: '文本转表格工具',
    icon: '📊',
    description: '在线文本转表格工具，支持多种分隔符，可导出为 Excel、CSV 等格式',
    path: '/tools/text/to-table',
    categories: ['text', 'office'],
    tags: ['文本', '表格', 'Excel', 'CSV'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'excel-to-json',
    name: 'Excel 转 JSON',
    icon: '��',
    description: '在线 Excel 转 JSON 工具，支持 Excel、CSV 等格式转换为 JSON 数据',
    path: '/tools/office/excel-to-json',
    categories: ['office'],
    tags: ['Excel', 'JSON', '转换', '办公'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'pdf-to-word',
    name: 'PDF 转 Word',
    icon: '📄',
    description: '在线 PDF 转 Word 工具，支持 PDF 文件转换为 Word 文档格式',
    path: '/tools/office/pdf-to-word',
    categories: ['office'],
    tags: ['PDF', 'Word', '转换', '办公'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'word-to-pdf',
    name: 'Word 转 PDF',
    icon: '📄',
    description: '在线 Word 转 PDF 工具，支持 Word 文档转换为 PDF 格式',
    path: '/tools/office/word-to-pdf',
    categories: ['office'],
    tags: ['Word', 'PDF', '转换', '办公'],
    isHot: false,
    isNew: true,
    updateTime: '2024-03-25'
  },
  {
    id: 'random-picker',
    name: '随机选择器',
    icon: '🎲',
    route: '/tools/entertainment/random-picker',
    description: '帮助你做随机选择，解决选择困难症',
    categories: ['entertainment'],
    tags: ['随机', '选择', '抽签'],
    isNew: true
  },
  {
    id: 'dice-roller',
    name: '骰子模拟器',
    icon: '🎲',
    route: '/tools/entertainment/dice-roller',
    description: '模拟各种类型的骰子，支持多面骰和自定义',
    categories: ['entertainment'],
    tags: ['骰子', '随机', '游戏']
  },
  {
    id: 'name-generator',
    name: '随机名字生成',
    icon: '📝',
    route: '/tools/entertainment/name-generator',
    description: '生成随机的中英文名字，适用于各种场景',
    categories: ['entertainment'],
    tags: ['名字', '随机', '生成']
  },
  {
    id: 'color-picker',
    name: '颜色选择器',
    icon: '🎨',
    route: '/tools/entertainment/color-picker',
    description: '高级颜色选择工具，支持多种颜色格式和配色方案',
    categories: ['entertainment', 'design'],
    tags: ['颜色', '设计', '选择器']
  },
  {
    id: 'meme-generator',
    name: '表情包生成器',
    icon: '😂',
    route: '/tools/entertainment/meme-generator',
    description: '在线制作各种流行表情包，添加自定义文字',
    categories: ['entertainment', 'image'],
    tags: ['表情包', '图片', '娱乐'],
    isHot: true
  }
]

/**
 * 获取工具信息
 * @param {string} id - 工具ID
 * @returns {Tool|undefined}
 */
export const getTool = (id) => {
  return tools.find(tool => tool.id === id)
}

/**
 * 获取分类信息
 * @param {string} id - 分类ID
 * @returns {Object|undefined}
 */
export const getCategory = (id) => {
  return categories.find(category => category.id === id)
}

/**
 * 获取分类下的工具
 * @param {string} categoryId - 分类ID
 * @returns {Tool[]}
 */
export const getToolsByCategory = (categoryId) => {
  return tools.filter(tool => tool.categories.includes(categoryId))
}

/**
 * 获取热门工具
 * @returns {Tool[]}
 */
export const getHotTools = () => {
  return tools.filter(tool => tool.isHot)
}

/**
 * 获取最新工具
 * @returns {Tool[]}
 */
export const getNewTools = () => {
  return tools.filter(tool => tool.isNew)
}

/**
 * 搜索工具
 * @param {string} query - 搜索关键词
 * @returns {Tool[]}
 */
export const searchTools = (query) => {
  const lowercaseQuery = query.toLowerCase()
  return tools.filter(tool => 
    tool.name.toLowerCase().includes(lowercaseQuery) ||
    tool.description.toLowerCase().includes(lowercaseQuery) ||
    tool.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
} 