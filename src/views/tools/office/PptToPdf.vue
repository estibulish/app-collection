<template>
  <div class="ppt-to-pdf-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>PPT 转 PDF 工具</h1>
        <p class="tool-desc">在线 PPT 转 PDF 工具，支持 PowerPoint 演示文稿转换为 PDF 格式</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="ppt-to-pdf" />
      </div>
    </div>

    <div class="convert-container">
      <div class="input-section">
        <div class="upload-panel">
          <div class="panel-header">
            <h3>上传文件</h3>
            <div class="panel-actions">
              <button class="action-btn" @click="clearFile">清空</button>
            </div>
          </div>
          <div 
            class="upload-area"
            @drop.prevent="handleDrop"
            @dragover.prevent
            @click="triggerUpload"
          >
            <input 
              type="file" 
              ref="fileInput"
              @change="handleFileChange"
              accept=".ppt,.pptx"
              style="display: none"
            >
            <div v-if="!file" class="upload-placeholder">
              <span class="upload-icon">📄</span>
              <p>点击或拖拽 PPT 文件到此处上传</p>
              <p class="upload-hint">支持 .ppt、.pptx 格式，最大 20MB</p>
            </div>
            <div v-else class="file-info">
              <span class="file-icon">📄</span>
              <div class="file-details">
                <p class="file-name">{{ file.name }}</p>
                <p class="file-size">{{ formatSize(file.size) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="options-section">
        <div class="convert-options">
          <label>
            <span>PDF 质量</span>
            <select v-model="pdfQuality">
              <option value="high">高质量</option>
              <option value="medium">中等质量</option>
              <option value="low">低质量</option>
            </select>
          </label>
          <label>
            <input type="checkbox" v-model="includeNotes">
            <span>包含备注</span>
          </label>
          <label>
            <input type="checkbox" v-model="includeHiddenSlides">
            <span>包含隐藏幻灯片</span>
          </label>
        </div>
        <div class="convert-actions">
          <button 
            class="convert-btn" 
            @click="convertToPdf" 
            :disabled="!file || isConverting"
          >
            {{ isConverting ? '转换中...' : '开始转换' }}
          </button>
        </div>
      </div>

      <div class="result-section" v-if="convertedFile">
        <div class="result-panel">
          <div class="panel-header">
            <h3>转换结果</h3>
            <div class="panel-actions">
              <button class="action-btn" @click="downloadResult">下载</button>
            </div>
          </div>
          <div class="result-preview">
            <div class="preview-placeholder">
              <span class="preview-icon">📄</span>
              <p>PDF 文件已生成</p>
            </div>
          </div>
          <div class="result-info">
            <div class="info-item">
              <span class="info-label">文件名</span>
              <span class="info-value">{{ convertedFile.name }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">文件大小</span>
              <span class="info-value">{{ formatSize(convertedFile.size) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">转换用时</span>
              <span class="info-value">{{ convertTime }}秒</span>
            </div>
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
const file = ref(null)
const pdfQuality = ref('high')
const includeNotes = ref(false)
const includeHiddenSlides = ref(false)
const isConverting = ref(false)
const convertedFile = ref(null)
const convertTime = ref(0)

// 转换为 PDF
const convertToPdf = async () => {
  if (!file.value || isConverting.value) return

  isConverting.value = true
  const startTime = Date.now()

  try {
    // 这里是模拟转换过程
    // 实际项目中需要集成相应的库或调用后端 API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 创建一个示例 PDF 文件
    const pdfBlob = new Blob(['PDF content'], { type: 'application/pdf' })
    const fileName = file.value.name.replace(/\.(ppt|pptx)$/i, '.pdf')
    convertedFile.value = new File([pdfBlob], fileName, { type: 'application/pdf' })
    
    convertTime.value = ((Date.now() - startTime) / 1000).toFixed(1)
  } catch (err) {
    console.error('转换失败:', err)
    alert('转换失败，请重试')
  } finally {
    isConverting.value = false
  }
}

// 处理文件选择
const handleFileChange = (event) => {
  const selectedFile = event.target.files[0]
  if (selectedFile && /\.(ppt|pptx)$/i.test(selectedFile.name)) {
    file.value = selectedFile
    convertedFile.value = null
  } else {
    alert('请选择有效的 PPT 文件')
  }
}

// 处理拖放
const handleDrop = (event) => {
  const droppedFile = event.dataTransfer.files[0]
  if (droppedFile && /\.(ppt|pptx)$/i.test(droppedFile.name)) {
    file.value = droppedFile
    convertedFile.value = null
  } else {
    alert('请拖放有效的 PPT 文件')
  }
}

// 触发文件上传
const triggerUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// 清空文件
const clearFile = () => {
  file.value = null
  convertedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 下载转换后的文件
const downloadResult = () => {
  if (convertedFile.value) {
    const url = URL.createObjectURL(convertedFile.value)
    const a = document.createElement('a')
    a.href = url
    a.download = convertedFile.value.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

// 格式化文件大小
const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  else return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}
</script>

<style lang="scss" scoped>
.ppt-to-pdf-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  .tool-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;

    .header-content {
      flex: 1;

      h1 {
        font-size: 1.8rem;
        margin: 0 0 0.5rem;
        color: var(--text-primary);
      }

      .tool-desc {
        margin: 0;
        color: var(--text-secondary);
      }
    }

    .tool-actions {
      margin-left: 2rem;
    }
  }

  .convert-container {
    display: grid;
    gap: 2rem;

    .upload-panel, .result-panel {
      background: var(--bg-card);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h3 {
          font-size: 1.2rem;
          margin: 0;
          color: var(--text-primary);
        }
      }
    }

    .upload-area {
      border: 2px dashed var(--border-color);
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: var(--primary);
        background: rgba(64, 158, 255, 0.02);
      }

      .upload-placeholder {
        .upload-icon {
          font-size: 3rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          display: block;
        }

        p {
          margin: 0.5rem 0;
          color: var(--text-primary);
        }

        .upload-hint {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
      }

      .file-info {
        display: flex;
        align-items: center;
        gap: 1rem;

        .file-icon {
          font-size: 2rem;
          color: var(--text-secondary);
        }

        .file-details {
          text-align: left;

          .file-name {
            margin: 0 0 0.5rem;
            color: var(--text-primary);
            font-weight: 500;
          }

          .file-size {
            margin: 0;
            color: var(--text-secondary);
            font-size: 0.9rem;
          }
        }
      }
    }

    .options-section {
      background: var(--bg-card);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .convert-options {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;

        label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-right: 1.5rem;

          span {
            color: var(--text-primary);
          }
        }

        select {
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background: var(--bg-color);
          color: var(--text-primary);

          &:focus {
            border-color: var(--primary);
            outline: none;
          }
        }
      }

      .convert-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .convert-btn {
          padding: 0.5rem 2rem;
          border: none;
          border-radius: 4px;
          background: var(--primary);
          color: white;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: var(--primary-dark);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
      }
    }

    .result-preview {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      margin-bottom: 1rem;

      .preview-placeholder {
        .preview-icon {
          font-size: 3rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
          display: block;
        }

        p {
          margin: 0.5rem 0;
          color: var(--text-primary);
        }
      }
    }

    .result-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;

      .info-item {
        .info-label {
          display: block;
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .info-value {
          color: var(--text-primary);
          font-weight: 500;
        }
      }
    }
  }

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
  }
}
</style> 