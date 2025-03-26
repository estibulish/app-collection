<template>
  <div class="number-base-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>进制转换工具</h1>
        <p class="tool-desc">在线进制转换工具，支持二进制、八进制、十进制、十六进制等互转</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="number-base" />
      </div>
    </div>

    <div class="converter-container">
      <div class="input-section">
        <div class="input-group">
          <label>
            <span class="label-text">二进制 (Binary)</span>
            <div class="input-with-actions">
              <input 
                type="text" 
                v-model="binary"
                @input="convertFromBinary"
                placeholder="输入二进制数"
                pattern="[0-1]*"
              >
              <button class="copy-btn" @click="copyValue(binary)">复制</button>
            </div>
          </label>
        </div>

        <div class="input-group">
          <label>
            <span class="label-text">八进制 (Octal)</span>
            <div class="input-with-actions">
              <input 
                type="text" 
                v-model="octal"
                @input="convertFromOctal"
                placeholder="输入八进制数"
                pattern="[0-7]*"
              >
              <button class="copy-btn" @click="copyValue(octal)">复制</button>
            </div>
          </label>
        </div>

        <div class="input-group">
          <label>
            <span class="label-text">十进制 (Decimal)</span>
            <div class="input-with-actions">
              <input 
                type="text" 
                v-model="decimal"
                @input="convertFromDecimal"
                placeholder="输入十进制数"
                pattern="[0-9]*"
              >
              <button class="copy-btn" @click="copyValue(decimal)">复制</button>
            </div>
          </label>
        </div>

        <div class="input-group">
          <label>
            <span class="label-text">十六进制 (Hexadecimal)</span>
            <div class="input-with-actions">
              <input 
                type="text" 
                v-model="hexadecimal"
                @input="convertFromHex"
                placeholder="输入十六进制数"
                pattern="[0-9A-Fa-f]*"
              >
              <button class="copy-btn" @click="copyValue(hexadecimal)">复制</button>
            </div>
          </label>
        </div>
      </div>

      <div class="actions-section">
        <button class="action-btn" @click="clearAll">清空</button>
      </div>

      <div class="info-section">
        <h3>进制说明</h3>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">二进制 (Binary)</div>
            <div class="info-value">使用 0 和 1 两个数字表示</div>
          </div>
          <div class="info-item">
            <div class="info-label">八进制 (Octal)</div>
            <div class="info-value">使用 0-7 八个数字表示</div>
          </div>
          <div class="info-item">
            <div class="info-label">十进制 (Decimal)</div>
            <div class="info-value">使用 0-9 十个数字表示</div>
          </div>
          <div class="info-item">
            <div class="info-label">十六进制 (Hexadecimal)</div>
            <div class="info-value">使用 0-9 和 A-F 十六个字符表示</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

const binary = ref('')
const octal = ref('')
const decimal = ref('')
const hexadecimal = ref('')

// 从二进制转换
const convertFromBinary = () => {
  if (!binary.value) {
    clearOthers('binary')
    return
  }

  try {
    const dec = parseInt(binary.value, 2)
    decimal.value = dec.toString()
    octal.value = dec.toString(8)
    hexadecimal.value = dec.toString(16).toUpperCase()
  } catch (error) {
    console.error('Binary conversion error:', error)
  }
}

// 从八进制转换
const convertFromOctal = () => {
  if (!octal.value) {
    clearOthers('octal')
    return
  }

  try {
    const dec = parseInt(octal.value, 8)
    decimal.value = dec.toString()
    binary.value = dec.toString(2)
    hexadecimal.value = dec.toString(16).toUpperCase()
  } catch (error) {
    console.error('Octal conversion error:', error)
  }
}

// 从十进制转换
const convertFromDecimal = () => {
  if (!decimal.value) {
    clearOthers('decimal')
    return
  }

  try {
    const dec = parseInt(decimal.value)
    binary.value = dec.toString(2)
    octal.value = dec.toString(8)
    hexadecimal.value = dec.toString(16).toUpperCase()
  } catch (error) {
    console.error('Decimal conversion error:', error)
  }
}

// 从十六进制转换
const convertFromHex = () => {
  if (!hexadecimal.value) {
    clearOthers('hexadecimal')
    return
  }

  try {
    const dec = parseInt(hexadecimal.value, 16)
    decimal.value = dec.toString()
    binary.value = dec.toString(2)
    octal.value = dec.toString(8)
  } catch (error) {
    console.error('Hexadecimal conversion error:', error)
  }
}

// 清空其他输入框
const clearOthers = (except) => {
  if (except !== 'binary') binary.value = ''
  if (except !== 'octal') octal.value = ''
  if (except !== 'decimal') decimal.value = ''
  if (except !== 'hexadecimal') hexadecimal.value = ''
}

// 清空所有
const clearAll = () => {
  binary.value = ''
  octal.value = ''
  decimal.value = ''
  hexadecimal.value = ''
}

// 复制值到剪贴板
const copyValue = (value) => {
  if (!value) return
  
  navigator.clipboard.writeText(value)
    .then(() => {
      alert('已复制到剪贴板')
    })
    .catch(err => {
      console.error('复制失败:', err)
    })
}
</script>

<style lang="scss" scoped>
.number-base-page {
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

  .converter-container {
    display: grid;
    gap: 2rem;

    .input-section {
      display: grid;
      gap: 1.5rem;

      .input-group {
        background: var(--bg-card);
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;

        label {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

          .label-text {
            font-size: 1rem;
            color: var(--text-primary);
          }

          .input-with-actions {
            display: flex;
            gap: 0.5rem;

            input {
              flex: 1;
              padding: 0.8rem;
              border: 1px solid var(--border-color);
              border-radius: 4px;
              font-family: monospace;
              font-size: 1rem;
              background: var(--bg-color);
              color: var(--text-primary);
              
              &:focus {
                border-color: var(--primary);
                outline: none;
              }
            }

            .copy-btn {
              padding: 0 1rem;
              border: 1px solid var(--border-color);
              border-radius: 4px;
              background: var(--bg-color);
              color: var(--text-secondary);
              cursor: pointer;
              transition: all 0.2s;

              &:hover {
                border-color: var(--primary);
                color: var(--primary);
              }
            }
          }
        }
      }
    }

    .actions-section {
      display: flex;
      justify-content: center;
      gap: 1rem;

      .action-btn {
        padding: 0.8rem 2rem;
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
            line-height: 1.4;
          }
        }
      }
    }
  }
}
</style> 