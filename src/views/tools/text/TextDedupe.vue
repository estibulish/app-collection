<template>
  <div class="text-dedupe-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>文本去重工具</h1>
        <p class="tool-desc">在线文本去重工具，帮助您快速去除重复的行或内容</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="text-dedupe" />
      </div>
    </div>

    <div class="dedupe-container">
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
            placeholder="请输入或粘贴要去重的文本，每行一个内容"
          ></textarea>
        </div>
      </div>

      <div class="options-section">
        <label>
          <span>去重方式</span>
          <select v-model="dedupeMode">
            <option value="line">按行去重</option>
            <option value="word">按单词去重</option>
            <option value="char">按字符去重</option>
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
        <label>
          <span>保持原顺序</span>
          <input type="checkbox" v-model="keepOrder">
        </label>
        <button class="dedupe-btn" @click="dedupe">开始去重</button>
      </div>

      <div class="result-section">
        <div class="result-panel">
          <div class="panel-header">
            <h3>去重结果</h3>
            <div class="panel-actions">
              <button class="action-btn" @click="copyResult">复制结果</button>
            </div>
          </div>
          <div class="result-content">{{ result }}</div>
          <div class="result-stats">
            <div class="stat-item">
              <span class="stat-label">原始数量</span>
              <span class="stat-value">{{ originalCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">去重后数量</span>
              <span class="stat-value">{{ dedupeCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">重复数量</span>
              <span class="stat-value">{{ duplicateCount }}</span>
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
const dedupeMode = ref('line')
const ignoreWhitespace = ref(true)
const ignoreCase = ref(false)
const keepOrder = ref(true)
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

// 去重处理
const dedupe = () => {
  if (!text.value) return

  let items = []
  switch (dedupeMode.value) {
    case 'line':
      items = text.value.split('\n')
      break
    case 'word':
      items = text.value.match(/\S+/g) || []
      break
    case 'char':
      items = text.value.split('')
      break
  }

  // 预处理
  items = items.map(item => {
    let processed = item
    if (ignoreWhitespace.value) {
      processed = processed.trim()
    }
    if (ignoreCase.value) {
      processed = processed.toLowerCase()
    }
    return { original: item, processed }
  })

  // 去重
  const seen = new Set()
  const deduped = items.filter(item => {
    if (seen.has(item.processed)) return false
    seen.add(item.processed)
    return true
  })

  // 恢复原始文本
  result.value = deduped
    .map(item => item.original)
    .join(dedupeMode.value === 'line' ? '\n' : dedupeMode.value === 'word' ? ' ' : '')
}

// 统计信息
const originalCount = computed(() => {
  if (!text.value) return 0
  switch (dedupeMode.value) {
    case 'line':
      return text.value.split('\n').length
    case 'word':
      return (text.value.match(/\S+/g) || []).length
    case 'char':
      return text.value.length
  }
})

const dedupeCount = computed(() => {
  if (!result.value) return 0
  switch (dedupeMode.value) {
    case 'line':
      return result.value.split('\n').length
    case 'word':
      return (result.value.match(/\S+/g) || []).length
    case 'char':
      return result.value.length
  }
})

const duplicateCount = computed(() => originalCount.value - dedupeCount.value)
</script>

<style lang="scss" scoped>
.text-dedupe-page {
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

  .dedupe-container {
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

      .dedupe-btn {
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