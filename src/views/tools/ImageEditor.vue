<template>
  <div class="image-editor">
    <div class="tool-header">
      <h1>图片编辑工具</h1>
      <p class="tool-desc">在线图片编辑工具，支持裁剪、旋转、调整大小等基本操作</p>
      <div class="tool-actions">
        <FavoriteButton tool-id="image-editor" />
      </div>
    </div>

    <div class="editor-container">
      <div class="upload-area" v-if="!imageUrl">
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          class="file-input"
          @change="handleFileChange"
        >
        <div class="upload-content">
          <span class="upload-icon">🖼</span>
          <h3>选择或拖放图片</h3>
          <p>支持 JPG、PNG、GIF 等常见格式</p>
          <button class="upload-btn" @click="$refs.fileInput.click()">
            选择图片
          </button>
        </div>
      </div>

      <div class="editor-main" v-else>
        <div class="editor-toolbar">
          <div class="tool-group">
            <button class="tool-btn" @click="rotate(-90)" title="向左旋转">
              <span class="tool-icon">↺</span>
            </button>
            <button class="tool-btn" @click="rotate(90)" title="向右旋转">
              <span class="tool-icon">↻</span>
            </button>
            <button class="tool-btn" @click="flip('horizontal')" title="水平翻转">
              <span class="tool-icon">⇔</span>
            </button>
            <button class="tool-btn" @click="flip('vertical')" title="垂直翻转">
              <span class="tool-icon">⇕</span>
            </button>
          </div>

          <div class="tool-group">
            <button class="tool-btn" @click="setMode('crop')" :class="{ active: mode === 'crop' }">
              <span class="tool-icon">✂️</span>
              裁剪
            </button>
            <button class="tool-btn" @click="setMode('resize')" :class="{ active: mode === 'resize' }">
              <span class="tool-icon">📐</span>
              调整大小
            </button>
          </div>

          <div class="tool-group">
            <button class="tool-btn" @click="reset">
              重置
            </button>
            <button class="tool-btn primary" @click="saveImage">
              保存
            </button>
          </div>
        </div>

        <div class="editor-workspace">
          <div class="image-container" ref="imageContainer">
            <img 
              :src="imageUrl" 
              ref="imageElement"
              @load="initImage"
              :style="imageStyle"
            >
            <div v-if="mode === 'crop'" class="crop-overlay">
              <!-- 裁剪区域 -->
            </div>
          </div>

          <div v-if="mode === 'resize'" class="resize-panel">
            <div class="input-group">
              <label>宽度</label>
              <input 
                type="number" 
                v-model="resizeWidth"
                @input="updateResizeHeight"
              >
              <span>px</span>
            </div>
            <div class="input-group">
              <label>高度</label>
              <input 
                type="number" 
                v-model="resizeHeight"
                @input="updateResizeWidth"
              >
              <span>px</span>
            </div>
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="maintainAspectRatio"
              >
              保持宽高比
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFavoriteStore } from '../../stores/favorite'
import FavoriteButton from '../../components/FavoriteButton.vue'

const favoriteStore = useFavoriteStore()
const fileInput = ref(null)
const imageElement = ref(null)
const imageContainer = ref(null)
const imageUrl = ref('')
const mode = ref('') // crop, resize
const rotation = ref(0)
const flips = ref({ horizontal: false, vertical: false })
const maintainAspectRatio = ref(true)
const resizeWidth = ref(0)
const resizeHeight = ref(0)
const originalSize = ref({ width: 0, height: 0 })

// 计算图片样式
const imageStyle = computed(() => ({
  transform: `
    rotate(${rotation.value}deg)
    scaleX(${flips.value.horizontal ? -1 : 1})
    scaleY(${flips.value.vertical ? -1 : 1})
  `,
  width: mode.value === 'resize' ? `${resizeWidth.value}px` : 'auto',
  height: mode.value === 'resize' ? `${resizeHeight.value}px` : 'auto'
}))

