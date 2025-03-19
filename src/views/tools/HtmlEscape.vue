<template>
  <div class="html-escape">
    <div class="tool-header">
      <h1>HTML转义工具</h1>
      <p class="tool-desc">在线HTML字符转义/反转义工具，支持特殊字符与HTML实体的相互转换</p>
      <div class="tool-actions">
        <FavoriteButton tool-id="html-escape" />
      </div>
    </div>

    <div class="tool-actions">
      <div class="action-group">
        <button 
          class="action-btn" 
          :class="{ active: mode === 'encode' }"
          @click="mode = 'encode'"
        >
          转义
        </button>
        <button 
          class="action-btn" 
          :class="{ active: mode === 'decode' }"
          @click="mode = 'decode'"
        >
          反转义
        </button>
      </div>
      <div class="action-group">
        <button class="action-btn" @click="handleConvert">
          转换
        </button>
        <button class="action-btn" @click="clearContent">
          清空
        </button>
        <button class="action-btn" @click="copyResult">
          复制
        </button>
      </div>
    </div>

    <div class="editor-container">
      <div class="editor-wrapper">
        <div class="editor-header">
          <span>{{ mode === 'encode' ? '输入HTML' : '输入转义文本' }}</span>
          <button class="sample-btn" @click="loadSample">
            <span class="sample-icon">📝</span>
            加载示例
          </button>
        </div>
        <textarea
          v-model="inputContent"
          class="html-editor"
          :placeholder="mode === 'encode' ? '请输入要转义的HTML内容...' : '请输入要反转义的文本...'"
        ></textarea>
      </div>

      <div class="editor-wrapper">
        <div class="editor-header">
          <span>转换结果</span>
          <div class="format-info" v-if="formatInfo">
            {{ formatInfo }}
          </div>
        </div>
        <textarea
          v-model="outputContent"
          class="html-editor"
          readonly
        ></textarea>
      </div>
    </div>

    <div class="preview-section" v-if="mode === 'decode' && outputContent">
      <div class="preview-header">
        <h3>预览效果</h3>
        <div class="preview-actions">
          <button 
            class="preview-btn"
            :class="{ active: previewMode === 'rendered' }"
            @click="previewMode = 'rendered'"
          >
            渲染视图
          </button>
          <button 
            class="preview-btn"
            :class="{ active: previewMode === 'source' }"
            @click="previewMode = 'source'"
          >
            源代码
          </button>
        </div>
      </div>
      <div class="preview-content">
        <div v-if="previewMode === 'rendered'" v-html="outputContent"></div>
        <pre v-else><code>{{ outputContent }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFavoriteStore } from '../../stores/favorite'
import FavoriteButton from '../../components/FavoriteButton.vue'
import { getTool } from '../../config/tools'

const tool = getTool('html-escape')
const favoriteStore = useFavoriteStore()

const mode = ref('encode')
const previewMode = ref('rendered')
const inputContent = ref('')
const outputContent = ref('')
const formatInfo = ref('')

// HTML实体映射表
const htmlEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;',
  ' ': '&nbsp;'
}

// 反向映射表
const reverseEntities = Object.fromEntries(
  Object.entries(htmlEntities).map(([key, value]) => [value, key])
)

// 转义HTML
const escapeHtml = (text) => {
  return text.replace(/[&<>"'` ]/g, char => htmlEntities[char])
}

// 反转义HTML
const unescapeHtml = (text) => {
  return text.replace(/&[#\w]+;/g, entity => {
    if (reverseEntities[entity]) {
      return reverseEntities[entity]
    }
    // 处理数字实体
    if (entity.match(/&#\d+;/)) {
      const code = entity.match(/&#(\d+);/)[1]
      return String.fromCharCode(code)
    }
    return entity
  })
}

// 处理转换
const handleConvert = () => {
  if (!inputContent.value.trim()) {
    formatInfo.value = '请输入内容'
    return
  }

  try {
    outputContent.value = mode.value === 'encode' 
      ? escapeHtml(inputContent.value)
      : unescapeHtml(inputContent.value)
    
    formatInfo.value = mode.value === 'encode' ? '已转义' : '已反转义'
    setTimeout(() => {
      formatInfo.value = ''
    }, 2000)
  } catch (error) {
    formatInfo.value = '转换失败'
  }
}

// 复制结果
const copyResult = async () => {
  if (!outputContent.value) {
    formatInfo.value = '没有可复制的内容'
    return
  }

  try {
    await navigator.clipboard.writeText(outputContent.value)
    formatInfo.value = '已复制'
    setTimeout(() => {
      formatInfo.value = ''
    }, 2000)
  } catch (e) {
    formatInfo.value = '复制失败'
  }
}

// 清空内容
const clearContent = () => {
  inputContent.value = ''
  outputContent.value = ''
  formatInfo.value = ''
}

// 加载示例
const loadSample = () => {
  if (mode.value === 'encode') {
    inputContent.value = '<div class="example">\n  <h1>Hello World!</h1>\n  <p>This is a "sample" text with \'special\' characters & symbols.</p>\n</div>'
  } else {
    inputContent.value = '&lt;div class=&quot;example&quot;&gt;\n  &lt;h1&gt;Hello World!&lt;/h1&gt;\n  &lt;p&gt;This is a &quot;sample&quot; text with &#39;special&#39; characters &amp; symbols.&lt;/p&gt;\n&lt;/div&gt;'
  }
  handleConvert()
}

onMounted(() => {
  // 更新最后使用时间
  favoriteStore.updateLastUsed(tool.id)
})
</script>

<style lang="scss" scoped>
.html-escape {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.tool-header {
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .tool-desc {
    color: var(--text-secondary);
  }
}

.tool-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  .action-group {
    display: flex;
    gap: 0.5rem;
  }
}

.action-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
  
  &.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }
}

.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.editor-wrapper {
  display: flex;
  flex-direction: column;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  span {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
}

.sample-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  .sample-icon {
    font-size: 1rem;
    line-height: 1;
  }
  
  &:hover {
    border-color: var(--primary);
    color: var(--primary);
    background: var(--primary-50);
  }
  
  &:active {
    transform: translateY(1px);
  }
}

.html-editor {
  flex: 1;
  min-height: 300px;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }
  
  &[readonly] {
    background: var(--bg-main);
    cursor: default;
  }
}

.preview-section {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  
  h3 {
    font-size: 1rem;
    margin: 0;
  }
}

.preview-actions {
  display: flex;
  gap: 0.5rem;
}

.preview-btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
  
  &.active {
    background: var(--primary-50);
    color: var(--primary);
    border-color: var(--primary);
  }
}

.preview-content {
  padding: 1rem;
  background: var(--bg-card);
  min-height: 200px;
  overflow: auto;
  
  pre {
    margin: 0;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    white-space: pre-wrap;
  }
}

@media (max-width: 768px) {
  .html-escape {
    padding: 1rem;
  }
  
  .editor-container {
    grid-template-columns: 1fr;
  }
  
  .tool-actions {
    flex-direction: column;
  }
  
  .action-group {
    justify-content: center;
  }
  
  .sample-btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.8125rem;
    
    .sample-icon {
      font-size: 0.875rem;
    }
  }
}
</style> 