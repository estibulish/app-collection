<template>
  <div class="image-editor">
    <div class="editor-toolbar">
      <div class="tool-group">
        <button 
          v-for="tool in tools" 
          :key="tool.name"
          class="tool-btn"
          :class="{ active: currentTool === tool.name }"
          @click="selectTool(tool.name)"
          :title="tool.label"
        >
          <span class="tool-icon">{{ tool.icon }}</span>
          {{ tool.label }}
        </button>
      </div>
      
      <div class="tool-group">
        <button 
          class="tool-btn"
          @click="rotateLeft"
          title="向左旋转90°"
        >
          <span class="tool-icon">↺</span>
        </button>
        <button 
          class="tool-btn"
          @click="rotateRight"
          title="向右旋转90°"
        >
          <span class="tool-icon">↻</span>
        </button>
        <button 
          class="tool-btn"
          @click="flipHorizontal"
          title="水平翻转"
        >
          <span class="tool-icon">⇔</span>
        </button>
        <button 
          class="tool-btn"
          @click="flipVertical"
          title="垂直翻转"
        >
          <span class="tool-icon">⇕</span>
        </button>
      </div>
      
      <div class="action-group">
        <button 
          class="action-btn" 
          @click="undo" 
          :disabled="!canUndo"
          title="撤销"
        >
          <span class="tool-icon">↩</span>
        </button>
        <button 
          class="action-btn" 
          @click="redo" 
          :disabled="!canRedo"
          title="重做"
        >
          <span class="tool-icon">↪</span>
        </button>
        <button 
          class="action-btn" 
          @click="reset"
          title="重置"
        >
          <span class="tool-icon">⟲</span>
        </button>
        <button 
          class="action-btn primary" 
          @click="save"
          title="保存"
        >
          <span class="tool-icon">💾</span>
        </button>
      </div>
    </div>

    <div class="editor-main">
      <div class="canvas-wrapper">
        <div 
          class="canvas-container" 
          ref="canvasContainer"
          :class="{
            'can-move': currentTool === 'move',
            'is-moving': isDragging,
            'is-cropping': currentTool === 'crop'
          }"
        >
          <canvas 
            ref="canvas"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
          ></canvas>
          
          <!-- 裁剪遮罩 -->
          <div v-if="currentTool === 'crop'" class="crop-container">
            <div class="crop-mask"></div>
            <div 
              class="crop-area"
              :style="{
                left: cropArea.x + 'px',
                top: cropArea.y + 'px',
                width: cropArea.width + 'px',
                height: cropArea.height + 'px'
              }"
              @mousedown="startCropDrag"
            >
              <div class="crop-grid"></div>
              <div 
                v-for="handle in ['tl', 'tm', 'tr', 'ml', 'mr', 'bl', 'bm', 'br']"
                :key="handle"
                :class="['handle-point', handle]"
                @mousedown.stop="startResize(handle)"
              ></div>
            </div>
          </div>

          <!-- 修改浮动文本输入框 -->
          <div 
            v-if="textInput.show"
            class="floating-text-input"
            :style="{
              left: textInput.x + 'px',
              top: textInput.y + 'px',
              width: textInput.width + 'px',
              height: textInput.height + 'px'
            }"
            @mousedown="startTextDrag"
            @mousemove="moveTextInput"
            @mouseup="endTextDrag"
            @mouseleave="endTextDrag"
          >
            <div class="text-input-header">
              <span class="drag-handle">⋮⋮</span>
            </div>
            <textarea
              v-model="textOptions.content"
              :style="{
                fontSize: textOptions.size + 'px',
                fontFamily: textOptions.font,
                color: textOptions.color
              }"
              @keydown.enter.exact.prevent="applyText"
              @keydown.esc="cancelText"
              ref="textArea"
              placeholder="输入文字..."
              autofocus
            ></textarea>
          </div>
        </div>
      </div>

      <div class="editor-panel">
        <!-- 裁剪工具面板 -->
        <div v-if="currentTool === 'crop'" class="tool-panel">
          <h3>裁剪设置</h3>
          <div class="panel-content">
            <button class="apply" @click="applyCrop">
              <span class="tool-icon">✓</span>
              应用裁剪
            </button>
            <button class="cancel" @click="cancelCrop">
              <span class="tool-icon">✕</span>
              取消
            </button>
          </div>
        </div>

        <!-- 调整工具面板 -->
        <div v-if="currentTool === 'adjust'" class="tool-panel">
          <h3>图像调整</h3>
          <div class="panel-content">
            <div class="adjust-item">
              <label>亮度</label>
              <div class="adjust-controls">
                <input 
                  type="range" 
                  v-model="adjustments.brightness" 
                  min="-100" 
                  max="100" 
                  @input="applyAdjustments"
                >
                <input 
                  type="number" 
                  v-model="adjustments.brightness"
                  min="-100" 
                  max="100"
                  @input="applyAdjustments"
                >
              </div>
            </div>
            
            <div class="adjust-item">
              <label>对比度</label>
              <div class="adjust-controls">
                <input 
                  type="range" 
                  v-model="adjustments.contrast" 
                  min="-100" 
                  max="100" 
                  @input="applyAdjustments"
                >
                <input 
                  type="number" 
                  v-model="adjustments.contrast"
                  min="-100" 
                  max="100"
                  @input="applyAdjustments"
                >
              </div>
            </div>
            
            <div class="adjust-item">
              <label>饱和度</label>
              <div class="adjust-controls">
                <input 
                  type="range" 
                  v-model="adjustments.saturation" 
                  min="-100" 
                  max="100" 
                  @input="applyAdjustments"
                >
                <input 
                  type="number" 
                  v-model="adjustments.saturation"
                  min="-100" 
                  max="100"
                  @input="applyAdjustments"
                >
              </div>
            </div>

            <div class="panel-actions">
              <button class="apply" @click="applyAdjustments">
                <span class="tool-icon">✓</span>
                应用调整
              </button>
              <button class="cancel" @click="cancelAdjustments">
                <span class="tool-icon">✕</span>
                取消
              </button>
            </div>
          </div>
        </div>

        <!-- 滤镜工具面板 -->
        <div v-if="currentTool === 'filter'" class="tool-panel">
          <h3>滤镜效果</h3>
          <div class="panel-content">
            <div class="filter-list">
              <button 
                v-for="filter in filters" 
                :key="filter.name"
                :class="{ active: currentFilter === filter.name }"
                @click="selectFilter(filter)"
              >
                {{ filter.label }}
              </button>
            </div>
            
            <div v-if="currentFilter !== 'none'" class="filter-strength">
              <label>强度</label>
              <div class="adjust-controls">
                <input 
                  type="range" 
                  v-model="filterStrength" 
                  :min="0" 
                  :max="getMaxStrength(currentFilter)" 
                  @input="applyFilter(currentFilter)"
                >
                <input 
                  type="number" 
                  v-model="filterStrength"
                  :min="0" 
                  :max="getMaxStrength(currentFilter)"
                  @input="applyFilter(currentFilter)"
                >
              </div>
            </div>

            <div class="panel-actions">
              <button class="apply" @click="applyFilterAndSave">
                <span class="tool-icon">✓</span>
                应用滤镜
              </button>
              <button class="cancel" @click="cancelFilter">
                <span class="tool-icon">✕</span>
                取消
              </button>
            </div>
          </div>
        </div>

        <!-- 绘画工具面板 -->
        <div v-if="currentTool === 'draw'" class="tool-panel">
          <h3>绘画工具</h3>
          <div class="panel-content">
            <label>
              画笔颜色
              <input type="color" v-model="drawOptions.color">
            </label>
            <label>
              画笔大小
              <input 
                type="range" 
                v-model="drawOptions.size" 
                min="1" 
                max="50"
              >
            </label>

            <div class="panel-actions">
              <button class="apply" @click="applyDraw">
                <span class="tool-icon">✓</span>
                完成绘画
              </button>
              <button class="cancel" @click="cancelDraw">
                <span class="tool-icon">✕</span>
                取消
              </button>
            </div>
          </div>
        </div>

        <!-- 文字工具面板 -->
        <div v-if="currentTool === 'text'" class="tool-panel">
          <h3>文字工具</h3>
          <div class="panel-content">
            <div class="text-input">
              <textarea 
                v-model="textOptions.content"
                placeholder="输入文字内容"
                rows="3"
              ></textarea>
            </div>
            
            <div class="text-options">
              <label>
                字体大小
                <input 
                  type="number" 
                  v-model="textOptions.size"
                  min="12"
                  max="100"
                >
              </label>
              
              <label>
                字体颜色
                <input type="color" v-model="textOptions.color">
              </label>
              
              <label>
                字体
                <select v-model="textOptions.font">
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Microsoft YaHei">微软雅黑</option>
                  <option value="SimSun">宋体</option>
                </select>
              </label>
            </div>

            <div class="panel-actions">
              <button class="apply" @click="applyText">
                <span class="tool-icon">✓</span>
                添加文字
              </button>
              <button class="cancel" @click="cancelText">
                <span class="tool-icon">✕</span>
                取消
              </button>
            </div>
          </div>
        </div>

        <!-- 形状工具面板 -->
        <div v-if="currentTool === 'shape'" class="tool-panel">
          <h3>形状工具</h3>
          <div class="panel-content">
            <div class="shape-types">
              <button 
                v-for="shape in shapes" 
                :key="shape.type"
                :class="{ active: shapeOptions.type === shape.type }"
                @click="shapeOptions.type = shape.type"
              >
                <span class="shape-icon">{{ shape.icon }}</span>
                <span class="shape-label">{{ shape.label }}</span>
              </button>
            </div>
            
            <label>
              线条颜色
              <div class="color-with-alpha">
                <input type="color" v-model="shapeOptions.strokeColor">
                <input 
                  type="range" 
                  v-model="shapeOptions.strokeAlpha"
                  min="0"
                  max="100"
                  step="1"
                >
              </div>
            </label>
            
            <label>
              填充颜色
              <div class="color-with-alpha">
                <input type="color" v-model="shapeOptions.fillColor">
                <input 
                  type="range" 
                  v-model="shapeOptions.fillAlpha"
                  min="0"
                  max="100"
                  step="1"
                >
              </div>
            </label>
            
            <label>
              线条宽度
              <input 
                type="range" 
                v-model="shapeOptions.strokeWidth"
                min="1"
                max="20"
              >
            </label>
          </div>

          <div class="panel-actions">
            <button class="apply" @click="applyShape">
              <span class="tool-icon">✓</span>
              添加形状
            </button>
            <button class="cancel" @click="cancelShape">
              <span class="tool-icon">✕</span>
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted,computed } from 'vue'

