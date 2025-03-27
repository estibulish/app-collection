<template>
  <div class="dice-roller-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>骰子模拟器</h1>
        <p class="tool-desc">模拟各种类型的骰子，支持多面骰和自定义</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="dice-roller" />
      </div>
    </div>

    <div class="dice-container">
      <div class="dice-section">
        <div class="dice-panel">
          <div class="panel-header">
            <h3>骰子设置</h3>
          </div>
          
          <div class="dice-settings">
            <div class="dice-presets">
              <h4>预设骰子</h4>
              <div class="preset-buttons">
                <button 
                  v-for="preset in dicePresets" 
                  :key="preset.sides"
                  class="preset-btn"
                  :class="{ active: currentDice.sides === preset.sides }"
                  @click="selectPreset(preset)"
                >
                  {{ preset.label }}
                </button>
              </div>
            </div>
            
            <div class="custom-dice">
              <h4>自定义骰子</h4>
              <div class="custom-settings">
                <label>
                  <span>面数</span>
                  <input 
                    type="number" 
                    v-model.number="customSides" 
                    min="2" 
                    max="1000"
                  >
                </label>
                <button 
                  class="apply-btn"
                  @click="applyCustomDice"
                >
                  应用
                </button>
              </div>
            </div>
            
            <div class="roll-settings">
              <h4>投掷设置</h4>
              <div class="roll-options">
                <label>
                  <span>骰子数量</span>
                  <input 
                    type="number" 
                    v-model.number="diceCount" 
                    min="1" 
                    max="10"
                  >
                </label>
                <label>
                  <input type="checkbox" v-model="showAnimation">
                  <span>显示动画</span>
                </label>
                <label>
                  <input type="checkbox" v-model="showSum">
                  <span>显示总和</span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="roll-actions">
            <button 
              class="roll-btn" 
              @click="rollDice"
              :disabled="isRolling"
            >
              {{ isRolling ? '投掷中...' : '投掷骰子' }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="result-section">
        <div class="result-panel">
          <div class="panel-header">
            <h3>投掷结果</h3>
            <div class="dice-info">
              {{ diceCount }}{{ currentDice.notation }}
            </div>
          </div>
          
          <div class="dice-results">
            <div v-if="results.length === 0" class="empty-result">
              <span class="empty-icon">🎲</span>
              <p>点击"投掷骰子"按钮开始</p>
            </div>
            <div v-else class="results-display">
              <div class="dice-grid">
                <div 
                  v-for="(result, index) in results" 
                  :key="index"
                  class="dice-result"
                  :class="{ 'animating': animatingIndices.includes(index) }"
                >
                  <div class="dice-face" :style="getDiceStyle(result)">
                    <span class="dice-value">{{ result }}</span>
                  </div>
                </div>
              </div>
              
              <div v-if="showSum && results.length > 1" class="sum-display">
                <div class="sum-label">总和</div>
                <div class="sum-value">{{ resultsSum }}</div>
              </div>
            </div>
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
                <div class="history-dice">{{ item.count }}{{ item.notation }}</div>
                <div class="history-results">
                  <span 
                    v-for="(result, rIndex) in item.results" 
                    :key="rIndex"
                    class="history-result"
                  >
                    {{ result }}
                  </span>
                  <span v-if="item.sum" class="history-sum">
                    = {{ item.sum }}
                  </span>
                </div>
              </div>
              <button class="reroll-btn" @click="rerollHistory(item)">重投</button>
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

// 预设骰子
const dicePresets = [
  { sides: 4, label: 'D4', notation: 'd4', color: '#4caf50' },
  { sides: 6, label: 'D6', notation: 'd6', color: '#2196f3' },
  { sides: 8, label: 'D8', notation: 'd8', color: '#9c27b0' },
  { sides: 10, label: 'D10', notation: 'd10', color: '#ff9800' },
  { sides: 12, label: 'D12', notation: 'd12', color: '#f44336' },
  { sides: 20, label: 'D20', notation: 'd20', color: '#795548' },
  { sides: 100, label: 'D100', notation: 'd100', color: '#607d8b' }
]

// 状态
const currentDice = ref(dicePresets[1]) // 默认 D6
const customSides = ref(30)
const diceCount = ref(2)
const showAnimation = ref(true)
const showSum = ref(true)
const results = ref([])
const history = ref([])
const isRolling = ref(false)
const animatingIndices = ref([])

// 计算结果总和
const resultsSum = computed(() => {
  return results.value.reduce((sum, val) => sum + val, 0)
})

// 选择预设骰子
const selectPreset = (preset) => {
  currentDice.value = preset
}

// 应用自定义骰子
const applyCustomDice = () => {
  if (customSides.value < 2) {
    customSides.value = 2
  } else if (customSides.value > 1000) {
    customSides.value = 1000
  }
  
  currentDice.value = {
    sides: customSides.value,
    label: `D${customSides.value}`,
    notation: `d${customSides.value}`,
    color: '#333333'
  }
}

// 获取骰子样式
const getDiceStyle = (value) => {
  return {
    backgroundColor: currentDice.value.color,
    boxShadow: `0 0 10px ${currentDice.value.color}80`
  }
}

// 投掷骰子
const rollDice = async () => {
  if (isRolling.value) return
  
  isRolling.value = true
  animatingIndices.value = []
  
  // 生成新的结果
  const newResults = []
  
  for (let i = 0; i < diceCount.value; i++) {
    if (showAnimation.value) {
      animatingIndices.value.push(i)
    }
    
    // 随机结果
    const result = Math.floor(Math.random() * currentDice.value.sides) + 1
    newResults.push(result)
  }
  
  if (showAnimation.value) {
    // 模拟动画
    results.value = Array(diceCount.value).fill(1)
    
    // 随机变化动画
    const animationDuration = 1000 // 1秒
    const intervalStep = 50 // 每50毫秒切换一次
    const startTime = Date.now()
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      
      if (elapsed >= animationDuration) {
        clearInterval(interval)
        results.value = [...newResults]
        animatingIndices.value = []
        isRolling.value = false
        
        // 添加到历史记录
        addToHistory(newResults)
        return
      }
      
      // 更新动画中的值
      const tempResults = [...results.value]
      
      for (let i = 0; i < diceCount.value; i++) {
        if (animatingIndices.value.includes(i)) {
          tempResults[i] = Math.floor(Math.random() * currentDice.value.sides) + 1
        }
      }
      
      results.value = tempResults
    }, intervalStep)
  } else {
    results.value = newResults
    isRolling.value = false
    
    // 添加到历史记录
    addToHistory(newResults)
  }
}

