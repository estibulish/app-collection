import axios from 'axios'
import { useUserStore } from '@/stores/user'
import Message from './message'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    
    // 如果返回的不是标准格式，直接返回数据
    if (typeof res.code === 'undefined') {
      return res
    }
    
    // 成功状态
    if (res.code === 0) {
      return res.data
    }
    
    // 使用自定义消息组件
    Message.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  error => {
    // 处理错误响应
    let message = '请求失败'
    
    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 400:
          message = error.response.data?.message || '请求参数错误'
          break
        case 401:
          message = '未登录或登录已过期'
          // 清除用户信息并跳转到登录页
          const userStore = useUserStore()
          userStore.logout()
          break
        case 403:
          message = '没有权限进行此操作'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = error.response.data?.message || '请求失败'
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      message = '服务器无响应'
    } else {
      // 请求配置出错
      message = error.message || '请求配置错误'
    }

    // 使用自定义消息组件
    Message.error(message)
    
    return Promise.reject(error)
  }
)

export default request 