// Props
const props = defineProps({
  image: {
    type: String,
    required: true
  }
})

// Emits
const emit = defineEmits(['save'])

// Refs
const canvas = ref(null)
const canvasContainer = ref(null)
const ctx = ref(null)
const originalImage = ref(null)
const history = ref([])
const historyIndex = ref(-1)

// State
const currentTool = ref('move')
const isDrawing = ref(false)
const drawOptions = ref({
  color: '#000000',
  size: 5
})
const adjustments = ref({
  brightness: 0,
  contrast: 0,
  saturation: 0
})
const currentFilter = ref('none')

// 工具列表
const tools = [
  { name: 'move', label: '移动', icon: '✥' },
  { name: 'crop', label: '裁剪', icon: '✂' },
  { name: 'adjust', label: '调整', icon: '⚙' },
  { name: 'filter', label: '滤镜', icon: '🎨' },
  { name: 'draw', label: '绘画', icon: '✏' },
  { name: 'text', label: '文字', icon: '📝' },
  { name: 'shape', label: '形状', icon: '⬡' },
]

// 滤镜列表
const filters = [
  { name: 'none', label: '原图' },
  { name: 'grayscale', label: '黑白', cssFilter: 'grayscale', unit: '%', defaultStrength: 100 },
  { name: 'sepia', label: '复古', cssFilter: 'sepia', unit: '%', defaultStrength: 100 },
  { name: 'blur', label: '模糊', cssFilter: 'blur', unit: 'px', defaultStrength: 5 },
  { name: 'brightness', label: '明亮', cssFilter: 'brightness', unit: '%', defaultStrength: 150 },
  { name: 'contrast', label: '对比度', cssFilter: 'contrast', unit: '%', defaultStrength: 150 },
  { name: 'saturate', label: '饱和度', cssFilter: 'saturate', unit: '%', defaultStrength: 200 }
]

// 计算属性
const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.value.length - 1)

// 添加旋转和翻转相关的状态
const rotation = ref(0)
const flips = ref({ horizontal: false, vertical: false })

// 添加图片状态
const imageState = ref({
  x: 0,
  y: 0,
  scale: 1,
  width: 0,
  height: 0
})

// 添加移动功能
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

// 裁剪状态
const cropArea = ref({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  isMoving: false,
  isResizing: false,
  currentHandle: null,
  startX: 0,
  startY: 0
})

// 添加防抖函数
const debounce = (fn, delay) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 保存原始图像数据
const originalImageData = ref(null)

// 添加滤镜强度状态
const filterStrength = ref(100)

// 修改文字工具状态
const textOptions = ref({
  content: '',
  size: 24,
  color: '#000000',
  font: 'Arial',
  x: 0,
  y: 0,
  isEditing: false // 新增：是否正在编辑
})

// 添加文本输入框状态
const textInput = ref({
  show: false,
  x: 0,
  y: 0,
  width: 200,
  height: 100
})

// 添加形状工具状态
const shapeOptions = ref({
  type: 'rect',
  strokeColor: '#000000',
  strokeAlpha: 100,
  fillColor: '#ffffff',
  fillAlpha: 100,
  strokeWidth: 2,
  x: 0,
  y: 0,
  isDrawing: false
})