// 添加到历史记录
const addToHistory = (diceResults) => {
  const historyItem = {
    time: new Date(),
    count: diceCount.value,
    sides: currentDice.value.sides,
    notation: currentDice.value.notation,
    results: [...diceResults]
  }
  
  if (showSum.value && diceResults.length > 1) {
    historyItem.sum = diceResults.reduce((sum, val) => sum + val, 0)
  }
  
  history.value.unshift(historyItem)
  
  // 限制历史记录数量
  if (history.value.length > 10) {
    history.value = history.value.slice(0, 10)
  }
}

// 重新投掷历史记录中的骰子
const rerollHistory = (item) => {
  diceCount.value = item.count
  
  // 查找匹配的预设骰子
  const preset = dicePresets.find(p => p.sides === item.sides)
  
  if (preset) {
    currentDice.value = preset
  } else {
    currentDice.value = {
      sides: item.sides,
      label: `D${item.sides}`,
      notation: item.notation,
      color: '#333333'
    }
    customSides.value = item.sides
  }
  
  // 投掷骰子
  rollDice()
}

// 清空历史记录
const clearHistory = () => {
  history.value = []
}

// 格式化时间
const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<style lang="scss" scoped>
.dice-roller-page {
  padding: 2rem;
  
  .dice-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    
    .dice-section {
      grid-column: 1;
      grid-row: 1;
    }
    
    .result-section {
      grid-column: 2;
      grid-row: 1;
    }
    
    .history-section {
      grid-column: 1 / span 2;
      grid-row: 2;
    }
  }
  
  .dice-panel, .result-panel, .history-panel {
    background: var(--bg-card);
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    height: 100%;
    
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      
      h3 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.25rem;
      }
      
      .dice-info {
        font-weight: 500;
        color: var(--primary);
        background: rgba(var(--primary-rgb), 0.1);
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
      }
      
      .panel-actions {
        display: flex;
        gap: 0.5rem;
      }
    }
  }
  
  .dice-settings {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    
    h4 {
      margin: 0 0 0.75rem;
      color: var(--text-primary);
      font-size: 1rem;
    }
    
    .preset-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      
      .preset-btn {
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
        
        &.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
      }
    }
    
    .custom-settings {
      display: flex;
      align-items: center;
      gap: 1rem;
      
      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        span {
          color: var(--text-primary);
        }
        
        input[type="number"] {
          width: 5rem;
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background: var(--bg-color);
          color: var(--text-primary);
        }
      }
      
      .apply-btn {
        padding: 0.5rem 1rem;
        border: 1px solid var(--primary);
        border-radius: 4px;
        background: none;
        color: var(--primary);
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
          background: var(--primary);
          color: white;
        }
      }
    }
    
    .roll-options {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      
      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        span {
          color: var(--text-primary);
        }
        
        input[type="number"] {
          width: 3rem;
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background: var(--bg-color);
          color: var(--text-primary);
        }
        
        input[type="checkbox"] {
          width: 1rem;
          height: 1rem;
        }
      }
    }
  }
  
  .roll-actions {
    display: flex;
    justify-content: center;
    
    .roll-btn {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 4px;
      background: var(--primary);
      color: white;
      font-size: 1.1rem;
      font-weight: 500;
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
  
  .dice-results {
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
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
    
    .results-display {
      width: 100%;
      
      .dice-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 1.5rem;
        
        .dice-result {
          .dice-face {
            width: 4rem;
            height: 4rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            font-weight: 700;
            transition: transform 0.1s;
            
            &:hover {
              transform: scale(1.05);
            }
          }
          
          &.animating .dice-face {
            animation: shake 0.5s infinite;
          }
        }
      }
      
      .sum-display {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        
        .sum-label {
          color: var(--text-secondary);
        }
        
        .sum-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
        }
      }
    }
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
        min-width: 5rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
      }
      
      .history-content {
        flex: 1;
        margin: 0 1rem;
        
        .history-dice {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }
        
        .history-results {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
          
          .history-result {
            background: rgba(var(--primary-rgb), 0.1);
            color: var(--primary);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.9rem;
          }
          
          .history-sum {
            color: var(--text-primary);
            font-weight: 500;
          }
        }
      }
      
      .reroll-btn {
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

@keyframes shake {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
}

@media (max-width: 768px) {
  .dice-roller-page {
    padding: 1rem;
    
    .dice-container {
      grid-template-columns: 1fr;
      
      .dice-section {
        grid-column: 1;
        grid-row: 1;
      }
      
      .result-section {
        grid-column: 1;
        grid-row: 2;
      }
      
      .history-section {
        grid-column: 1;
        grid-row: 3;
      }
    }
  }
}
</style> 