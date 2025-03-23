<template>
  <div class="image-merge-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>图片拼接</h1>
        <p class="tool-desc">在线图片拼接工具，支持横向、纵向拼接，可调整间距和背景</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="image-merge" />
      </div>
    </div>

    <div class="merge-container">
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
            <div class="upload-hint">支持多选，可拖拽排序</div>
          </div>
        </div>
      </div>

      <!-- 拼接设置 -->
      <div class="merge-settings">
        <h2>拼接设置</h2>
        <div class="settings-group">
          <label>
            拼接方向
            <select v-model="direction">
              <option value="horizontal">横向拼接</option>
              <option value="vertical">纵向拼接</option>
            </select>
          </label>

          <label>
            图片间距
            <div class="spacing-control">
              <input type="range" v-model="spacing" min="0" max="100">
              <span>{{ spacing }}px</span>
            </div>
          </label>

          <label>
            背景颜色
            <input type="color" v-model="backgroundColor">
          </label>

          <label>
            输出尺寸
            <select v-model="outputSize">
              <option value="original">原始尺寸</option>
              <option value="uniform">统一尺寸</option>
              <option value="custom">自定义尺寸</option>
            </select>
          </label>

          <template v-if="outputSize === 'custom'">
            <label>
              宽度
              <input type="number" v-model="customWidth" min="100" step="100">
            </label>
            <label>
              高度
              <input type="number" v-model="customHeight" min="100" step="100">
            </label>
          </template>
        </div>

        <div class="panel-actions">
          <button class="apply" @click="mergeImages">
            <span class="tool-icon">✓</span>
            开始拼接
          </button>
          <button class="cancel" @click="resetSettings">
            <span class="tool-icon">✕</span>
            重置
          </button>
        </div>
      </div>

      <!-- 图片列表 -->
      <div class="image-list" v-if="imageList.length > 0">
        <draggable 
          v-model="imageList"
          item-key="id"
          handle=".drag-handle"
          ghost-class="ghost"
        >
          <template #item="{ element }">
            <div class="image-item">
              <div class="drag-handle">⋮⋮</div>
              <img :src="element.preview" :alt="element.name">
              <div class="image-info">
                <span class="image-name">{{ element.name }}</span>
                <button class="remove-btn" @click="removeImage(element.id)">✕</button>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'
import draggable from 'vuedraggable'

const fileInput = ref(null)
const direction = ref('horizontal')
const spacing = ref(10)
const backgroundColor = ref('#ffffff')
const outputSize = ref('original')
const customWidth = ref(800)
const customHeight = ref(600)
const imageList = ref([])

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  // 处理文件选择
}

const handleDrop = (event) => {
  // 处理文件拖放
}

const mergeImages = () => {
  // 执行图片拼接
}

const removeImage = (id) => {
  // 移除图片
}

const resetSettings = () => {
  // 重置设置
}
</script>

<style lang="scss" scoped>
.image-merge-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.merge-container {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
}

.image-list {
  margin-top: 2rem;
  
  .image-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    margin-bottom: 0.5rem;
    background: var(--bg-card);
    
    .drag-handle {
      cursor: move;
      color: var(--text-secondary);
      user-select: none;
    }
    
    img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
    }
    
    .image-info {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .image-name {
        font-size: 0.875rem;
        color: var(--text-primary);
      }
      
      .remove-btn {
        padding: 0.25rem;
        border: none;
        background: none;
        color: var(--text-secondary);
        cursor: pointer;
        
        &:hover {
          color: var(--error);
        }
      }
    }
  }
  
  .ghost {
    opacity: 0.5;
    background: var(--primary-50);
  }
}

// ... 其他样式与 ImageCompress.vue 类似 ...
</style> 