// 修改形状列表，添加更多图形
const shapes = [
  { type: 'rect', icon: '⬜', label: '矩形' },
  { type: 'circle', icon: '⭕', label: '圆形' },
  { type: 'line', icon: '➖', label: '直线' },
  { type: 'arrow', icon: '➡', label: '箭头' },
  { type: 'triangle', icon: '△', label: '三角形' },
  { type: 'diamond', icon: '◇', label: '菱形' },
  { type: 'pentagon', icon: '⬟', label: '五边形' },
  { type: 'star', icon: '★', label: '星形' },
  { type: 'heart', icon: '♥', label: '心形' },
  { type: 'cloud', icon: '☁', label: '云形' }
]

// 添加拖动相关状态
const textDragging = ref(false)
const textDragStart = ref({ x: 0, y: 0 })

// 初始化
onMounted(() => {
  initCanvas()
  loadImage()
  
  window.addEventListener('resize', handleResize)
  window.addEventListener('mousedown', handleClickOutside)
})

// 清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousedown', handleClickOutside)
})

// 初始化画布
const initCanvas = () => {
  if (!canvas.value || !canvasContainer.value) return
  
  const container = canvasContainer.value
  const rect = container.getBoundingClientRect()
  
  // 设置画布尺寸为容器的实际尺寸
  canvas.value.width = rect.width
  canvas.value.height = rect.height
  
  ctx.value = canvas.value.getContext('2d')
}

// 加载图片
const loadImage = () => {
  const img = new Image()
  img.onload = () => {
    originalImage.value = img
    drawImage()
    saveState()
  }
  img.src = props.image
}

// 绘制图片
const drawImage = () => {
  const img = originalImage.value
  if (!img || !ctx.value || !canvas.value) return
  
  // 首次加载时初始化图片状态
  if (imageState.value.width === 0) {
    // 计算图片缩放比例以适应画布
    const scale = Math.min(
      canvas.value.width / img.width,
      canvas.value.height / img.height
    ) * 0.9 // 留一些边距
    
    imageState.value = {
      width: img.width * scale,
      height: img.height * scale,
      x: (canvas.value.width - img.width * scale) / 2,
      y: (canvas.value.height - img.height * scale) / 2,
      scale
    }
  }
  
  // 清空画布
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  // 保存当前上下文状态
  ctx.value.save()
  
  // 移动到图片中心点
  ctx.value.translate(
    imageState.value.x + imageState.value.width / 2,
    imageState.value.y + imageState.value.height / 2
  )
  
  // 应用旋转
  ctx.value.rotate((rotation.value * Math.PI) / 180)
  
  // 应用翻转
  ctx.value.scale(
    flips.value.horizontal ? -1 : 1,
    flips.value.vertical ? -1 : 1
  )
  
  // 绘制图片
  ctx.value.drawImage(
    img,
    -imageState.value.width / 2,
    -imageState.value.height / 2,
    imageState.value.width,
    imageState.value.height
  )
  
  // 恢复上下文状态
  ctx.value.restore()
}

// 保存状态
const saveState = () => {
  const imageData = ctx.value.getImageData(
    0, 0,
    canvas.value.width,
    canvas.value.height
  )
  
  // 删除当前状态之后的历史记录
  history.value.splice(historyIndex.value + 1)
  history.value.push(imageData)
  historyIndex.value++
}

// 撤销
const undo = () => {
  if (!canUndo.value) return
  
  historyIndex.value--
  ctx.value.putImageData(history.value[historyIndex.value], 0, 0)
}

// 重做
const redo = () => {
  if (!canRedo.value) return
  
  historyIndex.value++
  ctx.value.putImageData(history.value[historyIndex.value], 0, 0)
}

// 选择工具
const selectTool = (toolName) => {
  if (currentTool.value === toolName) return
  
  // 保存当前工具的状态
  if (currentTool.value === 'text' && textOptions.value.content) {
    drawText()
    saveState()
  } else if (currentTool.value === 'shape' && shapeOptions.value.isDrawing) {
    shapeOptions.value.isDrawing = false
    saveState()
  }
  
  currentTool.value = toolName
  
  // 初始化裁剪区域
  if (toolName === 'crop') {
    const padding = 50 // 留出边距
    cropArea.value = {
      x: imageState.value.x + padding,
      y: imageState.value.y + padding,
      width: imageState.value.width - padding * 2,
      height: imageState.value.height - padding * 2,
      isMoving: false,
      isResizing: false,
      currentHandle: null,
      startX: 0,
      startY: 0
    }
  } else if (toolName === 'text') {
    // ... 其他工具的初始化保持不变
  }
}

// 修改鼠标事件处理
const handleMouseDown = (e) => {
  if (!canvas.value) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  switch (currentTool.value) {
    case 'move':
      startMove(e)
      break
    case 'draw':
      startDraw(e)
      break
    case 'text':
      // 只有当没有显示文本输入框时，才显示新的输入框
      if (!textInput.value.show) {
        showTextInput(x, y)
      }
      break
    case 'shape':
      shapeOptions.value.x = x
      shapeOptions.value.y = y
      shapeOptions.value.isDrawing = true
      break
  }
}

const handleMouseMove = (e) => {
  if (!canvas.value) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  switch (currentTool.value) {
    case 'move':
      moving(e)
      break
    case 'draw':
      drawing(e)
      break
    case 'shape':
      if (shapeOptions.value.isDrawing) {
        drawShape(x, y)
      }
      break
  }
}

const handleMouseUp = () => {
  switch (currentTool.value) {
    case 'move':
      endMove()
      break
    case 'draw':
      endDraw()
      break
    case 'shape':
      if (shapeOptions.value.isDrawing) {
        shapeOptions.value.isDrawing = false
        saveState()
      }
      break
  }
}

// 绘画相关
const startDraw = (e) => {
  if (currentTool.value !== 'draw') return
  
  isDrawing.value = true
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  ctx.value.beginPath()
  ctx.value.moveTo(x, y)
}

const drawing = (e) => {
  if (!isDrawing.value || currentTool.value !== 'draw') return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  ctx.value.lineTo(x, y)
  ctx.value.strokeStyle = drawOptions.value.color
  ctx.value.lineWidth = drawOptions.value.size
  ctx.value.lineCap = 'round'
  ctx.value.stroke()
}

const endDraw = () => {
  if (!isDrawing.value) return
  
  isDrawing.value = false
  saveState()
}

// 修改应用滤镜的函数
const applyFilter = (filterName) => {
  if (!ctx.value || !canvas.value || !originalImage.value) return
  
  // 清空画布
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  if (filterName === 'none') {
    drawImage()
    saveState()
    return
  }
  
  const filter = filters.find(f => f.name === filterName)
  if (!filter) return
  
  // 保存当前上下文状态
  ctx.value.save()
  
  // 移动到图片中心点
  ctx.value.translate(
    imageState.value.x + imageState.value.width / 2,
    imageState.value.y + imageState.value.height / 2
  )
  
  // 应用旋转
  ctx.value.rotate((rotation.value * Math.PI) / 180)
  
  // 应用翻转
  ctx.value.scale(
    flips.value.horizontal ? -1 : 1,
    flips.value.vertical ? -1 : 1
  )
  
  // 应用滤镜
  ctx.value.filter = `${filter.cssFilter}(${filterStrength.value}${filter.unit})`
  
  // 从原始图像绘制
  ctx.value.drawImage(
    originalImage.value,
    -imageState.value.width / 2,
    -imageState.value.height / 2,
    imageState.value.width,
    imageState.value.height
  )
  
  // 重置滤镜和恢复上下文
  ctx.value.filter = 'none'
  ctx.value.restore()
}

