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
        <div v-if="!previewImage" class="upload-zone" @drop.prevent="handleDrop" @dragover.prevent>
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
        
        <div v-else class="preview-container">
          <img :src="previewImage" alt="预览图" class="preview-image">
          <div class="preview-actions">
            <button class="remove-btn" @click="removeImage">
              <span class="tool-icon">✕</span>
              移除图片
            </button>
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

    <!-- 添加隐藏的 canvas 元素 -->
    <canvas ref="canvas" style="display: none;"></canvas>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

const fileInput = ref(null)
const previewImage = ref('')
const watermarkType = ref('text')
const textContent = ref('')
const fontSize = ref(24)
const textColor = ref('#000000')
const opacity = ref(50)
const position = ref('center')
const watermarkImage = ref(null) // 存储水印图片
const canvas = ref(null) // 用于处理图片的 canvas
const resultImage = ref('') // 存储处理后的图片

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
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileSelect = (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImage.value = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
}

const handleDrop = (event) => {
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImage.value = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
}

const handleWatermarkImageSelect = (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        watermarkImage.value = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
}

const applyWatermark = async () => {
  if (!previewImage.value) {
    alert('请先选择要添加水印的图片')
    return
  }

  // 创建主图片对象
  const mainImg = new Image()
  mainImg.src = previewImage.value
  
  await new Promise((resolve) => {
    mainImg.onload = resolve
  })

  // 创建 canvas
  const ctx = canvas.value.getContext('2d')
  canvas.value.width = mainImg.width
  canvas.value.height = mainImg.height

  // 绘制主图片
  ctx.drawImage(mainImg, 0, 0)

  // 根据水印类型处理
  if (watermarkType.value === 'text' && textContent.value) {
    // 文字水印
    ctx.save()
    ctx.globalAlpha = opacity.value / 100
    ctx.fillStyle = textColor.value
    ctx.font = `${fontSize.value}px Arial`

    const textWidth = ctx.measureText(textContent.value).width
    const textHeight = fontSize.value

    // 计算位置
    const coords = calculatePosition(position.value, textWidth, textHeight, mainImg.width, mainImg.height)
    
    ctx.fillText(textContent.value, coords.x, coords.y)
    ctx.restore()
  } else if (watermarkType.value === 'image' && watermarkImage.value) {
    // 图片水印
    const watermarkImg = new Image()
    watermarkImg.src = watermarkImage.value
    
    await new Promise((resolve) => {
      watermarkImg.onload = resolve
    })

    ctx.save()
    ctx.globalAlpha = opacity.value / 100

    const maxWidth = mainImg.width * 0.3 // 水印最大宽度为主图的 30%
    const scale = Math.min(1, maxWidth / watermarkImg.width)
    const width = watermarkImg.width * scale
    const height = watermarkImg.height * scale

    const coords = calculatePosition(position.value, width, height, mainImg.width, mainImg.height)
    
    ctx.drawImage(watermarkImg, coords.x, coords.y, width, height)
    ctx.restore()
  }

  // 转换为图片 URL
  resultImage.value = canvas.value.toDataURL('image/jpeg')
  previewImage.value = resultImage.value
}

const calculatePosition = (pos, width, height, containerWidth, containerHeight) => {
  const padding = 20 // 边距
  const positions = {
    'top-left': { x: padding, y: padding + height },
    'top-center': { x: (containerWidth - width) / 2, y: padding + height },
    'top-right': { x: containerWidth - width - padding, y: padding + height },
    'middle-left': { x: padding, y: (containerHeight + height) / 2 },
    'center': { x: (containerWidth - width) / 2, y: (containerHeight + height) / 2 },
    'middle-right': { x: containerWidth - width - padding, y: (containerHeight + height) / 2 },
    'bottom-left': { x: padding, y: containerHeight - padding },
    'bottom-center': { x: (containerWidth - width) / 2, y: containerHeight - padding },
    'bottom-right': { x: containerWidth - width - padding, y: containerHeight - padding }
  }
  return positions[pos]
}

