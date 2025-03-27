<template>
  <div class="color-picker-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>颜色选择器</h1>
        <p class="tool-desc">高级颜色选择工具，支持多种颜色格式和配色方案</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="color-picker" />
      </div>
    </div>

    <div class="color-container">
      <div class="picker-section">
        <div class="picker-panel">
          <div class="panel-header">
            <h3>颜色选择</h3>
          </div>
          
          <div class="color-picker">
            <div class="color-preview" :style="{ backgroundColor: currentColor }">
              <div class="color-value">{{ currentColor }}</div>
            </div>
            
            <div class="picker-controls">
              <div class="picker-tabs">
                <button 
                  v-for="tab in pickerTabs" 
                  :key="tab.id"
                  :class="['tab-btn', { active: currentTab === tab.id }]"
                  @click="currentTab = tab.id"
                >
                  {{ tab.name }}
                </button>
              </div>
              
              <div class="tab-content">
                <!-- RGB 选择器 -->
                <div v-if="currentTab === 'rgb'" class="rgb-picker">
                  <div class="color-slider">
                    <span class="slider-label">R</span>
                    <input 
                      type="range" 
                      v-model.number="rgb.r" 
                      min="0" 
                      max="255" 
                      @input="updateFromRgb"
                    >
                    <input 
                      type="number" 
                      v-model.number="rgb.r" 
                      min="0" 
                      max="255" 
                      @input="updateFromRgb"
                    >
                  </div>
                  
                  <div class="color-slider">
                    <span class="slider-label">G</span>
                    <input 
                      type="range" 
                      v-model.number="rgb.g" 
                      min="0" 
                      max="255" 
                      @input="updateFromRgb"
                    >
                    <input 
                      type="number" 
                      v-model.number="rgb.g" 
                      min="0" 
                      max="255" 
                      @input="updateFromRgb"
                    >
                  </div>
                  
                  <div class="color-slider">
                    <span class="slider-label">B</span>
                    <input 
                      type="range" 
                      v-model.number="rgb.b" 
                      min="0" 
                      max="255" 
                      @input="updateFromRgb"
                    >
                    <input 
                      type="number" 
                      v-model.number="rgb.b" 
                      min="0" 
                      max="255" 
                      @input="updateFromRgb"
                    >
                  </div>
                </div>

                <!-- HSL 选择器 -->
                <div v-if="currentTab === 'hsl'" class="hsl-picker">
                  <div class="color-slider">
                    <span class="slider-label">H</span>
                    <input 
                      type="range" 
                      v-model.number="hsl.h" 
                      min="0" 
                      max="360" 
                      @input="updateFromHsl"
                    >
                    <input 
                      type="number" 
                      v-model.number="hsl.h" 
                      min="0" 
                      max="360" 
                      @input="updateFromHsl"
                    >
                  </div>
                  
                  <div class="color-slider">
                    <span class="slider-label">S</span>
                    <input 
                      type="range" 
                      v-model.number="hsl.s" 
                      min="0" 
                      max="100" 
                      @input="updateFromHsl"
                    >
                    <input 
                      type="number" 
                      v-model.number="hsl.s" 
                      min="0" 
                      max="100" 
                      @input="updateFromHsl"
                    >
                  </div>
                  
                  <div class="color-slider">
                    <span class="slider-label">L</span>
                    <input 
                      type="range" 
                      v-model.number="hsl.l" 
                      min="0" 
                      max="100" 
                      @input="updateFromHsl"
                    >
                    <input 
                      type="number" 
                      v-model.number="hsl.l" 
                      min="0" 
                      max="100" 
                      @input="updateFromHsl"
                    >
                  </div>
                </div>

                <!-- HEX 选择器 -->
                <div v-if="currentTab === 'hex'" class="hex-picker">
                  <div class="hex-input">
                    <span class="hash">#</span>
                    <input 
                      type="text" 
                      v-model="hexColor"
                      maxlength="6"
                      placeholder="000000"
                      @input="updateFromHex"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="palette-section">
        <div class="palette-panel">
          <div class="panel-header">
            <h3>配色方案</h3>
          </div>
          
          <div class="color-schemes">
            <div class="scheme-group">
              <h4>调和色</h4>
              <div class="color-list">
                <div 
                  v-for="(color, index) in harmonicColors" 
                  :key="index"
                  class="color-item"
                  :style="{ backgroundColor: color }"
                  @click="selectColor(color)"
                >
                  <div class="color-tooltip">{{ color }}</div>
                </div>
              </div>
            </div>
            
            <div class="scheme-group">
              <h4>类比色</h4>
              <div class="color-list">
                <div 
                  v-for="(color, index) in analogousColors" 
                  :key="index"
                  class="color-item"
                  :style="{ backgroundColor: color }"
                  @click="selectColor(color)"
                >
                  <div class="color-tooltip">{{ color }}</div>
                </div>
              </div>
            </div>
            
            <div class="scheme-group">
              <h4>三分色</h4>
              <div class="color-list">
                <div 
                  v-for="(color, index) in triadicColors" 
                  :key="index"
                  class="color-item"
                  :style="{ backgroundColor: color }"
                  @click="selectColor(color)"
                >
                  <div class="color-tooltip">{{ color }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="saved-section">
        <div class="saved-panel">
          <div class="panel-header">
            <h3>保存的颜色</h3>
            <button class="save-btn" @click="saveCurrentColor">保存当前颜色</button>
          </div>
          
          <div class="saved-colors">
            <div 
              v-for="(color, index) in savedColors" 
              :key="index"
              class="saved-color"
            >
              <div 
                class="color-preview"
                :style="{ backgroundColor: color }"
                @click="selectColor(color)"
              >
                <div class="color-tooltip">{{ color }}</div>
              </div>
              <div class="color-actions">
                <button class="copy-btn" @click="copyToClipboard(color)">复制</button>
                <button class="remove-btn" @click="removeSavedColor(index)">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

// 选项卡配置
const pickerTabs = [
  { id: 'rgb', name: 'RGB' },
  { id: 'hsl', name: 'HSL' },
  { id: 'hex', name: 'HEX' }
]

// 当前选项卡
const currentTab = ref('rgb')

// 颜色值
const rgb = reactive({ r: 0, g: 0, b: 0 })
const hsl = reactive({ h: 0, s: 0, l: 0 })
const hexColor = ref('000000')
const currentColor = computed(() => `#${hexColor.value}`)

// 保存的颜色
const savedColors = ref(JSON.parse(localStorage.getItem('savedColors') || '[]'))

// 工具函数
const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

// 颜色转换函数
const rgbToHex = (r, g, b) => {
  return [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// 更新函数
const updateFromRgb = () => {
  rgb.r = clamp(rgb.r, 0, 255)
  rgb.g = clamp(rgb.g, 0, 255)
  rgb.b = clamp(rgb.b, 0, 255)
  
  hexColor.value = rgbToHex(rgb.r, rgb.g, rgb.b)
  const newHsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  Object.assign(hsl, newHsl)
}

const updateFromHsl = () => {
  hsl.h = clamp(hsl.h, 0, 360)
  hsl.s = clamp(hsl.s, 0, 100)
  hsl.l = clamp(hsl.l, 0, 100)
  
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l)
  Object.assign(rgb, newRgb)
  hexColor.value = rgbToHex(rgb.r, rgb.g, rgb.b)
}

const updateFromHex = () => {
  const newRgb = hexToRgb('#' + hexColor.value)
  if (newRgb) {
    Object.assign(rgb, newRgb)
    const newHsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    Object.assign(hsl, newHsl)
  }
}

// 配色方案计算
const harmonicColors = computed(() => {
  const { h, s, l } = hsl
  return [
    getHslColor(h, s, l),
    getHslColor((h + 30) % 360, s, l),
    getHslColor((h + 60) % 360, s, l),
    getHslColor((h + 180) % 360, s, l),
    getHslColor((h + 150) % 360, s, l),
    getHslColor((h + 210) % 360, s, l),
  ]
})

const analogousColors = computed(() => {
  const { h, s, l } = hsl
  return [
    getHslColor((h - 30 + 360) % 360, s, l),
    getHslColor((h - 15 + 360) % 360, s, l),
    getHslColor(h, s, l),
    getHslColor((h + 15) % 360, s, l),
    getHslColor((h + 30) % 360, s, l),
  ]
})

const triadicColors = computed(() => {
  const { h, s, l } = hsl
  return [
    getHslColor(h, s, l),
    getHslColor((h + 120) % 360, s, l),
    getHslColor((h + 240) % 360, s, l),
  ]
})

// 操作函数
const selectColor = (color) => {
  if (color.startsWith('hsl')) {
    const matches = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
    if (matches) {
      hsl.h = parseInt(matches[1])
      hsl.s = parseInt(matches[2])
      hsl.l = parseInt(matches[3])
      updateFromHsl()
    }
  } else if (color.startsWith('#')) {
    hexColor.value = color.slice(1)
    updateFromHex()
  }
}

const saveCurrentColor = () => {
  if (!savedColors.value.includes(currentColor.value)) {
    savedColors.value.push(currentColor.value)
    localStorage.setItem('savedColors', JSON.stringify(savedColors.value))
  }
}

const removeSavedColor = (index) => {
  savedColors.value.splice(index, 1)
  localStorage.setItem('savedColors', JSON.stringify(savedColors.value))
}

const copyToClipboard = async (color) => {
  try {
    await navigator.clipboard.writeText(color)
    alert('颜色代码已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 颜色转换辅助函数
const rgbToHsl = (r, g, b) => {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    
    h /= 6
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

const hslToRgb = (h, s, l) => {
  h /= 360
  s /= 100
  l /= 100
  
  let r, g, b
  
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

const getHslColor = (h, s, l) => {
  return `hsl(${h}, ${s}%, ${l}%)`
}
</script>

<style lang="scss" scoped>
.color-picker-page {
  padding: 2rem;
}

.color-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.picker-panel,
.palette-panel,
.saved-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.panel-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }
}

.color-picker {
  padding: 1.5rem;

  .color-preview {
    width: 100%;
    height: 100px;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .color-value {
      background: rgba(0, 0, 0, 0.5);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-family: monospace;
    }
  }
}

.picker-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;

  .tab-btn {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: none;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: var(--primary);
      color: var(--primary);
    }

    &.active {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
    }
  }
}

.color-slider {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;

  .slider-label {
    font-weight: 600;
    color: var(--text-primary);
    width: 20px;
  }

  input[type="range"] {
    width: 100%;
  }

  input[type="number"] {
    width: 60px;
    padding: 0.25rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-main);
    color: var(--text-primary);
  }
}

.hex-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .hash {
    color: var(--text-primary);
    font-weight: 600;
  }

  input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-main);
    color: var(--text-primary);
    font-family: monospace;
    text-transform: uppercase;
  }
}

.color-schemes {
  padding: 1.5rem;

  .scheme-group {
    margin-bottom: 2rem;

    &:last-child {
      margin-bottom: 0;
    }

    h4 {
      color: var(--text-primary);
      margin-bottom: 1rem;
    }
  }
}

.color-list {
  display: flex;
  gap: 0.5rem;

  .color-item {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    cursor: pointer;
    position: relative;

    &:hover .color-tooltip {
      display: block;
    }
  }
}

.color-tooltip {
  display: none;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-card);
  color: var(--text-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.saved-colors {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
}

.saved-color {
  .color-preview {
    width: 100%;
    height: 60px;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    cursor: pointer;
    position: relative;

    &:hover .color-tooltip {
      display: block;
    }
  }

  .color-actions {
    display: flex;
    gap: 0.5rem;

    button {
      flex: 1;
      padding: 0.25rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: none;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;

      &.copy-btn:hover {
        border-color: var(--primary);
        color: var(--primary);
      }

      &.remove-btn:hover {
        border-color: var(--danger);
        color: var(--danger);
      }
    }
  }
}

@media (max-width: 768px) {
  .color-picker-page {
    padding: 1rem;
  }

  .color-container {
    grid-template-columns: 1fr;
  }
}
</style> 