// 使用防抖优化的调整函数
const applyAdjustments = debounce(() => {
  if (!ctx.value || !canvas.value || !originalImageData.value) return
  
  // 使用原始图像数据
  const imageData = new ImageData(
    new Uint8ClampedArray(originalImageData.value.data),
    originalImageData.value.width,
    originalImageData.value.height
  )
  const data = imageData.data
  
  // 预计算调整参数
  const brightness = 1 + adjustments.value.brightness / 100
  const contrast = adjustments.value.contrast // 直接使用对比度值
  const saturation = 1 + adjustments.value.saturation / 100
  
  // 计算对比度的查找表
  const contrastLookup = new Uint8Array(256)
  for (let i = 0; i < 256; i++) {
    contrastLookup[i] = Math.max(0, Math.min(255,
      Math.round(((i / 255 - 0.5) * (contrast / 100 + 1) + 0.5) * 255)
    ))
  }
  
  // 使用批量处理优化性能
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i]
    let g = data[i + 1]
    let b = data[i + 2]
    
    // 亮度调整
    if (adjustments.value.brightness !== 0) {
      r *= brightness
      g *= brightness
      b *= brightness
    }
    
    // 对比度调整
    if (adjustments.value.contrast !== 0) {
      r = contrastLookup[r]
      g = contrastLookup[g]
      b = contrastLookup[b]
    }
    
    // 饱和度调整
    if (adjustments.value.saturation !== 0) {
      const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b
      r = gray + saturation * (r - gray)
      g = gray + saturation * (g - gray)
      b = gray + saturation * (b - gray)
    }
    
    // 限制值范围
    data[i] = Math.max(0, Math.min(255, r))
    data[i + 1] = Math.max(0, Math.min(255, g))
    data[i + 2] = Math.max(0, Math.min(255, b))
  }
  
  ctx.value.putImageData(imageData, 0, 0)
  saveState()
}, 16)

// 保存图片
const save = () => {
  const dataUrl = canvas.value.toDataURL('image/png')
  emit('save', dataUrl)
}

// 处理窗口大小变化
const handleResize = () => {
  initCanvas()
  drawImage() // 重新绘制图片
}

// 旋转相关函数
const rotateLeft = () => {
  rotation.value = (rotation.value - 90) % 360
  applyTransforms()
}

const rotateRight = () => {
  rotation.value = (rotation.value + 90) % 360
  applyTransforms()
}

// 翻转相关函数
const flipHorizontal = () => {
  flips.value.horizontal = !flips.value.horizontal
  applyTransforms()
}

const flipVertical = () => {
  flips.value.vertical = !flips.value.vertical
  applyTransforms()
}

// 应用变换
const applyTransforms = () => {
  drawImage()
  saveState()
}

// 重置函数
const reset = () => {
  rotation.value = 0
  flips.value = { horizontal: false, vertical: false }
  imageState.value = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    scale: 1
  }
  drawImage()
  saveState()
}

// 添加移动功能
const startMove = (e) => {
  if (currentTool.value !== 'move') return
  
  isDragging.value = true
  dragStart.value = {
    x: e.clientX - imageState.value.x,
    y: e.clientY - imageState.value.y
  }
}

const moving = (e) => {
  if (!isDragging.value || currentTool.value !== 'move') return
  
  imageState.value.x = e.clientX - dragStart.value.x
  imageState.value.y = e.clientY - dragStart.value.y
  drawImage()
}

const endMove = () => {
  if (isDragging.value) {
    isDragging.value = false
    saveState()
  }
}

// 选择裁剪工具时初始化裁剪区域
const initCropArea = () => {
  const rect = canvas.value.getBoundingClientRect()
  const img = originalImage.value
  
  if (!img) return
  
  // 计算图片在画布中的实际显示区域
  const imgRect = {
    x: imageState.value.x,
    y: imageState.value.y,
    width: imageState.value.width,
    height: imageState.value.height
  }
  
  // 设置裁剪框为正方形，边长为图片较短边的60%
  const cropSize = Math.min(imgRect.width, imgRect.height) * 0.6
  
  cropArea.value = {
    x: imgRect.x + (imgRect.width - cropSize) / 2,
    y: imgRect.y + (imgRect.height - cropSize) / 2,
    width: cropSize,
    height: cropSize,
    isMoving: false,
    isResizing: false,
    currentHandle: null,
    startX: 0,
    startY: 0
  }
}

// 开始拖动裁剪框
const startCropDrag = (e) => {
  if (e.target.classList.contains('handle-point')) return
  
  cropArea.value.isMoving = true
  cropArea.value.startX = e.clientX - cropArea.value.x
  cropArea.value.startY = e.clientY - cropArea.value.y
  
  window.addEventListener('mousemove', moveCropArea)
  window.addEventListener('mouseup', endCropDrag)
}

// 移动裁剪框
const moveCropArea = (e) => {
  if (!cropArea.value.isMoving) return
  
  const rect = canvas.value.getBoundingClientRect()
  let newX = e.clientX - cropArea.value.startX
  let newY = e.clientY - cropArea.value.startY
  
  // 限制在画布范围内
  newX = Math.max(0, Math.min(newX, rect.width - cropArea.value.width))
  newY = Math.max(0, Math.min(newY, rect.height - cropArea.value.height))
  
  cropArea.value.x = newX
  cropArea.value.y = newY
}

// 结束拖动
const endCropDrag = () => {
  cropArea.value.isMoving = false
  window.removeEventListener('mousemove', moveCropArea)
  window.removeEventListener('mouseup', endCropDrag)
}

// 开始调整大小
const startResize = (handle) => {
  cropArea.value.isResizing = true
  cropArea.value.currentHandle = handle
  cropArea.value.startX = cropArea.value.x
  cropArea.value.startY = cropArea.value.y
  
  window.addEventListener('mousemove', resizeCropArea)
  window.addEventListener('mouseup', endResize)
}

