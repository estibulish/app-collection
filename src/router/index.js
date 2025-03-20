import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { useUserStore } from '@/stores/user'

/**
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/tools',
    name: 'Tools',
    component: () => import('../views/tools/List.vue'),
    meta: {
      title: '工具列表'
    }
  },
  {
    path: '/tools/json-formatter',
    name: 'JsonFormatter',
    component: () => import('../views/tools/JsonFormatter.vue'),
    meta: {
      title: 'JSON格式化工具'
    }
  },
  {
    path: '/tools/base64',
    name: 'Base64',
    component: () => import('../views/tools/Base64.vue'),
    meta: {
      title: 'Base64编解码工具'
    }
  },
  {
    path: '/tools/timestamp',
    name: 'Timestamp',
    component: () => import('../views/tools/Timestamp.vue'),
    meta: {
      title: '时间戳转换工具'
    }
  },
  {
    path: '/tools/image-compress',
    name: 'ImageCompress',
    component: () => import('../views/tools/ImageCompress.vue'),
    meta: {
      title: '图片压缩工具'
    }
  },
  {
    path: '/tools/pdf-convert',
    name: 'PdfConvert',
    component: () => import('../views/tools/PdfConvert.vue'),
    meta: {
      title: 'PDF转换工具'
    }
  },
  {
    path: '/tools/qr-code',
    name: 'QrCode',
    component: () => import('../views/tools/QrCode.vue'),
    meta: {
      title: '二维码生成器'
    }
  },
  {
    path: '/tools/url-encode',
    name: 'UrlEncode',
    component: () => import('../views/tools/UrlEncode.vue'),
    meta: {
      title: 'URL编解码工具'
    }
  },
  {
    path: '/tools/html-escape',
    name: 'HtmlEscape',
    component: () => import('../views/tools/HtmlEscape.vue'),
    meta: {
      title: 'HTML转义工具'
    }
  },
  {
    path: '/tools/markdown',
    name: 'Markdown',
    component: () => import('../views/tools/MarkdownEditor.vue'),
    meta: {
      title: 'Markdown编辑器'
    }
  },
  {
    path: '/tools/regex-test',
    name: 'RegexTest',
    component: () => import('../views/tools/RegexTest.vue'),
    meta: {
      title: '正则表达式测试工具'
    }
  },
  {
    path: '/updates',
    name: 'Updates',
    component: () => import('../views/Updates.vue'),
    meta: {
      title: '更新日志'
    }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../views/Favorites.vue'),
    meta: {
      title: '我的收藏',
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: '关于我们'
    }
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('../views/Help.vue'),
    meta: {
      title: '使用帮助'
    }
  },
  {
    path: '/changelog',
    name: 'Changelog',
    component: () => import('../views/Changelog.vue'),
    meta: {
      title: '版本历史'
    }
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: () => import('../views/Feedback.vue'),
    meta: {
      title: '意见反馈',
      requiresAuth: true
    }
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('../views/Report.vue'),
    meta: {
      title: '问题报告',
      requiresAuth: true
    }
  },
  {
    path: '/business',
    name: 'Business',
    component: () => import('../views/Business.vue'),
    meta: {
      title: '商务合作'
    }
  },
  {
    path: '/tools/image-editor',
    name: 'ImageEditor',
    component: () => import('../views/tools/ImageEditor.vue'),
    meta: {
      title: '图片编辑工具'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '404 - 页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.MODE === 'development' ? './' : '/app-collection/',),
  routes
})

// 修改路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 设置页面标题
  document.title = to.meta.title ? 
    `${to.meta.title} - 工具集合` : 
    '工具集合 - 便捷高效的在线工具箱'
  
  // 需要登录的路由
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  // 已登录用户访问登录页面，重定向到首页
  if (to.path === '/login' && userStore.isLoggedIn) {
    next('/')
    return
  }
  
  next()
})

export default router 