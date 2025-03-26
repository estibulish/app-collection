<template>
  <div class="length-converter-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>长度单位换算</h1>
        <p class="tool-desc">在线长度单位换算工具，支持米、厘米、英寸、英尺等单位互转</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="length-converter" />
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
            <option value="m">米 (m)</option>
            <option value="km">千米 (km)</option>
            <option value="cm">厘米 (cm)</option>
            <option value="mm">毫米 (mm)</option>
            <option value="in">英寸 (in)</option>
            <option value="ft">英尺 (ft)</option>
            <option value="yd">码 (yd)</option>
            <option value="mi">英里 (mi)</option>
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
            <option value="m">米 (m)</option>
            <option value="km">千米 (km)</option>
            <option value="cm">厘米 (cm)</option>
            <option value="mm">毫米 (mm)</option>
            <option value="in">英寸 (in)</option>
            <option value="ft">英尺 (ft)</option>
            <option value="yd">码 (yd)</option>
            <option value="mi">英里 (mi)</option>
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
import { ref, computed } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

// 基准单位为米的换算比例
const ratios = {
  m: 1,
  km: 0.001,
  cm: 100,
  mm: 1000,
  in: 39.3701,
  ft: 3.28084,
  yd: 1.09361,
  mi: 0.000621371
}

const unitLabels = {
  m: '米',
  km: '千米',
  cm: '厘米',
  mm: '毫米',
  in: '英寸',
  ft: '英尺',
  yd: '码',
  mi: '英里'
}

const inputValue = ref('')
const outputValue = ref('')
const fromUnit = ref('m')
const toUnit = ref('cm')

const commonConversions = [
  { from: 'm', to: 'cm', label: '米 → 厘米', value: 100 },
  { from: 'km', to: 'm', label: '千米 → 米', value: 1000 },
  { from: 'ft', to: 'm', label: '英尺 → 米', value: 0.3048 },
  { from: 'in', to: 'cm', label: '英寸 → 厘米', value: 2.54 }
]

const convert = () => {
  if (!inputValue.value) {
    outputValue.value = ''
    return
  }

  // 先转换为米
  const meters = inputValue.value / ratios[fromUnit.value]
  // 再从米转换为目标单位
  outputValue.value = (meters * ratios[toUnit.value]).toFixed(6)
}

const swapUnits = () => {
  [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value]
  convert()
}
</script>

<style lang="scss" scoped>
.length-converter-page {
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