// 调整裁剪框大小
const resizeCropArea = (e) => {
  if (!cropArea.value.isResizing) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const deltaX = x - cropArea.value.startX
  const deltaY = y - cropArea.value.startY
  
  const handle = cropArea.value.currentHandle
  let newX = cropArea.value.x
  let newY = cropArea.value.y
  let newWidth = cropArea.value.width
  let newHeight = cropArea.value.height
  
  // 根据不同的调整点计算新的位置和尺寸
  switch (handle) {
    case 'tl': // 左上角
      newX = Math.min(cropArea.value.x + cropArea.value.width - MIN_CROP_SIZE, cropArea.value.x + deltaX)
      newY = Math.min(cropArea.value.y + cropArea.value.height - MIN_CROP_SIZE, cropArea.value.y + deltaY)
      newWidth = cropArea.value.width - (newX - cropArea.value.x)
      newHeight = cropArea.value.height - (newY - cropArea.value.y)
      break
    case 'tm': // 上中
      newHeight = cropArea.value.y + cropArea.value.height - y
      if (newHeight >= MIN_CROP_SIZE) newY = y
      break
    case 'tr': // 右上
      newWidth = x - cropArea.value.x
      newHeight = cropArea.value.y + cropArea.value.height - y
      if (newHeight >= MIN_CROP_SIZE) newY = y
      break
    case 'ml': // 左中
      newWidth = cropArea.value.x + cropArea.value.width - x
      if (newWidth >= MIN_CROP_SIZE) newX = x
      break
    case 'mr': // 右中
      newWidth = x - cropArea.value.x
      break
    case 'bl': // 左下
      newWidth = cropArea.value.x + cropArea.value.width - x
      newHeight = y - cropArea.value.y
      if (newWidth >= MIN_CROP_SIZE) newX = x
      break
    case 'bm': // 下中
      newHeight = y - cropArea.value.y
      break
    case 'br': // 右下
      newWidth = x - cropArea.value.x
      newHeight = y - cropArea.value.y
      break
  }
  
  // 限制裁剪框在图片范围内
  newX = Math.max(imageState.value.x, Math.min(newX, imageState.value.x + imageState.value.width - MIN_CROP_SIZE))
  newY = Math.max(imageState.value.y, Math.min(newY, imageState.value.y + imageState.value.height - MIN_CROP_SIZE))
  newWidth = Math.max(MIN_CROP_SIZE, Math.min(newWidth, imageState.value.x + imageState.value.width - newX))
  newHeight = Math.max(MIN_CROP_SIZE, Math.min(newHeight, imageState.value.y + imageState.value.height - newY))
  
  // 更新裁剪区域
  cropArea.value = {
    ...cropArea.value,
    x: newX,
    y: newY,
    width: newWidth,
    height: newHeight,
    startX: x,
    startY: y
  }
}

// 结束调整大小
const endResize = () => {
  cropArea.value.isResizing = false
  window.removeEventListener('mousemove', resizeCropArea)
  window.removeEventListener('mouseup', endResize)
}

// 应用裁剪
const applyCrop = () => {
  const rect = canvas.value.getBoundingClientRect()
  const scaleX = canvas.value.width / rect.width
  const scaleY = canvas.value.height / rect.height
  
  // 计算实际裁剪区域
  const cropX = cropArea.value.x * scaleX
  const cropY = cropArea.value.y * scaleY
  const cropWidth = cropArea.value.width * scaleX
  const cropHeight = cropArea.value.height * scaleY
  
  // 保存当前画布尺寸
  const canvasWidth = canvas.value.width
  const canvasHeight = canvas.value.height
  
  // 创建临时画布存储裁剪的内容
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = cropWidth
  tempCanvas.height = cropHeight
  const tempCtx = tempCanvas.getContext('2d')
  
  // 将裁剪区域复制到临时画布
  const imageData = ctx.value.getImageData(cropX, cropY, cropWidth, cropHeight)
  tempCtx.putImageData(imageData, 0, 0)
  
  // 清空主画布
  ctx.value.clearRect(0, 0, canvasWidth, canvasHeight)
  
  // 计算新的图片状态
  const scale = Math.min(
    canvasWidth / cropWidth,
    canvasHeight / cropHeight
  ) * 0.9 // 留一些边距
  
  // 更新图片状态
  imageState.value = {
    width: cropWidth * scale,
    height: cropHeight * scale,
    x: (canvasWidth - cropWidth * scale) / 2,
    y: (canvasHeight - cropHeight * scale) / 2,
    scale
  }
  
  // 在主画布上绘制裁剪后的图片
  ctx.value.drawImage(
    tempCanvas,
    imageState.value.x,
    imageState.value.y,
    imageState.value.width,
    imageState.value.height
  )
  
  // 更新原始图片
  const img = new Image()
  img.onload = () => {
    originalImage.value = img
  }
  img.src = tempCanvas.toDataURL()
  
  // 退出裁剪模式
  currentTool.value = 'move'
  saveState()
}

// 取消裁剪
const cancelCrop = () => {
  currentTool.value = 'move'
  drawImage()
}

// 修改选择滤镜的函数
const selectFilter = (filter) => {
  currentFilter.value = filter.name
  if (filter.name !== 'none') {
    filterStrength.value = filter.defaultStrength
  }
  applyFilter(filter.name)
}

// 修改获取最大强度值的函数
const getMaxStrength = (filterName) => {
  const filter = filters.find(f => f.name === filterName)
  if (!filter) return 100
  
  switch (filterName) {
    case 'blur':
      return 20
    case 'brightness':
    case 'contrast':
    case 'saturate':
      return 200
    default:
      return 100
  }
}

// 取消调整
const cancelAdjustments = () => {
  adjustments.value = {
    brightness: 0,
    contrast: 0,
    saturation: 0
  }
  drawImage()
  currentTool.value = 'move'
}

// 取消滤镜
const cancelFilter = () => {
  currentFilter.value = 'none'
  filterStrength.value = 100
  drawImage()
  currentTool.value = 'move'
}

// 修改完成绘画的函数
const applyDraw = () => {
  if (!ctx.value || !canvas.value || !originalImage.value) return
  
  // 创建临时画布
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = originalImage.value.width
  tempCanvas.height = originalImage.value.height
  const tempCtx = tempCanvas.getContext('2d')
  
  // 绘制原始图片
  tempCtx.drawImage(originalImage.value, 0, 0)
  
  // 计算缩放比例
  const scaleX = originalImage.value.width / imageState.value.width
  const scaleY = originalImage.value.height / imageState.value.height
  
  // 将当前画布内容缩放并绘制到临时画布
  tempCtx.save()
  tempCtx.scale(scaleX, scaleY)
  tempCtx.translate(-imageState.value.x, -imageState.value.y)
  tempCtx.drawImage(canvas.value, 0, 0)
  tempCtx.restore()
  
  // 更新原始图片
  const img = new Image()
  img.onload = () => {
    originalImage.value = img
    
    // 重新绘制到主画布，保持当前的位置和大小
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    drawImage()
    saveState()
    
    // 切换到移动工具
    currentTool.value = 'move'
  }
  img.src = tempCanvas.toDataURL()
}

// 修改取消绘画的函数
const cancelDraw = () => {
  // 恢复到最后一个保存的状态
  if (historyIndex.value >= 0) {
    ctx.value.putImageData(history.value[historyIndex.value], 0, 0)
  } else {
    drawImage()
  }
  currentTool.value = 'move'
}

// 修改应用滤镜按钮的点击处理
const applyFilterAndSave = () => {
  if (!ctx.value || !canvas.value || !originalImage.value) return
  
  // 创建临时画布
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = originalImage.value.width
  tempCanvas.height = originalImage.value.height
  const tempCtx = tempCanvas.getContext('2d')
  
  // 在临时画布上应用滤镜
  const filter = filters.find(f => f.name === currentFilter.value)
  if (filter) {
    tempCtx.filter = `${filter.cssFilter}(${filterStrength.value}${filter.unit})`
  }
  
  // 绘制原始大小的图片
  tempCtx.drawImage(originalImage.value, 0, 0)
  
  // 重置滤镜
  tempCtx.filter = 'none'
  
  // 更新原始图片
  const img = new Image()
  img.onload = () => {
    originalImage.value = img
    
    // 重新绘制到主画布，保持当前的位置和大小
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    drawImage()
    saveState()
    
    // 切换到移动工具
    currentTool.value = 'move'
  }
  img.src = tempCanvas.toDataURL()
}

