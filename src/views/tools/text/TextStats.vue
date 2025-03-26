<template>
  <div class="text-stats-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>文本统计工具</h1>
        <p class="tool-desc">在线文本统计工具，帮助您快速统计字数、行数、字符数等信息</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="text-stats" />
      </div>
    </div>

    <div class="stats-container">
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
            placeholder="请输入或粘贴要统计的文本"
          ></textarea>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-card">
          <h3>基础统计</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-label">总字符数</div>
              <div class="stat-value">{{ totalChars }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">不含空格字符数</div>
              <div class="stat-value">{{ charsNoSpace }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">单词数</div>
              <div class="stat-value">{{ wordCount }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">行数</div>
              <div class="stat-value">{{ lineCount }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">段落数</div>
              <div class="stat-value">{{ paragraphCount }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">中文字数</div>
              <div class="stat-value">{{ chineseCount }}</div>
            </div>
          </div>
        </div>

        <div class="stats-card">
          <h3>字符分布</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-label">字母</div>
              <div class="stat-value">{{ letterCount }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">数字</div>
              <div class="stat-value">{{ digitCount }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">空格</div>
              <div class="stat-value">{{ spaceCount }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">标点符号</div>
              <div class="stat-value">{{ punctuationCount }}</div>
            </div>
          </div>
        </div>

        <div class="stats-card">
          <h3>字符频率</h3>
          <div class="freq-list">
            <div 
              v-for="(freq, char) in charFrequency" 
              :key="char"
              class="freq-item"
            >
              <span class="char">{{ char }}</span>
              <span class="count">{{ freq }}</span>
              <span class="percent">{{ ((freq / totalChars) * 100).toFixed(1) }}%</span>
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

// 基础统计
const totalChars = computed(() => text.value.length)
const charsNoSpace = computed(() => text.value.replace(/\s/g, '').length)
const wordCount = computed(() => {
  const words = text.value.trim().split(/\s+/)
  return words[0] === '' ? 0 : words.length
})
const lineCount = computed(() => {
  const lines = text.value.split('\n')
  return lines[0] === '' ? 0 : lines.length
})
const paragraphCount = computed(() => {
  const paragraphs = text.value.split(/\n\s*\n/)
  return paragraphs[0] === '' ? 0 : paragraphs.length
})
const chineseCount = computed(() => {
  const matches = text.value.match(/[\u4e00-\u9fa5]/g)
  return matches ? matches.length : 0
})

// 字符分布
const letterCount = computed(() => {
  const matches = text.value.match(/[a-zA-Z]/g)
  return matches ? matches.length : 0
})
const digitCount = computed(() => {
  const matches = text.value.match(/\d/g)
  return matches ? matches.length : 0
})
const spaceCount = computed(() => {
  const matches = text.value.match(/\s/g)
  return matches ? matches.length : 0
})
const punctuationCount = computed(() => {
  const matches = text.value.match(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g)
  return matches ? matches.length : 0
})

// 字符频率统计
const charFrequency = computed(() => {
  const freq = {}
  for (const char of text.value) {
    freq[char] = (freq[char] || 0) + 1
  }
  return Object.fromEntries(
    Object.entries(freq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
  )
})
</script>

<style lang="scss" scoped>
.text-stats-page {
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

  .stats-container {
    display: grid;
    gap: 2rem;

    .input-section {
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
      }
    }

    .stats-section {
      display: grid;
      gap: 1rem;

      .stats-card {
        background: var(--bg-card);
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;

        h3 {
          font-size: 1.2rem;
          margin: 0 0 1rem;
          color: var(--text-primary);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;

          .stat-item {
            padding: 1rem;
            background: var(--bg-color);
            border: 1px solid var(--border-color);
            border-radius: 4px;

            .stat-label {
              font-size: 0.9rem;
              color: var(--text-secondary);
              margin-bottom: 0.5rem;
            }

            .stat-value {
              font-size: 1.5rem;
              font-weight: 500;
              color: var(--text-primary);
            }
          }
        }

        .freq-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.5rem;

          .freq-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.5rem;
            background: var(--bg-color);
            border: 1px solid var(--border-color);
            border-radius: 4px;

            .char {
              font-family: monospace;
              padding: 0.2rem 0.5rem;
              background: var(--border-color);
              border-radius: 2px;
            }

            .count {
              color: var(--text-primary);
              font-weight: 500;
            }

            .percent {
              color: var(--text-secondary);
              font-size: 0.9rem;
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