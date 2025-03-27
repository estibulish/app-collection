<template>
  <div class="random-picker-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>随机选择器</h1>
        <p class="tool-desc">帮助你做随机选择，解决选择困难症</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="random-picker" />
      </div>
    </div>

    <div class="picker-container">
      <div class="input-section">
        <div class="options-panel">
          <div class="panel-header">
            <h3>选项列表</h3>
            <div class="panel-actions">
              <button class="action-btn" @click="clearOptions">清空</button>
              <button class="action-btn" @click="addExampleOptions">示例</button>
            </div>
          </div>
          <div class="options-editor">
            <textarea 
              v-model="optionsText" 
              placeholder="输入选项，每行一个选项"
              rows="10"
            ></textarea>
            <div class="options-info">
              <span>共 {{ options.length }} 个选项</span>
            </div>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-panel">
          <h3>选择设置</h3>
          <div class="setting-group">
            <label>
              <span>选择数量</span>
              <input 
                type="number" 
                v-model.number="pickCount" 
                min="1" 
                :max="options.length"
              >
            </label>
            <label>
              <input type="checkbox" v-model="allowDuplicates">
              <span>允许重复选择</span>
            </label>
            <label>
              <input type="checkbox" v-model="showAnimation">
              <span>显示动画效果</span>
            </label>
          </div>
          <div class="pick-actions">
            <button 
              class="pick-btn" 
              @click="pickRandom" 
              :disabled="options.length === 0 || isPicking"
            >
              {{ isPicking ? '选择中...' : '随机选择' }}
            </button>
          </div>
        </div>
      </div>

      <div class="result-section">
        <div class="result-panel">
          <h3>选择结果</h3>
          <div 
            class="result-display"
            :class="{ 'animating': isAnimating }"
          >
            <div v-if="!results.length && !isAnimating" class="empty-result">
              <span class="empty-icon">🎲</span>
              <p>点击"随机选择"按钮开始</p>
            </div>
            <div v-else-if="isAnimating" class="animating-result">
              <span class="animating-item">{{ animatingText }}</span>
            </div>
            <div v-else class="result-list">
              <div 
                v-for="(result, index) in results" 
                :key="index"
                class="result-item"
              >
                <span class="result-number">{{ index + 1 }}</span>
                <span class="result-text">{{ result }}</span>
              </div>
            </div>
          </div>
          <div class="result-actions" v-if="results.length > 0">
            <button class="action-btn" @click="copyResults">复制结果</button>
            <button class="action-btn" @click="clearResults">清除结果</button>
          </div>
        </div>
      </div>

      <div class="history-section">
        <div class="history-panel">
          <div class="panel-header">
            <h3>历史记录</h3>
            <div class="panel-actions">
              <button class="action-btn" @click="clearHistory">清空历史</button>
            </div>
          </div>
          <div class="history-list">
            <div v-if="history.length === 0" class="empty-history">
              <p>暂无历史记录</p>
            </div>
            <div 
              v-for="(item, index) in history" 
              :key="index"
              class="history-item"
            >
              <div class="history-time">{{ formatTime(item.time) }}</div>
              <div class="history-content">
                <div class="history-options">从 {{ item.totalOptions }} 个选项中选择 {{ item.count }} 个</div>
                <div class="history-results">
                  <span 
                    v-for="(result, rIndex) in item.results" 
                    :key="rIndex"
                    class="history-result"
                  >
                    {{ result }}
                  </span>
                </div>
              </div>
              <button class="reuse-btn" @click="reuseHistory(item)">重用</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

// 状态
const optionsText = ref('')
const options = computed(() => {
  return optionsText.value
    .split('\n')
    .map(option => option.trim())
    .filter(option => option.length > 0)
})

const pickCount = ref(1)
const allowDuplicates = ref(false)
const showAnimation = ref(true)
const results = ref([])
const history = ref([])
const isPicking = ref(false)
const isAnimating = ref(false)
const animatingText = ref('')

