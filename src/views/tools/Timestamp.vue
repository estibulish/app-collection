<template>
  <div class="timestamp-tool">
    <div class="tool-header">
      <h1>时间戳转换</h1>
      <p class="tool-desc">在线时间戳与日期格式互转工具，支持毫秒级时间戳</p>
    </div>

    <div class="tool-content">
      <div class="conversion-section">
        <div class="current-time">
          <span class="time-label">当前时间：</span>
          <span class="time-value">{{ currentDateTime }}</span>
          <span class="time-stamp">{{ currentTimestamp }}</span>
        </div>

        <div class="conversion-panel">
          <div class="panel-section">
            <h3>时间戳转日期</h3>
            <div class="input-group">
              <input 
                type="text" 
                v-model="timestampInput"
                placeholder="请输入时间戳"
                @input="handleTimestampInput"
              >
              <div class="input-actions">
                <button class="action-btn" @click="useCurrentTimestamp">
                  <span class="btn-icon">⏱</span>
                  使用当前时间戳
                </button>
                <button class="action-btn" @click="clearTimestamp">
                  <span class="btn-icon">✕</span>
                </button>
              </div>
            </div>
            <div class="result-display">
              <div v-if="timestampResult" class="result-item">
                <span class="result-label">日期时间：</span>
                <span class="result-value">{{ timestampResult }}</span>
                <button class="copy-btn" @click="copyToClipboard(timestampResult)">复制</button>
              </div>
              <div v-else class="placeholder-text">转换结果将显示在这里</div>
            </div>
          </div>

          <div class="panel-section">
            <h3>日期转时间戳</h3>
            <div class="input-group">
              <input 
                type="datetime-local" 
                v-model="dateTimeInput"
                step="1"
                @input="handleDateTimeInput"
              >
              <div class="input-actions">
                <button class="action-btn" @click="useCurrentDateTime">
                  <span class="btn-icon">⏰</span>
                  使用当前时间
                </button>
                <button class="action-btn" @click="clearDateTime">
                  <span class="btn-icon">✕</span>
                </button>
              </div>
            </div>
            <div class="result-display">
              <template v-if="dateTimeResult">
                <div class="result-item">
                  <span class="result-label">秒级时间戳：</span>
                  <span class="result-value">{{ dateTimeResult.seconds }}</span>
                  <button class="copy-btn" @click="copyToClipboard(dateTimeResult.seconds)">复制</button>
                </div>
                <div class="result-item">
                  <span class="result-label">毫秒级时间戳：</span>
                  <span class="result-value">{{ dateTimeResult.milliseconds }}</span>
                  <button class="copy-btn" @click="copyToClipboard(dateTimeResult.milliseconds)">复制</button>
                </div>
              </template>
              <div v-else class="placeholder-text">转换结果将显示在这里</div>
            </div>
          </div>
        </div>
      </div>

      <div class="info-section">
        <div class="info-card">
          <h3>使用说明</h3>
          <ul>
            <li>时间戳支持10位（秒）或13位（毫秒）格式</li>
            <li>日期时间精确到秒</li>
            <li>点击复制按钮可快速复制结果</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const timestampInput = ref('')
const dateTimeInput = ref('')
const currentTime = ref(new Date())

// 更新当前时间
const updateCurrentTime = () => {
  currentTime.value = new Date()
}

// 定时器
let timer

onMounted(() => {
  updateCurrentTime()
  timer = setInterval(updateCurrentTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

// 计算属性
const currentDateTime = computed(() => {
  return formatDate(currentTime.value)
})

const currentTimestamp = computed(() => {
  return Math.floor(currentTime.value.getTime() / 1000)
})

// 时间戳转日期结果
const timestampResult = computed(() => {
  if (!timestampInput.value) return ''
  const timestamp = parseInt(timestampInput.value)
  if (isNaN(timestamp)) return '无效的时间戳'
  
  try {
    const date = new Date(
      timestamp.toString().length === 10 ? timestamp * 1000 : timestamp
    )
    return formatDate(date)
  } catch (e) {
    return '无效的时间戳'
  }
})

// 日期转时间戳结果
const dateTimeResult = computed(() => {
  if (!dateTimeInput.value) return null
  
  try {
    const date = new Date(dateTimeInput.value)
    const timestamp = date.getTime()
    return {
      seconds: Math.floor(timestamp / 1000),
      milliseconds: timestamp
    }
  } catch (e) {
    return null
  }
})

// 方法
const formatDate = (date) => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

const handleTimestampInput = () => {
  timestampInput.value = timestampInput.value.replace(/[^\d]/g, '')
}

const handleDateTimeInput = () => {
  // 日期输入处理
}

const useCurrentTimestamp = () => {
  timestampInput.value = currentTimestamp.value.toString()
}

const useCurrentDateTime = () => {
  const now = new Date()
  dateTimeInput.value = now.toISOString().slice(0, 19)
}

const clearTimestamp = () => {
  timestampInput.value = ''
}

const clearDateTime = () => {
  dateTimeInput.value = ''
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text.toString())
    // 可以添加复制成功的提示
  } catch (err) {
    // 处理复制失败
  }
}
</script>

<style lang="scss" scoped>
.timestamp-tool {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.tool-header {
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .tool-desc {
    color: var(--text-secondary);
    font-size: 1rem;
  }
}

.tool-content {
  display: grid;
  gap: 2rem;
}

.conversion-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.current-time {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-main);
  border-radius: 8px;
  margin-bottom: 1.5rem;

  .time-label {
    color: var(--text-secondary);
  }

  .time-value {
    color: var(--text-primary);
    font-weight: 500;
  }

  .time-stamp {
    color: var(--primary);
    font-family: monospace;
  }
}

.conversion-panel {
  display: grid;
  gap: 2rem;
}

.panel-section {
  h3 {
    font-size: 1.125rem;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }
}

.input-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-main);
    color: var(--text-primary);
    font-size: 1rem;
    font-family: monospace;

    &:focus {
      outline: none;
      border-color: var(--primary);
    }
  }
}

.input-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-main);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  .btn-icon {
    font-size: 1rem;
  }
}

.result-display {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
  }

  .result-label {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  .result-value {
    flex: 1;
    color: var(--text-primary);
    font-family: monospace;
  }
}

.copy-btn {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
}

.placeholder-text {
  color: var(--text-tertiary);
  text-align: center;
  padding: 1rem;
}

.info-section {
  .info-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;

    h3 {
      font-size: 1.125rem;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    ul {
      list-style: none;
      padding: 0;
      color: var(--text-secondary);

      li {
        position: relative;
        padding-left: 1.5rem;
        margin-bottom: 0.5rem;

        &::before {
          content: "•";
          position: absolute;
          left: 0.5rem;
          color: var(--primary);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .timestamp-tool {
    padding: 1rem;
  }

  .tool-header {
    margin-bottom: 1.5rem;

    h1 {
      font-size: 1.5rem;
    }
  }

  .current-time {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .input-group {
    flex-direction: column;
  }

  .input-actions {
    justify-content: flex-end;
  }
}
</style> 