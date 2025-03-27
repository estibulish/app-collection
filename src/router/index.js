import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { useUserStore } from '@/stores/user'
import CssEffects from '@/views/tools/CssEffects.vue'

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
    path: '/tools/data/json-formatter',
    name: 'JsonFormatter',
    component: () => import('../views/tools/data/JsonFormatter.vue'),
    meta: {
      title: 'JSON 格式化工具'
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
    path: '/tools/image-compress',
    name: 'ImageCompress',
    component: () => import('../views/tools/ImageCompress.vue'),
    meta: {
      title: '图片压缩工具'
    }
  },
  {
    path: '/tools/image-convert',
    name: 'ImageConvert',
    component: () => import('../views/tools/ImageConvert.vue'),
    meta: {
      title: '图片格式转换工具'
    }
  },
  {
    path: '/tools/image-watermark',
    name: 'ImageWatermark',
    component: () => import('../views/tools/ImageWatermark.vue'),
    meta: {
      title: '图片水印工具'
    }
  },
  {
    path: '/tools/image-merge',
    name: 'ImageMerge',
    component: () => import('../views/tools/ImageMerge.vue'),
    meta: {
      title: '图片拼接工具'
    }
  },
  {
    path: '/tools/image-background',
    name: 'ImageBackground',
    component: () => import('../views/tools/ImageBackground.vue'),
    meta: {
      title: '图片背景移除工具'
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
    path: '/tools/css-effects',
    name: 'CssEffects',
    component: CssEffects,
    meta: {
      title: 'CSS 效果合集 - 工具集合',
      requiresAuth: false
    }
  },
  {
    path: '/tools/hash-generator',
    name: 'HashGenerator',
    component: () => import('../views/tools/HashGenerator.vue'),
    meta: {
      title: '哈希生成器'
    }
  },
  {
    path: '/tools/aes-encrypt',
    name: 'AesEncrypt',
    component: () => import('../views/tools/AesEncrypt.vue'),
    meta: {
      title: 'AES 加解密工具'
    }
  },
  {
    path: '/tools/rsa-encrypt',
    name: 'RsaEncrypt',
    component: () => import('../views/tools/RsaEncrypt.vue'),
    meta: {
      title: 'RSA 加解密工具'
    }
  },
  {
    path: '/tools/jwt-decoder',
    name: 'JwtDecoder',
    component: () => import('../views/tools/JwtDecoder.vue'),
    meta: {
      title: 'JWT 解析器'
    }
  },
  {
    path: '/tools/length-converter',
    name: 'LengthConverter',
    component: () => import('../views/tools/LengthConverter.vue'),
    meta: {
      title: '长度单位换算'
    }
  },
  {
    path: '/tools/area-converter',
    name: 'AreaConverter',
    component: () => import('../views/tools/AreaConverter.vue'),
    meta: {
      title: '面积单位换算'
    }
  },
  {
    path: '/tools/weight-converter',
    name: 'WeightConverter',
    component: () => import('../views/tools/WeightConverter.vue'),
    meta: {
      title: '重量单位换算'
    }
  },
  {
    path: '/tools/temperature-converter',
    name: 'TemperatureConverter',
    component: () => import('../views/tools/TemperatureConverter.vue'),
    meta: {
      title: '温度单位换算'
    }
  },
  {
    path: '/tools/number/base-converter',
    name: 'NumberBase',
    component: () => import('../views/tools/number/NumberBase.vue'),
    meta: {
      title: '进制转换工具'
    }
  },
  {
    path: '/tools/number/calculator',
    name: 'Calculator',
    component: () => import('../views/tools/number/Calculator.vue'),
    meta: {
      title: '科学计算器'
    }
  },
  {
    path: '/tools/number/random',
    name: 'RandomNumber',
    component: () => import('../views/tools/number/RandomNumber.vue'),
    meta: {
      title: '随机数生成器'
    }
  },
  {
    path: '/tools/number/unit-price',
    name: 'UnitPrice',
    component: () => import('../views/tools/number/UnitPrice.vue'),
    meta: {
      title: '单价计算器'
    }
  },
  {
    path: '/tools/number/percent',
    name: 'PercentCalculator',
    component: () => import('../views/tools/number/PercentCalculator.vue'),
    meta: {
      title: '百分比计算器'
    }
  },
  {
    path: '/tools/number/loan',
    name: 'LoanCalculator',
    component: () => import('../views/tools/number/LoanCalculator.vue'),
    meta: {
      title: '贷款计算器'
    }
  },
  {
    path: '/tools/text/diff',
    name: 'TextDiff',
    component: () => import('../views/tools/text/TextDiff.vue'),
    meta: {
      title: '文本对比工具'
    }
  },
  {
    path: '/tools/text/stats',
    name: 'TextStats',
    component: () => import('../views/tools/text/TextStats.vue'),
    meta: {
      title: '文本统计工具'
    }
  },
  {
    path: '/tools/text/case',
    name: 'TextCase',
    component: () => import('../views/tools/text/TextCase.vue'),
    meta: {
      title: '文本转换工具'
    }
  },
  {
    path: '/tools/text/dedupe',
    name: 'TextDedupe',
    component: () => import('../views/tools/text/TextDedupe.vue'),
    meta: {
      title: '文本去重工具'
    }
  },
  {
    path: '/tools/text/sort',
    name: 'TextSort',
    component: () => import('../views/tools/text/TextSort.vue'),
    meta: {
      title: '文本排序工具'
    }
  },
  {
    path: '/tools/text/replace',
    name: 'TextReplace',
    component: () => import('../views/tools/text/TextReplace.vue'),
    meta: {
      title: '文本替换工具'
    }
  },
  {
    path: '/tools/text/format',
    name: 'TextFormat',
    component: () => import('../views/tools/text/TextFormat.vue'),
    meta: {
      title: '文本格式化工具'
    }
  },
  {
    path: '/tools/text/to-table',
    name: 'TextToTable',
    component: () => import('../views/tools/text/TextToTable.vue'),
    meta: {
      title: '文本转表格工具'
    }
  },
  {
    path: '/tools/office/excel-to-json',
    name: 'ExcelToJson',
    component: () => import('../views/tools/office/ExcelToJson.vue'),
    meta: {
      title: 'Excel 转 JSON 工具'
    }
  },
  {
    path: '/tools/office/pdf-to-word',
    name: 'PdfToWord',
    component: () => import('../views/tools/office/PdfToWord.vue'),
    meta: {
      title: 'PDF 转 Word 工具'
    }
  },
  {
    path: '/tools/office/word-to-pdf',
    name: 'WordToPdf',
    component: () => import('../views/tools/office/WordToPdf.vue'),
    meta: {
      title: 'Word 转 PDF 工具'
    }
  },
  {
    path: '/tools/office/ppt-to-pdf',
    name: 'PptToPdf',
    component: () => import('../views/tools/office/PptToPdf.vue'),
    meta: {
      title: 'PPT 转 PDF 工具'
    }
  },
  {
    path: '/tools/office/pdf-merge',
    name: 'PdfMerge',
    component: () => import('../views/tools/office/PdfMerge.vue'),
    meta: {
      title: 'PDF 合并工具'
    }
  },
  {
    path: '/tools/office/pdf-split',
    name: 'PdfSplit',
    component: () => import('../views/tools/office/PdfSplit.vue'),
    meta: {
      title: 'PDF 拆分工具'
    }
  },
  {
    path: '/tools/entertainment/random-picker',
    name: 'RandomPicker',
    component: () => import('../views/tools/entertainment/RandomPicker.vue'),
    meta: {
      title: '随机选择器'
    }
  },
  {
    path: '/tools/entertainment/dice-roller',
    name: 'DiceRoller',
    component: () => import('../views/tools/entertainment/DiceRoller.vue'),
    meta: {
      title: '骰子模拟器'
    }
  },
  {
    path: '/tools/entertainment/name-generator',
    name: 'NameGenerator',
    component: () => import('../views/tools/entertainment/NameGenerator.vue'),
    meta: {
      title: '随机名字生成'
    }
  },
  {
    path: '/tools/entertainment/color-picker',
    name: 'ColorPicker',
    component: () => import('../views/tools/entertainment/ColorPicker.vue'),
    meta: {
      title: '颜色选择器'
    }
  },
  {
    path: '/tools/entertainment/meme-generator',
    name: 'MemeGenerator',
    component: () => import('../views/tools/entertainment/MemeGenerator.vue'),
    meta: {
      title: '表情包生成器'
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
  // const userStore = useUserStore()
  
  // 设置页面标题
  document.title = to.meta.title ? 
    `${to.meta.title} - 工具集合` : 
    '工具集合 - 便捷高效的在线工具箱'
  
  // 需要登录的路由
  // if (to.meta.requiresAuth && !userStore.isLoggedIn) {
  //   next({
  //     path: '/login',
  //     query: { redirect: to.fullPath }
  //   })
  //   return
  // }
  
  // 已登录用户访问登录页面，重定向到首页
  // if (to.path === '/login' && userStore.isLoggedIn) {
  //   next('/')
  //   return
  // }
  
  next()
})

export default router 