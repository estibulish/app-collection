<template>
    <section class="hero-section">
      <div class="hero-content">
        <h1>便捷高效的在线工具集合</h1>
        <p class="subtitle">为提高工作效率而生</p>
        <div class="search-large">
          <input
            type="text"
            placeholder="搜索你需要的工具..."
            v-model="searchQuery"
          />
          <button type="button" @click="handleSearch">搜索</button>
        </div>
        <div class="hot-tags">
          <span>热门搜索：</span>
          <router-link to="/tools/json-formatter">JSON格式化</router-link>
          <router-link to="/tools/image-compress">图片压缩</router-link>
          <router-link to="/tools/pdf-convert">PDF转换</router-link>
          <router-link to="/tools/timestamp">时间戳</router-link>
        </div>
      </div>
    </section>

    <section class="quick-access">
      <div class="section-header">
        <h2>快速访问</h2>
        <router-link to="/tools" class="view-all">查看全部工具 →</router-link>
      </div>
      <div class="quick-grid">
        <router-link to="/tools/json-formatter" class="quick-card">
          <span class="quick-icon">📝</span>
          <span class="quick-text">JSON格式化</span>
        </router-link>
        <router-link to="/tools/image-compress" class="quick-card">
          <span class="quick-icon">🖼️</span>
          <span class="quick-text">图片压缩</span>
        </router-link>
        <router-link to="/tools/pdf-convert" class="quick-card">
          <span class="quick-icon">📄</span>
          <span class="quick-text">PDF转换</span>
        </router-link>
        <router-link to="/tools/timestamp" class="quick-card">
          <span class="quick-icon">⏰</span>
          <span class="quick-text">时间戳转换</span>
        </router-link>
        <router-link to="/tools/encrypt" class="quick-card">
          <span class="quick-icon">🔒</span>
          <span class="quick-text">加密解密</span>
        </router-link>
        <router-link to="/tools/qrcode" class="quick-card">
          <span class="quick-icon">📊</span>
          <span class="quick-text">二维码生成</span>
        </router-link>
      </div>
    </section>

    <section class="category-section">
      <div class="section-header">
        <h2>工具分类</h2>
      </div>
      <div class="category-grid">
        <router-link to="/tools?category=dev" class="category-card">
          <div class="category-icon">💻</div>
          <div class="category-content">
            <h3>开发工具</h3>
            <p>12个工具</p>
            <div class="category-tags">
              <span>JSON</span>
              <span>Base64</span>
              <span>时间戳</span>
            </div>
          </div>
        </router-link>
        <router-link to="/tools?category=image" class="category-card">
          <div class="category-icon">🎨</div>
          <div class="category-content">
            <h3>图片工具</h3>
            <p>8个工具</p>
            <div class="category-tags">
              <span>压缩</span>
              <span>转换</span>
              <span>裁剪</span>
            </div>
          </div>
        </router-link>
        <router-link to="/tools?category=doc" class="category-card">
          <div class="category-icon">📄</div>
          <div class="category-content">
            <h3>文档工具</h3>
            <p>10个工具</p>
            <div class="category-tags">
              <span>PDF转换</span>
              <span>Word</span>
              <span>Excel</span>
            </div>
          </div>
        </router-link>
        <router-link to="/tools?category=encrypt" class="category-card">
          <div class="category-icon">🔒</div>
          <div class="category-content">
            <h3>加密工具</h3>
            <p>6个工具</p>
            <div class="category-tags">
              <span>MD5</span>
              <span>Base64</span>
              <span>AES</span>
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
        <div class="feature-card">
          <span class="feature-icon">🚀</span>
          <h3>快速高效</h3>
          <p>所有工具都经过优化，确保处理速度</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🔒</span>
          <h3>安全可靠</h3>
          <p>本地运算，数据无需上传服务器</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">💻</span>
          <h3>便捷使用</h3>
          <p>无需下载安装，随时随地使用</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🆓</span>
          <h3>完全免费</h3>
          <p>所有工具免费使用，无需付费</p>
        </div>
      </div>
    </section>

    <section class="latest-section">
      <div class="section-header">
        <h2>最新更新</h2>
        <router-link to="/updates" class="view-all">查看更多 →</router-link>
      </div>
      <div class="latest-grid">
        <div class="update-card">
          <div class="update-badge">新功能</div>
          <h3>JSON格式化工具更新</h3>
          <p>新增代码高亮和语法检查功能</p>
          <time>2024-03-20</time>
        </div>
      </div>
    </section>
</template>
  
<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { categories, tools, getHotTools, getNewTools } from '../config/tools'

const router = useRouter();
const searchQuery = ref("");

const handleSearch = () => {
  if (searchQuery.value) {
    router.push({
      path: "/tools",
      query: { search: searchQuery.value },
    });
  }
};

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
.search-large {
  display: flex;
  gap: 0.75rem;
  margin: 2rem auto;
  max-width: 600px;
  padding: 0 1rem;
}

.search-large input {
  flex: 1;
  min-width: 0;
  padding: 1rem 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--bg-card);
  color: var(--text-primary);
  transition: all 0.2s;
}

.search-large input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-large input::placeholder {
  color: var(--text-tertiary);
}

.search-large button {
  padding: 1rem 2rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-large button:hover {
  background-color: var(--primary-dark);
}

/* 热门标签 */
.hot-tags {
  margin-top: 1.5rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.hot-tags span {
  margin-right: 0.5rem;
}

.hot-tags a {
  color: var(--primary);
  text-decoration: none;
  margin: 0 0.5rem;
  transition: color 0.2s;
}

.hot-tags a:hover {
  color: var(--primary-dark);
  text-decoration: underline;
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
}

.search-box:focus-within .search-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.search-category h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.search-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.hot-tag {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: var(--bg-main);
  border-radius: 16px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s;
}

.hot-tag:hover {
  background: var(--bg-hover);
  color: var(--primary);
}

.tag-icon {
  color: #ef4444;
}

.search-results h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 1rem 0 0.75rem;
  color: var(--text-primary);
}

.result-group h5 {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.result-item:hover {
  background: var(--bg-hover);
}

.result-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-main);
  border-radius: 8px;
  font-size: 1.25rem;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-title {
  display: block;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.result-desc {
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-tag {
  padding: 0.25rem 0.5rem;
  background: #fee2e2;
  color: #ef4444;
  border-radius: 12px;
  font-size: 0.75rem;
}

/* 工具过滤器 */
.tool-filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tool-filters button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.tool-filters button.active {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.tool-filters button:hover:not(.active) {
  border-color: var(--primary);
  color: var(--primary);
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

  .search-large {
    margin: 1.5rem auto;
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

  .search-dropdown {
    position: fixed;
    top: 72px;
    left: 1rem;
    right: 1rem;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
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

  .search-large {
    flex-direction: column;
    gap: 0.5rem;
  }

  .search-large input {
    padding: 0.875rem 1.25rem;
  }

  .search-large button {
    width: 100%;
    padding: 0.875rem 1.25rem;
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
  }

  .hot-tags span {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .hot-tags a {
    margin: 0;
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