// 监听选项变化，调整选择数量上限
watch(options, () => {
  if (!allowDuplicates.value && pickCount.value > options.value.length) {
    pickCount.value = Math.max(1, options.value.length)
  }
})

// 添加示例选项
const addExampleOptions = () => {
  optionsText.value = '吃麻辣烫\n吃火锅\n吃烧烤\n吃西餐\n吃日料\n吃家常菜\n叫外卖\n下厨做饭'
}

// 清空选项
const clearOptions = () => {
  optionsText.value = ''
}

// 随机选择
const pickRandom = async () => {
  if (options.value.length === 0 || isPicking.value) return
  
  isPicking.value = true
  results.value = []
  
  if (showAnimation.value) {
    await runAnimation()
  }
  
  // 执行随机选择
  const selectedOptions = []
  const availableOptions = [...options.value]
  
  for (let i = 0; i < pickCount.value; i++) {
    if (!allowDuplicates.value && availableOptions.length === 0) break
    
    const randomIndex = Math.floor(Math.random() * availableOptions.length)
    const selected = allowDuplicates.value ? 
      options.value[randomIndex] : 
      availableOptions.splice(randomIndex, 1)[0]
    
    selectedOptions.push(selected)
  }
  
  results.value = selectedOptions
  
  // 添加到历史记录
  addToHistory(selectedOptions)
  
  isPicking.value = false
}

// 运行动画
const runAnimation = async () => {
  if (options.value.length === 0) return
  
  isAnimating.value = true
  
  // 快速切换显示不同选项
  const animationDuration = 2000 // 2秒
  const intervalStep = 50 // 每50毫秒切换一次
  const startTime = Date.now()
  
  return new Promise(resolve => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      
      if (elapsed >= animationDuration) {
        clearInterval(interval)
        isAnimating.value = false
        resolve()
        return
      }
      
      // 速度逐渐变慢
      const progress = elapsed / animationDuration
      const slowdownFactor = 1 + progress * 5
      
      // 随机选择一个选项显示
      const randomIndex = Math.floor(Math.random() * options.value.length)
      animatingText.value = options.value[randomIndex]
      
    }, intervalStep)
  })
}

// 添加到历史记录
const addToHistory = (selectedOptions) => {
  history.value.unshift({
    time: new Date(),
    totalOptions: options.value.length,
    count: selectedOptions.length,
    results: [...selectedOptions]
  })
  
  // 限制历史记录数量
  if (history.value.length > 10) {
    history.value = history.value.slice(0, 10)
  }
  
  // 保存到本地存储
  saveHistory()
}

// 保存历史记录到本地存储
const saveHistory = () => {
  try {
    localStorage.setItem('randomPickerHistory', JSON.stringify(history.value))
  } catch (e) {
    console.error('Failed to save history to localStorage', e)
  }
}

// 从本地存储加载历史记录
const loadHistory = () => {
  try {
    const savedHistory = localStorage.getItem('randomPickerHistory')
    if (savedHistory) {
      history.value = JSON.parse(savedHistory)
    }
  } catch (e) {
    console.error('Failed to load history from localStorage', e)
  }
}

// 清空历史记录
const clearHistory = () => {
  history.value = []
  saveHistory()
}

// 重用历史记录
const reuseHistory = (item) => {
  pickCount.value = item.count
  results.value = [...item.results]
}

// 复制结果
const copyResults = () => {
  const text = results.value.join('\n')
  navigator.clipboard.writeText(text)
    .then(() => {
      alert('已复制到剪贴板')
    })
    .catch(err => {
      console.error('复制失败:', err)
      alert('复制失败，请手动复制')
    })
}

// 清除结果
const clearResults = () => {
  results.value = []
}

// 格式化时间
const formatTime = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 初始化
loadHistory()
</script>

