<template>
  <div class="image-editor">
    <div class="tool-header">
      <div class="header-content">
        <h1>图片编辑工具</h1>
        <p class="tool-desc">在线图片编辑工具，支持裁剪、旋转、调整大小等基本操作</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="image-editor" />
      </div>
    </div>

    <div class="editor-container">
      <div 
        class="upload-area" 
        v-if="!imageUrl"
        @drop="handleDrop"
        @dragover="handleDragOver"
      >
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
            <button class="tool-btn" @click="setMode('filter')" :class="{ active: mode === 'filter' }">
              <span class="tool-icon">🎨</span>
              滤镜
            </button>
            <button class="tool-btn" @click="setMode('effect')" :class="{ active: mode === 'effect' }">
              <span class="tool-icon">✨</span>
              特效
            </button>
            <button class="tool-btn" @click="setMode('text')" :class="{ active: mode === 'text' }">
              <span class="tool-icon">📝</span>
              文本
            </button>
            <button class="tool-btn" @click="setMode('sticker')" :class="{ active: mode === 'sticker' }">
              <span class="tool-icon">🏷</span>
              贴纸
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

          <div class="tool-group">
            <button 
              class="tool-btn" 
              @click="undo"
              :disabled="historyIndex <= 0"
            >
              <span class="tool-icon">↩</span>
              撤销
            </button>
            <button 
              class="tool-btn" 
              @click="redo"
              :disabled="historyIndex >= history.length - 1"
            >
              <span class="tool-icon">↪</span>
              重做
            </button>
          </div>
        </div>

        <div class="editor-workspace">
          <div class="main-content">
            <div class="image-container" ref="canvasContainer">
              <!-- Canvas 将在这里动态插入 -->
            </div>
          </div>

          <div class="side-panel">
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

            <div v-if="mode === 'crop'" class="crop-panel">
              <div class="input-group">
                <label>宽度</label>
                <input 
                  type="number" 
                  v-model="cropWidth"
                  @input="updateCropHeight"
                >
                <span>px</span>
              </div>
              <div class="input-group">
                <label>高度</label>
                <input 
                  type="number" 
                  v-model="cropHeight"
                  @input="updateCropWidth"
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
              <button class="apply-btn" @click="applyCrop">
                应用裁剪
              </button>
            </div>

            <!-- 滤镜面板 -->
            <div v-if="mode === 'filter'" class="filter-panel">
              <div class="filter-list">
                <button 
                  v-for="filter in filters" 
                  :key="filter.name"
                  class="filter-btn"
                  :class="{ active: currentFilter === filter.name }"
                  @click="applyFilter(filter)"
                >
                  <div class="filter-preview" :style="{ filter: filter.style }"></div>
                  <span>{{ filter.name }}</span>
                </button>
              </div>
              <div class="filter-adjust">
                <label>强度</label>
                <input 
                  type="range" 
                  v-model="filterIntensity" 
                  min="0" 
                  max="100"
                  @input="updateFilter"
                >
              </div>
            </div>

            <!-- 特效面板 -->
            <div v-if="mode === 'effect'" class="effect-panel">
              <div class="effect-list">
                <button 
                  v-for="effect in effects" 
                  :key="effect.name"
                  class="effect-btn"
                  :class="{ active: currentEffect === effect.name }"
                  @click="applyEffect(effect)"
                >
                  <span class="effect-icon">{{ effect.icon }}</span>
                  <span>{{ effect.name }}</span>
                </button>
              </div>
            </div>

            <!-- 文本面板 -->
            <div v-if="mode === 'text'" class="text-panel">
              <div class="text-input">
                <textarea 
                  v-model="textContent"
                  placeholder="输入文本内容..."
                  rows="3"
                ></textarea>
              </div>
              <div class="text-controls">
                <div class="control-group">
                  <label>字体</label>
                  <select v-model="textStyle.fontFamily">
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="微软雅黑">微软雅黑</option>
                  </select>
                </div>
                <div class="control-group">
                  <label>大小</label>
                  <input type="number" v-model="textStyle.fontSize">
                </div>
                <div class="control-group">
                  <label>颜色</label>
                  <input type="color" v-model="textStyle.color">
                </div>
              </div>
              <button class="add-text-btn" @click="addText">添加文本</button>
            </div>

            <!-- 贴纸面板 -->
            <div v-if="mode === 'sticker'" class="sticker-panel">
              <div class="sticker-categories">
                <button 
                  v-for="category in stickerCategories" 
                  :key="category.id"
                  class="category-btn"
                  :class="{ active: currentStickerCategory === category.id }"
                  @click="selectStickerCategory(category)"
                >
                  <span class="category-icon">{{ category.icon }}</span>
                  <span>{{ category.name }}</span>
                </button>
              </div>
              <div class="sticker-grid">
                <button 
                  v-for="sticker in currentStickers" 
                  :key="sticker.id"
                  class="sticker-btn"
                  @click="addSticker(sticker)"
                >
                  <img :src="sticker.url" :alt="sticker.name">
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useFavoriteStore } from '../../stores/favorite'
import FavoriteButton from '../../components/FavoriteButton.vue'

