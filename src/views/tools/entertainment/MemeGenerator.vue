<template>
  <div class="meme-generator-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>表情包生成器</h1>
        <p class="tool-desc">在线制作各种流行表情包，添加自定义文字</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="meme-generator" />
      </div>
    </div>

    <div class="editor-container">
      <div class="canvas-area">
        <canvas 
          ref="canvas"
          @mousedown="startDragging"
          @mousemove="onDragging"
          @mouseup="stopDragging"
          @mouseleave="stopDragging"
        ></canvas>
      </div>

      <div class="tools-panel">
        <div class="panel-section">
          <h3>模板选择</h3>
          <div class="template-grid">
            <div 
              v-for="template in templates" 
              :key="template.id"
              class="template-item"
              @click="selectTemplate(template)"
            >
              <img :src="template.url" :alt="template.name">
            </div>
          </div>
        </div>

        <div class="panel-section">
          <h3>文字设置</h3>
          <div class="text-controls">
            <div class="text-input">
              <textarea 
                v-model="currentText.content"
                placeholder="输入文字内容"
                @input="updateText"
              ></textarea>
            </div>
            
            <div class="text-options">
              <div class="option-group">
                <label>字体大小</label>
                <input 
                  type="number" 
                  v-model.number="currentText.size"
                  min="12"
                  max="72"
                  @input="updateText"
                >
              </div>
              
              <div class="option-group">
                <label>字体颜色</label>
                <input 
                  type="color" 
                  v-model="currentText.color"
                  @input="updateText"
                >
              </div>
              
              <div class="option-group">
                <label>描边颜色</label>
                <input 
                  type="color" 
                  v-model="currentText.strokeColor"
                  @input="updateText"
                >
              </div>
              
              <div class="option-group">
                <label>描边宽度</label>
                <input 
                  type="number" 
                  v-model.number="currentText.strokeWidth"
                  min="0"
                  max="10"
                  step="0.5"
                  @input="updateText"
                >
              </div>
            </div>

            <div class="text-actions">
              <button @click="addNewText">添加文字</button>
              <button 
                v-if="selectedTextIndex !== -1"
                @click="removeText(selectedTextIndex)"
              >删除文字</button>
            </div>
          </div>
        </div>

        <div class="panel-section">
          <h3>导出设置</h3>
          <div class="export-controls">
            <div class="option-group">
              <label>图片格式</label>
              <select v-model="exportFormat">
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
              </select>
            </div>
            
            <div class="option-group">
              <label>图片质量</label>
              <input 
                type="range" 
                v-model.number="exportQuality"
                min="0.1"
                max="1.0"
                step="0.1"
              >
              <span>{{ Math.round(exportQuality * 100) }}%</span>
            </div>
            
            <button class="export-btn" @click="exportImage">导出图片</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

// 画布相关
const canvas = ref(null)
const ctx = ref(null)
const baseImage = ref(null)

// 状态管理
const isDragging = ref(false)
const selectedTextIndex = ref(-1)
const dragStartPos = reactive({ x: 0, y: 0 })

// 文字列表
const texts = ref([])
const currentText = reactive({
  content: '',
  size: 32,
  color: '#ffffff',
  strokeColor: '#000000',
  strokeWidth: 2,
  x: 50,
  y: 50
})

// 导出设置
const exportFormat = ref('png')
const exportQuality = ref(0.9)

// 模板列表
const templates = [
  { id: 1, name: '模板1', url: '/src/assets/meme-templates/template1.jpg' },
  { id: 2, name: '模板2', url: '/src/assets/meme-templates/template2.jpg' },
  { id: 3, name: '模板3', url: '/src/assets/meme-templates/template3.jpg' },
  // ... 添加更多模板
]

// 初始化画布
onMounted(() => {
  initCanvas()
})

const initCanvas = () => {
  const canvasEl = canvas.value
  ctx.value = canvasEl.getContext('2d')
  
  // 设置初始大小
  canvasEl.width = 500
  canvasEl.height = 500
  
  // 添加白色背景
  const context = ctx.value
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvasEl.width, canvasEl.height)
  
  render()
}

