<template>
  <div class="random-number-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>随机数生成器</h1>
        <p class="tool-desc">在线随机数生成工具，支持整数、小数、范围、数量等多种生成方式</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="random-number" />
      </div>
    </div>

    <div class="generator-container">
      <div class="settings-section">
        <div class="setting-group">
          <h3>生成设置</h3>
          <div class="setting-item">
            <label>
              <span>数字类型</span>
              <select v-model="type">
                <option value="int">整数</option>
                <option value="float">小数</option>
              </select>
            </label>
          </div>

          <div class="setting-item">
            <label>
              <span>最小值</span>
              <input 
                type="number" 
                v-model.number="min"
                :step="type === 'int' ? 1 : 0.1"
              >
            </label>
          </div>

          <div class="setting-item">
            <label>
              <span>最大值</span>
              <input 
                type="number" 
                v-model.number="max"
                :step="type === 'int' ? 1 : 0.1"
              >
            </label>
          </div>

          <div class="setting-item">
            <label>
              <span>生成数量</span>
              <input 
                type="number" 
                v-model.number="count"
                min="1"
                max="1000"
                step="1"
              >
            </label>
          </div>

          <div v-if="type === 'float'" class="setting-item">
            <label>
              <span>小数位数</span>
              <input 
                type="number" 
                v-model.number="decimals"
                min="1"
                max="10"
                step="1"
              >
            </label>
          </div>

          <div class="setting-item">
            <label>
              <span>是否允许重复</span>
              <input type="checkbox" v-model="allowDuplicate">
            </label>
          </div>
        </div>

        <div class="actions">
          <button class="generate-btn" @click="generateNumbers">生成随机数</button>
          <button class="clear-btn" @click="clearResults">清空结果</button>
        </div>
      </div>

      <div class="results-section">
        <div class="results-header">
          <h3>生成结果</h3>
          <button 
            class="copy-btn" 
            @click="copyResults" 
            :disabled="!results.length"
          >
            复制结果
          </button>
        </div>
        <div class="results-content">
          <div v-if="results.length" class="results-grid">
            <div 
              v-for="(num, index) in results" 
              :key="index"
              class="result-item"
            >
              {{ num }}
            </div>
          </div>
          <div v-else class="no-results">
            点击"生成随机数"按钮开始生成
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

const type = ref('int')
const min = ref(1)
const max = ref(100)
const count = ref(10)
const decimals = ref(2)
const allowDuplicate = ref(true)
const results = ref([])

// 生成随机数
const generateNumbers = () => {
  if (min.value >= max.value) {
    alert('最小值必须小于最大值')
    return
  }

  if (!allowDuplicate.value && 
      (max.value - min.value + 1) < count.value && 
      type.value === 'int') {
    alert('在不允许重复的情况下，可生成的数字范围必须大于等于生成数量')
    return
  }

  results.value = []
  const nums = new Set()

  while (results.value.length < count.value) {
    let num
    if (type.value === 'int') {
      num = Math.floor(Math.random() * (max.value - min.value + 1)) + min.value
    } else {
      num = (Math.random() * (max.value - min.value) + min.value).toFixed(decimals.value)
    }

    if (!allowDuplicate.value && nums.has(num)) {
      continue
    }

    nums.add(num)
    results.value.push(num)
  }
}

// 清空结果
const clearResults = () => {
  results.value = []
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
    })
}
</script>

<style lang="scss" scoped>
.random-number-page {
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

  .generator-container {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .settings-section {
      background: var(--bg-card);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;

      h3 {
        font-size: 1.2rem;
        margin: 0 0 1rem;
        color: var(--text-primary);
      }

      .setting-item {
        margin-bottom: 1rem;

        label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;

          span {
            color: var(--text-primary);
          }

          input[type="number"], select {
            width: 120px;
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

          input[type="checkbox"] {
            width: 20px;
            height: 20px;
          }
        }
      }

      .actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 2rem;

        button {
          padding: 0.8rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;

          &.generate-btn {
            background: var(--primary);
            color: white;

            &:hover {
              background: var(--primary-dark);
            }
          }

          &.clear-btn {
            background: var(--bg-color);
            border: 1px solid var(--border-color);
            color: var(--text-primary);

            &:hover {
              border-color: var(--primary);
              color: var(--primary);
            }
          }
        }
      }
    }

    .results-section {
      background: var(--bg-card);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;

      .results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h3 {
          font-size: 1.2rem;
          margin: 0;
          color: var(--text-primary);
        }

        .copy-btn {
          padding: 0.5rem 1rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background: var(--bg-color);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s;

          &:hover:not(:disabled) {
            border-color: var(--primary);
            color: var(--primary);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
      }

      .results-content {
        min-height: 400px;
        background: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 1rem;

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 1rem;

          .result-item {
            padding: 0.5rem;
            background: #f5f7fa;
            border-radius: 4px;
            text-align: center;
            font-family: monospace;
            color: var(--text-primary);
          }
        }

        .no-results {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }
      }
    }
  }
}
</style> 