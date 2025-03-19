<template>
  <div class="base64-tool">
    <div class="tool-header">
      <h1>Base64编解码工具</h1>
      <p class="tool-desc">在线Base64编码解码工具，支持文本和文件的编码解码</p>
    </div>

    <div class="mode-selector">
      <button 
        class="mode-btn"
        :class="{ active: mode === 'text' }"
        @click="mode = 'text'"
      >
        文本编解码
      </button>
      <button 
        class="mode-btn"
        :class="{ active: mode === 'file' }"
        @click="mode = 'file'"
      >
        文件编码
      </button>
    </div>

    <div v-if="mode === 'text'" class="text-mode">
      <div class="content-container">
        <div class="editor-section">
          <div class="section-header">
            <h3>输入区域</h3>
            <div class="actions">
              <button class="action-btn" @click="clearInput">
                清空
              </button>
              <button class="action-btn" @click="pasteFromClipboard">
                粘贴
              </button>
            </div>
          </div>

          <div class="editor-container">
            <textarea 
              ref="inputEditor"
              v-model="inputText"
              placeholder="请输入要编码或解码的文本"
              spellcheck="false"
            ></textarea>
          </div>

          <div class="operation-btns">
            <button 
              class="primary-btn"
              @click="encodeText"
              :disabled="!inputText"
            >
              Base64编码
            </button>
            <button 
              class="primary-btn"
              @click="decodeText"
              :disabled="!inputText"
            >
              Base64解码
            </button>
          </div>
        </div>

        <div class="output-section">
          <div class="section-header">
            <h3>输出结果</h3>
            <div class="actions">
              <button 
                class="action-btn"
                @click="copyOutput"
                :disabled="!outputText"
              >
                复制
              </button>
              <button 
                class="action-btn"
                @click="downloadOutput"
                :disabled="!outputText"
              >
                下载
              </button>
            </div>
          </div>

          <div class="editor-container">
            <textarea 
              ref="outputEditor"
              v-model="outputText"
              placeholder="编码或解码结果将显示在这里"
              readonly
              spellcheck="false"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="file-mode">
      <div class="upload-zone" 
        @dragover.prevent 
        @drop.prevent="handleFileDrop"
        :class="{ 'is-dragging': isDragging }"
        @dragenter="isDragging = true"
        @dragleave="isDragging = false"
      >
        <div class="upload-content">
          <span class="upload-icon">📁</span>
          <h3>拖放文件到这里</h3>
          <p>或</p>
          <label class="file-input-label">
            <input 
              type="file" 
              @change="handleFileSelect" 
              class="file-input"
            >
            选择文件
          </label>
          <p class="upload-tip">最大支持10MB</p>
        </div>
      </div>

      <div v-if="selectedFile" class="file-info">
        <div class="info-header">
          <div class="file-details">
            <h4>{{ selectedFile.name }}</h4>
            <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
          </div>
          <button class="action-btn" @click="clearFile">
            清除
          </button>
        </div>

        <div class="operation-btns">
          <button 
            class="primary-btn"
            @click="encodeFile"
            :disabled="!selectedFile || isProcessing"
          >
            Base64编码
          </button>
        </div>

        <div v-if="isProcessing" class="processing-status">
          <div class="spinner"></div>
          <span>处理中...</span>
        </div>
      </div>

      <div v-if="fileResult" class="file-result">
        <div class="result-header">
          <h3>编码结果</h3>
          <div class="actions">
            <button class="action-btn" @click="copyFileResult">
              复制Base64
            </button>
            <button class="action-btn" @click="downloadFileResult">
              下载文本文件
            </button>
          </div>
        </div>

        <div class="result-preview">
          <div class="preview-header">
            <span>Base64字符串预览（显示前100个字符）：</span>
            <span class="result-size">总长度：{{ fileResult.length }} 字符</span>
          </div>
          <pre class="preview-content">{{ fileResult.slice(0, 100) }}...</pre>
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
          <span class="feature-icon">📝</span>
          <h3>文本编解码</h3>
          <p>支持文本内容的Base64编码和解码</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">📁</span>
          <h3>文件编码</h3>
          <p>支持各种类型文件的Base64编码</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🔒</span>
          <h3>本地处理</h3>
          <p>所有操作在本地完成，保护数据安全</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">💫</span>
          <h3>实时转换</h3>
          <p>快速响应，即时查看转换结果</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mode = ref('text')
const inputText = ref('')
const outputText = ref('')
const errorMessage = ref('')
const isDragging = ref(false)
const isProcessing = ref(false)
const selectedFile = ref(null)
const fileResult = ref('')

const inputEditor = ref(null)
const outputEditor = ref(null)

