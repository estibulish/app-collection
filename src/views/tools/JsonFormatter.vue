<template>
  <div class="json-formatter">
    <div class="tool-header">
      <h1>JSON格式化工具</h1>
      <p class="tool-desc">在线JSON格式化工具，支持JSON压缩、美化、校验等功能</p>
      <div class="tool-actions">
        <FavoriteButton :tool-id="tool.id" />
      </div>
    </div>

    <div class="tool-actions">
      <div class="action-group">
        <button 
          class="action-btn" 
          :class="{ active: formatType === 'beautify' }"
          @click="setFormatType('beautify')"
        >
          美化
        </button>
        <button 
          class="action-btn" 
          :class="{ active: formatType === 'compress' }"
          @click="setFormatType('compress')"
        >
          压缩
        </button>
      </div>
      <div class="action-group">
        <button class="action-btn" @click="formatJson">
          格式化
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
          <span>输入JSON</span>
          <button class="sample-btn" @click="loadSample">加载示例</button>
        </div>
        <textarea
          ref="inputEditor"
          v-model="inputContent"
          class="json-editor"
          placeholder="请输入要格式化的JSON内容..."
          @input="validateJson"
        ></textarea>
      </div>

      <div class="editor-wrapper">
        <div class="editor-header">
          <span>格式化结果</span>
          <div class="format-info" v-if="formatInfo">
            {{ formatInfo }}
          </div>
        </div>
        <textarea
          ref="outputEditor"
          v-model="outputContent"
          class="json-editor"
          readonly
        ></textarea>
      </div>
    </div>

    <div class="error-message" v-if="errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFavoriteStore } from '../../stores/favorite'
import FavoriteButton from '../../components/FavoriteButton.vue'
import { getTool } from '../../config/tools'

const tool = getTool('json-formatter')
const favoriteStore = useFavoriteStore()

const formatType = ref('beautify')
const inputContent = ref('')
const outputContent = ref('')
const errorMessage = ref('')
const formatInfo = ref('')

const inputEditor = ref(null)
const outputEditor = ref(null)

const sampleJson = {
  "name": "JSON格式化工具",
  "version": "1.0.0",
  "description": "一个简单的JSON格式化工具示例",
  "features": [
    "美化",
    "压缩",
    "校验"
  ],
  "settings": {
    "indentSize": 2,
    "theme": "light",
    "autoFormat": true
  }
}

const setFormatType = (type) => {
  formatType.value = type
  formatJson()
}

const validateJson = () => {
  try {
    if (!inputContent.value.trim()) {
      errorMessage.value = ''
      outputContent.value = ''
      formatInfo.value = ''
      return
    }
    
    JSON.parse(inputContent.value)
    errorMessage.value = ''
    formatJson()
  } catch (e) {
    errorMessage.value = `JSON语法错误: ${e.message}`
    outputContent.value = ''
    formatInfo.value = ''
  }
}

const formatJson = () => {
  try {
    if (!inputContent.value.trim()) {
      return
    }

    const obj = JSON.parse(inputContent.value)
    
    if (formatType.value === 'beautify') {
      outputContent.value = JSON.stringify(obj, null, 2)
      formatInfo.value = '已格式化'
    } else {
      outputContent.value = JSON.stringify(obj)
      formatInfo.value = '已压缩'
    }
  } catch (e) {
    errorMessage.value = `格式化失败: ${e.message}`
  }
}

const clearContent = () => {
  inputContent.value = ''
  outputContent.value = ''
  errorMessage.value = ''
  formatInfo.value = ''
}

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(outputContent.value)
    formatInfo.value = '已复制到剪贴板'
    setTimeout(() => {
      formatInfo.value = formatType.value === 'beautify' ? '已格式化' : '已压缩'
    }, 2000)
  } catch (e) {
    formatInfo.value = '复制失败'
  }
}

const loadSample = () => {
  inputContent.value = JSON.stringify(sampleJson)
  validateJson()
}

onMounted(() => {
  // 如果URL中包含了JSON内容，自动加载
  const urlParams = new URLSearchParams(window.location.search)
  const jsonContent = urlParams.get('json')
  if (jsonContent) {
    try {
      inputContent.value = decodeURIComponent(jsonContent)
      validateJson()
    } catch (e) {
      errorMessage.value = '无法解析URL中的JSON内容'
    }
  }

  // 更新最后使用时间
  favoriteStore.updateLastUsed(tool.id)
})
</script>

<style lang="scss" scoped>
.json-formatter {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.tool-header {
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .tool-desc {
    color: var(--text-secondary);
    font-size: 1rem;
  }
}

.tool-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-group {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  &.active {
    background: var(--primary);
    border-color: var(--primary);
    color: white;
  }
}

.editor-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.editor-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.sample-btn {
  color: var(--primary);
  background: none;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
}

.format-info {
  color: var(--text-tertiary);
  font-size: 0.75rem;
}

.json-editor {
  flex: 1;
  min-height: 400px;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.2s;

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

.error-message {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .json-formatter {
    padding: 1.5rem 1rem;
  }

  .tool-header {
    margin-bottom: 1.5rem;

    h1 {
      font-size: 1.75rem;
    }
  }

  .tool-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .action-group {
    justify-content: center;
  }

  .json-editor {
    min-height: 300px;
  }
}

@media (max-width: 480px) {
  .tool-header h1 {
    font-size: 1.5rem;
  }

  .json-editor {
    font-size: 0.8125rem;
  }
}
</style> 