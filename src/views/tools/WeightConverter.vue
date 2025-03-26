<template>
  <div class="weight-converter-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>重量单位换算</h1>
        <p class="tool-desc">在线重量单位换算工具，支持千克、克、磅、盎司等单位互转</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="weight-converter" />
      </div>
    </div>

    <div class="converter-container">
      <div class="input-section">
        <div class="input-group">
          <input 
            type="number" 
            v-model="inputValue"
            @input="convert"
            placeholder="输入数值"
          >
          <select v-model="fromUnit" @change="convert">
            <option value="kg">千克 (kg)</option>
            <option value="g">克 (g)</option>
            <option value="mg">毫克 (mg)</option>
            <option value="lb">磅 (lb)</option>
            <option value="oz">盎司 (oz)</option>
            <option value="jin">斤</option>
            <option value="liang">两</option>
            <option value="qian">钱</option>
          </select>
        </div>
        <button class="swap-btn" @click="swapUnits">
          <span class="swap-icon">⇅</span>
        </button>
        <div class="input-group">
          <input 
            type="number" 
            v-model="outputValue" 
            readonly
            placeholder="转换结果"
          >
          <select v-model="toUnit" @change="convert">
            <option value="kg">千克 (kg)</option>
            <option value="g">克 (g)</option>
            <option value="mg">毫克 (mg)</option>
            <option value="lb">磅 (lb)</option>
            <option value="oz">盎司 (oz)</option>
            <option value="jin">斤</option>
            <option value="liang">两</option>
            <option value="qian">钱</option>
          </select>
        </div>
      </div>

      <div class="common-conversions">
        <h3>常用换算</h3>
        <div class="conversion-grid">
          <div class="conversion-item" v-for="conv in commonConversions" :key="conv.from + conv.to">
            <div class="conversion-label">{{ conv.label }}</div>
            <div class="conversion-value">
              1 {{ unitLabels[conv.from] }} = {{ conv.value }} {{ unitLabels[conv.to] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

// 基准单位为千克的换算比例
const ratios = {
  kg: 1,
  g: 1000,
  mg: 1000000,
  lb: 2.20462,
  oz: 35.274,
  jin: 2,      // 1斤 = 0.5千克
  liang: 20,   // 1两 = 0.05千克
  qian: 200    // 1钱 = 0.005千克
}

const unitLabels = {
  kg: '千克',
  g: '克',
  mg: '毫克',
  lb: '磅',
  oz: '盎司',
  jin: '斤',
  liang: '两',
  qian: '钱'
}

const inputValue = ref('')
const outputValue = ref('')
const fromUnit = ref('kg')
const toUnit = ref('jin')

const commonConversions = [
  { from: 'kg', to: 'jin', label: '千克 → 斤', value: 2 },
  { from: 'jin', to: 'liang', label: '斤 → 两', value: 10 },
  { from: 'kg', to: 'lb', label: '千克 → 磅', value: 2.20462 },
  { from: 'lb', to: 'oz', label: '磅 → 盎司', value: 16 }
]

const convert = () => {
  if (!inputValue.value) {
    outputValue.value = ''
    return
  }

  // 先转换为千克
  const kilograms = inputValue.value / ratios[fromUnit.value]
  // 再从千克转换为目标单位
  outputValue.value = (kilograms * ratios[toUnit.value]).toFixed(6)
}

const swapUnits = () => {
  [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value]
  convert()
}
</script>

<style lang="scss" scoped>
// 复用相同的样式
.weight-converter-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  .tool-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;

    .header-content {
      h1 {
        font-size: 2rem;
        margin: 0 0 0.5rem;
      }

      .tool-desc {
        color: var(--text-secondary);
        margin: 0;
      }
    }
  }

  .converter-container {
    background: var(--bg-card);
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    padding: 2rem;

    .input-section {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2rem;

      @media (max-width: 768px) {
        flex-direction: column;
      }

      .input-group {
        flex: 1;
        display: flex;
        gap: 0.5rem;

        input {
          flex: 1;
          padding: 0.8rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 1rem;
          
          &:focus {
            border-color: var(--primary);
            outline: none;
          }

          &[readonly] {
            background: var(--bg-color);
          }
        }

        select {
          width: 120px;
          padding: 0.8rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          
          &:focus {
            border-color: var(--primary);
            outline: none;
          }
        }
      }

      .swap-btn {
        width: 40px;
        height: 40px;
        border: 1px solid var(--border-color);
        border-radius: 50%;
        background: var(--bg-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;

        &:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .swap-icon {
          font-size: 1.2rem;
        }
      }
    }

    .common-conversions {
      h3 {
        font-size: 1.2rem;
        margin: 0 0 1rem;
        color: var(--text-primary);
      }

      .conversion-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;

        .conversion-item {
          padding: 1rem;
          background: var(--bg-color);
          border-radius: 4px;
          border: 1px solid var(--border-color);

          .conversion-label {
            font-size: 0.9rem;
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
          }

          .conversion-value {
            font-size: 1.1rem;
            color: var(--text-primary);
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style> 