<template>
  <div class="text-case-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>文本转换工具</h1>
        <p class="tool-desc">在线文本格式转换工具，支持大小写转换、驼峰命名、下划线命名等多种格式</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="text-case" />
      </div>
    </div>

    <div class="converter-container">
      <div class="input-section">
        <div class="text-panel">
          <div class="panel-header">
            <h3>输入文本</h3>
            <div class="panel-actions">
              <button class="action-btn" @click="clearText">清空</button>
              <button class="action-btn" @click="pasteText">粘贴</button>
            </div>
          </div>
          <textarea 
            v-model="text"
            placeholder="请输入或粘贴要转换的文本"
          ></textarea>
        </div>
      </div>

      <div class="output-section">
        <div class="output-panel">
          <div class="panel-header">
            <h3>转换结果</h3>
            <div class="panel-actions">
              <select v-model="selectedCase">
                <option value="upper">大写</option>
                <option value="lower">小写</option>
                <option value="capitalize">首字母大写</option>
                <option value="camel">小驼峰</option>
                <option value="pascal">大驼峰</option>
                <option value="snake">下划线</option>
                <option value="kebab">连字符</option>
                <option value="constant">常量</option>
                <option value="dot">点号</option>
                <option value="path">路径</option>
              </select>
              <button class="action-btn" @click="copyResult">复制</button>
            </div>
          </div>
          <div class="output-content">{{ convertedText }}</div>
        </div>

        <div class="preview-panel">
          <h3>预览</h3>
          <div class="preview-grid">
            <div 
              v-for="type in previewTypes" 
              :key="type.value"
              class="preview-item"
              @click="selectedCase = type.value"
            >
              <div class="preview-label">{{ type.label }}</div>
              <div class="preview-value">{{ convert(text, type.value) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

const text = ref('')
const selectedCase = ref('camel')

const previewTypes = [
  { label: '大写', value: 'upper' },
  { label: '小写', value: 'lower' },
  { label: '首字母大写', value: 'capitalize' },
  { label: '小驼峰', value: 'camel' },
  { label: '大驼峰', value: 'pascal' },
  { label: '下划线', value: 'snake' },
  { label: '连字符', value: 'kebab' },
  { label: '常量', value: 'constant' },
  { label: '点号', value: 'dot' },
  { label: '路径', value: 'path' }
]

// 清空文本
const clearText = () => {
  text.value = ''
}

// 粘贴文本
const pasteText = async () => {
  try {
    const clipboardText = await navigator.clipboard.readText()
    text.value = clipboardText
  } catch (err) {
    console.error('粘贴失败:', err)
  }
}

// 复制结果
const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(convertedText.value)
    alert('已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 文本转换函数
const convert = (text, type) => {
  if (!text) return ''
  
  // 先将文本分割成单词
  const words = text
    .replace(/([a-z])([A-Z])/g, '$1 $2') // 驼峰分割
    .replace(/[_\-\.\/\\]/g, ' ') // 分隔符分割
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)

  switch (type) {
    case 'upper':
      return text.toUpperCase()
    case 'lower':
      return text.toLowerCase()
    case 'capitalize':
      return words.map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    case 'camel':
      return words.map((w, i) => i === 0 ? w : w[0].toUpperCase() + w.slice(1)).join('')
    case 'pascal':
      return words.map(w => w[0].toUpperCase() + w.slice(1)).join('')
    case 'snake':
      return words.join('_')
    case 'kebab':
      return words.join('-')
    case 'constant':
      return words.map(w => w.toUpperCase()).join('_')
    case 'dot':
      return words.join('.')
    case 'path':
      return words.join('/')
    default:
      return text
  }
}

// 转换后的文本
const convertedText = computed(() => convert(text.value, selectedCase.value))
</script>

<style lang="scss" scoped>
.text-case-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  .tool-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;

    .header-content {
      flex: 1;

      h1 {
        font-size: 1.8rem;
        margin: 0 0 0.5rem;
        color: var(--text-primary);
      }

      .tool-desc {
        margin: 0;
        color: var(--text-secondary);
      }
    }

    .tool-actions {
      margin-left: 2rem;
    }
  }

  .converter-container {
    display: grid;
    gap: 2rem;

    .text-panel, .output-panel, .preview-panel {
      background: var(--bg-card);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;

      h3 {
        font-size: 1.2rem;
        margin: 0 0 1rem;
        color: var(--text-primary);
      }

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        .panel-actions {
          display: flex;
          gap: 0.5rem;

          select {
            padding: 0.5rem;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--bg-color);
            color: var(--text-primary);

            &:focus {
              border-color: var(--primary);
              outline: none;
            }
          }
        }
      }

      textarea {
        width: 100%;
        height: 200px;
        padding: 1rem;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-color);
        color: var(--text-primary);
        resize: vertical;
        font-family: monospace;
        line-height: 1.5;

        &:focus {
          border-color: var(--primary);
          outline: none;
        }
      }

      .output-content {
        padding: 1rem;
        min-height: 100px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-color);
        color: var(--text-primary);
        font-family: monospace;
        line-height: 1.5;
        white-space: pre-wrap;
      }
    }

    .preview-panel {
      .preview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;

        .preview-item {
          padding: 1rem;
          background: var(--bg-color);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            border-color: var(--primary);
          }

          .preview-label {
            font-size: 0.9rem;
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
          }

          .preview-value {
            font-family: monospace;
            color: var(--text-primary);
            word-break: break-all;
          }
        }
      }
    }
  }

  .action-btn {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-color);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
  }
}
</style> 