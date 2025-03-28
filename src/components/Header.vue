<template>
  <header class="app-header">
    <div class="header-content">
      <router-link to="/" class="logo">
        <span class="logo-icon">⚡️</span>
        <span>工具集合</span>
      </router-link>

      

      <!-- 移动端菜单 -->
      <Transition name="slide">
        <div v-if="showMobileMenu" class="mobile-menu">
          <div class="menu-header">
            <span>菜单</span>
            <button class="close-btn" @click="showMobileMenu = false">×</button>
          </div>
          
          <div class="menu-content">
            <div class="search-wrapper">
              <input
                type="text"
                placeholder="搜索工具..."
                v-model="searchQuery"
                @focus="showSearchResults = true"
                @keyup.enter="handleSearch"
              >
            </div>

            <nav class="menu-nav">
              <router-link to="/" @click="showMobileMenu = false">首页</router-link>
              <router-link to="/tools" @click="showMobileMenu = false">工具列表</router-link>
              <router-link to="/favorites" @click="showMobileMenu = false">我的收藏</router-link>
              <router-link to="/about" @click="showMobileMenu = false">关于我们</router-link>
            </nav>

            <div class="menu-footer">
              <button class="theme-toggle" @click="toggleTheme">
                <span v-if="themeStore.isDark" class="theme-icon">🌞</span>
                <span v-else class="theme-icon">🌙</span>
                <span>{{ themeStore.isDark ? '浅色模式' : '深色模式' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- 遮罩层 -->
      <Transition name="fade">
        <div v-if="showMobileMenu" class="menu-overlay" @click="showMobileMenu = false"></div>
      </Transition>

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
        <!-- <router-link to="/about">关于</router-link> -->
        <!-- <router-link to="/business">商务合作</router-link> -->
        <div class="dropdown">
          <button class="dropdown-toggle" @click="toggleDropdown">
            娱乐 
            <span class="arrow" :class="{ 'rotated': showDropdown }">▾</span>
          </button>
          <div class="dropdown-menu" :class="{ 'show': showDropdown }">
            <div class="menu-grid">
              <router-link to="/tools/entertainment/random-picker" class="menu-item">
                <span class="item-icon">🎲</span>
                <span class="item-text">随机选择器</span>
              </router-link>
              <router-link to="/tools/entertainment/dice-roller" class="menu-item">
                <span class="item-icon">🎲</span>
                <span class="item-text">骰子模拟器</span>
              </router-link>
              <router-link to="/tools/entertainment/name-generator" class="menu-item">
                <span class="item-icon">📝</span>
                <span class="item-text">随机名字生成</span>
              </router-link>
              <router-link to="/tools/entertainment/color-picker" class="menu-item">
                <span class="item-icon">🎨</span>
                <span class="item-text">颜色选择器</span>
              </router-link>
              <router-link to="/tools/entertainment/meme-generator" class="menu-item">
                <span class="item-icon">😂</span>
                <span class="item-text">表情包生成器</span>
              </router-link>
            </div>
          </div>
        </div>
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

        <!-- 移动端菜单按钮 -->
        <button class="menu-btn" @click="showMobileMenu = true">
          <span class="menu-icon">☰</span>
        </button>
      </div>

      <div class="header-right" v-if="false">
        <!-- 未登录状态 -->
        <button 
          v-if="!isLoggedIn" 
          class="login-btn"
          @click="showLoginDialog = true"
        >
          登录
        </button>
        
        <!-- 已登录状态 -->
        <div class="user-menu" v-else>
          <button 
            class="user-btn" 
            @mouseenter="showUserDropdown = true"
          >
            <img 
              v-if="userAvatar" 
              :src="userAvatar" 
              class="user-avatar"
              alt="用户头像"
            >
            <span v-else class="user-initial">
              {{ userName?.[0]?.toUpperCase() || '👤' }}
            </span>
            <span class="username">{{ userName }}</span>
            <span class="dropdown-arrow">▾</span>
          </button>
          
          <div 
            class="dropdown-menu"
            :class="{ 'show': showUserDropdown }" 
            @mouseleave="showUserDropdown = false"
          >
            <div class="user-info">
              <span class="user-name">{{ userName }}</span>
              <span class="user-email">{{ userStore.userEmail }}</span>
            </div>
            <div class="menu-divider"></div>
            <router-link to="/favorites" class="menu-item">
              <span class="item-icon">⭐️</span>
              我的收藏
            </router-link>
            <button class="menu-item" @click="handleLogout">
              <span class="item-icon">🚪</span>
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 登录弹框 -->
    <LoginDialog 
      v-model="showLoginDialog"
    />

    <!-- 确认退出弹框 -->
    <ConfirmDialog
      v-model="showLogoutConfirm"
      title="退出登录"
      message="确定要退出登录吗？"
      @confirm="confirmLogout"
    />
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { tools, getHotTools, searchTools } from '../config/tools'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import LoginDialog from './LoginDialog.vue'
import ConfirmDialog from './ConfirmDialog.vue'

const router = useRouter()
const themeStore = useThemeStore()
const userStore = useUserStore()
const searchQuery = ref('')
const showDropdown = ref(false)
const showSearchResults = ref(false)
let dropdownTimer = null
const showLoginDialog = ref(false)
const showUserDropdown = ref(false)
const showLogoutConfirm = ref(false)
const showMobileMenu = ref(false)

const isLoggedIn = computed(() => userStore.isLoggedIn)
const userName = computed(() => userStore.userName)
const userAvatar = computed(() => userStore.userAvatar)

// 常用工具列表 - 使用配置中的热门工具
const commonTools = computed(() => {
  return [
    ...getHotTools().slice(0, 4), // 只显示前4个热门工具
    {
      id: 'css-effects',
      name: 'CSS 效果合集',
      icon: '🎨',
      path: '/tools/css-effects',
      description: '常用 CSS 效果展示和代码片段'
    }
  ]
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

const handleLogout = () => {
  showUserDropdown.value = false
  showLogoutConfirm.value = true
}

const confirmLogout = async () => {
  await userStore.logout()
  router.push('/')
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
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
  align-items: center;
  gap: 1rem;

  a {
    color: var(--text-primary);
    text-decoration: none;
    padding: 0.5rem 1rem;
    transition: color 0.2s;

    &:hover {
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

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.login-btn {
  padding: 0.5rem 1.25rem;
  border: 1px solid var(--primary);
  border-radius: 6px;
  background: none;
  color: var(--primary);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: var(--primary);
    color: white;
  }
}

.user-menu {
  position: relative;
  
  .user-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-card);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      border-color: var(--primary);
      background: var(--bg-hover);
    }
    
    .user-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .user-initial {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-50);
      color: var(--primary);
      border-radius: 50%;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .username {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.875rem;
    }
    
    .dropdown-arrow {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      transition: transform 0.2s;
    }
    
    &:hover .dropdown-arrow {
      transform: rotate(180deg);
    }
  }
  
  .dropdown-menu {
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    min-width: 200px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    
    .user-info {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      
      .user-name {
        display: block;
        font-weight: 500;
        color: var(--text-primary);
      }
      
      .user-email {
        display: block;
        font-size: 0.875rem;
        color: var(--text-tertiary);
        margin-top: 0.25rem;
      }
    }
    
    .menu-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      background: none;
      color: var(--text-primary);
      text-decoration: none;
      cursor: pointer;
      font-size: 0.875rem;
      
      &:hover {
        background: var(--bg-hover);
        color: var(--primary);
      }
      
      .item-icon {
        font-size: 1.125rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .user-menu {
    .user-btn {
      padding: 0.5rem;
      
      .username {
        display: none;
      }
      
      .dropdown-arrow {
        display: none;
      }
    }
  }
}

.menu-btn {
  display: none;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);

  .menu-icon {
    font-size: 24px;
    line-height: 1;
  }
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 280px;
  background: var(--bg-card);
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;

  .menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
    font-size: 1.125rem;
    font-weight: 500;

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      color: var(--text-tertiary);
      cursor: pointer;
      padding: 4px;

      &:hover {
        color: var(--text-primary);
      }
    }
  }

  .menu-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .search-wrapper {
    input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      background: var(--bg-main);
      color: var(--text-primary);
    }
  }

  .menu-nav {
    display: flex;
    flex-direction: column;
    gap: 8px;

    a {
      padding: 12px;
      color: var(--text-primary);
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.2s;

      &:hover,
      &.router-link-active {
        background: var(--bg-hover);
        color: var(--primary);
      }
    }
  }

  .menu-footer {
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid var(--border-color);

    .theme-toggle {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: none;
      border: none;
      color: var(--text-primary);
      cursor: pointer;
      border-radius: 6px;

      &:hover {
        background: var(--bg-hover);
      }
    }
  }
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* 动画 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .menu-btn {
    display: block;
  }

  .main-nav,
  .header-right {
    display: none;
  }
}

.dropdown {
  position: relative;
  display: inline-block;

  .dropdown-toggle {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0.5rem 1rem;
    color: var(--text-primary);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    transition: color 0.2s;

    .arrow {
      font-size: 0.8em;
      transition: transform 0.2s;

      &.rotated {
        transform: rotate(180deg);
      }
    }

    &:hover {
      color: var(--primary);
    }
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 0.5rem;
    min-width: 200px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    z-index: 100;

    &.show {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }

    .menu-grid {
      display: grid;
      gap: 0.5rem;

      .menu-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        color: var(--text-primary);
        text-decoration: none;
        border-radius: 4px;
        transition: all 0.2s;

        &:hover {
          background: var(--bg-hover);
          color: var(--primary);
        }

        .item-icon {
          font-size: 1.2em;
        }

        .item-text {
          font-size: 0.9em;
        }
      }
    }
  }
}

@media (min-width: 769px) {
  .dropdown {
    &:hover {
      .dropdown-toggle {
        color: var(--primary);

        .arrow {
          transform: rotate(180deg);
        }
      }

      .dropdown-menu {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
      }
    }
  }
}

@media (max-width: 768px) {
  .dropdown {
    width: 100%;
    
    .dropdown-toggle {
      width: 100%;
      justify-content: center;
      padding: 0.75rem;
    }

    .dropdown-menu {
      position: static;
      transform: none;
      width: 100%;
      box-shadow: none;
      border: none;
      background: var(--bg-hover);
      margin-top: 0.5rem;
      padding: 0.5rem;
      visibility: visible;
      opacity: 1;
      display: none;

      &.show {
        display: block;
      }
    }
  }
}
</style> 