// 修改文字工具相关函数
const showTextInput = (x, y) => {
  textInput.value = {
    show: true,
    x,
    y,
    width: 200,
    height: 100
  }
  textOptions.value.x = x
  textOptions.value.y = y
  textOptions.value.isEditing = true
}

// 修改重置文字工具状态函数
const resetTextTool = () => {
  textOptions.value.content = ''
  textOptions.value.isEditing = false
  textInput.value.show = false
  // 不再自动切换到移动工具
  // currentTool.value = 'move'
}

// 修改应用文字函数
const applyText = () => {
  if (!textOptions.value.content.trim()) {
    resetTextTool()
    return
  }
  
  // 创建临时画布
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = originalImage.value.width
  tempCanvas.height = originalImage.value.height
  const tempCtx = tempCanvas.getContext('2d')
  
  // 绘制原始图片
  tempCtx.drawImage(originalImage.value, 0, 0)
  
  // 计算缩放比例
  const scaleX = originalImage.value.width / imageState.value.width
  const scaleY = originalImage.value.height / imageState.value.height
  
  // 绘制文字到临时画布
  tempCtx.save()
  tempCtx.scale(scaleX, scaleY)
  tempCtx.translate(-imageState.value.x, -imageState.value.y)
  
  // 设置文字样式
  tempCtx.font = `${textOptions.value.size}px ${textOptions.value.font}`
  tempCtx.fillStyle = textOptions.value.color
  tempCtx.textBaseline = 'top'
  
  // 绘制文字
  const lines = textOptions.value.content.split('\n')
  const lineHeight = textOptions.value.size * 1.2
  
  lines.forEach((line, index) => {
    tempCtx.fillText(
      line,
      textOptions.value.x,
      textOptions.value.y + index * lineHeight
    )
  })
  
  tempCtx.restore()
  
  // 更新原始图片
  const img = new Image()
  img.onload = () => {
    originalImage.value = img
    
    // 重新绘制到主画布，保持当前的位置和大小
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    drawImage()
    saveState()
    
    // 重置文字工具状态
    resetTextTool()
  }
  img.src = tempCanvas.toDataURL()
}

// 修改文字绘制函数（用于预览）
const drawText = () => {
  if (!ctx.value || !textOptions.value.content) return
  
  // 恢复上一个状态
  if (historyIndex.value >= 0) {
    ctx.value.putImageData(history.value[historyIndex.value], 0, 0)
  }
  
  // 绘制文字
  ctx.value.save()
  ctx.value.font = `${textOptions.value.size}px ${textOptions.value.font}`
  ctx.value.fillStyle = textOptions.value.color
  ctx.value.textBaseline = 'top'
  
  const lines = textOptions.value.content.split('\n')
  const lineHeight = textOptions.value.size * 1.2
  
  lines.forEach((line, index) => {
    ctx.value.fillText(
      line,
      textOptions.value.x,
      textOptions.value.y + index * lineHeight
    )
  })
  
  ctx.value.restore()
}

// 形状工具相关函数
const drawShape = (currentX, currentY) => {
  if (!ctx.value || !shapeOptions.value.isDrawing) return
  
  // 恢复到上一个状态
  if (historyIndex.value >= 0) {
    ctx.value.putImageData(history.value[historyIndex.value], 0, 0)
  }
  
  ctx.value.save()
  
  // 设置样式
  ctx.value.strokeStyle = shapeOptions.value.strokeColor
  ctx.value.fillStyle = shapeOptions.value.fillColor
  ctx.value.globalAlpha = shapeOptions.value.fillAlpha / 100
  
  const width = currentX - shapeOptions.value.x
  const height = currentY - shapeOptions.value.y
  
  switch (shapeOptions.value.type) {
    case 'rect':
      // 先填充
      ctx.value.fillRect(shapeOptions.value.x, shapeOptions.value.y, width, height)
      // 再描边
      ctx.value.globalAlpha = shapeOptions.value.strokeAlpha / 100
      ctx.value.lineWidth = shapeOptions.value.strokeWidth
      ctx.value.strokeRect(shapeOptions.value.x, shapeOptions.value.y, width, height)
      break
      
    case 'circle':
      const radius = Math.sqrt(width * width + height * height)
      ctx.value.beginPath()
      ctx.value.arc(shapeOptions.value.x, shapeOptions.value.y, radius, 0, Math.PI * 2)
      if (shapeOptions.value.fillAlpha > 0) {
        ctx.value.fill()
      }
      if (shapeOptions.value.strokeAlpha > 0) {
        ctx.value.stroke()
      }
      break
      
    case 'line':
      ctx.value.beginPath()
      ctx.value.moveTo(shapeOptions.value.x, shapeOptions.value.y)
      ctx.value.lineTo(currentX, currentY)
      ctx.value.stroke()
      break
      
    case 'arrow':
      drawArrow(shapeOptions.value.x, shapeOptions.value.y, currentX, currentY)
      break
      
    case 'triangle':
      ctx.value.beginPath()
      ctx.value.moveTo(shapeOptions.value.x + width/2, shapeOptions.value.y)
      ctx.value.lineTo(shapeOptions.value.x, shapeOptions.value.y + height)
      ctx.value.lineTo(shapeOptions.value.x + width, shapeOptions.value.y + height)
      ctx.value.closePath()
      ctx.value.fill()
      ctx.value.stroke()
      break
      
    case 'diamond':
      ctx.value.beginPath()
      ctx.value.moveTo(shapeOptions.value.x + width/2, shapeOptions.value.y)
      ctx.value.lineTo(shapeOptions.value.x + width, shapeOptions.value.y + height/2)
      ctx.value.lineTo(shapeOptions.value.x + width/2, shapeOptions.value.y + height)
      ctx.value.lineTo(shapeOptions.value.x, shapeOptions.value.y + height/2)
      ctx.value.closePath()
      ctx.value.fill()
      ctx.value.stroke()
      break
      
    case 'pentagon':
      drawRegularPolygon(5, width, height)
      break
      
    case 'star':
      drawStar(width, height)
      break
      
    case 'heart':
      drawHeart(width, height)
      break
      
    case 'cloud':
      drawCloud(width, height)
      break
  }
  
  ctx.value.restore()
}

const drawArrow = (fromX, fromY, toX, toY) => {
  const headLength = 20
  const angle = Math.atan2(toY - fromY, toX - fromX)
  
  ctx.value.beginPath()
  ctx.value.moveTo(fromX, fromY)
  ctx.value.lineTo(toX, toY)
  
  ctx.value.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  )
  ctx.value.moveTo(toX, toY)
  ctx.value.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6)
  )
  
  ctx.value.stroke()
}