// 文本编解码
const encodeText = () => {
  try {
    outputText.value = btoa(inputText.value)
    errorMessage.value = ''
  } catch (err) {
    errorMessage.value = '编码失败：输入包含非ASCII字符'
  }
}

const decodeText = () => {
  try {
    outputText.value = atob(inputText.value)
    errorMessage.value = ''
  } catch (err) {
    errorMessage.value = '解码失败：输入不是有效的Base64字符串'
  }
}

// 文件处理
const handleFileDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const validateAndSetFile = (file) => {
  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = '文件大小不能超过10MB'
    return
  }
  selectedFile.value = file
  errorMessage.value = ''
  fileResult.value = ''
}

const encodeFile = () => {
  if (!selectedFile.value) return

  isProcessing.value = true
  errorMessage.value = ''
  
  const reader = new FileReader()
  reader.onload = () => {
    const base64String = reader.result.split(',')[1]
    fileResult.value = base64String
    isProcessing.value = false
  }
  reader.onerror = () => {
    errorMessage.value = '文件读取失败'
    isProcessing.value = false
  }
  reader.readAsDataURL(selectedFile.value)
}

// 辅助功能
const clearInput = () => {
  inputText.value = ''
  outputText.value = ''
  errorMessage.value = ''
}

const clearFile = () => {
  selectedFile.value = null
  fileResult.value = ''
  errorMessage.value = ''
}

const copyOutput = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
  } catch (err) {
    errorMessage.value = '复制失败'
  }
}

const copyFileResult = async () => {
  try {
    await navigator.clipboard.writeText(fileResult.value)
  } catch (err) {
    errorMessage.value = '复制失败'
  }
}

const downloadOutput = () => {
  const blob = new Blob([outputText.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'base64_result.txt'
  link.click()
  URL.revokeObjectURL(url)
}

const downloadFileResult = () => {
  const blob = new Blob([fileResult.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'base64_file.txt'
  link.click()
  URL.revokeObjectURL(url)
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
  } catch (err) {
    errorMessage.value = '粘贴失败'
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style lang="scss" scoped>
.base64-tool {
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

.mode-selector {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.mode-btn {
  padding: 0.75rem 2rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-main);
  color: var(--text-secondary);
  font-size: 1rem;
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
}

.content-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }
}

.editor-section,
.output-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.editor-container {
  position: relative;
  height: 300px;
  margin-bottom: 1rem;

  textarea {
    width: 100%;
    height: 100%;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-main);
    color: var(--text-primary);
    font-family: monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    resize: none;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: var(--primary);
    }

    &::placeholder {
      color: var(--text-secondary);
    }

    &[readonly] {
      background: var(--bg-card);
      cursor: default;
    }
  }
}

.operation-btns {
  display: flex;
  gap: 1rem;
  justify-content: center;
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
}

.primary-btn {
  padding: 0.75rem 2rem;
  border: 1px solid var(--primary);
  border-radius: 6px;
  background: var(--primary);
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: var(--primary-dark);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.upload-zone {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.2s;
  margin-bottom: 2rem;

  &.is-dragging {
    border-color: var(--primary);
    background: var(--bg-hover);
  }
}

.upload-content {
  .upload-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-secondary);
    margin: 0.5rem 0;
  }

  .upload-tip {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

.file-input {
  display: none;
}

.file-input-label {
  display: inline-block;
  padding: 0.75rem 2rem;
  border: 1px solid var(--primary);
  border-radius: 6px;
  background: var(--primary);
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  margin: 1rem 0;

  &:hover {
    background: var(--primary-dark);
  }
}

.file-info {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.file-details {
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }

  .file-size {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

.processing-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  color: var(--text-secondary);

  .spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid var(--border-color);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

.file-result {
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

  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }
}

.result-preview {
  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .preview-content {
    padding: 1rem;
    background: var(--bg-main);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-family: monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-all;
  }
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .base64-tool {
    padding: 1.5rem 1rem;
  }

  .tool-header {
    margin-bottom: 1.5rem;

    h1 {
      font-size: 1.75rem;
    }
  }

  .mode-selector {
    flex-direction: column;
  }

  .mode-btn {
    width: 100%;
  }

  .editor-section,
  .output-section,
  .file-info,
  .file-result {
    padding: 1rem;
  }

  .editor-container {
    height: 200px;
  }

  .operation-btns {
    flex-direction: column;
  }

  .primary-btn {
    width: 100%;
  }

  .upload-zone {
    padding: 2rem 1rem;
  }

  .result-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;

    .actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
}

@media (max-width: 480px) {
  .tool-header h1 {
    font-size: 1.5rem;
  }

  .section-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style> 