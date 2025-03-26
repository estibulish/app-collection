<template>
  <div class="area-converter-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>面积单位换算</h1>
        <p class="tool-desc">在线面积单位换算工具，支持平方米、平方厘米、亩、公顷等单位互转</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="area-converter" />
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
            <option value="m2">平方米 (m²)</option>
            <option value="km2">平方千米 (km²)</option>
            <option value="cm2">平方厘米 (cm²)</option>
            <option value="ha">公顷 (ha)</option>
            <option value="mu">亩</option>
            <option value="ft2">平方英尺 (ft²)</option>
            <option value="yd2">平方码 (yd²)</option>
            <option value="acre">英亩 (acre)</option>
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
            <option value="m2">平方米 (m²)</option>
            <option value="km2">平方千米 (km²)</option>
            <option value="cm2">平方厘米 (cm²)</option>
            <option value="ha">公顷 (ha)</option>
            <option value="mu">亩</option>
            <option value="ft2">平方英尺 (ft²)</option>
            <option value="yd2">平方码 (yd²)</option>
            <option value="acre">英亩 (acre)</option>
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

// 基准单位为平方米的换算比例
const ratios = {
  m2: 1,
  km2: 0.000001,
  cm2: 10000,
  ha: 0.0001,
  mu: 0.0015,
  ft2: 10.7639,
  yd2: 1.19599,
  acre: 0.000247105
}

const unitLabels = {
  m2: '平方米',
  km2: '平方千米',
  cm2: '平方厘米',
  ha: '公顷',
  mu: '亩',
  ft2: '平方英尺',
  yd2: '平方码',
  acre: '英亩'
}

const inputValue = ref('')
const outputValue = ref('')
const fromUnit = ref('m2')
const toUnit = ref('mu')

const commonConversions = [
  { from: 'mu', to: 'm2', label: '亩 → 平方米', value: 666.67 },
  { from: 'ha', to: 'm2', label: '公顷 → 平方米', value: 10000 },
  { from: 'acre', to: 'm2', label: '英亩 → 平方米', value: 4046.86 },
  { from: 'km2', to: 'ha', label: '平方千米 → 公顷', value: 100 }
]

const convert = () => {
  if (!inputValue.value) {
    outputValue.value = ''
    return
  }

  // 先转换为平方米
  const squareMeters = inputValue.value / ratios[fromUnit.value]
  // 再从平方米转换为目标单位
  outputValue.value = (squareMeters * ratios[toUnit.value]).toFixed(6)
}

const swapUnits = () => {
  [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value]
  convert()
}
</script>

<style lang="scss" scoped>
// 复用 LengthConverter 的样式
.area-converter-page {
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