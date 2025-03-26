<template>
  <div class="temperature-converter-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>温度单位换算</h1>
        <p class="tool-desc">在线温度单位换算工具，支持摄氏度、华氏度、开尔文等单位互转</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="temperature-converter" />
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
            <option value="c">摄氏度 (°C)</option>
            <option value="f">华氏度 (°F)</option>
            <option value="k">开尔文 (K)</option>
            <option value="r">兰氏度 (°R)</option>
            <option value="re">列氏度 (°Ré)</option>
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
            <option value="c">摄氏度 (°C)</option>
            <option value="f">华氏度 (°F)</option>
            <option value="k">开尔文 (K)</option>
            <option value="r">兰氏度 (°R)</option>
            <option value="re">列氏度 (°Ré)</option>
          </select>
        </div>
      </div>

      <div class="common-conversions">
        <h3>常用换算</h3>
        <div class="conversion-grid">
          <div class="conversion-item" v-for="conv in commonConversions" :key="conv.from + conv.to">
            <div class="conversion-label">{{ conv.label }}</div>
            <div class="conversion-value">{{ conv.formula }}</div>
          </div>
        </div>
      </div>

      <div class="temperature-info">
        <h3>温标说明</h3>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">摄氏度 (°C)</div>
            <div class="info-value">以水的冰点为 0°C，沸点为 100°C</div>
          </div>
          <div class="info-item">
            <div class="info-label">华氏度 (°F)</div>
            <div class="info-value">以水的冰点为 32°F，沸点为 212°F</div>
          </div>
          <div class="info-item">
            <div class="info-label">开尔文 (K)</div>
            <div class="info-value">以绝对零度为 0K，水的冰点为 273.15K</div>
          </div>
          <div class="info-item">
            <div class="info-label">兰氏度 (°R)</div>
            <div class="info-value">以绝对零度为 0°R，一度等于华氏度</div>
          </div>
          <div class="info-item">
            <div class="info-label">列氏度 (°Ré)</div>
            <div class="info-value">以水的冰点为 0°Ré，沸点为 80°Ré</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

const unitLabels = {
  c: '摄氏度',
  f: '华氏度',
  k: '开尔文',
  r: '兰氏度',
  re: '列氏度'
}

const inputValue = ref('')
const outputValue = ref('')
const fromUnit = ref('c')
const toUnit = ref('f')

// 常用换算公式
const commonConversions = [
  { 
    from: 'c', to: 'f', 
    label: '摄氏度 → 华氏度', 
    formula: '°F = °C × 1.8 + 32' 
  },
  { 
    from: 'c', to: 'k', 
    label: '摄氏度 → 开尔文', 
    formula: 'K = °C + 273.15' 
  },
  { 
    from: 'f', to: 'c', 
    label: '华氏度 → 摄氏度', 
    formula: '°C = (°F - 32) ÷ 1.8' 
  },
  { 
    from: 'k', to: 'c', 
    label: '开尔文 → 摄氏度', 
    formula: '°C = K - 273.15' 
  }
]

// 转换函数
const convert = () => {
  if (!inputValue.value) {
    outputValue.value = ''
    return
  }

  const value = parseFloat(inputValue.value)

  // 先转换为摄氏度
  let celsius
  switch (fromUnit.value) {
    case 'c':
      celsius = value
      break
    case 'f':
      celsius = (value - 32) / 1.8
      break
    case 'k':
      celsius = value - 273.15
      break
    case 'r':
      celsius = (value - 491.67) / 1.8
      break
    case 're':
      celsius = value * 1.25
      break
  }

  // 从摄氏度转换为目标单位
  let result
  switch (toUnit.value) {
    case 'c':
      result = celsius
      break
    case 'f':
      result = celsius * 1.8 + 32
      break
    case 'k':
      result = celsius + 273.15
      break
    case 'r':
      result = (celsius + 273.15) * 1.8
      break
    case 're':
      result = celsius * 0.8
      break
  }

  outputValue.value = result.toFixed(3)
}

const swapUnits = () => {
  [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value]
  convert()
}
</script>

<style lang="scss" scoped>
// 复用基础样式
.temperature-converter-page {
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

    .common-conversions, .temperature-info {
      h3 {
        font-size: 1.2rem;
        margin: 0 0 1rem;
        color: var(--text-primary);
      }
    }

    .common-conversions {
      margin-bottom: 2rem;

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
            font-family: monospace;
          }
        }
      }
    }

    .temperature-info {
      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
            line-height: 1.4;
          }
        }
      }
    }
  }
}
</style> 