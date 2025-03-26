<template>
  <div class="text-sort-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>文本排序工具</h1>
        <p class="tool-desc">在线文本排序工具，支持按字母、数字、长度等多种方式排序</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="text-sort" />
      </div>
    </div>

    <div class="sort-container">
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
            placeholder="请输入或粘贴要排序的文本，每行一个内容"
          ></textarea>
        </div>
      </div>

      <div class="options-section">
        <label>
          <span>排序方式</span>
          <select v-model="sortMode">
            <option value="alpha">按字母</option>
            <option value="length">按长度</option>
            <option value="number">按数字</option>
            <option value="random">随机排序</option>
          </select>
        </label>
        <label>
          <span>排序顺序</span>
          <select v-model="sortOrder">
            <option value="asc">升序</option>
            <option value="desc">降序</option>
          </select>
        </label>
        <label>
          <span>忽略空白</span>
          <input type="checkbox" v-model="ignoreWhitespace">
        </label>
        <label>
          <span>忽略大小写</span>
          <input type="checkbox" v-model="ignoreCase">
        </label>
        <button class="sort-btn" @click="sort">开始排序</button>
      </div>

      <div class="result-section">
        <div class="result-panel">
          <div class="panel-header">
            <h3>排序结果</h3>
            <div class="panel-actions">
              <button class="action-btn" @click="copyResult">复制结果</button>
            </div>
          </div>
          <div class="result-content">{{ result }}</div>
          <div class="result-stats">
            <div class="stat-item">
              <span class="stat-label">总行数</span>
              <span class="stat-value">{{ lineCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">有效行数</span>
              <span class="stat-value">{{ validLineCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">空行数</span>
              <span class="stat-value">{{ emptyLineCount }}</span>
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
const sortMode = ref('alpha')
const sortOrder = ref('asc')
const ignoreWhitespace = ref(true)
const ignoreCase = ref(false)
const result = ref('')

// 清空文本
const clearText = () => {
  text.value = ''
  result.value = ''
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
    await navigator.clipboard.writeText(result.value)
    alert('已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 排序处理
const sort = () => {
  if (!text.value) return

  let lines = text.value.split('\n')

  // 预处理
  lines = lines.map(line => {
    let processed = line
    if (ignoreWhitespace.value) {
      processed = processed.trim()
    }
    if (ignoreCase.value) {
      processed = processed.toLowerCase()
    }
    return { original: line, processed }
  })

  // 排序
  lines.sort((a, b) => {
    if (!a.processed && !b.processed) return 0
    if (!a.processed) return 1
    if (!b.processed) return -1

    let comparison = 0
    switch (sortMode.value) {
      case 'alpha':
        comparison = a.processed.localeCompare(b.processed)
        break
      case 'length':
        comparison = a.processed.length - b.processed.length
        break
      case 'number':
        const numA = parseFloat(a.processed) || 0
        const numB = parseFloat(b.processed) || 0
        comparison = numA - numB
        break
      case 'random':
        comparison = Math.random() - 0.5
        break
    }

    return sortOrder.value === 'desc' ? -comparison : comparison
  })

  // 恢复原始文本
  result.value = lines.map(line => line.original).join('\n')
}

// 统计信息
const lineCount = computed(() => {
  return text.value ? text.value.split('\n').length : 0
})

const validLineCount = computed(() => {
  return text.value ? text.value.split('\n').filter(line => line.trim()).length : 0
})

const emptyLineCount = computed(() => lineCount.value - validLineCount.value)
</script>

<style lang="scss" scoped>
.text-sort-page {
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

  .sort-container {
    display: grid;
    gap: 2rem;

    .text-panel, .result-panel {
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

      .result-content {
        padding: 1rem;
        min-height: 200px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-color);
        color: var(--text-primary);
        font-family: monospace;
        line-height: 1.5;
        white-space: pre-wrap;
      }

      .result-stats {
        display: flex;
        gap: 2rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          .stat-label {
            color: var(--text-secondary);
          }

          .stat-value {
            font-weight: 500;
            color: var(--text-primary);
          }
        }
      }
    }

    .options-section {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
      background: var(--bg-card);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        span {
          color: var(--text-primary);
        }

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

      .sort-btn {
        margin-left: auto;
        padding: 0.5rem 2rem;
        border: none;
        border-radius: 4px;
        background: var(--primary);
        color: white;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: var(--primary-dark);
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