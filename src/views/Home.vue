<template>
    <section class="hero-section">
      <div class="hero-content">
        <h1>便捷高效的在线工具集合</h1>
        <p class="subtitle">为提高工作效率而生</p>
        <div class="search-container">
          <div class="search-input">
            <input
              type="text"
              placeholder="搜索你需要的工具..."
              v-model="searchQuery"
              @focus="showSearchResults = true"
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">
              <span class="search-icon">🔍</span>
            </button>
          </div>
          
          <div 
            class="search-results" 
            v-if="showSearchResults && searchResults.length > 0"
          >
            <router-link
              v-for="result in searchResults"
              :key="result.id"
              :to="result.path"
              class="result-item"
              @click="selectResult(result)"
            >
              <span class="result-icon">{{ result.icon }}</span>
              <div class="result-info">
                <span class="result-name">{{ result.name }}</span>
                <span class="result-desc">{{ result.description }}</span>
              </div>
            </router-link>
          </div>
        </div>
        <div class="hot-tags">
          <span>热门搜索：</span>
          <router-link
            v-for="tag in hotTags"
            :key="tag.id"
            :to="tag.path"
          >
            {{ tag.name }}
          </router-link>
        </div>
      </div>
    </section>

    <section class="quick-access">
      <div class="section-header">
        <h2>快速访问</h2>
        <router-link to="/tools" class="view-all">查看全部工具 →</router-link>
      </div>
      <div class="quick-grid">
        <router-link
          v-for="tool in quickTools"
          :key="tool.id"
          :to="tool.path"
          class="quick-card"
        >
          <span class="quick-icon">{{ tool.icon }}</span>
          <span class="quick-text">{{ tool.name }}</span>
        </router-link>
      </div>
    </section>

    <section class="category-section">
      <div class="section-header">
        <h2>工具分类</h2>
      </div>
      <div class="category-grid">
        <router-link
          v-for="category in toolCategories"
          :key="category.id"
          :to="`/tools?category=${category.id}`"
          class="category-card"
        >
          <div class="category-icon">{{ category.icon }}</div>
          <div class="category-content">
            <h3>{{ category.name }}</h3>
            <p>{{ category.count }}个工具</p>
            <div class="category-tags">
              <span v-for="tag in category.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </section>

    <section class="features-section">
      <div class="section-header">
        <h2>为什么选择我们</h2>
      </div>
      <div class="features-grid">
        <div 
          v-for="feature in features"
          :key="feature.id"
          class="feature-card"
        >
          <span class="feature-icon">{{ feature.icon }}</span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <section class="latest-section">
      <div class="section-header">
        <h2>最新更新</h2>
        <router-link to="/updates" class="view-all">查看更多 →</router-link>
      </div>
      <div class="latest-grid">
        <div 
          v-for="update in latestUpdates"
          :key="update.id"
          class="update-card"
        >
          <div class="update-badge">{{ update.type }}</div>
          <h3>{{ update.title }}</h3>
          <p>{{ update.description }}</p>
          <time>{{ update.date }}</time>
        </div>
      </div>
    </section>
</template>
  
<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { categories, tools, getHotTools, getNewTools } from '../config/tools'
import { useToolStore } from '@/stores/tool'

const router = useRouter();
const toolStore = useToolStore();
const searchQuery = ref("");
const showSearchResults = ref(false);

// 搜索结果
const searchResults = computed(() => {
  if (!searchQuery.value) return [];
  
  const query = searchQuery.value.toLowerCase();
  return toolStore.tools.filter(tool => {
    return tool.name.toLowerCase().includes(query) ||
           tool.description.toLowerCase().includes(query) ||
           tool.tags.some(tag => tag.toLowerCase().includes(query));
  }).slice(0, 5); // 限制显示前5个结果
});

// 处理搜索
const handleSearch = () => {
  if (!searchQuery.value) return;
  
  router.push({
    path: '/tools',
    query: { search: searchQuery.value }
  });
};

// 选择搜索结果
const selectResult = (tool) => {
  router.push(tool.path);
  searchQuery.value = '';
  showSearchResults.value = false;
};

// 处理点击外部关闭搜索结果
const handleClickOutside = (event) => {
  const searchContainer = document.querySelector('.search-container');
  if (searchContainer && !searchContainer.contains(event.target)) {
    showSearchResults.value = false;
  }
};