const drawRegularPolygon = (sides, width, height) => {
  const radius = Math.min(Math.abs(width), Math.abs(height)) / 2
  const centerX = shapeOptions.value.x + width/2
  const centerY = shapeOptions.value.y + height/2
  
  ctx.value.beginPath()
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI / sides) - Math.PI/2
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    if (i === 0) ctx.value.moveTo(x, y)
    else ctx.value.lineTo(x, y)
  }
  ctx.value.closePath()
  ctx.value.fill()
  ctx.value.stroke()
}

const drawStar = (width, height) => {
  const radius = Math.min(Math.abs(width), Math.abs(height)) / 2
  const centerX = shapeOptions.value.x + width/2
  const centerY = shapeOptions.value.y + height/2
  const spikes = 5
  const outerRadius = radius
  const innerRadius = radius/2
  
  ctx.value.beginPath()
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius
    const angle = (i * Math.PI / spikes) - Math.PI/2
    const x = centerX + r * Math.cos(angle)
    const y = centerY + r * Math.sin(angle)
    if (i === 0) ctx.value.moveTo(x, y)
    else ctx.value.lineTo(x, y)
  }
  ctx.value.closePath()
  ctx.value.fill()
  ctx.value.stroke()
}

const drawHeart = (width, height) => {
  const centerX = shapeOptions.value.x + width/2
  const centerY = shapeOptions.value.y + height/2
  const size = Math.min(Math.abs(width), Math.abs(height)) / 2
  
  ctx.value.beginPath()
  ctx.value.moveTo(centerX, centerY + size)
  ctx.value.bezierCurveTo(
    centerX + size, centerY, 
    centerX + size, centerY - size/2,
    centerX, centerY - size
  )
  ctx.value.bezierCurveTo(
    centerX - size, centerY - size/2,
    centerX - size, centerY,
    centerX, centerY + size
  )
  ctx.value.fill()
  ctx.value.stroke()
}

const drawCloud = (width, height) => {
  const centerX = shapeOptions.value.x + width/2
  const centerY = shapeOptions.value.y + height/2
  const radius = Math.min(Math.abs(width), Math.abs(height)) / 4
  
  ctx.value.beginPath()
  ctx.value.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.value.arc(centerX - radius, centerY, radius * 0.8, 0, Math.PI * 2)
  ctx.value.arc(centerX + radius, centerY, radius * 0.8, 0, Math.PI * 2)
  ctx.value.arc(centerX, centerY - radius/2, radius * 0.8, 0, Math.PI * 2)
  ctx.value.fill()
  ctx.value.stroke()
}

const endShape = () => {
  if (!shapeOptions.value.isDrawing) return
  shapeOptions.value.isDrawing = false
  // 不再自动保存状态，等用户点击保存按钮时再保存
}

// 修改形状工具的保存函数
const applyShape = () => {
  if (!ctx.value || !canvas.value || !originalImage.value) return
  
  // 创建临时画布
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = canvas.value.width
  tempCanvas.height = canvas.value.height
  const tempCtx = tempCanvas.getContext('2d')
  
  // 复制当前画布内容到临时画布
  tempCtx.drawImage(canvas.value, 0, 0)
  
  // 更新原始图片
  const img = new Image()
  img.onload = () => {
    originalImage.value = img
    
    // 重新绘制到主画布
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    drawImage()
    saveState()
    
    // 重置形状状态但不切换工具
    shapeOptions.value = {
      ...shapeOptions.value,
      x: 0,
      y: 0,
      isDrawing: false
    }
  }
  img.src = tempCanvas.toDataURL()
}

// 修改取消形状函数
const cancelShape = () => {
  // 恢复到上一个状态
  if (historyIndex.value >= 0) {
    ctx.value.putImageData(history.value[historyIndex.value], 0, 0)
  } else {
    drawImage()
  }
  
  // 重置形状状态但不切换工具
  shapeOptions.value = {
    ...shapeOptions.value,
    x: 0,
    y: 0,
    isDrawing: false
  }
}

// 修改文字输入框相关函数
const startTextDrag = (e) => {
  if (e.target.tagName === 'TEXTAREA') return // 如果点击的是文本框则不触发拖动
  
  textDragging.value = true
  textDragStart.value = {
    x: e.clientX - textInput.value.x,
    y: e.clientY - textInput.value.y
  }
}

const moveTextInput = (e) => {
  if (!textDragging.value) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - textDragStart.value.x
  const y = e.clientY - textDragStart.value.y
  
  // 限制在画布范围内
  textInput.value.x = Math.max(0, Math.min(x, rect.width - textInput.value.width))
  textInput.value.y = Math.max(0, Math.min(y, rect.height - textInput.value.height))
  
  // 同步更新文字位置
  textOptions.value.x = textInput.value.x
  textOptions.value.y = textInput.value.y
}

const endTextDrag = () => {
  textDragging.value = false
}

// 修改点击外部关闭功能
const handleClickOutside = (e) => {
  if (!textInput.value.show) return
  
  // 检查点击是否在文本输入框或画布工具面板内
  const textInputEl = document.querySelector('.floating-text-input')
  const toolPanel = document.querySelector('.tool-panel')
  
  if (!textInputEl?.contains(e.target) && 
      !toolPanel?.contains(e.target) && 
      e.target.tagName !== 'CANVAS') {
    applyText()
  }
}

// 添加颜色转换函数
const convertColorToRGBA = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// 修改形状工具的重置函数
const resetShapeOptions = () => {
  shapeOptions.value = {
    ...shapeOptions.value,
    x: 0,
    y: 0,
    isDrawing: false
  }
}

// 修改裁剪框的最小尺寸限制
const MIN_CROP_SIZE = 50 // 最小 50px
</script>

<style lang="scss" scoped>
.image-editor {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 700px;
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
}

.editor-toolbar {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-card);
  z-index: 1;
  
  .tool-group {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    padding: 0 1rem;
    
    &:not(:last-child) {
      border-right: 1px solid var(--border-color);
    }
  }

  .action-group {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
}

