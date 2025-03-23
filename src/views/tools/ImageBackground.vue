<template>
  <div class="image-background-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>图片背景移除</h1>
        <p class="tool-desc">在线图片背景移除工具，智能识别前景，一键移除背景</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="image-background" />
      </div>
    </div>

    <div class="background-container">
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
            <div class="upload-hint">支持 JPG、PNG 格式，最大 10MB</div>
          </div>
        </div>
      </div>

      <!-- 预览和设置区域 -->
      <div class="preview-area" v-if="imageUrl">
        <div class="preview-container">
          <div class="preview original">
            <h3>原图</h3>
            <img :src="imageUrl" alt="原图">
          </div>
          <div class="preview result">
            <h3>处理结果</h3>
            <img v-if="resultUrl" :src="resultUrl" alt="处理结果">
            <div v-else class="processing">
              <div class="loading-spinner"></div>
              <span>正在处理中...</span>
            </div>
          </div>
        </div>

        <div class="settings-panel">
          <h2>背景设置</h2>
          <div class="settings-group">
            <label>
              背景类型
              <select v-model="backgroundType">
                <option value="transparent">透明背景</option>
                <option value="color">纯色背景</option>
                <option value="blur">模糊背景</option>
              </select>
            </label>

            <template v-if="backgroundType === 'color'">
              <label>
                背景颜色
                <input type="color" v-model="backgroundColor">
              </label>
            </template>

            <template v-if="backgroundType === 'blur'">
              <label>
                模糊程度
                <div class="blur-control">
                  <input type="range" v-model="blurAmount" min="1" max="20">
                  <span>{{ blurAmount }}</span>
                </div>
              </label>
            </template>
          </div>

          <div class="panel-actions">
            <button class="apply" @click="processImage" :disabled="isProcessing">
              <span class="tool-icon">✓</span>
              {{ isProcessing ? '处理中...' : '开始处理' }}
            </button>
            <button class="download" @click="downloadResult" :disabled="!resultUrl">
              <span class="tool-icon">⭳</span>
              下载结果
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

const fileInput = ref(null)
const imageUrl = ref('')
const resultUrl = ref('')
const isProcessing = ref(false)
const backgroundType = ref('transparent')
const backgroundColor = ref('#ffffff')
const blurAmount = ref(5)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageUrl.value = URL.createObjectURL(file)
    resultUrl.value = ''
  }
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) {
    imageUrl.value = URL.createObjectURL(file)
    resultUrl.value = ''
  }
}

const processImage = async () => {
  isProcessing.value = true
  try {
    // 这里添加实际的背景移除处理逻辑
    await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟处理过程
    resultUrl.value = imageUrl.value // 临时使用原图作为结果
  } finally {
    isProcessing.value = false
  }
}

const downloadResult = () => {
  if (resultUrl.value) {
    const link = document.createElement('a')
    link.href = resultUrl.value
    link.download = 'removed_background.png'
    link.click()
  }
}
</script>

<style lang="scss" scoped>
.image-background-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.background-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
}

.preview-area {
  display: flex;
  gap: 2rem;
  
  .preview-container {
    flex: 1;
    display: flex;
    gap: 2rem;
    
    .preview {
      flex: 1;
      
      h3 {
        margin-bottom: 1rem;
        color: var(--text-primary);
        font-size: 1rem;
      }
      
      img {
        width: 100%;
        border-radius: 8px;
        border: 1px solid var(--border-color);
      }
      
      .processing {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 2rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--bg-card);
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      }
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.settings-panel {
  width: 300px;
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  
  h2 {
    margin-bottom: 1.5rem;
    color: var(--text-primary);
    font-size: 1.25rem;
  }
}

// ... 其他样式与 ImageCompress.vue 类似 ...
</style> 