// 监听点击事件
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// 分类统计
const categoryStats = computed(() => {
  return categories.map(category => {
    const toolCount = tools.filter(tool => 
      tool.categories.includes(category.id)
    ).length
    return {
      ...category,
      toolCount
    }
  })
})

// 热门工具
const hotTools = computed(() => getHotTools())

// 最新工具
const newTools = computed(() => getNewTools())

// 热门标签数据
const hotTags = [
  { id: 'json', name: 'JSON格式化', path: '/tools/json-formatter' },
  { id: 'image', name: '图片压缩', path: '/tools/image-compress' },
  { id: 'pdf', name: 'PDF转换', path: '/tools/pdf-convert' },
  { id: 'time', name: '时间戳', path: '/tools/timestamp' }
]

// 快速访问工具数据
const quickTools = [
  { id: 'json', name: 'JSON格式化', icon: '📝', path: '/tools/json-formatter' },
  { id: 'image', name: '图片压缩', icon: '🖼️', path: '/tools/image-compress' },
  { id: 'pdf', name: 'PDF转换', icon: '📄', path: '/tools/pdf-convert' },
  { id: 'time', name: '时间戳转换', icon: '⏰', path: '/tools/timestamp' },
  { id: 'encrypt', name: '加密解密', icon: '🔒', path: '/tools/encrypt' },
  { id: 'qrcode', name: '二维码生成', icon: '📱', path: '/tools/qrcode' }
]

// 最新更新数据
const latestUpdates = [
  {
    id: 1,
    type: '新功能',
    title: 'JSON格式化工具更新',
    description: '新增代码高亮和语法检查功能',
    date: '2024-03-20'
  }
  // ... 可以添加更多更新记录
]

// 工具分类数据
const toolCategories = [
  {
    id: 'dev',
    name: '开发工具',
    icon: '💻',
    count: 12,
    tags: ['JSON', 'Base64', '时间戳']
  },
  {
    id: 'image',
    name: '图片工具',
    icon: '🎨',
    count: 8,
    tags: ['压缩', '转换', '裁剪']
  },
  {
    id: 'doc',
    name: '文档工具',
    icon: '📄',
    count: 10,
    tags: ['PDF转换', 'Word', 'Excel']
  },
  {
    id: 'encrypt',
    name: '加密工具',
    icon: '🔒',
    count: 6,
    tags: ['MD5', 'Base64', 'AES']
  }
]

// 特性数据
const features = [
  {
    id: 'speed',
    icon: '🚀',
    title: '快速高效',
    description: '所有工具都经过优化，确保处理速度'
  },
  {
    id: 'security',
    icon: '🔒',
    title: '安全可靠',
    description: '本地运算，数据无需上传服务器'
  },
  {
    id: 'easy',
    icon: '💻',
    title: '便捷使用',
    description: '无需下载安装，随时随地使用'
  },
  {
    id: 'free',
    icon: '🆓',
    title: '完全免费',
    description: '所有工具免费使用，无需付费'
  }
]
</script>
  
<style lang="scss" scoped>
/* 容器样式 */
main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

/* Hero部分样式 */
.hero-section {
  background: linear-gradient(to bottom, var(--bg-main), var(--bg-card));
  margin: -2rem -1rem 2rem;
  padding: 4rem 1rem;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.hero-content h1 {
  font-size: 2.5rem;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.hero-content .subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

/* 搜索框 */
.search-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 2rem auto 0;
}

.search-input {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  
  &:focus-within {
    border-color: var(--primary);
    box-shadow: 0 2px 12px rgba(var(--primary-rgb), 0.2);
  }
  
  input {
    flex: 1;
    border: none;
    padding: 0.75rem;
    font-size: 1rem;
    outline: none;
    background: transparent;
    color: var(--text-primary);
    
    &::placeholder {
      color: var(--text-secondary);
    }
  }
  
  .search-btn {
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.75rem;
    cursor: pointer;
    transition: background 0.2s;
    
    &:hover {
      background: var(--primary-dark);
    }
    
    .search-icon {
      font-size: 1.25rem;
    }
  }
}

/* 搜索结果下拉框 */
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-top: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 10;
  
  .result-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    text-decoration: none;
    color: var(--text-primary);
    transition: background 0.2s;
    
    &:hover {
      background: var(--bg-hover);
    }
    
    &:not(:last-child) {
      border-bottom: 1px solid var(--border-color);
    }
    
    .result-icon {
      font-size: 1.5rem;
    }
    
    .result-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      
      .result-name {
        font-weight: 500;
        color: var(--text-primary);
      }
      
      .result-desc {
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
    }
  }
}

