<template>
  <div class="percent-calculator-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>百分比计算器</h1>
        <p class="tool-desc">在线百分比计算工具，支持多种百分比计算场景</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="percent-calculator" />
      </div>
    </div>

    <div class="calculator-container">
      <div class="calculator-section">
        <div class="calculator-card">
          <h3>基础百分比</h3>
          <div class="input-group">
            <input type="number" v-model.number="number" placeholder="输入数值">
            <span class="operator">×</span>
            <input type="number" v-model.number="percent" placeholder="输入百分比">
            <span class="operator">%</span>
            <span class="equals">=</span>
            <div class="result">{{ basicResult }}</div>
          </div>
        </div>

        <div class="calculator-card">
          <h3>增长率计算</h3>
          <div class="input-group">
            <label>
              <span>原始值</span>
              <input type="number" v-model.number="originalValue" placeholder="输入原始值">
            </label>
            <label>
              <span>现在值</span>
              <input type="number" v-model.number="currentValue" placeholder="输入现在值">
            </label>
            <div class="result-group">
              <span>增长率:</span>
              <span class="result" :class="{ increase: growthRate > 0, decrease: growthRate < 0 }">
                {{ growthRate }}%
              </span>
            </div>
          </div>
        </div>

        <div class="calculator-card">
          <h3>比例计算</h3>
          <div class="input-group">
            <label>
              <span>部分值</span>
              <input type="number" v-model.number="part" placeholder="输入部分值">
            </label>
            <label>
              <span>总值</span>
              <input type="number" v-model.number="total" placeholder="输入总值">
            </label>
            <div class="result-group">
              <span>占比:</span>
              <span class="result">{{ ratio }}%</span>
            </div>
          </div>
        </div>

        <div class="calculator-card">
          <h3>加减百分比</h3>
          <div class="input-group">
            <label>
              <span>原始值</span>
              <input type="number" v-model.number="baseValue" placeholder="输入原始值">
            </label>
            <div class="operation-group">
              <select v-model="operation">
                <option value="increase">增加</option>
                <option value="decrease">减少</option>
              </select>
              <input type="number" v-model.number="changePercent" placeholder="百分比">
              <span>%</span>
            </div>
            <div class="result-group">
              <span>结果:</span>
              <span class="result">{{ changeResult }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3>计算说明</h3>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">基础百分比</div>
            <div class="info-value">计算一个数的百分比值</div>
            <div class="info-formula">结果 = 数值 × 百分比%</div>
          </div>
          <div class="info-item">
            <div class="info-label">增长率</div>
            <div class="info-value">计算两个数值之间的增长百分比</div>
            <div class="info-formula">增长率 = (现在值 - 原始值) / 原始值 × 100%</div>
          </div>
          <div class="info-item">
            <div class="info-label">比例计算</div>
            <div class="info-value">计算部分值占总值的百分比</div>
            <div class="info-formula">占比 = 部分值 / 总值 × 100%</div>
          </div>
          <div class="info-item">
            <div class="info-label">加减百分比</div>
            <div class="info-value">计算增加或减少特定百分比后的值</div>
            <div class="info-formula">结果 = 原始值 × (1 ± 百分比%)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

// 基础百分比计算
const number = ref(null)
const percent = ref(null)
const basicResult = computed(() => {
  if (!number.value || !percent.value) return '0'
  return (number.value * percent.value / 100).toFixed(2)
})

// 增长率计算
const originalValue = ref(null)
const currentValue = ref(null)
const growthRate = computed(() => {
  if (!originalValue.value || !currentValue.value) return '0'
  return ((currentValue.value - originalValue.value) / originalValue.value * 100).toFixed(2)
})

// 比例计算
const part = ref(null)
const total = ref(null)
const ratio = computed(() => {
  if (!part.value || !total.value) return '0'
  return (part.value / total.value * 100).toFixed(2)
})

// 加减百分比计算
const baseValue = ref(null)
const operation = ref('increase')
const changePercent = ref(null)
const changeResult = computed(() => {
  if (!baseValue.value || !changePercent.value) return '0'
  const factor = operation.value === 'increase' ? 1 + changePercent.value / 100 : 1 - changePercent.value / 100
  return (baseValue.value * factor).toFixed(2)
})
</script>

<style lang="scss" scoped>
.percent-calculator-page {
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

  .calculator-container {
    display: grid;
    gap: 2rem;

    .calculator-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;

      .calculator-card {
        background: var(--bg-card);
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;

        h3 {
          font-size: 1.2rem;
          margin: 0 0 1rem;
          color: var(--text-primary);
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;

          label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;

            span {
              color: var(--text-primary);
            }
          }

          input, select {
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

          .operator {
            color: var(--text-secondary);
            font-size: 1.2rem;
          }

          .equals {
            color: var(--text-secondary);
            font-size: 1.2rem;
            margin: 0 0.5rem;
          }

          .operation-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;

            select {
              width: 100px;
            }

            input {
              width: 100px;
            }
          }

          .result-group {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 0.5rem;
            border-top: 1px solid var(--border-color);
          }

          .result {
            font-size: 1.2rem;
            font-weight: 500;
            color: var(--text-primary);

            &.increase {
              color: #67c23a;
            }

            &.decrease {
              color: #f56c6c;
            }
          }
        }
      }
    }

    .info-section {
      background: var(--bg-card);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;

      h3 {
        font-size: 1.2rem;
        margin: 0 0 1rem;
        color: var(--text-primary);
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;

        .info-item {
          padding: 1rem;
          background: var(--bg-color);
          border-radius: 4px;
          border: 1px solid var(--border-color);

          .info-label {
            font-size: 1rem;
            color: var(--text-primary);
            font-weight: 500;
            margin-bottom: 0.5rem;
          }

          .info-value {
            font-size: 0.9rem;
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
          }

          .info-formula {
            font-family: monospace;
            font-size: 0.9rem;
            color: var(--primary);
            background: #f5f7fa;
            padding: 0.5rem;
            border-radius: 4px;
          }
        }
      }
    }
  }
}
</style> 