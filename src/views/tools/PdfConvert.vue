<template>
  <div class="pdf-convert">
    <div class="tool-header">
      <h1>PDF转换工具</h1>
      <p class="tool-desc">在线PDF转换工具，支持PDF转Word、Excel、图片等格式</p>
    </div>

    <div class="convert-container">
      <div class="convert-types">
        <button 
          v-for="type in convertTypes" 
          :key="type.id"
          class="type-btn"
          :class="{ active: currentType === type.id }"
          @click="setConvertType(type.id)"
        >
          <span class="type-icon">{{ type.icon }}</span>
          <span class="type-name">{{ type.name }}</span>
        </button>
      </div>

      <div class="upload-zone" 
        @dragover.prevent 
        @drop.prevent="handleDrop"
        :class="{ 'is-dragover': isDragover }"
        @dragenter="isDragover = true"
        @dragleave="isDragover = false"
      >
        <div class="upload-content">
          <div class="upload-icon">📄</div>
          <div class="upload-text">
            <template v-if="!isProcessing">
              拖放PDF文件到这里，或
              <label class="upload-button">
                点击上传
                <input 
                  type="file" 
                  accept=".pdf" 
                  @change="handleFileSelect"
                  ref="fileInput"
                >
              </label>
            </template>
            <template v-else>
              正在处理中...
            </template>
          </div>
          <div class="upload-hint">支持PDF格式，最大50MB</div>
        </div>
      </div>

      <div class="file-info" v-if="currentFile">
        <div class="file-preview">
          <div class="preview-placeholder">
            <span class="preview-icon">📄</span>
            <span class="preview-pages">{{ pageCount }}页</span>
          </div>
        </div>
        <div class="file-details">
          <div class="file-name">{{ currentFile.name }}</div>
          <div class="file-size">{{ formatSize(currentFile.size) }}</div>
          <div class="file-actions">
            <button 
              class="action-btn primary" 
              @click="startConvert"
              :disabled="isProcessing"
            >
              开始转换
            </button>
            <button 
              class="action-btn" 
              @click="clearFile"
              :disabled="isProcessing"
            >
              清除
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="convert-result" v-if="convertedFile">
      <div class="result-header">
        <h2>转换完成</h2>
        <div class="result-actions">
          <button class="action-btn primary" @click="downloadFile">
            下载文件
          </button>
          <button class="action-btn" @click="clearResult">
            清除结果
          </button>
        </div>
      </div>
      <div class="result-info">
        <div class="info-item">
          <span class="info-label">原始文件：</span>
          <span class="info-value">{{ currentFile?.name }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">转换格式：</span>
          <span class="info-value">{{ getCurrentTypeName() }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">文件大小：</span>
          <span class="info-value">{{ formatSize(convertedFile.size) }}</span>
        </div>
      </div>
    </div>

    <div class="error-message" v-if="errorMessage">
      {{ errorMessage }}
    </div>

    <div class="features-section">
      <h2>功能特点</h2>
      <div class="features-grid">
        <div class="feature-card">
          <span class="feature-icon">🚀</span>
          <h3>快速转换</h3>
          <p>采用高效算法，快速完成转换</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">💯</span>
          <h3>保真转换</h3>
          <p>完整保留原文档的格式和样式</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🔒</span>
          <h3>安全可靠</h3>
          <p>文件仅在本地处理，保护隐私</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">💻</span>
          <h3>多格式支持</h3>
          <p>支持Word、Excel、图片等格式</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isDragover = ref(false)
const isProcessing = ref(false)
const currentFile = ref(null)
const convertedFile = ref(null)
const errorMessage = ref('')
const pageCount = ref(0)
const fileInput = ref(null)

const currentType = ref('word')

const convertTypes = [
  { id: 'word', name: 'PDF转Word', icon: '📝' },
  { id: 'excel', name: 'PDF转Excel', icon: '📊' },
  { id: 'image', name: 'PDF转图片', icon: '🖼️' },
  { id: 'text', name: 'PDF转文本', icon: '📄' }
]

const setConvertType = (type) => {
  currentType.value = type
}

const getCurrentTypeName = () => {
  const type = convertTypes.find(t => t.id === currentType.value)
  return type ? type.name : ''
}

const handleDrop = (e) => {
  isDragover.value = false
  const files = Array.from(e.dataTransfer.files)
  handleFiles(files)
}

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  handleFiles(files)
  fileInput.value.value = ''
}

const handleFiles = (files) => {
  if (files.length === 0) return

  const file = files[0]
  if (!file.type.includes('pdf')) {
    errorMessage.value = '请选择PDF文件'
    return
  }

  if (file.size > 50 * 1024 * 1024) {
    errorMessage.value = '文件大小不能超过50MB'
    return
  }

  errorMessage.value = ''
  currentFile.value = file
  convertedFile.value = null
  // 模拟获取页数
  pageCount.value = Math.floor(Math.random() * 20) + 1
}

const startConvert = async () => {
  if (!currentFile.value || isProcessing.value) return

  isProcessing.value = true
  errorMessage.value = ''

  try {
    // 模拟转换过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 模拟生成结果文件
    const fileName = currentFile.value.name.replace('.pdf', '')
    let blob
    let newFileName

    switch (currentType.value) {
      case 'word':
        blob = new Blob(['模拟Word文件内容'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
        newFileName = `${fileName}.docx`
        break
      case 'excel':
        blob = new Blob(['模拟Excel文件内容'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        newFileName = `${fileName}.xlsx`
        break
      case 'image':
        blob = new Blob(['模拟图片文件内容'], { type: 'image/png' })
        newFileName = `${fileName}.png`
        break
      case 'text':
        blob = new Blob(['模拟文本内容'], { type: 'text/plain' })
        newFileName = `${fileName}.txt`
        break
    }

    convertedFile.value = new File([blob], newFileName, { type: blob.type })
  } catch (err) {
    errorMessage.value = '转换失败：' + err.message
  } finally {
    isProcessing.value = false
  }
}

const downloadFile = () => {
  if (!convertedFile.value) return

  const link = document.createElement('a')
  link.href = URL.createObjectURL(convertedFile.value)
  link.download = convertedFile.value.name
  link.click()
  URL.revokeObjectURL(link.href)
}

const clearFile = () => {
  currentFile.value = null
  convertedFile.value = null
  errorMessage.value = ''
  pageCount.value = 0
}

const clearResult = () => {
  convertedFile.value = null
}

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}
</script>

<style lang="scss" scoped>
.pdf-convert {
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

.convert-container {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.convert-types {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.type-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-main);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  &.active {
    background: var(--primary);
    border-color: var(--primary);
    color: white;
  }

  .type-icon {
    font-size: 1.25rem;
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

.file-info {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--bg-main);
  border-radius: 8px;
}

.file-preview {
  width: 100px;
  height: 140px;
  flex-shrink: 0;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  .preview-icon {
    font-size: 2rem;
  }

  .preview-pages {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }
}

.file-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-name {
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 500;
  word-break: break-all;
}

.file-size {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.file-actions {
  margin-top: auto;
  display: flex;
  gap: 0.75rem;
}

.convert-result {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }
}

.result-actions {
  display: flex;
  gap: 0.75rem;
}

.result-info {
  background: var(--bg-main);
  border-radius: 8px;
  padding: 1rem;
}

.info-item {
  display: flex;
  padding: 0.5rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
  }

  .info-label {
    color: var(--text-secondary);
    font-size: 0.875rem;
    width: 6rem;
    flex-shrink: 0;
  }

  .info-value {
    color: var(--text-primary);
    font-size: 0.875rem;
    word-break: break-all;
  }
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
}

.error-message {
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  font-size: 0.875rem;
}

.features-section {
  margin-top: 3rem;
  text-align: center;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2rem;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  padding: 2rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
  }

  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    display: block;
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
  }

  p {
    color: var(--text-secondary);
    font-size: 0.875rem;
    line-height: 1.6;
  }
}

@media (max-width: 768px) {
  .pdf-convert {
    padding: 1.5rem 1rem;
  }

  .tool-header {
    margin-bottom: 1.5rem;

    h1 {
      font-size: 1.75rem;
    }
  }

  .convert-container {
    padding: 1.5rem;
  }

  .convert-types {
    margin-bottom: 1.5rem;
  }

  .upload-zone {
    padding: 2rem 1rem;
  }

  .file-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .file-preview {
    width: 80px;
    height: 112px;
  }

  .file-actions {
    justify-content: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .tool-header h1 {
    font-size: 1.5rem;
  }

  .convert-types {
    justify-content: center;
  }

  .type-btn {
    width: 100%;
    justify-content: center;
  }

  .result-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .result-actions {
    width: 100%;
    flex-direction: column;
    gap: 0.5rem;
  }

  .info-item {
    flex-direction: column;
    gap: 0.25rem;

    .info-label {
      width: auto;
    }
  }
}
</style> 