<style lang="scss" scoped>
.random-picker-page {
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

  .picker-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    .options-panel, .settings-panel, .result-panel, .history-panel {
      background: var(--bg-card);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      height: 100%;
    }

    .input-section {
      grid-column: 1;
      grid-row: 1 / span 2;
    }

    .settings-section {
      grid-column: 2;
      grid-row: 1;
    }

    .result-section {
      grid-column: 2;
      grid-row: 2;
    }

    .history-section {
      grid-column: 1 / span 2;
      grid-row: 3;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      h3 {
        margin: 0;
        font-size: 1.2rem;
        color: var(--text-primary);
      }

      .panel-actions {
        display: flex;
        gap: 0.5rem;
      }
    }

    .options-editor {
      display: flex;
      flex-direction: column;
      height: calc(100% - 3rem);

      textarea {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-main);
        color: var(--text-primary);
        font-size: 1rem;
        resize: none;
        min-height: 200px;

        &:focus {
          border-color: var(--primary);
          outline: none;
        }
      }

      .options-info {
        margin-top: 0.5rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
      }
    }

    .setting-group {
      margin-bottom: 1.5rem;

      label {
        display: flex;
        align-items: center;
        margin-bottom: 0.75rem;

        span {
          margin-right: 0.5rem;
          min-width: 5rem;
        }

        input[type="number"] {
          width: 4rem;
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background: var(--bg-main);
          color: var(--text-primary);

          &:focus {
            border-color: var(--primary);
            outline: none;
          }
        }

        input[type="checkbox"] {
          margin-right: 0.5rem;
        }
      }
    }

    .pick-actions {
      display: flex;
      justify-content: center;
      margin-top: 2rem;

      .pick-btn {
        padding: 0.75rem 2rem;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: var(--primary-dark);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }

    .result-display {
      min-height: 200px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--bg-main);
      padding: 1rem;
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &.animating {
        background: rgba(var(--primary-rgb), 0.05);
      }

      .empty-result {
        text-align: center;
        color: var(--text-secondary);

        .empty-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }

        p {
          margin: 0;
        }
      }

      .animating-result {
        text-align: center;

        .animating-item {
          font-size: 1.5rem;
          font-weight: 500;
          color: var(--primary);
        }
      }

      .result-list {
        width: 100%;

        .result-item {
          display: flex;
          align-items: center;
          padding: 0.5rem;
          border-bottom: 1px solid var(--border-color);

          &:last-child {
            border-bottom: none;
          }

          .result-number {
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--primary);
            color: white;
            border-radius: 50%;
            margin-right: 1rem;
            font-weight: 500;
          }

          .result-text {
            font-size: 1.1rem;
            color: var(--text-primary);
          }
        }
      }
    }

    .result-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .history-list {
      max-height: 300px;
      overflow-y: auto;

      .empty-history {
        text-align: center;
        color: var(--text-secondary);
        padding: 2rem 0;
      }

      .history-item {
        display: flex;
        align-items: center;
        padding: 0.75rem;
        border-bottom: 1px solid var(--border-color);

        &:last-child {
          border-bottom: none;
        }

        .history-time {
          min-width: 6rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .history-content {
          flex: 1;
          margin: 0 1rem;

          .history-options {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-bottom: 0.25rem;
          }

          .history-results {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;

            .history-result {
              background: rgba(var(--primary-rgb), 0.1);
              color: var(--primary);
              padding: 0.25rem 0.5rem;
              border-radius: 4px;
              font-size: 0.9rem;
            }
          }
        }

        .reuse-btn {
          padding: 0.25rem 0.75rem;
          background: none;
          border: 1px solid var(--primary);
          color: var(--primary);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: var(--primary);
            color: white;
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

@media (max-width: 768px) {
  .random-picker-page {
    padding: 1rem;

    .picker-container {
      grid-template-columns: 1fr;

      .input-section {
        grid-column: 1;
        grid-row: 1;
      }

      .settings-section {
        grid-column: 1;
        grid-row: 2;
      }

      .result-section {
        grid-column: 1;
        grid-row: 3;
      }

      .history-section {
        grid-column: 1;
        grid-row: 4;
      }
    }
  }
}
</style> 