const favoriteStore = useFavoriteStore()
const fileInput = ref(null)
const canvasContainer = ref(null)
const imageUrl = ref('')
const mode = ref('resize')
const rotation = ref(0)
const flips = ref({ horizontal: false, vertical: false })
const maintainAspectRatio = ref(true)
const resizeWidth = ref(0)
const resizeHeight = ref(0)
const originalSize = ref({ width: 0, height: 0 })

// 裁剪相关状态
const cropStart = ref({ x: 0, y: 0 })
const cropSize = ref({ width: 0, height: 0 })
const cropPosition = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragHandle = ref(null)
const cropWidth = ref(0)
const cropHeight = ref(0)
const aspectRatio = ref(1)

// 滤镜相关状态
const currentFilter = ref('')
const filterIntensity = ref(50)
const filters = [
  { name: '原始', style: 'none' },
  { name: '黑白', style: 'grayscale(100%)' },
  { name: '复古', style: 'sepia(100%)' },
  { name: '明亮', style: 'brightness(130%)' },
  { name: '对比度', style: 'contrast(150%)' },
  { name: '饱和度', style: 'saturate(200%)' },
  { name: '模糊', style: 'blur(5px)' },
]

// 特效相关状态
const currentEffect = ref('')
const effects = [
  { name: '发光', icon: '✨', style: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' },
  { name: '霓虹', icon: '🌈', style: 'drop-shadow(0 0 8px #ff00ff)' },
  { name: '浮雕', icon: '🗿', style: 'opacity(0.8) contrast(160%)' },
  { name: '噪点', icon: '📺', style: 'contrast(120%) brightness(90%)' },
]

// 文本相关状态
const textContent = ref('')
const textStyle = ref({
  fontFamily: 'Arial',
  fontSize: 24,
  color: '#000000',
})
const textElements = ref([])

// 贴纸相关状态
const currentStickerCategory = ref('')
const currentStickers = ref([])
const stickerCategories = [
  { 
    id: 'emoji',
    name: '表情', 
    icon: '😊',
    stickers: [
      { id: 1, name: '笑脸', url: '/stickers/emoji/smile.png' },
      { id: 2, name: '爱心', url: '/stickers/emoji/heart.png' },
      { id: 3, name: '星星', url: '/stickers/emoji/star.png' },
    ]
  },
  { 
    id: 'animals',
    name: '动物', 
    icon: '🐱',
    stickers: [
      { id: 4, name: '猫咪', url: '/stickers/animals/cat.png' },
      { id: 5, name: '小狗', url: '/stickers/animals/dog.png' },
      { id: 6, name: '兔子', url: '/stickers/animals/rabbit.png' },
    ]
  },
  { 
    id: 'decorative',
    name: '装饰', 
    icon: '🎨',
    stickers: [
      { id: 7, name: '边框1', url: '/stickers/decorative/frame1.png' },
      { id: 8, name: '边框2', url: '/stickers/decorative/frame2.png' },
      { id: 9, name: '花纹', url: '/stickers/decorative/pattern.png' },
    ]
  }
]

// 计算图片样式
const imageStyle = computed(() => ({
  transform: `
    rotate(${rotation.value}deg)
    scaleX(${flips.value.horizontal ? -1 : 1})
    scaleY(${flips.value.vertical ? -1 : 1})
  `,
  maxWidth: '100%',
  maxHeight: '100%',
  width: mode.value === 'resize' ? `${resizeWidth.value}px` : 'auto',
  height: mode.value === 'resize' ? `${resizeHeight.value}px` : 'auto',
  display: 'block'
}))

// 计算裁剪区域样式
const cropAreaStyle = computed(() => ({
  width: `${cropSize.value.width}px`,
  height: `${cropSize.value.height}px`,
  left: `${cropPosition.value.x}px`,
  top: `${cropPosition.value.y}px`
}))

// 添加图片容器样式计算
const imageWrapperStyle = computed(() => {
  if (!imageElement.value || !originalSize.value.width) return {}
  return {
    position: 'relative',
    maxWidth: '100%',
    maxHeight: '100%'
  }
})

// 添加遮罩层样式计算
const overlayStyle = computed(() => {
  if (!imageElement.value) return {}
  const { width, height } = imageElement.value
  return {
    width: `${width}px`,
    height: `${height}px`
  }
})

// Canvas 相关状态
const canvas = ref(null)
const ctx = ref(null)

// 添加撤销/重做功能
const history = ref([])
const historyIndex = ref(-1)

// 添加拖放处理
const handleDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    loadImage(file)
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
}

