<template>
  <div class="calculator-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>科学计算器</h1>
        <p class="tool-desc">在线科学计算器，支持基础运算、三角函数、对数等高级计算功能</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="calculator" />
      </div>
    </div>

    <div class="calculator-container">
      <div class="display-section">
        <div class="expression">{{ expression || '0' }}</div>
        <div class="result">{{ result || '0' }}</div>
      </div>

      <div class="keypad-section">
        <div class="function-keys">
          <button class="key function" @click="addFunction('sin')">sin</button>
          <button class="key function" @click="addFunction('cos')">cos</button>
          <button class="key function" @click="addFunction('tan')">tan</button>
          <button class="key function" @click="addFunction('log')">log</button>
          <button class="key function" @click="addFunction('ln')">ln</button>
          <button class="key function" @click="addFunction('sqrt')">√</button>
          <button class="key function" @click="addOperator('^')">^</button>
          <button class="key function" @click="addConstant('PI')">π</button>
          <button class="key function" @click="addConstant('E')">e</button>
        </div>

        <div class="main-keys">
          <button class="key" @click="clearAll">C</button>
          <button class="key" @click="deleteLast">⌫</button>
          <button class="key operator" @click="addOperator('/')">/</button>
          <button class="key operator" @click="addOperator('*')">×</button>
          
          <button class="key number" @click="addNumber('7')">7</button>
          <button class="key number" @click="addNumber('8')">8</button>
          <button class="key number" @click="addNumber('9')">9</button>
          <button class="key operator" @click="addOperator('-')">-</button>
          
          <button class="key number" @click="addNumber('4')">4</button>
          <button class="key number" @click="addNumber('5')">5</button>
          <button class="key number" @click="addNumber('6')">6</button>
          <button class="key operator" @click="addOperator('+')">+</button>
          
          <button class="key number" @click="addNumber('1')">1</button>
          <button class="key number" @click="addNumber('2')">2</button>
          <button class="key number" @click="addNumber('3')">3</button>
          <button class="key equal" @click="calculate">=</button>
          
          <button class="key number zero" @click="addNumber('0')">0</button>
          <button class="key" @click="addNumber('.')">.</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

const expression = ref('')
const result = ref('')

// 添加数字
const addNumber = (num) => {
  expression.value += num
  calculateResult()
}

// 添加运算符
const addOperator = (op) => {
  if (!expression.value && op !== '-') return
  if (isOperator(expression.value.slice(-1)) && op !== '-') {
    expression.value = expression.value.slice(0, -1)
  }
  expression.value += op
}

// 添加函数
const addFunction = (func) => {
  expression.value += `${func}(`
}

// 添加常量
const addConstant = (constant) => {
  expression.value += constant
  calculateResult()
}

// 清空所有
const clearAll = () => {
  expression.value = ''
  result.value = ''
}

// 删除最后一个字符
const deleteLast = () => {
  expression.value = expression.value.slice(0, -1)
  calculateResult()
}

// 计算结果
const calculate = () => {
  if (!expression.value) return
  
  try {
    // 替换数学常量和函数
    let expr = expression.value
      .replace(/PI/g, 'Math.PI')
      .replace(/E/g, 'Math.E')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/log/g, 'Math.log10')
      .replace(/ln/g, 'Math.log')
      .replace(/sqrt/g, 'Math.sqrt')
    
    const res = eval(expr)
    expression.value = res.toString()
    result.value = ''
  } catch (error) {
    result.value = 'Error'
  }
}

// 实时计算结果
const calculateResult = () => {
  if (!expression.value) {
    result.value = ''
    return
  }
  
  try {
    let expr = expression.value
      .replace(/PI/g, 'Math.PI')
      .replace(/E/g, 'Math.E')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/log/g, 'Math.log10')
      .replace(/ln/g, 'Math.log')
      .replace(/sqrt/g, 'Math.sqrt')
    
    result.value = eval(expr)
  } catch (error) {
    result.value = ''
  }
}

// 判断是否为运算符
const isOperator = (char) => {
  return ['+', '-', '*', '/', '^'].includes(char)
}
</script>

<style lang="scss" scoped>
.calculator-page {
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
    background: var(--bg-card);
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;

    .display-section {
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      padding: 1rem;
      margin-bottom: 1rem;
      text-align: right;
      font-family: monospace;

      .expression {
        font-size: 1.2rem;
        color: var(--text-primary);
        min-height: 1.5em;
        margin-bottom: 0.5rem;
      }

      .result {
        font-size: 2rem;
        color: var(--text-primary);
        min-height: 1.2em;
      }
    }

    .keypad-section {
      display: grid;
      gap: 1rem;

      .function-keys {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
        gap: 0.5rem;
      }

      .main-keys {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.5rem;

        .zero {
          grid-column: span 2;
        }
      }

      .key {
        padding: 1rem;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-color);
        color: var(--text-primary);
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        &.function {
          background: #f5f7fa;
        }

        &.operator {
          background: #ecf5ff;
          color: var(--primary);
        }

        &.equal {
          grid-row: span 2;
          background: var(--primary);
          color: white;

          &:hover {
            background: var(--primary-dark);
          }
        }
      }
    }
  }
}
</style> 