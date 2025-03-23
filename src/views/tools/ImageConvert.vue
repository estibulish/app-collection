<template>
  <div class="image-convert-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>图片格式转换</h1>
        <p class="tool-desc">在线图片格式转换工具，支持 JPG、PNG、WEBP、GIF 等格式互转</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="image-convert" />
      </div>
    </div>
    
    <div class="convert-container">
      <!-- 上传区域 -->
      <div class="upload-area">
        <div class="upload-zone" @drop.prevent="handleDrop" @dragover.prevent>
          <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*" multiple>
          <div class="upload-content">
            <div class="upload-icon">📁</div>
            <div class="upload-text">
              拖放图片到这里，或
              <button class="upload-button" @click="triggerFileInput">点击上传</button>
            </div>
            <div class="upload-hint">支持 JPG、PNG、WEBP、GIF 格式</div>
          </div>
        </div>
      </div>
      
      <!-- 转换设置 -->
      <div class="convert-settings">
        <h2>转换设置</h2>
        <div class="settings-group">
          <label>
            目标格式
            <select v-model="targetFormat">
              <option value="jpeg">JPG</option>
              <option value="png">PNG</option>
              <option value="webp">WEBP</option>
              <option value="gif">GIF</option>
            </select>
          </label>
          
          <label v-if="targetFormat === 'jpeg' || targetFormat === 'webp'">
            质量
            <div class="quality-control">
              <input type="range" v-model="quality" min="1" max="100">
              <span>{{ quality }}%</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

const fileInput = ref(null)
const targetFormat = ref('jpeg')
const quality = ref(80)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  // 处理文件选择
}

const handleDrop = (event) => {
  // 处理文件拖放
}
</script>

<style lang="scss" scoped>
.image-convert-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

// ... 其他样式与 ImageCompress.vue 类似 ...
</style> 