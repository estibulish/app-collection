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

    <div class="meme-container">
      <div class="editor-section">
        <div class="editor-panel">
          <div class="panel-header">
            <h3>表情包编辑</h3>
          </div>
          
          <div class="meme-editor">
            <div class="meme-canvas-container">
              <div 
                class="meme-canvas" 
                ref="memeCanvas"
                :style="{ 
                  width: canvasWidth + 'px', 
                  height: canvasHeight + 'px',
                  backgroundImage: memeImage ? `url(${memeImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }"
              >
                <div 
                  v-for="(text, index) in memeTexts" 
                  :key="index"
                  class="meme-text"
                  :class="{ 'selected': selectedTextIndex === index }"
                  :style="getTextStyle(text)"
                  @mousedown="startDragText(index, $event)"
                  @touchstart="startDragTextTouch(index, $event)"
                >
                  {{ text.content }}
                </div>
              </div>
            </div>
            
            <div class="editor-actions">
              <button class="action-btn" @click="addText">添加文字</button>
              <button 
                class="action-btn" 
                @click="removeSelectedText"
                :disabled="selectedTextIndex === -1"
              >
                删除文字
              </button>
              <button class="action-btn" @click="downloadMeme">下载表情包</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <div class="settings-panel">
          <div class="panel-header">
            <h3>设置</h3>
          </div>
          
          <div class="meme-settings">
            <div class="image-settings">
              <h4>表情图片</h4>
              <div class="image-upload">
                <button class="upload-btn" @click="triggerUpload">上传图片</button>
                <input 
                  type="file" 
                  ref="fileInput"
                  @change="handleImageUpload"
                  accept="image/*"
                  style="display: none"
                >
                <span class="or-text">或</span>
                <button class="template-btn" @click="showTemplates = true">选择模板</button>
              </div>
            </div>
            
            <div v-if="selectedTextIndex !== -1" class="text-settings">
              <h4>文字设置</h4>
              <div class="text-content">
                <label>文字内容</label>
                <textarea 
                  v-model="selectedText.content"
                  rows="2"
                  placeholder="输入文字内容"
                ></textarea>
              </div>
              
              <div class="text-style">
                <div class="style-row">
                  <label>字体大小</label>
                  <input 
                    type="range" 
                    v-model.number="selectedText.fontSize" 
                    min="12" 
                    max="72"
                  >
                  <span>{{ selectedText.fontSize }}px</span>
                </div>
                
                <div class="style-row">
                  <label>字体颜色</label>
                  <input type="color" v-model="selectedText.color">
                </div>
                
                <div class="style-row">
                  <label>描边颜色</label>
                  <input type="color" v-model="selectedText.strokeColor">
                </div>
                
                <div class="style-row">
                  <label>描边宽度</label>
                  <input 
                    type="range" 
                    v-model.number="selectedText.strokeWidth" 
                    min="0" 
                    max="5" 
                    step="0.5"
                  >
                  <span>{{ selectedText.strokeWidth }}px</span>
                </div>
                
                <div class="style-row">
                  <label>对齐方式</label>
                  <div class="align-buttons">
                    <button 
                      :class="['align-btn', { active: selectedText.align === 'left' }]"
                      @click="selectedText.align = 'left'"
                    >
                      左对齐
                    </button>
                    <button 
                      :class="['align-btn', { active: selectedText.align === 'center' }]"
                      @click="selectedText.align = 'center'"
                    >
                      居中
                    </button>
                    <button 
                      :class="['align-btn', { active: selectedText.align === 'right' }]"
                      @click="selectedText.align = 'right'"
                    >
                      右对齐
                    </button>
                  </div>
                </div>
                
                <div class="style-row">
                  <label>字体样式</label>
                  <div class="font-style-buttons">
                    <button 
                      :class="['style-btn', { active: selectedText.bold }]"
                      @click="selectedText.bold = !selectedText.bold"
                    >
                      粗体
                    </button>
                    <button 
                      :class="['style-btn', { active: selectedText.italic }]"
                      @click="selectedText.italic = !selectedText.italic"
                    >
                      斜体
                    </button>
                    <button 
                      :class="['style-btn', { active: selectedText.uppercase }]"
                      @click="selectedText.uppercase = !selectedText.uppercase"
                    >
                      大写
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="no-text-selected">
              <p>请添加文字或选择已有文字进行编辑</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="templates-section" v-if="showTemplates">
        <div class="templates-panel">
          <div class="panel-header">
            <h3>表情包模板</h3>
            <button class="close-btn" @click="showTemplates = false">×</button>
          </div>
          
          <div class="templates-grid">
            <div 
              v-for="(template, index) in memeTemplates" 
              :key="index"
              class="template-item"
              @click="selectTemplate(template)"
            >
              <img :src="template.url" :alt="template.name">
              <div class="template-name">{{ template.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import html2canvas from 'html2canvas'
import FavoriteButton from '@/components/FavoriteButton.vue'

// 画布尺寸
const canvasWidth = ref(500)
const canvasHeight = ref(500)

// 表情包图片
const memeImage = ref(null)
const fileInput = ref(null)

// 文字列表
const memeTexts = ref([])
const selectedTextIndex = ref(-1)

// 模板相关
const showTemplates = ref(false)
const memeTemplates = ref([
  { 
    name: '滑稽', 
    url: '/meme-templates/huaji.jpg'
  },
  { 
    name: '狗头', 
    url: '/meme-templates/doge.jpg'
  },
  { 
    name: '小丑', 
    url: '/meme-templates/clown.jpg'
  },
  { 
    name: '黑人问号', 
    url: '/meme-templates/question.jpg'
  },
  { 
    name: '打工人', 
    url: '/meme-templates/worker.jpg'
  },
  { 
    name: '柴犬', 
    url: '/meme-templates/shiba.jpg'
  },
  { 
    name: '猫咪', 
    url: '/meme-templates/cat.jpg'
  },
  { 
    name: '鲁迅说', 
    url: '/meme-templates/luxun.jpg'
  }
])

// 拖拽相关
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const memeCanvas = ref(null)

// 计算属性：当前选中的文字
const selectedText = computed(() => {
  if (selectedTextIndex.value === -1) {
    return null
  }
  return memeTexts.value[selectedTextIndex.value]
})

// 监听选中文字的变化
watch(selectedTextIndex, (newIndex) => {
  if (newIndex === -1) {
    document.removeEventListener('mousemove', moveText)
    document.removeEventListener('mouseup', endDragText)
    document.removeEventListener('touchmove', moveTextTouch)
    document.removeEventListener('touchend', endDragTextTouch)
  }
})

// 生命周期钩子
onMounted(() => {
  // 初始化默认文字
  addText()
  
  // 点击画布外部取消选中
  document.addEventListener('click', (e) => {
    if (!memeCanvas.value.contains(e.target)) {
      selectedTextIndex.value = -1
    }
  })
})

// 触发文件上传
const triggerUpload = () => {
  fileInput.value.click()
}

// 处理图片上传
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      memeImage.value = e.target.result
      
      // 加载图片以获取尺寸
      const img = new Image()
      img.onload = () => {
        // 保持宽高比
        if (img.width > img.height) {
          canvasWidth.value = 500
          canvasHeight.value = Math.round(500 * (img.height / img.width))
        } else {
          canvasHeight.value = 500
          canvasWidth.value = Math.round(500 * (img.width / img.height))
        }
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 选择模板
const selectTemplate = (template) => {
  // 加载模板图片
  const img = new Image()
  img.onload = () => {
    memeImage.value = template.url
    
    // 保持宽高比
    if (img.width > img.height) {
      canvasWidth.value = 500
      canvasHeight.value = Math.round(500 * (img.height / img.width))
    } else {
      canvasHeight.value = 500
      canvasWidth.value = Math.round(500 * (img.width / img.height))
    }
    
    showTemplates.value = false
  }
  img.src = template.url
}

// 添加文字
const addText = () => {
  const newText = {
    content: '点击编辑文字',
    x: canvasWidth.value / 2 - 100,
    y: memeTexts.value.length === 0 ? 50 : (canvasHeight.value - 50),
    fontSize: 24,
    color: '#ffffff',
    strokeColor: '#000000',
    strokeWidth: 1,
    align: 'center',
    bold: false,
    italic: false,
    uppercase: false
  }
  
  memeTexts.value.push(newText)
  selectedTextIndex.value = memeTexts.value.length - 1
}

// 移除选中的文字
const removeSelectedText = () => {
  if (selectedTextIndex.value !== -1) {
    memeTexts.value.splice(selectedTextIndex.value, 1)
    selectedTextIndex.value = -1
  }
}

// 获取文字样式
const getTextStyle = (text) => {
  return {
    left: `${text.x}px`,
    top: `${text.y}px`,
    fontSize: `${text.fontSize}px`,
    color: text.color,
    textAlign: text.align,
    fontWeight: text.bold ? 'bold' : 'normal',
    fontStyle: text.italic ? 'italic' : 'normal',
    textTransform: text.uppercase ? 'uppercase' : 'none',
    textShadow: text.strokeWidth > 0 ? 
      `-${text.strokeWidth}px -${text.strokeWidth}px 0 ${text.strokeColor},
       ${text.strokeWidth}px -${text.strokeWidth}px 0 ${text.strokeColor},
       -${text.strokeWidth}px ${text.strokeWidth}px 0 ${text.strokeColor},
       ${text.strokeWidth}px ${text.strokeWidth}px 0 ${text.strokeColor}` : 'none'
  }
}

// 开始拖拽文字
const startDragText = (index, event) => {
  selectedTextIndex.value = index
  isDragging.value = true
  dragStartX.value = event.clientX
  dragStartY.value = event.clientY
  
  document.addEventListener('mousemove', moveText)
  document.addEventListener('mouseup', endDragText)
  
  event.preventDefault()
}

// 移动文字
const moveText = (event) => {
  if (isDragging.value && selectedTextIndex.value !== -1) {
    const dx = event.clientX - dragStartX.value
    const dy = event.clientY - dragStartY.value
    
    const text = memeTexts.value[selectedTextIndex.value]
    text.x += dx
    text.y += dy
    
    dragStartX.value = event.clientX
    dragStartY.value = event.clientY
  }
}

// 结束拖拽
const endDragText = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', moveText)
  document.removeEventListener('mouseup', endDragText)
}

// 触摸事件处理
const startDragTextTouch = (index, event) => {
  selectedTextIndex.value = index
  isDragging.value = true
  dragStartX.value = event.touches[0].clientX
  dragStartY.value = event.touches[0].clientY
  
  document.addEventListener('touchmove', moveTextTouch, { passive: false })
  document.addEventListener('touchend', endDragTextTouch)
  
  event.preventDefault()
}

const moveTextTouch = (event) => {
  if (isDragging.value && selectedTextIndex.value !== -1) {
    const dx = event.touches[0].clientX - dragStartX.value
    const dy = event.touches[0].clientY - dragStartY.value
    
    const text = memeTexts.value[selectedTextIndex.value]
    text.x += dx
    text.y += dy
    
    dragStartX.value = event.touches[0].clientX
    dragStartY.value = event.touches[0].clientY
  }
  
  event.preventDefault()
}

const endDragTextTouch = () => {
  isDragging.value = false
  document.removeEventListener('touchmove', moveTextTouch)
  document.removeEventListener('touchend', endDragTextTouch)
}

// 下载表情包
const downloadMeme = async () => {
  try {
    // 取消选中状态
    selectedTextIndex.value = -1
    
    // 等待一下以确保UI更新
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // 使用 html2canvas 将画布转换为图片
    const canvas = await html2canvas(memeCanvas.value, {
      useCORS: true,
      scale: 2, // 提高分辨率
      allowTaint: true,
      backgroundColor: null
    })
    
    // 创建下载链接
    const link = document.createElement('a')
    link.download = 'meme.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (error) {
    console.error('下载表情包失败:', error)
    alert('下载失败，请重试')
  }
}
</script>

<style lang="scss" scoped>
.meme-generator-page {
  padding: 2rem;
  
  .meme-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .editor-panel,
  .settings-panel,
  .templates-panel {
    background: var(--bg-card);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    
    h3 {
      margin: 0;
      color: var(--text-primary);
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--text-secondary);
      cursor: pointer;
      
      &:hover {
        color: var(--danger);
      }
    }
  }
  
  .meme-editor {
    padding: 1rem;
    
    .meme-canvas-container {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
      
      .meme-canvas {
        position: relative;
        background-color: #f0f0f0;
        border: 1px solid var(--border-color);
        overflow: hidden;
        
        .meme-text {
          position: absolute;
          cursor: move;
          user-select: none;
          white-space: pre-wrap;
          max-width: 100%;
          padding: 4px;
          
          &.selected {
            outline: 2px dashed var(--primary);
          }
        }
      }
    }
    
    .editor-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;
    }
  }
  
  .meme-settings {
    padding: 1rem;
    
    h4 {
      margin: 0 0 1rem 0;
      color: var(--text-primary);
    }
    
    .image-upload {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      
      .or-text {
        color: var(--text-secondary);
      }
    }
    
    .text-content {
      margin-bottom: 1rem;
      
      label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
      }
      
      textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-input);
        color: var(--text-primary);
        resize: vertical;
      }
    }
    
    .text-style {
      .style-row {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        
        label {
          width: 80px;
          color: var(--text-secondary);
        }
        
        input[type="range"] {
          flex: 1;
          margin: 0 0.5rem;
        }
        
        input[type="color"] {
          width: 30px;
          height: 30px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background: none;
          cursor: pointer;
        }
        
        span {
          width: 50px;
          text-align: right;
          color: var(--text-primary);
        }
        
        .align-buttons,
        .font-style-buttons {
          display: flex;
          gap: 0.5rem;
          
          .align-btn,
          .style-btn {
            padding: 0.25rem 0.5rem;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--bg-color);
            color: var(--text-primary);
            cursor: pointer;
            
            &.active {
              background: var(--primary);
              color: white;
              border-color: var(--primary);
            }
          }
        }
      }
    }
    
    .no-text-selected {
      text-align: center;
      padding: 2rem 0;
      color: var(--text-secondary);
    }
  }
  
  .templates-section {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    
    .templates-panel {
      width: 80%;
      max-width: 800px;
      max-height: 80vh;
      background: var(--bg-card);
      border-radius: 8px;
      overflow: hidden;
      
      .templates-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
        padding: 1rem;
        overflow-y: auto;
        max-height: calc(80vh - 60px);
        
        .template-item {
          cursor: pointer;
          border-radius: 4px;
          overflow: hidden;
          transition: transform 0.2s;
          
          &:hover {
            transform: scale(1.05);
          }
          
          img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            display: block;
          }
          
          .template-name {
            padding: 0.5rem;
            text-align: center;
            background: var(--bg-color);
            color: var(--text-primary);
            font-size: 0.9rem;
          }
        }
      }
    }
  }
  
  .upload-btn,
  .template-btn,
  .action-btn {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-color);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

@media (max-width: 768px) {
  .meme-generator-page {
    padding: 1rem;
    
    .meme-container {
      grid-template-columns: 1fr;
      
      .editor-section {
        grid-row: 1;
      }
      
      .settings-section {
        grid-row: 2;
      }
    }
    
    .templates-section {
      .templates-panel {
        width: 95%;
        
        .templates-grid {
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        }
      }
    }
  }
}
</style> 