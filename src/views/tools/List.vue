<template>
    <div class="tools-page">
        <div class="page-header">
            <div class="header-content">
                <h1>工具列表</h1>
                <p class="subtitle">发现并使用各种实用工具</p>
            </div>
            <div class="view-options">
                <button 
                    class="view-btn" 
                    :class="{ active: viewMode === 'grid' }"
                    @click="viewMode = 'grid'"
                >
                    <span class="view-icon">▤</span>
                    网格视图
                </button>
                <button 
                    class="view-btn"
                    :class="{ active: viewMode === 'list' }"
                    @click="viewMode = 'list'"
                >
                    <span class="view-icon">☰</span>
                    列表视图
                </button>
            </div>
        </div>

        <div class="tools-container">
            <aside class="tools-sidebar">
                <div class="filter-section">
                    <div class="filter-header">
                        <h3>筛选工具</h3>
                        <button class="clear-btn" @click="clearFilters">清除</button>
                    </div>
                    
                    <div class="filter-group">
                        <h4>工具分类</h4>
                        <div class="filter-options">
                            <label 
                                v-for="category in categories" 
                                :key="category.id"
                                class="filter-option"
                            >
                                <input 
                                    type="checkbox"
                                    v-model="selectedCategories"
                                    :value="category.id"
                                >
                                <span class="checkbox-custom"></span>
                                {{ category.name }}
                                <span class="count">({{ getCategoryCount(category.id) }})</span>
                            </label>
                        </div>
                    </div>

                    <div class="filter-group">
                        <h4>使用频率</h4>
                        <div class="filter-options">
                            <label class="filter-option">
                                <input 
                                    type="radio" 
                                    v-model="frequency" 
                                    value="all"
                                >
                                <span class="radio-custom"></span>
                                全部
                            </label>
                            <label class="filter-option">
                                <input 
                                    type="radio" 
                                    v-model="frequency" 
                                    value="frequent"
                                >
                                <span class="radio-custom"></span>
                                经常使用
                            </label>
                            <label class="filter-option">
                                <input 
                                    type="radio" 
                                    v-model="frequency" 
                                    value="recent"
                                >
                                <span class="radio-custom"></span>
                                最近使用
                            </label>
                        </div>
                    </div>
                </div>
            </aside>

            <div class="tools-content">
                <div class="tools-header">
                    <div class="tools-count">
                        共 <span>{{ filteredTools.length }}</span> 个工具
                    </div>
                    <div class="tools-sort">
                        <select v-model="sortBy" class="sort-select">
                            <option value="popular">按热度排序</option>
                            <option value="newest">最新添加</option>
                            <option value="name">按名称排序</option>
                        </select>
                    </div>
                </div>

                <div :class="['tools-grid', viewMode]">
                    <router-link 
                        v-for="tool in paginatedTools" 
                        :key="tool.id"
                        :to="tool.path"
                        class="tool-card"
                        :class="{ 'new': tool.isNew, 'popular': tool.isPopular }"
                    >
                        <div class="tool-card-header">
                            <span class="tool-icon">{{ tool.icon }}</span>
                            
                            <div class="tool-tags">
                                <span 
                                    v-for="tag in tool.tags" 
                                    :key="tag"
                                    class="tool-tag"
                                >{{ tag }}</span>
                                <span v-if="tool.isHot" class="tool-tag hot">热门</span>
                            </div>
                        </div>
                        <div class="tool-card-content">
                            <h3>{{ tool.name }}</h3>
                            <p>{{ tool.description }}</p>
                        </div>
                        <div class="tool-card-footer">
                            <div class="tool-stats">
                                <span class="stat-item">
                                    <span class="stat-icon">👁️</span>
                                    {{ tool.views }}
                                </span>
                                <!-- <span class="stat-item">
                                    <span class="stat-icon">⭐️</span>
                                    {{ tool.rating }}
                                </span> -->
                                <FavoriteButton :tool-id="tool.id" />
                            </div>
                            <span class="use-btn">使用工具</span>
                        </div>
                    </router-link>
                </div>
                <div class="pagination" v-if="totalPages > 1">
                    <button 
                        class="page-btn" 
                        :disabled="currentPage === 1"
                        @click="currentPage--"
                    >上一页</button>
                    <div class="page-numbers">
                        <button 
                            v-for="page in displayedPages" 
                            :key="page"
                            class="page-btn"
                            :class="{ active: currentPage === page }"
                            @click="currentPage = page"
                        >{{ page }}</button>
                        <span v-if="showEndEllipsis" class="page-dots">...</span>
                        <button 
                            v-if="showEndEllipsis"
                            class="page-btn"
                            @click="currentPage = totalPages"
                        >{{ totalPages }}</button>
                    </div>
                    <button 
                        class="page-btn"
                        :disabled="currentPage === totalPages"
                        @click="currentPage++"
                    >下一页</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { tools, categories, getToolsByCategory, searchTools } from '../../config/tools'
