<template>
  <div class="word-to-pdf-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>Word 转 PDF 工具</h1>
        <p class="tool-desc">在线 Word 转 PDF 工具，支持 Word 文档转换为 PDF 格式</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="word-to-pdf" />
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
              accept=".doc,.docx"
              style="display: none"
            >
            <div v-if="!file" class="upload-placeholder">
              <span class="upload-icon">📄</span>
              <p>点击或拖拽 Word 文件到此处上传</p>
              <p class="upload-hint">支持 .doc、.docx 格式，最大 20MB</p>
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
            <span>PDF 版本</span>
            <select v-model="pdfVersion">
              <option value="1.7">PDF 1.7</option>
              <option value="1.6">PDF 1.6</option>
              <option value="1.5">PDF 1.5</option>
              <option value="1.4">PDF 1.4</option>
            </select>
          </label>
          <label>
            <input type="checkbox" v-model="embedFonts">
            <span>嵌入字体</span>
          </label>
          <label>
            <input type="checkbox" v-model="optimizeSize">
            <span>优化文件大小</span>
          </label>
          <label>
            <input type="checkbox" v-model="preserveLinks">
            <span>保留超链接</span>
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
              <button class="action-btn" @click="downloadResult">下载文件</button>
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
const pdfVersion = ref('1.7')
const embedFonts = ref(true)
const optimizeSize = ref(true)
const preserveLinks = ref(true)
const isConverting = ref(false)
const convertedFile = ref(null)
const convertTime = ref(0)

// 触发文件上传
const triggerUpload = () => {
  fileInput.value.click()
}

// 处理文件变化
const handleFileChange = (event) => {
  const files = event.target.files
  if (files.length) {
    handleFile(files[0])
  }
}

// 处理拖拽
const handleDrop = (event) => {
  const files = event.dataTransfer.files
  if (files.length) {
    handleFile(files[0])
  }
}

// 处理文件
const handleFile = (uploadedFile) => {
  const validExtensions = ['.doc', '.docx']
  const isValidFile = validExtensions.some(ext => uploadedFile.name.toLowerCase().endsWith(ext))
  
  if (!isValidFile) {
    alert('请上传 Word 文件 (.doc, .docx)')
    return
  }

  if (uploadedFile.size > 20 * 1024 * 1024) {
    alert('文件大小不能超过 20MB')
    return
  }

  file.value = uploadedFile
  convertedFile.value = null
}

// 清空文件
const clearFile = () => {
  file.value = null
  convertedFile.value = null
  fileInput.value.value = ''
}

// 格式化文件大小
const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 转换为 PDF
const convertToPdf = async () => {
  if (!file.value || isConverting.value) return

  isConverting.value = true
  const startTime = Date.now()

  try {
    // 这里添加实际的转换逻辑
    await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟转换过程
    
    // 模拟生成结果文件
    const fileName = file.value.name.replace(/\.(doc|docx)$/i, '.pdf')
    convertedFile.value = new File([file.value], fileName, { type: 'application/pdf' })
    
    convertTime.value = ((Date.now() - startTime) / 1000).toFixed(1)
  } catch (err) {
    console.error('转换失败:', err)
    alert('转换失败，请重试')
  } finally {
    isConverting.value = false
  }
}

// 下载结果
const downloadResult = () => {
  if (!convertedFile.value) return

  const url = URL.createObjectURL(convertedFile.value)
  const a = document.createElement('a')
  a.href = url
  a.download = convertedFile.value.name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style lang="scss" scoped>
.word-to-pdf-page {
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

        .panel-actions {
          display: flex;
          gap: 0.5rem;
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
        }

        .upload-placeholder {
          .upload-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
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
          }

          .file-details {
            text-align: left;

            .file-name {
              margin: 0;
              color: var(--text-primary);
              font-weight: 500;
            }

            .file-size {
              margin: 0.25rem 0 0;
              color: var(--text-secondary);
              font-size: 0.9rem;
            }
          }
        }
      }

      .result-info {
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-color);
        overflow: hidden;

        .info-item {
          display: flex;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border-color);

          &:last-child {
            border-bottom: none;
          }

          .info-label {
            width: 100px;
            color: var(--text-secondary);
          }

          .info-value {
            flex: 1;
            color: var(--text-primary);
          }
        }
      }
    }

    .options-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      padding: 1rem;
      background: var(--bg-card);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      .convert-options {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        label {
          display: flex;
          align-items: center;
          gap: 0.5rem;

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