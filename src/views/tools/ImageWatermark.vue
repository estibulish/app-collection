<template>
  <div class="image-watermark-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>图片水印</h1>
        <p class="tool-desc">在线图片水印工具，支持文字水印、图片水印，可调整位置、透明度等</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="image-watermark" />
      </div>
    </div>

    <div class="watermark-container">
      <!-- 上传区域 -->
      <div class="upload-area">
        <div class="upload-zone" @drop.prevent="handleDrop" @dragover.prevent>
          <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*">
          <div class="upload-content">
            <div class="upload-icon">📁</div>
            <div class="upload-text">
              拖放图片到这里，或
              <button class="upload-button" @click="triggerFileInput">点击上传</button>
            </div>
            <div class="upload-hint">支持 JPG、PNG 格式</div>
          </div>
        </div>
      </div>

      <!-- 水印设置 -->
      <div class="watermark-settings">
        <h2>水印设置</h2>
        <div class="settings-group">
          <label>
            水印类型
            <select v-model="watermarkType">
              <option value="text">文字水印</option>
              <option value="image">图片水印</option>
            </select>
          </label>

          <!-- 文字水印设置 -->
          <template v-if="watermarkType === 'text'">
            <label>
              水印文字
              <input type="text" v-model="textContent" placeholder="请输入水印文字">
            </label>
            <label>
              字体大小
              <input type="number" v-model="fontSize" min="12" max="72">
            </label>
            <label>
              字体颜色
              <input type="color" v-model="textColor">
            </label>
          </template>

          <!-- 图片水印设置 -->
          <template v-if="watermarkType === 'image'">
            <label>
              水印图片
              <input type="file" @change="handleWatermarkImageSelect" accept="image/*">
            </label>
          </template>

          <!-- 通用设置 -->
          <label>
            透明度
            <div class="opacity-control">
              <input type="range" v-model="opacity" min="0" max="100">
              <span>{{ opacity }}%</span>
            </div>
          </label>

          <label>
            位置
            <div class="position-grid">
              <button 
                v-for="pos in positions" 
                :key="pos.value"
                :class="['position-btn', { active: position === pos.value }]"
                @click="position = pos.value"
              >
                {{ pos.label }}
              </button>
            </div>
          </label>
        </div>

        <div class="panel-actions">
          <button class="apply" @click="applyWatermark">
            <span class="tool-icon">✓</span>
            应用水印
          </button>
          <button class="cancel" @click="resetSettings">
            <span class="tool-icon">✕</span>
            重置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

const fileInput = ref(null)
const watermarkType = ref('text')
const textContent = ref('')
const fontSize = ref(24)
const textColor = ref('#000000')
const opacity = ref(50)
const position = ref('center')

const positions = [
  { value: 'top-left', label: '左上' },
  { value: 'top-center', label: '上中' },
  { value: 'top-right', label: '右上' },
  { value: 'middle-left', label: '左中' },
  { value: 'center', label: '中心' },
  { value: 'middle-right', label: '右中' },
  { value: 'bottom-left', label: '左下' },
  { value: 'bottom-center', label: '下中' },
  { value: 'bottom-right', label: '右下' }
]

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  // 处理文件选择
}

const handleDrop = (event) => {
  // 处理文件拖放
}

const handleWatermarkImageSelect = (event) => {
  // 处理水印图片选择
}

const applyWatermark = () => {
  // 应用水印
}

const resetSettings = () => {
  // 重置设置
}
</script>

<style lang="scss" scoped>
.image-watermark-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.watermark-container {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}

// ... 其他样式与 ImageCompress.vue 类似 ...

.position-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  
  .position-btn {
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-card);
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      border-color: var(--primary);
      background: var(--primary-50);
    }
    
    &.active {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
    }
  }
}
</style> 