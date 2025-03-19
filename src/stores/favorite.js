import { defineStore } from 'pinia'

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
    lastUsed: JSON.parse(localStorage.getItem('lastUsed') || '{}')
  }),

  actions: {
    addFavorite(toolId) {
      if (!this.favorites.includes(toolId)) {
        this.favorites.push(toolId)
        this.saveFavorites()
      }
    },

    removeFavorite(toolId) {
      const index = this.favorites.indexOf(toolId)
      if (index > -1) {
        this.favorites.splice(index, 1)
        this.saveFavorites()
      }
    },

    clearFavorites() {
      this.favorites = []
      this.saveFavorites()
    },

    updateLastUsed(toolId) {
      this.lastUsed[toolId] = new Date().toISOString()
      this.saveLastUsed()
    },

    getLastUsed(toolId) {
      return this.lastUsed[toolId]
    },

    saveFavorites() {
      localStorage.setItem('favorites', JSON.stringify(this.favorites))
    },

    saveLastUsed() {
      localStorage.setItem('lastUsed', JSON.stringify(this.lastUsed))
    }
  }
}) 