.editor-main {
  flex: 1;
  display: flex;
  min-height: 0;
  position: relative;
  
  .canvas-wrapper {
    flex: 1;
    position: relative;
    overflow: hidden;
    background: #f0f0f0;
    
    .canvas-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.can-move {
        cursor: move;
      }
      
      &.is-moving {
        cursor: grabbing;
      }
      
      // 添加裁剪相关样式
      &.is-cropping {
        cursor: crosshair;
        
        .crop-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          
          .crop-mask {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
          }
          
          .crop-area {
            position: absolute;
            border: 2px solid #fff;
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
            pointer-events: all; // 确保可以接收事件
            cursor: move;

            .crop-grid {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              pointer-events: none;

              &::before,
              &::after {
                content: '';
                position: absolute;
                background: rgba(255, 255, 255, 0.5);
              }

              &::before {
                left: 33.33%;
                width: 1px;
                height: 100%;
                box-shadow: 33.33% 0 0 rgba(255, 255, 255, 0.5);
              }

              &::after {
                top: 33.33%;
                height: 1px;
                width: 100%;
                box-shadow: 0 33.33% 0 rgba(255, 255, 255, 0.5);
              }
            }

            .handle-point {
              position: absolute;
              width: 12px;
              height: 12px;
              background: #fff;
              border: 1px solid rgba(0, 0, 0, 0.3);
              border-radius: 50%;
              pointer-events: all; // 确保可以接收事件
              z-index: 2;

              &:hover {
                transform: scale(1.2);
                background: var(--primary);
              }

              &.tl { top: -6px; left: -6px; cursor: nw-resize; }
              &.tm { top: -6px; left: 50%; margin-left: -6px; cursor: n-resize; }
              &.tr { top: -6px; right: -6px; cursor: ne-resize; }
              &.ml { top: 50%; left: -6px; margin-top: -6px; cursor: w-resize; }
              &.mr { top: 50%; right: -6px; margin-top: -6px; cursor: e-resize; }
              &.bl { bottom: -6px; left: -6px; cursor: sw-resize; }
              &.bm { bottom: -6px; left: 50%; margin-left: -6px; cursor: s-resize; }
              &.br { bottom: -6px; right: -6px; cursor: se-resize; }
            }
          }
        }
      }
      
      canvas {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 100%;
        max-height: 100%;
        z-index: 0;
      }
    }
  }
  
  .editor-panel {
    width: 250px;
    flex-shrink: 0;
    border-left: 1px solid var(--border-color);
    background: var(--bg-card);
    padding: 1rem;
    overflow-y: auto;
  }
}

.tool-panel {
  h3 {
    margin-bottom: 1rem;
    color: var(--text-primary);
    font-size: 1rem;
    font-weight: 500;
  }
  
  .panel-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    
    // 添加通用按钮样式
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      
      &.apply {
        background: var(--primary);
        border-color: var(--primary);
        color: white;
        
        &:hover {
          background: var(--primary-dark);
        }
      }
      
      &.cancel {
        background: transparent;
        
        &:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
      }
      
      .tool-icon {
        margin-right: 0.25rem;
      }
    }
    
    // 通用输入控件样式
    label {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    input[type="color"] {
      width: 100%;
      height: 36px;
      padding: 2px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      cursor: pointer;
      
      &::-webkit-color-swatch-wrapper {
        padding: 0;
      }
      
      &::-webkit-color-swatch {
        border: none;
        border-radius: 2px;
      }
    }
    
    input[type="range"] {
      width: 100%;
      height: 6px;
      -webkit-appearance: none;
      background: var(--border-color);
      border-radius: 3px;
      
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--primary);
        cursor: pointer;
      }
    }
    
    input[type="number"],
    select {
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: 0.875rem;
      
      &:focus {
        border-color: var(--primary);
        outline: none;
      }
    }
    
    textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      resize: vertical;
      min-height: 80px;
      font-size: 0.875rem;
      
      &:focus {
        border-color: var(--primary);
        outline: none;
      }
    }
    
    // 调整控件组
    .adjust-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      input[type="range"] {
        flex: 1;
      }
      
      input[type="number"] {
        width: 60px;
        text-align: center;
        
        &::-webkit-inner-spin-button {
          opacity: 1;
          height: 20px;
        }
      }
    }
    
    // 滤镜列表
    .filter-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      
      button {
        flex: 1;
        min-width: 80px;
        padding: 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-card);
        color: var(--text-primary);
        font-size: 0.875rem;
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
  }
  
  // 面板底部操作按钮
  .panel-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
    
    button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      
      &.apply {
        background: var(--primary);
        border-color: var(--primary);
        color: white;
        
        &:hover {
          background: var(--primary-dark);
        }
      }
      
      &.cancel {
        background: transparent;
        
        &:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
      }
      
      .tool-icon {
        margin-right: 0.25rem;
      }
    }
  }
}

.tool-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
  
  .tool-icon {
    font-size: 1.125rem;
  }
  
  &:hover {
    border-color: var(--primary);
    background: var(--primary-50);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &.active {
    background: var(--primary);
    border-color: var(--primary);
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      border-color: var(--border-color);
      background: var(--bg-card);
    }
  }
}

.action-btn {
  @extend .tool-btn;
  
  &.primary {
    background: var(--primary);
    border-color: var(--primary);
    color: white;
    
    &:hover {
      background: var(--primary-dark);
    }
  }
}

@media (max-width: 768px) {
  .editor-toolbar {
    flex-direction: column;
    gap: 1rem;
    
    .tool-group,
    .action-group {
      width: 100%;
      justify-content: center;
    }
  }
  
  .editor-main {
    flex-direction: column;
    
    .canvas-wrapper {
      height: 400px;
    }
    
    .editor-panel {
      width: 100%;
      border-left: none;
      border-top: 1px solid var(--border-color);
    }
  }
}

.text-input {
  textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    resize: vertical;
    font-size: 0.875rem;
    
    &:focus {
      border-color: var(--primary);
      outline: none;
    }
  }
}

.text-options,
.shape-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  input[type="number"],
  select {
    padding: 0.25rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 0.875rem;
    
    &:focus {
      border-color: var(--primary);
      outline: none;
    }
  }
  
  input[type="color"] {
    width: 100%;
    height: 40px;
    padding: 2px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    cursor: pointer;
  }
}

.shape-types {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem; // 改为正值，给下面的按钮留出空间
  
  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--border-color);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 3px;
  }
  
  button {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem;
    min-width: 50px; // 减小最小宽度
    border: 1px solid var(--border-color); // 添加边框
    border-radius: 4px; // 添加圆角
    background: var(--bg-card);
    cursor: pointer;
    transition: all 0.2s;
    
    .shape-icon {
      font-size: 1.25rem; // 减小图标大小
    }
    
    .shape-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    &:hover {
      border-color: var(--primary);
      background: var(--primary-50);
      
      .shape-label {
        color: var(--primary);
      }
    }
    
    &.active {
      background: var(--primary);
      border-color: var(--primary);
      
      .shape-icon,
      .shape-label {
        color: white;
      }
    }
  }
}

.canvas-container {
  position: relative;
  // ... 其他样式保持不变 ...
  
  .floating-text-input {
    position: absolute;
    z-index: 10;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    
    .text-input-header {
      padding: 4px;
      border-bottom: 1px solid var(--border-color);
      cursor: move;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .drag-handle {
        color: var(--text-secondary);
        font-size: 12px;
        letter-spacing: -1px;
        user-select: none;
      }
    }
    
    textarea {
      flex: 1;
      width: 100%;
      padding: 8px;
      background: transparent;
      border: none;
      resize: both;
      outline: none;
      overflow: auto;
      
      &::placeholder {
        color: var(--text-secondary);
        opacity: 0.5;
      }
    }
    
    &:hover {
      border-color: var(--primary);
    }
  }
}

.color-with-alpha {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  
  input[type="color"] {
    flex: 0 0 60px;
    height: 30px;
  }
  
  input[type="range"] {
    flex: 1;
    height: 6px;
    -webkit-appearance: none;
    background: var(--border-color);
    border-radius: 3px;
    
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--primary);
      cursor: pointer;
    }
  }
}
</style> 