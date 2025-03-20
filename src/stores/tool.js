import { defineStore } from 'pinia'

/**
 * @typedef {Object} Tool
 * @property {string} id - 工具唯一标识
 * @property {string} name - 工具名称
 * @property {string} description - 工具描述
 * @property {string} icon - 工具图标
 * @property {string} path - 工具路由路径
 * @property {string[]} categories - 工具所属分类
 * @property {string[]} tags - 工具标签
 * @property {number} views - 查看次数
 * @property {Date} createdAt - 创建时间
 * @property {Date} updatedAt - 更新时间
 */

export const useToolStore = defineStore('tool', {
  state: () => ({
    tools: [
      {
        id: 'json-formatter',
        name: 'JSON格式化',
        description: '在线JSON格式化工具，支持压缩、美化、校验等功能',
        icon: '📝',
        path: '/tools/json-formatter',
        categories: ['dev', 'format'],
        tags: ['JSON', '格式化', '开发工具'],
        views: 1000,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-03-20')
      },
      {
        id: 'image-compress',
        name: '图片压缩',
        description: '在线图片压缩工具，支持JPG、PNG等格式',
        icon: '🖼️',
        path: '/tools/image-compress',
        categories: ['image'],
        tags: ['图片', '压缩', '图片处理'],
        views: 800,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-03-15')
      },
      {
        id: 'pdf-convert',
        name: 'PDF转换',
        description: 'PDF转Word、Excel、图片等格式',
        icon: '📄',
        path: '/tools/pdf-convert',
        categories: ['convert'],
        tags: ['PDF', '转换', '文档处理'],
        views: 600,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-03-10')
      },
      {
        id: 'timestamp',
        name: '时间戳转换',
        description: '时间戳与日期格式互转工具',
        icon: '⏰',
        path: '/tools/timestamp',
        categories: ['dev', 'convert'],
        tags: ['时间戳', '日期', '开发工具'],
        views: 500,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-03-05')
      },
      {
        id: 'base64',
        name: 'Base64编解码',
        description: '在线Base64编码解码工具',
        icon: '🔄',
        path: '/tools/base64',
        categories: ['dev', 'encrypt'],
        tags: ['Base64', '编码', '解码'],
        views: 400,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01')
      },
      {
        id: 'qr-code',
        name: '二维码生成',
        description: '在线生成二维码，支持自定义样式',
        icon: '📱',
        path: '/tools/qr-code',
        categories: ['image', 'generate'],
        tags: ['二维码', '生成器'],
        views: 300,
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-10')
      },
      {
        id: 'image-editor',
        name: '图片编辑',
        description: '在线图片编辑工具，支持裁剪、滤镜等功能',
        icon: '✂️',
        path: '/tools/image-editor',
        categories: ['image'],
        tags: ['图片', '编辑', '滤镜'],
        views: 200,
        createdAt: new Date('2024-03-20'),
        updatedAt: new Date('2024-03-20')
      }
    ]
  }),

  getters: {
    /**
     * 获取所有工具
     * @returns {Tool[]}
     */
    getAllTools: (state) => state.tools,

    /**
     * 按分类获取工具
     * @param {string} category - 分类ID
     * @returns {Tool[]}
     */
    getToolsByCategory: (state) => (category) => {
      return state.tools.filter(tool => tool.categories.includes(category))
    },

    /**
     * 按标签获取工具
     * @param {string} tag - 标签名称
     * @returns {Tool[]}
     */
    getToolsByTag: (state) => (tag) => {
      return state.tools.filter(tool => tool.tags.includes(tag))
    },

    /**
     * 获取热门工具
     * @param {number} limit - 限制数量
     * @returns {Tool[]}
     */
    getHotTools: (state) => (limit = 6) => {
      return [...state.tools]
        .sort((a, b) => b.views - a.views)
        .slice(0, limit)
    },

    /**
     * 获取最新工具
     * @param {number} limit - 限制数量
     * @returns {Tool[]}
     */
    getNewTools: (state) => (limit = 6) => {
      return [...state.tools]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit)
    },

    /**
     * 获取最近更新的工具
     * @param {number} limit - 限制数量
     * @returns {Tool[]}
     */
    getRecentlyUpdatedTools: (state) => (limit = 6) => {
      return [...state.tools]
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, limit)
    }
  },

  actions: {
    /**
     * 增加工具访问量
     * @param {string} toolId - 工具ID
     */
    incrementViews(toolId) {
      const tool = this.tools.find(t => t.id === toolId)
      if (tool) {
        tool.views++
      }
    },

    /**
     * 更新工具信息
     * @param {string} toolId - 工具ID
     * @param {Partial<Tool>} updates - 更新的字段
     */
    updateTool(toolId, updates) {
      const index = this.tools.findIndex(t => t.id === toolId)
      if (index !== -1) {
        this.tools[index] = {
          ...this.tools[index],
          ...updates,
          updatedAt: new Date()
        }
      }
    },

    /**
     * 添加新工具
     * @param {Omit<Tool, 'id' | 'views' | 'createdAt' | 'updatedAt'>} tool - 工具信息
     */
    addTool(tool) {
      const now = new Date()
      this.tools.push({
        ...tool,
        id: tool.path.split('/').pop(),
        views: 0,
        createdAt: now,
        updatedAt: now
      })
    }
  }
}) 