// 处理文件选择
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    loadImage(file)
  }
}

// 加载图片
const loadImage = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      // 设置图片 URL（用于重置功能）
      imageUrl.value = e.target.result
      
      // 创建 canvas
      canvas.value = document.createElement('canvas')
      canvas.value.width = img.naturalWidth
      canvas.value.height = img.naturalHeight
      
      // 设置 canvas 样式
      canvas.value.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        display: block;
      `
      
      // 获取上下文并绘制图片
      ctx.value = canvas.value.getContext('2d')
      ctx.value.drawImage(img, 0, 0)
      
      // 添加到容器
      if (canvasContainer.value) {
        canvasContainer.value.innerHTML = ''
        canvasContainer.value.appendChild(canvas.value)
      }
      
      // 保存原始尺寸
      originalSize.value = {
        width: img.naturalWidth,
        height: img.naturalHeight
      }
      
      // 初始化编辑尺寸
      resizeWidth.value = img.naturalWidth
      resizeHeight.value = img.naturalHeight
      
      // 重置其他状态
      rotation.value = 0
      flips.value = { horizontal: false, vertical: false }
      currentFilter.value = ''
      currentEffect.value = ''
      mode.value = 'resize'
      
      // 保存初始状态
      saveState()
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

// 旋转图片
const rotate = (degrees) => {
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  
  // 计算新的画布尺寸
  const angle = (rotation.value + degrees) * Math.PI / 180
  const sin = Math.abs(Math.sin(angle))
  const cos = Math.abs(Math.cos(angle))
  const width = canvas.value.width
  const height = canvas.value.height
  const newWidth = width * cos + height * sin
  const newHeight = width * sin + height * cos
  
  // 设置临时画布尺寸
  tempCanvas.width = newWidth
  tempCanvas.height = newHeight
  
  // 移动到中心点并旋转
  tempCtx.translate(newWidth / 2, newHeight / 2)
  tempCtx.rotate(angle)
  tempCtx.drawImage(
    canvas.value,
    -width / 2,
    -height / 2,
    width,
    height
  )
  
  // 更新主画布
  canvas.value.width = newWidth
  canvas.value.height = newHeight
  ctx.value.drawImage(tempCanvas, 0, 0)
  
  // 更新旋转角度
  rotation.value = (rotation.value + degrees) % 360
}

// 翻转图片
const flip = (direction) => {
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  
  tempCanvas.width = canvas.value.width
  tempCanvas.height = canvas.value.height
  
  // 根据方向进行翻转
  if (direction === 'horizontal') {
    tempCtx.translate(tempCanvas.width, 0)
    tempCtx.scale(-1, 1)
    flips.value.horizontal = !flips.value.horizontal
  } else {
    tempCtx.translate(0, tempCanvas.height)
    tempCtx.scale(1, -1)
    flips.value.vertical = !flips.value.vertical
  }
  
  tempCtx.drawImage(canvas.value, 0, 0)
  
  // 更新主画布
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  ctx.value.drawImage(tempCanvas, 0, 0)
}

// 设置编辑模式
const setMode = (newMode) => {
  mode.value = newMode
  if (newMode === 'crop') {
    initCropArea()
  } else if (newMode === 'resize') {
    // 重置为当前尺寸
    resizeWidth.value = imageElement.value?.width || originalSize.value.width
    resizeHeight.value = imageElement.value?.height || originalSize.value.height
  }
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
  const img = new Image()
  img.onload = () => {
    // 重置画布尺寸
    canvas.value.width = img.naturalWidth
    canvas.value.height = img.naturalHeight
    
    // 清除画布
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    
    // 重新绘制原始图片
    ctx.value.drawImage(img, 0, 0)
    
    // 重置所有状态
    rotation.value = 0
    flips.value = { horizontal: false, vertical: false }
    currentFilter.value = ''
    currentEffect.value = ''
    mode.value = 'resize'
    resizeWidth.value = img.naturalWidth
    resizeHeight.value = img.naturalHeight
  }
  img.src = imageUrl.value
}

// 保存图片
const saveImage = () => {
  const link = document.createElement('a')
  link.download = 'edited-image.png'
  link.href = canvas.value.toDataURL('image/png')
  link.click()
}

// 开始裁剪区域拖拽
const startCropDrag = (event) => {
  event.preventDefault()
  isDragging.value = true
  
  // 获取拖拽的手柄类型
  const handle = event.target.dataset.handle
  dragHandle.value = handle || 'move'
  
  // 记录起始位置
  cropStart.value = {
    x: event.clientX,
    y: event.clientY,
    cropX: cropPosition.value.x,
    cropY: cropPosition.value.y,
    cropWidth: cropSize.value.width,
    cropHeight: cropSize.value.height
  }
  
  // 添加全局事件监听
  document.addEventListener('mousemove', handleCropDrag)
  document.addEventListener('mouseup', endCropDrag)
}

// 处理裁剪区域拖拽
const handleCropDrag = (event) => {
  if (!isDragging.value || !imageElement.value) return
  
  const deltaX = event.clientX - cropStart.value.x
  const deltaY = event.clientY - cropStart.value.y
  const imgRect = imageElement.value.getBoundingClientRect()
  
  if (dragHandle.value === 'move') {
    // 移动整个裁剪区域
    let newX = cropStart.value.cropX + deltaX
    let newY = cropStart.value.cropY + deltaY
    
    // 限制在图片范围内
    newX = Math.max(0, Math.min(newX, imgRect.width - cropSize.value.width))
    newY = Math.max(0, Math.min(newY, imgRect.height - cropSize.value.height))
    
    cropPosition.value = { x: newX, y: newY }
  } else {
    // 调整裁剪区域大小
    let newWidth = cropStart.value.cropWidth
    let newHeight = cropStart.value.cropHeight
    let newX = cropStart.value.cropX
    let newY = cropStart.value.cropY
    
    if (dragHandle.value.includes('right')) {
      newWidth = Math.max(50, cropStart.value.cropWidth + deltaX)
    }
    if (dragHandle.value.includes('bottom')) {
      newHeight = Math.max(50, cropStart.value.cropHeight + deltaY)
    }
    if (dragHandle.value.includes('left')) {
      const width = Math.max(50, cropStart.value.cropWidth - deltaX)
      newX = cropStart.value.cropX + (cropStart.value.cropWidth - width)
      newWidth = width
    }
    if (dragHandle.value.includes('top')) {
      const height = Math.max(50, cropStart.value.cropHeight - deltaY)
      newY = cropStart.value.cropY + (cropStart.value.cropHeight - height)
      newHeight = height
    }
    
    // 保持宽高比
    if (maintainAspectRatio.value) {
      if (dragHandle.value.includes('left') || dragHandle.value.includes('right')) {
        newHeight = newWidth / aspectRatio.value
      } else {
        newWidth = newHeight * aspectRatio.value
      }
    }
    
    // 限制在图片范围内
    newWidth = Math.min(newWidth, imgRect.width - newX)
    newHeight = Math.min(newHeight, imgRect.height - newY)
    
    cropSize.value = { width: newWidth, height: newHeight }
    cropPosition.value = { x: newX, y: newY }
    
    // 更新输入框的值
    cropWidth.value = Math.round(newWidth)
    cropHeight.value = Math.round(newHeight)
  }
}

// 结束裁剪区域拖拽
const endCropDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleCropDrag)
  document.removeEventListener('mouseup', endCropDrag)
}

// 监听输入框值的变化
watch([cropWidth, cropHeight], ([newWidth, newHeight]) => {
  if (!maintainAspectRatio.value) {
    cropSize.value = {
      width: newWidth,
      height: newHeight
    }
  }
})

// 初始化裁剪区域时设置宽高比
const initCropArea = () => {
  const img = imageElement.value
  if (!img) return
  
  const imgWidth = img.width
  const imgHeight = img.height
  aspectRatio.value = imgWidth / imgHeight
  
  const initialSize = Math.min(imgWidth, imgHeight) * 0.8
  
  cropSize.value = {
    width: initialSize,
    height: initialSize
  }
  cropPosition.value = {
    x: (imgWidth - initialSize) / 2,
    y: (imgHeight - initialSize) / 2
  }
  cropWidth.value = Math.round(initialSize)
  cropHeight.value = Math.round(initialSize)
}

// 应用裁剪
const applyCrop = () => {
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = cropWidth.value
  tempCanvas.height = cropHeight.value
  const tempCtx = tempCanvas.getContext('2d')
  
  tempCtx.drawImage(
    canvas.value,
    cropPosition.value.x,
    cropPosition.value.y,
    cropSize.value.width,
    cropSize.value.height,
    0,
    0,
    cropWidth.value,
    cropHeight.value
  )
  
  // 更新主 canvas
  canvas.value.width = cropWidth.value
  canvas.value.height = cropHeight.value
  ctx.value.drawImage(tempCanvas, 0, 0)
  
  // 重置裁剪状态
  mode.value = 'resize'
}

// 监听模式变化
watch(mode, (newMode) => {
  if (newMode === 'crop') {
    initCropArea()
  }
})

// 应用滤镜
const applyFilter = (filter) => {
  currentFilter.value = filter.name
  
  // 创建临时 canvas
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = canvas.value.width
  tempCanvas.height = canvas.value.height
  const tempCtx = tempCanvas.getContext('2d')
  
  // 应用滤镜
  tempCtx.filter = filter.style
  tempCtx.drawImage(canvas.value, 0, 0)
  
  // 更新主 canvas
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  ctx.value.drawImage(tempCanvas, 0, 0)
}

// 更新滤镜强度
const updateFilter = () => {
  if (!currentFilter.value) return
  const filter = filters.find(f => f.name === currentFilter.value)
  if (!filter) return
  
  const intensity = filterIntensity.value / 100
  // 更新图片滤镜样式
}

// 应用特效
const applyEffect = (effect) => {
  currentEffect.value = effect.name
  
  // 根据特效类型处理图片
  switch (effect.type) {
    case 'blur':
      ctx.value.filter = `blur(${effect.value}px)`
      break
    case 'brightness':
      ctx.value.filter = `brightness(${effect.value}%)`
      break
    case 'contrast':
      ctx.value.filter = `contrast(${effect.value}%)`
      break
    // ... 其他特效处理
  }
  
  // 重新绘制
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = canvas.value.width
  tempCanvas.height = canvas.value.height
  const tempCtx = tempCanvas.getContext('2d')
  tempCtx.drawImage(canvas.value, 0, 0)
  
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  ctx.value.drawImage(tempCanvas, 0, 0)
}

// 添加文本
const addText = () => {
  if (!textContent.value) return
  
  ctx.value.save()
  ctx.value.font = `${textStyle.value.fontSize}px ${textStyle.value.fontFamily}`
  ctx.value.fillStyle = textStyle.value.color
  ctx.value.fillText(textContent.value, 50, 50) // 默认位置
  ctx.value.restore()
}

// 选择贴纸分类
const selectStickerCategory = (category) => {
  currentStickerCategory.value = category.id
  currentStickers.value = category.stickers
}

// 初始化时选择第一个分类
onMounted(() => {
  if (stickerCategories.length > 0) {
    selectStickerCategory(stickerCategories[0])
  }
})

// 添加贴纸到画布
const addSticker = (sticker) => {
  const img = new Image()
  img.onload = () => {
    ctx.value.drawImage(img, 50, 50, 100, 100) // 默认大小和位置
  }
  img.src = sticker.url
}

// 画布元素列表（用于存储贴纸和文本）
const canvasElements = ref([])

// 渲染画布元素
const renderCanvasElements = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  // 设置画布尺寸
  canvas.width = imageElement.value.width
  canvas.height = imageElement.value.height
  
  // 绘制原始图片
  ctx.drawImage(imageElement.value, 0, 0)
  
  // 绘制所有元素
  canvasElements.value.forEach(element => {
    if (element.type === 'sticker') {
      // 加载贴纸图片
      const img = new Image()
      img.onload = () => {
        ctx.save()
        ctx.translate(element.position.x, element.position.y)
        ctx.rotate(element.rotation * Math.PI / 180)
        ctx.drawImage(
          img, 
          -element.size.width / 2, 
          -element.size.height / 2,
          element.size.width,
          element.size.height
        )
        ctx.restore()
      }
      img.src = element.url
    } else if (element.type === 'text') {
      // 绘制文本
      ctx.save()
      ctx.font = `${element.style.fontSize}px ${element.style.fontFamily}`
      ctx.fillStyle = element.style.color
      ctx.translate(element.position.x, element.position.y)
      ctx.rotate(element.rotation * Math.PI / 180)
      ctx.fillText(element.content, 0, 0)
      ctx.restore()
    }
  })
  
  return canvas
}

// 更新最后使用时间
favoriteStore.updateLastUsed('image-editor')

// 保存当前状态
const saveState = () => {
  // 删除当前位置之后的历史记录
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }
  
  // 保存当前画布状态
  history.value.push(canvas.value.toDataURL())
  historyIndex.value++
  
  // 限制历史记录数量
  if (history.value.length > 20) {
    history.value.shift()
    historyIndex.value--
  }
}

// 撤销
const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    loadState(history.value[historyIndex.value])
  }
}

// 重做
const redo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    loadState(history.value[historyIndex.value])
  }
}

// 加载状态
const loadState = (dataUrl) => {
  const img = new Image()
  img.onload = () => {
    canvas.value.width = img.width
    canvas.value.height = img.height
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.value.drawImage(img, 0, 0)
  }
  img.src = dataUrl
}

// 在每次编辑后保存状态
watch([rotation, flips, currentFilter, currentEffect], () => {
  saveState()
})
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
  width: 100%;
  min-height: 300px;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s;
  background: var(--bg-card);
  
  &:hover {
    border-color: var(--primary);
    background: var(--primary-50);
  }
  
  .file-input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  
  .upload-content {
    text-align: center;
    padding: 2rem;
    
    .upload-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      display: block;
    }
    
    h3 {
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }
    
    p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }
    
    .upload-btn {
      padding: 0.75rem 1.5rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
      
      &:hover {
        background: var(--primary-dark);
      }
    }
  }
}

.editor-main {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 300px);
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-card);
  border-radius: 8px;
  margin-bottom: 1rem;
  
  .tool-group {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    
    @media (max-width: 1200px) {
      flex-wrap: wrap;
    }
  }
  
  .tool-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border: 2px solid var(--border-color);
    border-radius: 6px;
    background: none;
    color: var(--text-primary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    
    &:hover {
      border-color: var(--primary);
      transform: translateY(-2px);
    }
    
    &.active {
      border-color: var(--primary);
      background: var(--primary-50);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    
    &.primary {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
      
      &:hover {
        background: var(--primary-dark);
      }
    }
    
    .tool-icon {
      font-size: 1.25rem;
    }
  }
}

.editor-workspace {
  display: flex;
  gap: 1rem;
  height: 600px;
  margin: 1rem;
  background: var(--bg-card);
  border-radius: 8px;
  padding: 1rem;
  overflow: hidden;
}

.main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: hidden;
  
  .image-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    background: #f5f5f5;
    border-radius: 8px;
    padding: 1rem;
    
    canvas {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      display: block;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
}

.side-panel {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--bg-card);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
    
    &:hover {
      background: var(--text-secondary);
    }
  }
  
  .resize-panel,
  .crop-panel,
  .filter-panel,
  .effect-panel,
  .text-panel,
  .sticker-panel {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.resize-panel {
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

.crop-panel {
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

.apply-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background: var(--primary-dark);
  }
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;

  .header-content {
    flex: 1;
    
    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .tool-desc {
      color: var(--text-secondary);
      font-size: 1rem;
      line-height: 1.5;
    }
  }

  .tool-actions {
    margin-left: 1rem;
    display: flex;
    gap: 0.5rem;
  }
}

.filter-panel {
  .filter-list {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding-right: 0.5rem;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: var(--bg-card);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--border-color);
      border-radius: 3px;
      
      &:hover {
        background: var(--text-secondary);
      }
    }
  }
  
  .filter-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      border-color: var(--primary);
      transform: translateY(-2px);
    }
    
    &.active {
      border-color: var(--primary);
      background: var(--primary-50);
    }
    
    .filter-preview {
      width: 80px;
      height: 80px;
      background: #f0f0f0;
      margin-bottom: 0.75rem;
      border-radius: 6px;
      overflow: hidden;
    }
    
    span {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
  }
  
  .filter-adjust {
    flex-shrink: 0;
    padding-top: 1rem;
    margin-top: auto;
    border-top: 1px solid var(--border-color);
  }
}

.effect-panel {
  .effect-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .effect-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      border-color: var(--primary);
      transform: translateY(-2px);
    }
    
    &.active {
      border-color: var(--primary);
      background: var(--primary-50);
    }
    
    .effect-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    
    span {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
  }
}

.text-panel {
  .text-input {
    margin-bottom: 1.5rem;
    
    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      resize: vertical;
      min-height: 100px;
      font-size: 0.875rem;
      
      &:focus {
        outline: none;
        border-color: var(--primary);
      }
    }
  }
  
  .text-controls {
    flex-shrink: 0;
    display: grid;
    gap: 1rem;
    margin-bottom: 1.5rem;
    
    .control-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      
      label {
        width: 4rem;
        color: var(--text-secondary);
        font-size: 0.875rem;
      }
      
      select,
      input {
        flex: 1;
        padding: 0.5rem;
        border: 2px solid var(--border-color);
        border-radius: 6px;
        font-size: 0.875rem;
        
        &:focus {
          outline: none;
          border-color: var(--primary);
        }
      }
      
      input[type="color"] {
        padding: 0;
        width: 40px;
        height: 40px;
        border-radius: 4px;
      }
    }
  }
  
  .add-text-btn {
    margin-top: auto;
    width: 100%;
    padding: 0.75rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 0.2s;
    
    &:hover {
      background: var(--primary-dark);
    }
  }
}

.sticker-panel {
  .sticker-categories {
    flex-shrink: 0;
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
    overflow-x: auto;
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--border-color);
      border-radius: 2px;
    }
  }
  
  .category-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border: 2px solid var(--border-color);
    border-radius: 6px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
    
    &:hover {
      border-color: var(--primary);
    }
    
    &.active {
      border-color: var(--primary);
      background: var(--primary);
      color: white;
    }
    
    .category-icon {
      font-size: 1.25rem;
    }
  }
  
  .sticker-grid {
    flex: 1;
    overflow-y: auto;
    padding-right: 0.5rem;
  }
}

@media (max-width: 768px) {
  .editor-workspace {
    flex-direction: column;
    height: auto;
    overflow: visible;
  }

  .main-content {
    height: 400px;
  }

  .side-panel {
    width: 100%;
    height: auto;
    max-height: 400px;
  }
  
  .image-container {
    height: 400px;
  }
  
  .editor-main {
    height: auto;
  }
  
  .editor-toolbar {
    padding: 0.75rem;
    gap: 0.75rem;
    
    .tool-group {
      flex: none;
      width: auto;
      justify-content: flex-start;
    }
    
    .tool-btn {
      padding: 0.375rem 0.5rem;
      font-size: 0.8125rem;
      
      .tool-icon {
        font-size: 1rem;
      }
    }
  }
  
  .resize-panel {
    width: 100%;
  }

  .tool-header {
    flex-direction: column;
    gap: 1rem;
    
    .tool-actions {
      margin-left: 0;
      align-self: flex-end;
    }
  }
}

@media (max-width: 480px) {
  .editor-toolbar {
    padding: 0.5rem;
    gap: 0.5rem;
    
    .tool-group {
      width: 100%;
      justify-content: space-between;
    }
  }
}
</style> 