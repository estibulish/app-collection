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
@use "sass:color";

.image-background-page {
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

  .background-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 1rem;

    .upload-area {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 2rem;

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
    }

    .preview-area {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
      
      .preview-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        
        .preview {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          
          h3 {
            margin: 0 0 1rem;
            color: #333;
            font-size: 1.2rem;
            font-weight: 500;
          }
          
          img {
            width: 100%;
            border-radius: 4px;
            display: block;
          }
          
          .processing {
            min-height: 200px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            color: #666;
            
            .loading-spinner {
              width: 40px;
              height: 40px;
              border: 3px solid #f3f3f3;
              border-top-color: #409eff;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
          }
        }
      }

      .settings-panel {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
        
        h2 {
          font-size: 1.5rem;
          margin: 0 0 1.5rem;
          color: #333;
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

            .blur-control {
              display: flex;
              align-items: center;
              gap: 1rem;

              input[type="range"] {
                flex: 1;
              }

              span {
                min-width: 2rem;
                text-align: right;
              }
            }
          }
        }

        .panel-actions {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;

          button {
            width: 100%;
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

            &:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }

            &.apply {
              background: #409eff;
              color: white;

              &:not(:disabled):hover {
                background: color.scale(#409eff, $lightness: -10%);
              }
            }

            &.download {
              background: #67c23a;
              color: white;

              &:not(:disabled):hover {
                background: color.scale(#67c23a, $lightness: -10%);
              }
            }
          }
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
</style> 