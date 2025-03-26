<template>
  <div class="text-replace-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>文本替换工具</h1>
        <p class="tool-desc">在线文本替换工具，支持普通替换和正则表达式替换</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="text-replace" />
      </div>
    </div>

    <div class="replace-container">
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
            placeholder="请输入或粘贴要替换的文本"
          ></textarea>
        </div>
      </div>

      <div class="options-section">
        <div class="search-replace">
          <div class="search-input">
            <span>查找内容</span>
            <input 
              type="text" 
              v-model="searchText"
              :placeholder="useRegex ? '支持正则表达式' : '要查找的文本'"
            >
          </div>
          <div class="replace-input">
            <span>替换为</span>
            <input 
              type="text" 
              v-model="replaceText"
              :placeholder="useRegex ? '支持$1,$2等分组引用' : '替换后的文本'"
            >
          </div>
        </div>

        <div class="replace-options">
          <label>
            <input type="checkbox" v-model="useRegex">
            <span>使用正则表达式</span>
          </label>
          <label v-if="useRegex">
            <input type="checkbox" v-model="regexFlags.global">
            <span>全局替换 (g)</span>
          </label>
          <label v-if="useRegex">
            <input type="checkbox" v-model="regexFlags.ignoreCase">
            <span>忽略大小写 (i)</span>
          </label>
          <label v-if="useRegex">
            <input type="checkbox" v-model="regexFlags.multiline">
            <span>多行模式 (m)</span>
          </label>
          <label v-if="!useRegex">
            <input type="checkbox" v-model="replaceAll">
            <span>替换所有匹配</span>
          </label>
        </div>

        <div class="replace-actions">
          <button class="preview-btn" @click="previewReplace">预览替换</button>
          <button class="replace-btn" @click="applyReplace">应用替换</button>
        </div>
      </div>

      <div class="result-section">
        <div class="result-panel">
          <div class="panel-header">
            <h3>替换结果</h3>
            <div class="panel-actions">
              <button class="action-btn" @click="copyResult">复制结果</button>
            </div>
          </div>
          <div class="result-content">{{ result }}</div>
          <div class="result-stats">
            <div class="stat-item">
              <span class="stat-label">匹配数量</span>
              <span class="stat-value">{{ matchCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">替换数量</span>
              <span class="stat-value">{{ replaceCount }}</span>
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
const searchText = ref('')
const replaceText = ref('')
const useRegex = ref(false)
const replaceAll = ref(true)
const result = ref('')
const matchCount = ref(0)
const replaceCount = ref(0)

const regexFlags = ref({
  global: true,
  ignoreCase: false,
  multiline: false
})

// 清空文本
const clearText = () => {
  text.value = ''
  result.value = ''
  matchCount.value = 0
  replaceCount.value = 0
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

// 预览替换
const previewReplace = () => {
  if (!text.value || !searchText.value) return

  try {
    if (useRegex.value) {
      const flags = [
        regexFlags.value.global ? 'g' : '',
        regexFlags.value.ignoreCase ? 'i' : '',
        regexFlags.value.multiline ? 'm' : ''
      ].join('')
      
      const regex = new RegExp(searchText.value, flags)
      const matches = text.value.match(regex)
      matchCount.value = matches ? matches.length : 0
      
      result.value = text.value.replace(regex, (match, ...args) => {
        const offset = args[args.length - 2]
        const string = args[args.length - 1]
        return `[${replaceText.value}]`
      })
      replaceCount.value = matchCount.value
    } else {
      if (replaceAll.value) {
        const regex = new RegExp(searchText.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
        const matches = text.value.match(regex)
        matchCount.value = matches ? matches.length : 0
        
        result.value = text.value.replace(regex, `[${replaceText.value}]`)
        replaceCount.value = matchCount.value
      } else {
        const index = text.value.indexOf(searchText.value)
        matchCount.value = index !== -1 ? 1 : 0
        
        if (index !== -1) {
          result.value = text.value.substring(0, index) + 
                        `[${replaceText.value}]` + 
                        text.value.substring(index + searchText.value.length)
          replaceCount.value = 1
        } else {
          result.value = text.value
          replaceCount.value = 0
        }
      }
    }
  } catch (err) {
    console.error('替换预览失败:', err)
    alert('替换预览失败，请检查输入是否正确')
  }
}

// 应用替换
const applyReplace = () => {
  if (!text.value || !searchText.value) return

  try {
    if (useRegex.value) {
      const flags = [
        regexFlags.value.global ? 'g' : '',
        regexFlags.value.ignoreCase ? 'i' : '',
        regexFlags.value.multiline ? 'm' : ''
      ].join('')
      
      const regex = new RegExp(searchText.value, flags)
      result.value = text.value.replace(regex, replaceText.value)
    } else {
      if (replaceAll.value) {
        const regex = new RegExp(searchText.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
        result.value = text.value.replace(regex, replaceText.value)
      } else {
        const index = text.value.indexOf(searchText.value)
        if (index !== -1) {
          result.value = text.value.substring(0, index) + 
                        replaceText.value + 
                        text.value.substring(index + searchText.value.length)
        }
      }
    }
    // 更新替换计数
    if (useRegex.value) {
      const matches = text.value.match(new RegExp(searchText.value, 'g'))
      replaceCount.value = matches ? matches.length : 0
    } else if (replaceAll.value) {
      const matches = text.value.match(new RegExp(searchText.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'))
      replaceCount.value = matches ? matches.length : 0
    } else {
      replaceCount.value = text.value.indexOf(searchText.value) !== -1 ? 1 : 0
    }
  } catch (err) {
    console.error('替换失败:', err)
    alert('替换失败，请检查输入是否正确')
  }
}
</script>

<style lang="scss" scoped>
.text-replace-page {
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

  .replace-container {
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
      background: var(--bg-card);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;

      .search-replace {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;

        .search-input,
        .replace-input {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

          span {
            color: var(--text-primary);
          }

          input {
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

      .replace-options {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 1rem;

        label {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          span {
            color: var(--text-primary);
          }
        }
      }

      .replace-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;

        .preview-btn,
        .replace-btn {
          padding: 0.5rem 2rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .preview-btn {
          background: var(--bg-color);
          border: 1px solid var(--primary);
          color: var(--primary);

          &:hover {
            background: var(--primary);
            color: white;
          }
        }

        .replace-btn {
          background: var(--primary);
          color: white;

          &:hover {
            background: var(--primary-dark);
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