/* 热门标签 */
.hot-tags {
  margin-top: 1.5rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
  
  span {
    margin-right: 0.5rem;
  }
  
  a {
    color: var(--primary);
    text-decoration: none;
    margin: 0 0.5rem;
    transition: color 0.2s;
    
    &:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }
  }
}

/* 快速访问区域 */
.quick-access {
  padding: 1.5rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.view-all {
  color: var(--primary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.view-all:hover {
  color: var(--primary-dark);
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.quick-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;
}

.quick-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.quick-icon {
  font-size: 2rem;
  line-height: 1;
}

.quick-text {
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-weight: 500;
}

/* 分类区域 */
.category-section {
  margin-top: 3rem;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.category-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;
}

.category-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.category-icon {
  font-size: 2rem;
  line-height: 1;
}

.category-content {
  flex: 1;
}

.category-content h3 {
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.category-content p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-tags span {
  padding: 0.25rem 0.75rem;
  background: var(--bg-main);
  color: var(--text-secondary);
  border-radius: 16px;
  font-size: 0.75rem;
}

/* 特性区域 */
.features-section {
  margin-top: 3rem;
  padding: 1.5rem 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
  border-color: var(--primary);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
  transition: transform 0.2s;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

.feature-card h3 {
  margin-bottom: 0.75rem;
  color: var(--text-primary);
  font-weight: 600;
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.6;
}

/* 最新更新区域 */
.latest-section {
  margin-top: 3rem;
}

.latest-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.update-card {
  position: relative;
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.2s;
}

.update-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
  box-shadow: 0 8px 16px -6px rgba(0, 0, 0, 0.1);
}

.update-badge {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  padding: 0.25rem 0.75rem;
  background: var(--success-50);
  color: var(--success);
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
}

.update-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding-right: 5rem;
}

.update-card p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.update-card time {
  display: inline-block;
  color: var(--text-tertiary);
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: var(--bg-main);
  border-radius: 12px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 1rem;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-content .subtitle {
    font-size: 1rem;
  }

  .search-container {
    max-width: 100%;
    padding: 0 1rem;
  }

  .search-input {
    input {
      font-size: 0.875rem;
    }
    
    .search-btn {
      padding: 0.625rem;
      
      .search-icon {
        font-size: 1rem;
      }
    }
  }

  .search-results {
    position: fixed;
    top: 72px;
    left: 1rem;
    right: 1rem;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: var(--bg-card);
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--border-color);
      border-radius: 3px;
      
      &:hover {
        background: var(--text-secondary);
      }
    }
  }

  .category-section {
    margin-top: 2rem;
  }

  .features-section {
    margin-top: 2rem;
    padding: 1rem 0;
  }

  .latest-section {
    margin-top: 2rem;
  }

  .category-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  .quick-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding: 2rem 1rem;
  }

  .hero-content h1 {
    font-size: 1.75rem;
  }

  .search-input {
    flex-direction: column;
    gap: 0.5rem;
    
    input {
      width: 100%;
      padding: 0.875rem 1.25rem;
    }
    
    .search-btn {
      width: 100%;
      padding: 0.875rem 1.25rem;
    }
  }

  .category-section {
    margin-top: 1.5rem;
  }

  .features-section {
    margin-top: 1.5rem;
    padding: 0.75rem 0;
  }

  .latest-section {
    margin-top: 1.5rem;
  }

  .hot-tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    padding: 0 1rem;
    
    span {
      width: 100%;
      margin-bottom: 0.5rem;
    }
    
    a {
      margin: 0;
    }
  }

  main {
    padding: 1rem;
  }

  .category-grid {
    grid-template-columns: 1fr;
  }

  .tool-filters {
    overflow-x: auto;
    padding-bottom: 0.5rem;
    margin: -0.5rem -1rem 1rem;
    padding: 0.5rem 1rem;
  }

  .tool-filters button {
    white-space: nowrap;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 1.5rem;
  }

  .hero-content .subtitle {
    font-size: 0.875rem;
  }
}
</style> 