const resetSettings = () => {
  watermarkType.value = 'text'
  textContent.value = ''
  fontSize.value = 24
  textColor.value = '#000000'
  opacity.value = 50
  position.value = 'center'
}

const removeImage = () => {
  previewImage.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style lang="scss" scoped>
@use "sass:color";

.image-watermark-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  .tool-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;

    .header-content {
      h1 {
        font-size: 2rem;
        margin: 0 0 0.5rem;
      }

      .tool-desc {
        color: #666;
        margin: 0;
      }
    }
  }

  .watermark-container {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 2rem;
    margin-top: 1rem;

    .upload-area {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      min-height: 300px;
      display: flex;
      flex-direction: column;

      .upload-zone {
        border: 2px dashed #ddd;
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
          border-color: #409eff;
          background: rgba(64, 158, 255, 0.05);
        }

        input[type="file"] {
          display: none;
        }

        .upload-content {
          .upload-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }

          .upload-text {
            margin-bottom: 0.5rem;
            
            .upload-button {
              color: #409eff;
              background: none;
              border: none;
              cursor: pointer;
              padding: 0;
              font-size: inherit;

              &:hover {
                text-decoration: underline;
              }
            }
          }

          .upload-hint {
            color: #999;
            font-size: 0.9rem;
          }
        }
      }

      .preview-container {
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        margin-top: 1rem;

        .preview-image {
          width: 100%;
          height: auto;
          display: block;
        }

        .preview-actions {
          padding: 1rem;
          display: flex;
          justify-content: center;

          .remove-btn {
            padding: 0.5rem 1rem;
            border: 1px solid #ff4d4f;
            border-radius: 4px;
            background: none;
            color: #ff4d4f;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.2s;

            &:hover {
              background: #fff1f0;
            }

            .tool-icon {
              font-size: 1rem;
            }
          }
        }
      }
    }

    .watermark-settings {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;

      h2 {
        font-size: 1.5rem;
        margin: 0 0 1.5rem;
      }

      .settings-group {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;

        label {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

          select, input[type="text"], input[type="number"] {
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 100%;
            
            &:focus {
              border-color: #409eff;
              outline: none;
            }
          }

          input[type="color"] {
            width: 100%;
            height: 40px;
            padding: 2px;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
          }
        }

        .opacity-control {
          display: flex;
          align-items: center;
          gap: 1rem;

          input[type="range"] {
            flex: 1;
          }

          span {
            min-width: 3rem;
          }
        }

        .position-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          
          .position-btn {
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #fff;
            cursor: pointer;
            transition: all 0.2s;
            
            &:hover {
              border-color: var(--primary);
              background: rgba(var(--primary), 0.05);
            }
            
            &.active {
              background: var(--primary);
              border-color: var(--primary);
              color: white;
            }
          }
        }
      }

      .panel-actions {
        margin-top: 2rem;
        display: flex;
        gap: 1rem;

        button {
          flex: 1;
          padding: 0.8rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;

          .tool-icon {
            font-size: 1.2rem;
          }

          &.apply {
            background: var(--primary);
            color: white;

            &:hover {
              background: var(--primary-dark);
            }
          }

          &.cancel {
            background: #f5f7fa;
            color: #606266;

            &:hover {
              background: color.scale(#f5f7fa, $lightness: -5%);
            }
          }
        }
      }
    }
  }
}

.preview-container {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;

  .preview-image {
    width: 100%;
    height: auto;
    display: block;
  }

  .preview-actions {
    padding: 1rem;
    display: flex;
    justify-content: center;

    .remove-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #ff4d4f;
      border-radius: 4px;
      background: none;
      color: #ff4d4f;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;

      &:hover {
        background: #fff1f0;
      }

      .tool-icon {
        font-size: 1rem;
      }
    }
  }
}
</style> 