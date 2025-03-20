import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '@/api/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    user: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userEmail: (state) => state.user?.email,
    userAvatar: (state) => state.user?.wechat?.avatar,
    userName: (state) => state.user?.wechat?.nickname || state.user?.email,
    favorites: (state) => state.user?.favorites || []
  },

  actions: {
    async emailLogin(email, code) {
      try {
        const data = await authApi.emailLogin(email, code)
        this.token = data.token
        this.user = data.user
        this.saveToStorage()
        return data
      } catch (error) {
        throw error
      }
    },

    async sendEmailCode(email) {
      try {
        return await authApi.sendEmailCode(email)
      } catch (error) {
        throw error
      }
    },

    async getWechatQrcode() {
      try {
        return await authApi.getWechatQrcode()
      } catch (error) {
        throw error
      }
    },

    async checkWechatLogin(scene) {
      try {
        const data = await authApi.checkWechatLogin(scene)
        if (data.isLoggedIn) {
          this.token = data.token
          this.user = data.user
          this.saveToStorage()
          return true
        }
        return false
      } catch (error) {
        return false
      }
    },

    async addFavorite(toolId) {
      try {
        await authApi.addFavorite(toolId)
        if (!this.user.favorites.includes(toolId)) {
          this.user.favorites.push(toolId)
        }
      } catch (error) {
        throw error
      }
    },

    async removeFavorite(toolId) {
      try {
        await authApi.removeFavorite(toolId)
        this.user.favorites = this.user.favorites.filter(id => id !== toolId)
      } catch (error) {
        throw error
      }
    },

    async logout() {
      try {
        // 调用退出接口
        await authApi.logout()
      } catch (error) {
        console.error('退出失败:', error)
      } finally {
        // 无论接口是否成功，都清除本地状态
        this.token = null
        this.user = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },

    saveToStorage() {
      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    loadFromStorage() {
      try {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        
        if (token && userStr) {
          const user = JSON.parse(userStr)
          this.token = token
          this.user = user
          
          // 验证 token 是否有效
          this.validateToken()
        }
      } catch (error) {
        console.error('加载用户信息失败:', error)
        this.logout()
      }
    },
    
    async validateToken() {
      try {
        // 调用后端接口验证 token
        await authApi.validateToken()
      } catch (error) {
        console.error('Token 验证失败:', error)
        this.logout()
      }
    }
  }
}) 