import FavoriteButton from '../../components/FavoriteButton.vue'

const route = useRoute()
const viewMode = ref('grid')
const selectedCategories = ref([])
const sortBy = ref('default')
const searchQuery = ref(route.query.search || '')
const frequency = ref('all')
const currentPage = ref(1)
const pageSize = 12

// 获取分类下的工具数量
const getCategoryCount = (categoryId) => {
  return tools.filter(tool => tool.categories.includes(categoryId)).length
}

// 清除筛选
const clearFilters = () => {
  selectedCategories.value = []
  frequency.value = 'all'
  sortBy.value = 'default'
}

// 过滤工具列表
const filteredTools = computed(() => {
  let result = [...tools]
  
  // 搜索过滤
  if (searchQuery.value) {
    result = searchTools(searchQuery.value)
  }
  
  // 分类过滤
  if (selectedCategories.value.length > 0) {
    result = result.filter(tool => 
      tool.categories.some(cat => selectedCategories.value.includes(cat))
    )
  }
  
  // 频率过滤
  if (frequency.value === 'frequent') {
    result = result.filter(tool => tool.isHot)
  } else if (frequency.value === 'recent') {
    result = result.filter(tool => tool.isNew)
  }
  
  // 排序
  if (sortBy.value === 'newest') {
    result.sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime))
  } else if (sortBy.value === 'hot') {
    result.sort((a, b) => b.isHot - a.isHot)
  } else if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  }
  
  return result
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(filteredTools.value.length / pageSize)
})

// 当前页的工具列表
const paginatedTools = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredTools.value.slice(start, end)
})

// 显示的页码范围
const displayedPages = computed(() => {
  const delta = 2 // 当前页前后显示的页码数
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= totalPages.value; i++) {
    if (
      i === 1 || 
      i === totalPages.value || 
      i >= currentPage.value - delta && 
      i <= currentPage.value + delta
    ) {
      range.push(i)
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return range
})

// 是否显示末尾省略号
const showEndEllipsis = computed(() => {
  return displayedPages.value[displayedPages.value.length - 1] < totalPages.value
})

// 监听筛选条件变化，重置页码
watch([selectedCategories, frequency, sortBy], () => {
  currentPage.value = 1
})
</script>

<style lang="scss" scoped>
/* 页面头部 */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.header-content h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.header-content .subtitle {
    color: var(--text-secondary);
    font-size: 1.125rem;
}

/* 工具列表容器 */
.tools-container {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
}

/* 侧边栏筛选 */
.tools-sidebar {
    position: sticky;
    top: 84px;
    height: fit-content;
}

.filter-section {
    background: var(--bg-card);
    border-radius: 12px;
    border: 1px solid var(--border-color);
    overflow: hidden;
}

.filter-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.filter-header h3 {
    font-size: 1rem;
    font-weight: 600;
}

.clear-btn {
    color: var(--primary);
    background: none;
    border: none;
    font-size: 0.875rem;
    cursor: pointer;
}

.filter-group {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.filter-group:last-child {
    border-bottom: none;
}

.filter-group h4 {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 1rem;
}

.filter-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.filter-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
}

.filter-option label {
    color: var(--text-secondary);
    font-size: 0.875rem;
    user-select: none;
}

.filter-option:hover label {
    color: var(--text-primary);
}

/* 隐藏原生input */
.filter-option input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

/* 自定义复选框和单选框 */
.checkbox-custom,
.radio-custom {
    width: 18px;
    height: 18px;
    border: 2px solid var(--border-color);
    border-radius: 4px;
    position: relative;
    transition: all 0.2s;
}

.radio-custom {
    border-radius: 50%;
}

/* 悬停效果 */
.filter-option:hover .checkbox-custom,
.filter-option:hover .radio-custom {
    border-color: var(--primary);
}

/* 选中状态 */
.filter-option input:checked ~ .checkbox-custom {
    background-color: var(--primary);
    border-color: var(--primary);
}

.filter-option input:checked ~ .checkbox-custom::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 2px;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.filter-option input:checked ~ .radio-custom {
    border-color: var(--primary);
}

.filter-option input:checked ~ .radio-custom::after {
    content: '';
    position: absolute;
    left: 3px;
    top: 3px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--primary);
}

