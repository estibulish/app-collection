import request from '@/utils/request'

export const sendEmailCode = (email) => {
  return request.post('/auth/email/code', { email })
}

export const emailLogin = (email, code) => {
  return request.post('/auth/email/login', { email, code })
}

export const getWechatQrcode = () => {
  return request.get('/auth/wechat/qrcode')
}

export const checkWechatLogin = (scene) => {
  return request.get('/auth/wechat/check', { params: { scene } })
}

export const getFavorites = () => {
  return request.get('/auth/favorites')
}

export const addFavorite = (toolId) => {
  return request.post('/auth/favorites', { toolId })
}

export const removeFavorite = (toolId) => {
  return request.delete(`/auth/favorites/${toolId}`)
}

export const validateToken = () => {
  return request.get('/auth/validate')
}

export const logout = () => {
  return request.post('/auth/logout')
} 