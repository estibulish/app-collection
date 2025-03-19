<template>
  <main class="favorites-page">
    <div class="page-header">
      <div class="header-content">
        <h1>我的收藏</h1>
        <p class="subtitle">管理您收藏的工具</p>
      </div>
      <div class="header-actions">
        <button 
          v-if="favorites.length" 
          class="action-btn"
          @click="clearAllFavorites"
        >
          <span class="btn-icon">🗑</span>
          清空收藏
        </button>
      </div>
    </div>

    <div class="favorites-content">
      <template v-if="favorites.length">
        <div class="tools-grid">
          <div 
            v-for="tool in favorites" 
            :key="tool.id"
            class="tool-card"
          >
            <div class="tool-card-header">
              <span class="tool-icon">{{ tool.icon }}</span>
              <button 
                class="favorite-btn"
                @click="removeFavorite(tool.id)"
                title="取消收藏"
              >
                <span class="favorite-icon">⭐️</span>
              </button>
            </div>
            <div class="tool-card-content">
              <router-link :to="tool.path" class="tool-name">
                {{ tool.name }}
              </router-link>
              <p class="tool-desc">{{ tool.description }}</p>
              <div class="tool-tags">
                <span 
                  v-for="tag in tool.tags.slice(0, 2)" 
                  :key="tag"
                  class="tool-tag"
                >{{ tag }}</span>
              </div>
            </div>
            <div class="tool-card-footer">
              <span class="last-used">上次使用: {{ formatDate(tool.lastUsed) }}</span>
              <router-link :to="tool.path" class="use-btn">使用工具</router-link>
            </div>
          </div>
        </div>
      </template>
      
      <div v-else class="empty-state">
        <div class="empty-icon">⭐️</div>
        <h3>暂无收藏工具</h3>
        <p>您可以在使用工具时点击收藏按钮添加到这里</p>
        <router-link to="/tools" class="browse-btn">
          浏览工具
        </router-link>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { tools } from '../config/tools'
import { useFavoriteStore } from '../stores/favorite'

const favoriteStore = useFavoriteStore()

// 修改 favorites 计算属性的实现
const favorites = computed(() => {
  return favoriteStore.favorites
    .map(id => {
      // 查找工具信息
      const tool = tools.find(t => t.id === id)
      // 如果找不到工具信息，跳过这个收藏
      if (!tool) return null
      
      return {
        ...tool,
        lastUsed: favoriteStore.getLastUsed(id)
      }
    })
    // 过滤掉无效的工具（null）
    .filter(tool => tool !== null)
    // 按最后使用时间排序
    .sort((a, b) => new Date(b.lastUsed || 0) - new Date(a.lastUsed || 0))
})

// 移除收藏
const removeFavorite = (toolId) => {
  favoriteStore.removeFavorite(toolId)
}

// 清空所有收藏
const clearAllFavorites = () => {
  if (confirm('确定要清空所有收藏吗？')) {
    favoriteStore.clearFavorites()
  }
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '从未使用'
  
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  
  // 24小时内
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000))
    if (hours === 0) {
      const minutes = Math.floor(diff / (60 * 1000))
      return `${minutes}分钟前`
    }
    return `${hours}小时前`
  }
  
  // 7天内
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    return `${days}天前`
  }
  
  // 超过7天显示具体日期
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style lang="scss" scoped>
.favorites-page {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-content {
  h1 {
    font-size: 1.875rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: var(--text-secondary);
    font-size: 1rem;
  }
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--danger);
    color: var(--danger);
  }

  .btn-icon {
    font-size: 1.25rem;
  }
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.tool-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
}

.tool-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tool-icon {
  font-size: 2rem;
  line-height: 1;
}

.favorite-btn {
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  .favorite-icon {
    font-size: 1.25rem;
  }
}

.tool-card-content {
  margin-bottom: 1rem;

  .tool-name {
    display: block;
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--text-primary);
    text-decoration: none;
    margin-bottom: 0.5rem;

    &:hover {
      color: var(--primary);
    }
  }

  .tool-desc {
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
}

.tool-tags {
  display: flex;
  gap: 0.5rem;
}

.tool-tag {
  padding: 0.25rem 0.5rem;
  background: var(--bg-hover);
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.tool-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.last-used {
  color: var(--text-tertiary);
  font-size: 0.75rem;
}

.use-btn {
  padding: 0.5rem 1rem;
  background: var(--primary);
  color: white;
  border-radius: 6px;
  font-size: 0.875rem;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background: var(--primary-dark);
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.25rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  p {
    margin-bottom: 1.5rem;
  }

  .browse-btn {
    display: inline-flex;
    padding: 0.75rem 1.5rem;
    background: var(--primary);
    color: white;
    border-radius: 8px;
    text-decoration: none;
    transition: background-color 0.2s;

    &:hover {
      background: var(--primary-dark);
    }
  }
}

@media (max-width: 768px) {
  .favorites-page {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style> 