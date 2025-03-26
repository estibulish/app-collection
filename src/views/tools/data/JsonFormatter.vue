<template>
  <div class="json-formatter-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>JSON 格式化工具</h1>
        <p class="tool-desc">在线 JSON 格式化、压缩、校验工具，支持语法高亮和错误提示</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="json-formatter" />
      </div>
    </div>

    <div class="formatter-container">
      <div class="editor-section">
        <div class="editor-header">
          <h3>输入 JSON</h3>
          <div class="editor-actions">
            <button class="action-btn" @click="formatJson">
              格式化
            </button>
            <button class="action-btn" @click="compressJson">
              压缩
            </button>
            <button class="action-btn" @click="clearJson">
              清空
            </button>
          </div>
        </div>
        <div class="editor-content">
          <textarea 
            v-model="inputJson"
            placeholder="请输入要格式化的 JSON 字符串"
            spellcheck="false"
          ></textarea>
        </div>
      </div>

      <div class="result-section">
        <div class="result-header">
          <h3>格式化结果</h3>
          <div class="result-info">
            <span v-if="jsonError" class="error-badge">
              {{ jsonError }}
            </span>
            <span v-else class="valid-badge">
              有效的 JSON
            </span>
            <button class="copy-btn" @click="copyResult">
              复制
            </button>
          </div>
        </div>
        <div class="result-content" v-html="highlightedJson"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

const inputJson = ref('')
const jsonError = ref('')

// 格式化 JSON
const formatJson = () => {
  if (!inputJson.value) {
    jsonError.value = '请输入 JSON 字符串'
    return
  }

  try {
    const parsed = JSON.parse(inputJson.value)
    inputJson.value = JSON.stringify(parsed, null, 2)
    jsonError.value = ''
  } catch (error) {
    jsonError.value = `JSON 语法错误: ${error.message}`
  }
}

// 压缩 JSON
const compressJson = () => {
  if (!inputJson.value) {
    jsonError.value = '请输入 JSON 字符串'
    return
  }

  try {
    const parsed = JSON.parse(inputJson.value)
    inputJson.value = JSON.stringify(parsed)
    jsonError.value = ''
  } catch (error) {
    jsonError.value = `JSON 语法错误: ${error.message}`
  }
}

// 语法高亮
const highlightedJson = computed(() => {
  if (!inputJson.value) return ''
  
  try {
    const parsed = JSON.parse(inputJson.value)
    const formatted = JSON.stringify(parsed, null, 2)
    
    return formatted
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = 'number'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key'
          } else {
            cls = 'string'
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean'
        } else if (/null/.test(match)) {
          cls = 'null'
        }
        return `<span class="${cls}">${match}</span>`
      })
  } catch (error) {
    return ''
  }
})

// 清空输入
const clearJson = () => {
  inputJson.value = ''
  jsonError.value = ''
}

// 复制结果
const copyResult = () => {
  if (!inputJson.value) return
  
  navigator.clipboard.writeText(inputJson.value)
    .then(() => {
      alert('已复制到剪贴板')
    })
    .catch(err => {
      console.error('复制失败:', err)
    })
}
</script>

<style lang="scss" scoped>
.json-formatter-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  .formatter-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    .editor-section, .result-section {
      background: var(--bg-card);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;

      .editor-header, .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h3 {
          font-size: 1.2rem;
          margin: 0;
          color: var(--text-primary);
        }
      }

      .editor-actions {
        display: flex;
        gap: 0.5rem;

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

      .editor-content {
        textarea {
          width: 100%;
          min-height: 400px;
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.9rem;
          line-height: 1.5;
          resize: vertical;
          background: var(--bg-color);
          color: var(--text-primary);

          &:focus {
            border-color: var(--primary);
            outline: none;
          }
        }
      }

      .result-info {
        display: flex;
        align-items: center;
        gap: 1rem;

        .error-badge {
          padding: 0.25rem 0.5rem;
          background: #fef0f0;
          color: #f56c6c;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .valid-badge {
          padding: 0.25rem 0.5rem;
          background: #f0f9eb;
          color: var(--primary);
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .copy-btn {
          padding: 0.25rem 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background: var(--bg-color);
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;

          &:hover {
            border-color: var(--primary);
            color: var(--primary);
          }
        }
      }

      .result-content {
        padding: 1rem;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-color);
        font-family: monospace;
        font-size: 0.9rem;
        line-height: 1.5;
        white-space: pre;
        overflow-x: auto;

        :deep(.string) { color: #42b983; }
        :deep(.number) { color: #f08d49; }
        :deep(.boolean) { color: #7c4dff; }
        :deep(.null) { color: #ff4081; }
        :deep(.key) { color: #409eff; }
      }
    }
  }
}
</style> 