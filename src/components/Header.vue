<template>
  <header class="app-header">
    <div class="header-content">
      <router-link to="/" class="logo">
        <span class="logo-icon">⚡️</span>
        <span>工具集合</span>
      </router-link>

      <nav class="main-nav">
        <router-link to="/">首页</router-link>
        <div 
          class="nav-item" 
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <router-link to="/tools" class="nav-link">
            工具列表
            <span class="nav-arrow">▾</span>
          </router-link>
          <div 
            class="dropdown-menu"
            :class="{ 'show': showDropdown }"
          >
            <div class="dropdown-content">
              <div class="dropdown-header">
                <h4>常用工具</h4>
                <router-link to="/tools" class="view-all">查看全部</router-link>
              </div>
              <div class="dropdown-grid">
                <router-link v-for="tool in commonTools" 
                  :key="tool.id" 
                  :to="tool.path"
                  class="dropdown-item"
                >
                  <span class="item-icon">{{ tool.icon }}</span>
                  <div class="item-info">
                    <span class="item-name">{{ tool.name }}</span>
                    <span class="item-desc">{{ tool.description }}</span>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <router-link to="/favorites">我的收藏</router-link>
        <router-link to="/updates">更新日志</router-link>
        <router-link to="/about">关于</router-link>
        <router-link to="/business">商务合作</router-link>
      </nav>

      <div class="header-actions">
        <div class="search-box">
          <div class="search-input-wrapper">
            <input 
              type="text" 
              placeholder="搜索工具..."
              v-model="searchQuery"
              @focus="showSearchResults = true"
              @blur="hideSearchResults"
              @keyup.enter="handleSearch"
            >
            <button class="search-btn" @click="handleSearch">
              <span class="search-icon">🔍</span>
            </button>
          </div>
          
          <!-- 搜索下拉框 -->
          <div class="search-dropdown" :class="{ 'show': showSearchResults }">
            <div v-if="searchResults.length > 0" class="search-results">
              <router-link 
                v-for="result in searchResults" 
                :key="result.id"
                :to="result.path"
                class="result-item"
                @mousedown.prevent="selectSearchResult(result)"
              >
                <span class="result-icon">{{ result.icon }}</span>
                <div class="result-info">
                  <span class="result-name">{{ result.name }}</span>
                  <span class="result-desc">{{ result.description }}</span>
                </div>
              </router-link>
            </div>
            <div v-else-if="searchQuery" class="no-results">
              <span class="no-results-icon">🔍</span>
              <p>未找到相关工具</p>
            </div>
            <div v-else class="search-suggestions">
              <div class="suggestions-header">
                <h4>热门搜索</h4>
              </div>
              <div class="suggestions-list">
                <a 
                  v-for="suggestion in searchSuggestions" 
                  :key="suggestion.id"
                  href="#"
                  class="suggestion-item"
                  @click.prevent="applySuggestion(suggestion)"
                >
                  <span class="suggestion-icon">{{ suggestion.icon }}</span>
                  <span class="suggestion-text">{{ suggestion.text }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <button class="theme-toggle" @click="toggleTheme">
          <span v-if="themeStore.isDark" class="theme-icon">🌞</span>
          <span v-else class="theme-icon">🌙</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { tools, getHotTools, searchTools } from '../config/tools'
import { onMounted } from 'vue'

const router = useRouter()
const themeStore = useThemeStore()
const searchQuery = ref('')
const showDropdown = ref(false)
const showSearchResults = ref(false)
let dropdownTimer = null

// 常用工具列表 - 使用配置中的热门工具
const commonTools = computed(() => {
  return getHotTools().slice(0, 4) // 只显示前4个热门工具
})

// 搜索结果 - 使用配置中的搜索函数
const searchResults = computed(() => {
  if (!searchQuery.value) return []
  return searchTools(searchQuery.value)
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/tools',
      query: { search: searchQuery.value.trim() }
    })
    searchQuery.value = ''
    showSearchResults.value = false
  }
}

