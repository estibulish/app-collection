<template>
  <div class="image-compress">
    <div class="tool-header">
      <h1>图片压缩工具</h1>
      <p class="tool-desc">在线图片压缩工具，支持JPG、PNG等格式，快速压缩不失真</p>
    </div>

    <div class="upload-zone" 
      @dragover.prevent 
      @drop.prevent="handleDrop"
      :class="{ 'is-dragover': isDragover }"
      @dragenter="isDragover = true"
      @dragleave="isDragover = false"
    >
      <div class="upload-content">
        <div class="upload-icon">📁</div>
        <div class="upload-text">
          <template v-if="!isProcessing">
            拖放图片到这里，或
            <label class="upload-button">
              点击上传
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                @change="handleFileSelect"
                ref="fileInput"
              >
            </label>
          </template>
          <template v-else>
            正在处理中...
          </template>
        </div>
        <div class="upload-hint">支持 JPG、PNG 格式，最大 10MB</div>
      </div>
    </div>

    <div class="settings-panel" v-if="imageList.length > 0">
      <h2>压缩设置</h2>
      <div class="settings-group">
        <label class="setting-item">
          <span>压缩质量</span>
          <div class="quality-slider">
            <input 
              type="range" 
              v-model="quality" 
              min="0" 
              max="100" 
              step="1"
            >
            <span class="quality-value">{{ quality }}%</span>
          </div>
        </label>
        <label class="setting-item">
          <span>最大宽度</span>
          <input 
            type="number" 
            v-model="maxWidth" 
            min="100" 
            step="100"
            placeholder="不限制"
          >
        </label>
        <label class="setting-item">
          <span>保持格式</span>
          <input type="checkbox" v-model="keepFormat">
        </label>
      </div>
      <div class="settings-actions">
        <button class="action-btn primary" @click="compressAll" :disabled="isProcessing">
          开始压缩
        </button>
        <button class="action-btn" @click="clearAll" :disabled="isProcessing">
          清空列表
        </button>
      </div>
    </div>

    <div class="image-list" v-if="imageList.length > 0">
      <div 
        v-for="(image, index) in imageList" 
        :key="index"
        class="image-item"
        :class="{ 'is-compressed': image.compressed }"
      >
        <div class="image-preview">
          <img :src="image.preview" :alt="image.file.name">
        </div>
        <div class="image-info">
          <div class="image-name">{{ image.file.name }}</div>
          <div class="image-size">
            <template v-if="image.compressed">
              {{ formatSize(image.file.size) }} → {{ formatSize(image.compressedSize) }}
              <span class="compress-rate">
                ({{ calculateRate(image.file.size, image.compressedSize) }})
              </span>
            </template>
            <template v-else>
              {{ formatSize(image.file.size) }}
            </template>
          </div>
          <div class="image-status">
            <template v-if="image.error">
              <span class="status-error">{{ image.error }}</span>
            </template>
            <template v-else-if="image.compressed">
              <button class="action-btn small" @click="downloadImage(image)">下载</button>
              <button class="action-btn small" @click="removeImage(index)">删除</button>
            </template>
            <template v-else>
              <span class="status-waiting">等待压缩</span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="batch-actions" v-if="hasCompressedImages">
      <button class="action-btn primary" @click="downloadAll">
        打包下载全部
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const isDragover = ref(false)
const isProcessing = ref(false)
const imageList = ref([])
const fileInput = ref(null)

// 压缩设置
const quality = ref(80)
const maxWidth = ref('')
const keepFormat = ref(true)

// 计算属性
const hasCompressedImages = computed(() => {
  return imageList.value.some(image => image.compressed)
})

// 处理文件拖放
const handleDrop = (e) => {
  isDragover.value = false
  const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
  if (files.length > 0) {
    addImages(files)
  }
}

// 处理文件选择
const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  if (files.length > 0) {
    addImages(files)
  }
  // 重置 input 以允许选择相同文件
  fileInput.value.value = ''
}

// 添加图片到列表
const addImages = (files) => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  files.forEach(file => {
    if (file.size > maxSize) {
      alert(`文件 ${file.name} 超过10MB限制`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      imageList.value.push({
        file,
        preview: e.target.result,
        compressed: false,
        compressedSize: 0,
        compressedBlob: null,
        error: null
      })
    }
    reader.readAsDataURL(file)
  })
}