/* 计数标签 */
.count {
    color: var(--text-tertiary);
    font-size: 0.75rem;
    margin-left: auto;
}

/* 工具内容区 */
.tools-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.tools-count {
    color: var(--text-secondary);
    font-size: 0.875rem;
}

.tools-count span {
    color: var(--text-primary);
    font-weight: 600;
}

.sort-select {
    padding: 0.5rem 2rem 0.5rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 0.875rem;
    background-color: var(--bg-card);
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 16px;
}

/* 工具卡片优化 */
.tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.tool-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
}

.tool-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
}

.tool-card-header {
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.tool-icon {
    font-size: 2rem;
}

.tool-tags {
    display: flex;
    gap: 0.5rem;
}

.tool-tag {
    padding: 0.25rem 0.75rem;
    background-color: var(--bg-main);
    color: var(--text-secondary);
    border-radius: 16px;
    font-size: 0.75rem;
}

.tool-tag.hot {
    background-color: #fee2e2;
    color: #ef4444;
}

.tool-card-content {
    padding: 0 1.5rem;
}

.tool-card-content h3 {
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
}

.tool-card-content p {
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
}


.tool-card-footer {
    padding: 1.5rem;
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tool-stats {
    display: flex;
    gap: 1rem;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--text-secondary);
    font-size: 0.75rem;
}

.use-btn {
    padding: 0.5rem 1rem;
    background-color: var(--primary);
    color: white;
    border-radius: 6px;
    font-size: 0.875rem;
    transition: background-color 0.2s;
}

/* 分页优化 */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
    padding: 1rem 0;
}

.page-numbers {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.page-btn {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-card);
    color: var(--text-secondary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
        border-color: var(--primary);
        color: var(--primary);
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    &.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
    }
}

.page-dots {
    color: var(--text-tertiary);
    padding: 0 0.5rem;
}

/* 响应式优化 */
@media (max-width: 1024px) {
    .tools-container {
        grid-template-columns: 1fr;
    }

    .tools-sidebar {
        position: static;
        margin-bottom: 2rem;
    }

    .filter-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }

    .filter-group {
        border: none;
    }
}

@media (max-width: 640px) {
    .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }

    .tools-header {
        flex-direction: column;
        gap: 1rem;
    }

    .sort-select {
        width: 100%;
    }

    .pagination {
        flex-wrap: wrap;
        gap: 0.5rem;
    }
}

@media (max-width: 768px) {
    .page-header {
        padding: 1.5rem 1rem;
    }

    .tools-container {
        padding: 0 1rem;
    }

    .tools-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }

    .sort-select {
        width: 100%;
    }

    .filter-section {
        border-radius: 8px;
        padding: 1.25rem;
    }

    .tool-card {
        padding: 1.25rem;
    }

    .tool-icon {
        font-size: 1.75rem;
    }

    .pagination {
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .page-numbers {
        order: -1;
        width: 100%;
        justify-content: center;
        margin-bottom: 0.5rem;
    }
    
    .page-btn {
        padding: 0.375rem 0.75rem;
    }
}