// 处理文件选择
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imageUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 初始化图片
const initImage = () => {
  if (imageElement.value) {
    originalSize.value = {
      width: imageElement.value.naturalWidth,
      height: imageElement.value.naturalHeight
    }
    resizeWidth.value = originalSize.value.width
    resizeHeight.value = originalSize.value.height
  }
}

// 旋转图片
const rotate = (deg) => {
  rotation.value = (rotation.value + deg) % 360
}

// 翻转图片
const flip = (direction) => {
  flips.value[direction] = !flips.value[direction]
}

// 设置编辑模式
const setMode = (newMode) => {
  mode.value = mode.value === newMode ? '' : newMode
}

// 更新调整大小时的宽度
const updateResizeWidth = () => {
  if (maintainAspectRatio.value) {
    const ratio = originalSize.value.width / originalSize.value.height
    resizeWidth.value = Math.round(resizeHeight.value * ratio)
  }
}

// 更新调整大小时的高度
const updateResizeHeight = () => {
  if (maintainAspectRatio.value) {
    const ratio = originalSize.value.height / originalSize.value.width
    resizeHeight.value = Math.round(resizeWidth.value * ratio)
  }
}

// 重置编辑
const reset = () => {
  rotation.value = 0
  flips.value = { horizontal: false, vertical: false }
  mode.value = ''
  if (originalSize.value.width) {
    resizeWidth.value = originalSize.value.width
    resizeHeight.value = originalSize.value.height
  }
}

// 保存图片
const saveImage = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  // 设置画布大小
  canvas.width = resizeWidth.value
  canvas.height = resizeHeight.value
  
  // 应用变换
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((rotation.value * Math.PI) / 180)
  ctx.scale(
    flips.value.horizontal ? -1 : 1,
    flips.value.vertical ? -1 : 1
  )
  
  // 绘制图片
  ctx.drawImage(
    imageElement.value,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  )
  
  // 导出图片
  const link = document.createElement('a')
  link.download = 'edited-image.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

// 更新最后使用时间
favoriteStore.updateLastUsed('image-editor')
</script>

<style lang="scss" scoped>
.image-editor {
  padding: 2rem;
}

.editor-container {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.upload-area {
  padding: 3rem;
  text-align: center;
  
  .file-input {
    display: none;
  }
}

.upload-content {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 3rem 2rem;
  
  .upload-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
  }
}

.upload-btn {
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: var(--primary-dark);
  }
}

.editor-main {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 300px);
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  
  .tool-group {
    display: flex;
    gap: 0.5rem;
  }
}

.tool-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  .tool-icon {
    font-size: 1rem;
  }
  
  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
  
  &.active {
    background: var(--primary-50);
    color: var(--primary);
    border-color: var(--primary);
  }
  
  &.primary {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    
    &:hover {
      background: var(--primary-dark);
    }
  }
}

.editor-workspace {
  flex: 1;
  display: flex;
  padding: 1rem;
  gap: 1rem;
  overflow: auto;
}

.image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-main);
  border-radius: 8px;
  overflow: hidden;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.resize-panel {
  width: 240px;
  padding: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  
  .input-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    
    label {
      width: 3rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    
    input {
      width: 100px;
      padding: 0.375rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      
      &:focus {
        outline: none;
        border-color: var(--primary);
      }
    }
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  
  input {
    cursor: pointer;
  }
}

@media (max-width: 768px) {
  .image-editor {
    padding: 1rem;
  }
  
  .editor-main {
    height: auto;
  }
  
  .editor-toolbar {
    flex-wrap: wrap;
    gap: 0.5rem;
    
    .tool-group {
      flex: 1;
      justify-content: center;
    }
  }
  
  .editor-workspace {
    flex-direction: column;
  }
  
  .resize-panel {
    width: 100%;
  }
}
</style> 