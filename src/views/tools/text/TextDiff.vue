<template>
  <div class="text-diff-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>文本对比工具</h1>
        <p class="tool-desc">在线文本对比工具，帮助您快速找出两段文本的差异</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="text-diff" />
      </div>
    </div>

    <div class="diff-container">
      <div class="input-section">
        <div class="text-panel">
          <div class="panel-header">
            <h3>原始文本</h3>
            <div class="panel-actions">
              <button class="action-btn" @click="clearText('old')">清空</button>
              <button class="action-btn" @click="pasteText('old')">粘贴</button>
            </div>
          </div>
          <textarea 
            v-model="oldText"
            placeholder="请输入或粘贴原始文本"
          ></textarea>
        </div>

        <div class="text-panel">
          <div class="panel-header">
            <h3>新文本</h3>
            <div class="panel-actions">
              <button class="action-btn" @click="clearText('new')">清空</button>
              <button class="action-btn" @click="pasteText('new')">粘贴</button>
            </div>
          </div>
          <textarea 
            v-model="newText"
            placeholder="请输入或粘贴新文本"
          ></textarea>
        </div>
      </div>

      <div class="options-section">
        <label>
          <span>对比方式</span>
          <select v-model="diffMode">
            <option value="chars">逐字对比</option>
            <option value="words">逐词对比</option>
            <option value="lines">逐行对比</option>
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
        <button class="compare-btn" @click="compare">开始对比</button>
      </div>

      <div class="result-section" v-if="diffResult">
        <div class="result-header">
          <h3>对比结果</h3>
          <div class="result-actions">
            <button class="action-btn" @click="copyResult">复制结果</button>
          </div>
        </div>
        <div class="result-content">
          <div 
            v-for="(part, index) in diffResult" 
            :key="index"
            :class="['diff-part', part.added ? 'added' : part.removed ? 'removed' : 'unchanged']"
          >
            {{ part.value }}
          </div>
        </div>
        <div class="result-stats">
          <div class="stat-item">
            <span class="stat-label">添加</span>
            <span class="stat-value added">{{ addedCount }} 处</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">删除</span>
            <span class="stat-value removed">{{ removedCount }} 处</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">修改率</span>
            <span class="stat-value">{{ changeRate }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'
import { diffChars, diffWords, diffLines } from 'diff'

const oldText = ref('')
const newText = ref('')
const diffMode = ref('chars')
const ignoreWhitespace = ref(false)
const ignoreCase = ref(false)
const diffResult = ref(null)

// 清空文本
const clearText = (type) => {
  if (type === 'old') {
    oldText.value = ''
  } else {
    newText.value = ''
  }
  diffResult.value = null
}

// 粘贴文本
const pasteText = async (type) => {
  try {
    const text = await navigator.clipboard.readText()
    if (type === 'old') {
      oldText.value = text
    } else {
      newText.value = text
    }
  } catch (err) {
    console.error('粘贴失败:', err)
  }
}

// 开始对比
const compare = () => {
  let text1 = oldText.value
  let text2 = newText.value

  if (ignoreWhitespace.value) {
    text1 = text1.replace(/\s+/g, ' ').trim()
    text2 = text2.replace(/\s+/g, ' ').trim()
  }

  if (ignoreCase.value) {
    text1 = text1.toLowerCase()
    text2 = text2.toLowerCase()
  }

  switch (diffMode.value) {
    case 'chars':
      diffResult.value = diffChars(text1, text2)
      break
    case 'words':
      diffResult.value = diffWords(text1, text2)
      break
    case 'lines':
      diffResult.value = diffLines(text1, text2)
      break
  }
}

// 复制结果
const copyResult = () => {
  if (!diffResult.value) return
  
  const text = diffResult.value
    .map(part => part.value)
    .join('')
  
  navigator.clipboard.writeText(text)
    .then(() => {
      alert('已复制到剪贴板')
    })
    .catch(err => {
      console.error('复制失败:', err)
    })
}

// 统计数据
const addedCount = computed(() => {
  if (!diffResult.value) return 0
  return diffResult.value.filter(part => part.added).length
})

const removedCount = computed(() => {
  if (!diffResult.value) return 0
  return diffResult.value.filter(part => part.removed).length
})

const changeRate = computed(() => {
  if (!diffResult.value) return 0
  const total = diffResult.value.length
  const changes = addedCount.value + removedCount.value
  return ((changes / total) * 100).toFixed(1)
})
</script>

<style lang="scss" scoped>
.text-diff-page {
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

  .diff-container {
    display: grid;
    gap: 2rem;

    .input-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;

      .text-panel {
        background: var(--bg-card);
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;

          h3 {
            font-size: 1.2rem;
            margin: 0;
            color: var(--text-primary);
          }

          .panel-actions {
            display: flex;
            gap: 0.5rem;
          }
        }

        textarea {
          width: 100%;
          height: 300px;
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
        color: var(--text-primary);

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

      .compare-btn {
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

    .result-section {
      background: var(--bg-card);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;

      .result-header {
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

      .result-content {
        padding: 1rem;
        background: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-family: monospace;
        line-height: 1.5;
        white-space: pre-wrap;

        .diff-part {
          &.added {
            background: #e6ffe6;
            color: #0a3d0a;
          }

          &.removed {
            background: #ffe6e6;
            color: #3d0a0a;
          }

          &.unchanged {
            color: var(--text-primary);
          }
        }
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

            &.added {
              color: #67c23a;
            }

            &.removed {
              color: #f56c6c;
            }
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