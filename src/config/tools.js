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
  }
]

/**
 * 工具列表
 * @type {Tool[]}
 */
export const tools = [
  {
    id: 'json-formatter',
    name: 'JSON格式化',
    path: '/tools/json-formatter',
    icon: '📝',
    description: 'JSON数据格式化、压缩、转换工具',
    categories: ['format', 'dev'],
    tags: ['JSON', '格式化', '压缩', '校验'],
    isHot: true,
    isNew: false,
    updateTime: '2024-03-15'
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
    icon: '🖼',
    description: '在线图片压缩工具，支持JPG、PNG等格式',
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
    icon: '📝',
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
    name: '图片编辑工具',
    description: '在线图片编辑工具，支持裁剪、旋转、调整大小等基本操作',
    icon: '🖼️',
    path: '/tools/image-editor',
    categories: ['media', 'image'],
    tags: ['图片编辑', '裁剪', '旋转', '调整大小'],
    isHot: true,
    isNew: true,
    updateTime: '2024-03-20'
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