const selectSearchResult = (result) => {
  router.push(result.path)
  searchQuery.value = ''
  showSearchResults.value = false
}

const hideSearchResults = () => {
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

// 搜索建议 - 使用配置中的热门工具
const searchSuggestions = computed(() => {
  return getHotTools().slice(0, 3).map(tool => ({
    id: tool.id,
    text: tool.name,
    icon: tool.icon,
    path: tool.path
  }))
})

const applySuggestion = (suggestion) => {
  router.push(suggestion.path)
  searchQuery.value = ''
  showSearchResults.value = false
}

const handleMouseEnter = () => {
  if (dropdownTimer) {
    clearTimeout(dropdownTimer)
  }
  showDropdown.value = true
}

const handleMouseLeave = () => {
  dropdownTimer = setTimeout(() => {
    showDropdown.value = false
  }, 200) // 200ms 延迟
}

onMounted(() => {
  themeStore.initTheme()
})
</script>

<style lang="scss" scoped>
.app-header {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.25rem;

  .logo-icon {
    font-size: 1.5rem;
  }
}

.main-nav {
  display: flex;
  gap: 2rem;

  a {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s;
    font-size: 0.9375rem;

    &:hover, &.router-link-active {
      color: var(--primary);
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
  z-index: 100;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: var(--primary);
  }

  input {
    width: 240px;
    padding: 0.5rem 0.75rem;
    border: none;
    background: none;
    color: var(--text-primary);
    font-size: 0.875rem;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: var(--text-tertiary);
    }
  }
}

.search-btn {
  padding: 0.5rem 0.75rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: var(--primary);
  }
}

.theme-toggle {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background: var(--bg-hover);
  }

  .theme-icon {
    font-size: 1.25rem;
    line-height: 1;
  }
}

@media (max-width: 1024px) {
  .search-input-wrapper input {
    width: 160px;
  }
}

@media (max-width: 768px) {
  .main-nav {
    display: none;
  }

  .header-content {
    padding: 0.75rem 1rem;
  }

  .search-input-wrapper {
    display: none;
  }
}

/* 下拉菜单样式 */
.nav-item {
  position: relative;
  
  &:hover .nav-arrow {
    transform: rotate(180deg);
  }
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-arrow {
  display: inline-block;
  margin-left: 4px;
  transition: transform 0.2s ease;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 280px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all 0.2s ease;
  
  &.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

.dropdown-content {
  padding: 1rem;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .view-all {
    font-size: 0.75rem;
    color: var(--primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.dropdown-grid {
  display: grid;
  gap: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background: var(--bg-hover);
  }
}

.item-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.item-info {
  display: flex;
  flex-direction: column;
}

.item-name {
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
}

.item-desc {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

/* 搜索下拉菜单 */
.search-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all 0.2s;

  &.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

.search-results {
  max-height: 300px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background: var(--bg-hover);
  }
}

.result-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.result-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.result-name {
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
}

.result-desc {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.no-results {
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);

  .no-results-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    display: block;
  }

  p {
    font-size: 0.875rem;
  }
}

.search-suggestions {
  padding: 1rem;
}

.suggestions-header {
  padding: 0 0.5rem;
  margin-bottom: 0.75rem;

  h4 {
    font-size: 0.75rem;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.suggestions-list {
  display: grid;
  gap: 0.5rem;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  text-decoration: none;
  color: var(--text-primary);
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background: var(--bg-hover);
  }
}

.suggestion-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.suggestion-text {
  font-size: 0.875rem;
}

/* 响应式补充 */
@media (max-width: 768px) {
  .search-input-wrapper input {
    width: 180px;
  }

  .search-dropdown {
    position: fixed;
    top: 60px;
    left: 1rem;
    right: 1rem;
    margin-top: 0;
  }
}
</style> 