@media (max-width: 480px) {
    .header-content h1 {
        font-size: 1.75rem;
    }

    .subtitle {
        font-size: 0.875rem;
    }

    .filter-section {
        padding: 1rem;
    }

    .tool-card {
        padding: 1rem;
    }
}

/* 视图切换按钮 */
.view-options {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
}

.view-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-card);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
}

.view-btn.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

.view-btn:hover:not(.active) {
    border-color: var(--primary);
    color: var(--primary);
}


.use-btn {
    padding: 0.5rem 1rem;
    background: var(--primary-50);
    color: var(--primary);
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;
}

.tool-card:hover .use-btn {
    background: var(--primary);
    color: white;
}

/* 分页样式补充 */
.page-btn {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-card);
    color: var(--text-secondary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
    border-color: var(--primary);
    color: var(--primary);
}

.page-btn.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

.page-dots {
    color: var(--text-tertiary);
    padding: 0 0.5rem;
}

.page-numbers {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

/* 导航下拉菜单 */
.dropdown-content {
    padding: 1rem;
}

.dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.dropdown-header h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
}

/* 工具卡片补充样式 */
.tool-icon {
    font-size: 2rem;
    line-height: 1;
    color: var(--text-primary);
}

/* 工具列表页头部补充 */
.subtitle {
    color: var(--text-secondary);
    font-size: 1rem;
    margin-bottom: 1rem;
}

/* 工具过滤器补充 */
/* .filter-option label {
    color: var(--text-secondary);
    font-size: 0.875rem;
    user-select: none;
}

.filter-option:hover label {
    color: var(--text-primary);
}

.filter-option:hover .checkbox-custom,
.filter-option:hover .radio-custom {
    border-color: var(--primary);
} */

/* 工具排序补充 */
.sort-select:hover {
    border-color: var(--primary);
}

.sort-select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 视图切换按钮补充 */
.view-icon {
    font-size: 1.25rem;
    line-height: 1;
}

/* 工具卡片状态样式 */
.tool-card.new::before {
    content: 'NEW';
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.25rem 0.5rem;
    background: #10b981;
    color: white;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
}

.tool-card.popular::before {
    content: '热门';
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.25rem 0.5rem;
    background: #f59e0b;
    color: white;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
}


.stat-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    color: var(--text-secondary);
    font-size: 0.75rem;
}

.stat-icon {
    font-size: 1rem;
    line-height: 1;
}

/* 工具列表页面布局 */
.tools-layout {
    min-height: calc(100vh - 72px - 320px); /* 视口高度减去头部和页脚 */
}

/* 工具列表分类标签 */
.category-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0;
}

.category-tag {
    padding: 0.375rem 0.75rem;
    background: var(--bg-main);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    color: var(--text-secondary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
}

.category-tag:hover,
.category-tag.active {
    background: var(--primary-50);
    border-color: var(--primary);
    color: var(--primary);
}

/* 响应式补充 */
@media (max-width: 768px) {
    .tools-layout {
        min-height: calc(100vh - 64px - 280px);
    }

    .category-tags {
        margin: 0.75rem 0;
        padding: 0.5rem;
        overflow-x: auto;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
    }

    .category-tag {
        padding: 0.25rem 0.625rem;
        font-size: 0.8125rem;
    }

    .tool-stats {
        margin-top: 0.75rem;
        padding-top: 0.75rem;
    }
}

/* 添加列表视图样式 */
.tools-grid.list {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .tool-card {
        display: flex;
        align-items: center;
        padding: 1rem;

        .tool-card-header {
            margin-right: 1rem;
        }

        .tool-card-content {
            flex: 1;
        }

        .tool-card-footer {
            margin-left: auto;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
    }
}

/* 添加过渡动画 */
.tools-grid {
    transition: all 0.3s ease;
}

.tool-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
</style> 