// 渲染画布
const render = () => {
  const context = ctx.value
  const canvasEl = canvas.value
  
  // 清空画布并填充白色背景
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvasEl.width, canvasEl.height)
  
  // 绘制背景图
  if (baseImage.value) {
    context.drawImage(baseImage.value, 0, 0, canvasEl.width, canvasEl.height)
  }
  
  // 绘制所有文字
  texts.value.forEach((text, index) => {
    context.save()
    
    // 设置文字样式
    context.font = `${text.size}px Arial`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    
    // 绘制描边
    if (text.strokeWidth > 0) {
      context.strokeStyle = text.strokeColor
      context.lineWidth = text.strokeWidth
      context.strokeText(text.content, text.x, text.y)
    }
    
    // 绘制文字
    context.fillStyle = text.color
    context.fillText(text.content, text.x, text.y)
    
    // 如果是选中的文字，绘制边框
    if (index === selectedTextIndex.value) {
      const metrics = context.measureText(text.content)
      const height = text.size
      
      context.strokeStyle = '#00ff00'
      context.lineWidth = 1
      context.strokeRect(
        text.x - metrics.width / 2 - 5,
        text.y - height / 2 - 5,
        metrics.width + 10,
        height + 10
      )
    }
    
    context.restore()
  })
}

// 选择模板
const selectTemplate = (template) => {
  const img = new Image()
  img.onload = () => {
    baseImage.value = img
    // 调整画布大小以匹配图片
    canvas.value.width = img.width
    canvas.value.height = img.height
    render()
  }
  img.src = template.url
}

// 文字操作
const addNewText = () => {
  // 创建新文字对象
  const newText = {
    ...currentText,
    x: canvas.value.width / 2,
    y: canvas.value.height / 2
  }
  texts.value.push(JSON.parse(JSON.stringify(newText)))
  selectedTextIndex.value = texts.value.length - 1
  render()
}

const updateText = () => {
  if (selectedTextIndex.value !== -1) {
    // 更新选中文字的属性
    Object.assign(texts.value[selectedTextIndex.value], {
      content: currentText.content,
      size: currentText.size,
      color: currentText.color,
      strokeColor: currentText.strokeColor,
      strokeWidth: currentText.strokeWidth
    })
    render()
  }
}

const removeText = (index) => {
  texts.value.splice(index, 1)
  selectedTextIndex.value = -1
  render()
}

// 拖拽操作
const startDragging = (e) => {
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  // 检查是否点击到文字
  texts.value.forEach((text, index) => {
    const ctx = canvas.value.getContext('2d')
    const metrics = ctx.measureText(text.content)
    const height = text.size
    
    if (
      x >= text.x - metrics.width / 2 &&
      x <= text.x + metrics.width / 2 &&
      y >= text.y - height / 2 &&
      y <= text.y + height / 2
    ) {
      selectedTextIndex.value = index
      isDragging.value = true
      dragStartPos.x = x - text.x
      dragStartPos.y = y - text.y
      
      // 更新当前文字设置
      Object.assign(currentText, text)
    }
  })
  
  render()
}

const onDragging = (e) => {
  if (!isDragging.value || selectedTextIndex.value === -1) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const text = texts.value[selectedTextIndex.value]
  text.x = x - dragStartPos.x
  text.y = y - dragStartPos.y
  
  render()
}

const stopDragging = () => {
  isDragging.value = false
}

// 导出图片
const exportImage = () => {
  const canvasEl = canvas.value
  const dataUrl = canvasEl.toDataURL(`image/${exportFormat.value}`, exportQuality.value)
  
  const link = document.createElement('a')
  link.download = `meme.${exportFormat.value}`
  link.href = dataUrl
  link.click()
}
</script>

<style lang="scss" scoped>
.meme-generator-page {
  padding: 2rem;
}

.editor-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  margin-top: 2rem;
}

.canvas-area {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  canvas {
    max-width: 100%;
    max-height: 70vh;
    cursor: move;
    background: #ffffff;
  }
}

.tools-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;

  h3 {
    padding: 1rem;
    margin: 0;
    border-bottom: 1px solid var(--border-color);
    font-size: 1rem;
    font-weight: 600;
  }
}

.template-grid {
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;

  .template-item {
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.text-controls {
  padding: 1rem;

  .text-input {
    margin-bottom: 1rem;

    textarea {
      width: 100%;
      height: 80px;
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      resize: none;
    }
  }
}

.text-options {
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;

  .option-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    label {
      min-width: 80px;
    }

    input {
      flex: 1;
    }
  }
}

.text-actions {
  display: flex;
  gap: 0.5rem;

  button {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: none;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
  }
}

.export-controls {
  padding: 1rem;

  .option-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;

    label {
      min-width: 80px;
    }

    select, input {
      flex: 1;
    }
  }

  .export-btn {
    width: 100%;
    padding: 0.75rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
    }
  }
}

@media (max-width: 768px) {
  .meme-generator-page {
    padding: 1rem;
  }

  .editor-container {
    grid-template-columns: 1fr;
  }
}
</style> 