// 压缩单张图片
const compressImage = (image) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      // 限制最大宽度
      if (maxWidth.value && width > maxWidth.value) {
        height = Math.round((maxWidth.value * height) / width)
        width = maxWidth.value
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      // 确定输出格式
      let outputType = keepFormat.value ? image.file.type : 'image/jpeg'
      
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('压缩失败'))
          return
        }
        resolve(blob)
      }, outputType, quality.value / 100)
    }
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = image.preview
  })
}

// 压缩所有图片
const compressAll = async () => {
  if (isProcessing.value) return
  isProcessing.value = true

  try {
    for (const image of imageList.value) {
      if (!image.compressed && !image.error) {
        try {
          const compressedBlob = await compressImage(image)
          image.compressedBlob = compressedBlob
          image.compressedSize = compressedBlob.size
          image.compressed = true
        } catch (err) {
          image.error = err.message
        }
      }
    }
  } finally {
    isProcessing.value = false
  }
}

// 下载单张图片
const downloadImage = (image) => {
  if (!image.compressed || !image.compressedBlob) return
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(image.compressedBlob)
  link.download = `compressed_${image.file.name}`
  link.click()
  URL.revokeObjectURL(link.href)
}

// 打包下载所有压缩后的图片
const downloadAll = async () => {
  const zip = new JSZip()
  const compressedImages = imageList.value.filter(img => img.compressed)

  compressedImages.forEach(image => {
    zip.file(`compressed_${image.file.name}`, image.compressedBlob)
  })

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, 'compressed_images.zip')
}

// 移除单张图片
const removeImage = (index) => {
  imageList.value.splice(index, 1)
}

// 清空列表
const clearAll = () => {
  imageList.value = []
}

// 格式化文件大小
const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

// 计算压缩率
const calculateRate = (original, compressed) => {
  const rate = ((original - compressed) / original * 100).toFixed(1)
  return `-${rate}%`
}
</script>

<style lang="scss" scoped>
.image-compress {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.tool-header {
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .tool-desc {
    color: var(--text-secondary);
    font-size: 1rem;
  }
}

.upload-zone {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.2s;
  margin-bottom: 2rem;

  &.is-dragover {
    border-color: var(--primary);
    background: rgba(59, 130, 246, 0.05);
  }
}

.upload-content {
  .upload-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .upload-text {
    font-size: 1.125rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .upload-hint {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
}

.upload-button {
  color: var(--primary);
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }

  input {
    display: none;
  }
}

.settings-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
  }
}

.settings-group {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  span {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  input[type="number"] {
    width: 120px;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 0.875rem;
    background: var(--bg-main);
    color: var(--text-primary);

    &:focus {
      outline: none;
      border-color: var(--primary);
    }
  }
}

.quality-slider {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;

  input[type="range"] {
    flex: 1;
    height: 4px;
    -webkit-appearance: none;
    background: var(--border-color);
    border-radius: 2px;
    outline: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--primary);
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .quality-value {
    min-width: 3.5rem;
    text-align: right;
    color: var(--text-primary);
    font-size: 0.875rem;
  }
}

.settings-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-main);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: var(--primary);
    color: var(--primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.primary {
    background: var(--primary);
    border-color: var(--primary);
    color: white;

    &:hover:not(:disabled) {
      background: var(--primary-dark);
    }
  }

  &.small {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}

.image-list {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.image-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;

  &.is-compressed {
    border-color: #10b981;
  }
}

.image-preview {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.image-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.image-name {
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-size {
  color: var(--text-secondary);
  font-size: 0.75rem;

  .compress-rate {
    color: #10b981;
  }
}

.image-status {
  display: flex;
  gap: 0.5rem;
  align-items: center;

  .status-waiting {
    color: var(--text-tertiary);
    font-size: 0.75rem;
  }

  .status-error {
    color: #dc2626;
    font-size: 0.75rem;
  }
}

.batch-actions {
  text-align: center;
}

@media (max-width: 768px) {
  .image-compress {
    padding: 1.5rem 1rem;
  }

  .tool-header {
    margin-bottom: 1.5rem;

    h1 {
      font-size: 1.75rem;
    }
  }

  .upload-zone {
    padding: 2rem 1rem;
  }

  .settings-panel {
    padding: 1.25rem;
  }

  .image-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .image-preview {
    width: 120px;
    height: 120px;
  }

  .image-status {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .tool-header h1 {
    font-size: 1.5rem;
  }

  .settings-group {
    gap: 0.75rem;
  }

  .setting-item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;

    span {
      font-size: 0.8125rem;
    }
  }

  .quality-slider {
    .quality-value {
      font-size: 0.8125rem;
    }
  }
}
</style> 