<template>
  <div class="url-encode">
    <div class="tool-header">
      <h1>URL编解码工具</h1>
      <p class="tool-desc">在线URL编码解码工具，支持单个URL和批量处理</p>
    </div>

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
            placeholder="请输入要编码或解码的URL"
            spellcheck="false"
          ></textarea>
        </div>

        <div class="options-panel">
          <label class="checkbox">
            <input 
              type="checkbox"
              v-model="encodeOptions.encodeAll"
            >
            <span class="checkbox-text">编码所有字符（包括保留字符）</span>
          </label>
          <label class="checkbox">
            <input 
              type="checkbox"
              v-model="encodeOptions.uppercase"
            >
            <span class="checkbox-text">使用大写字母</span>
          </label>
          <label class="checkbox">
            <input 
              type="checkbox"
              v-model="encodeOptions.spaceAsPlus"
            >
            <span class="checkbox-text">空格转换为加号</span>
          </label>
        </div>

        <div class="operation-btns">
          <button 
            class="primary-btn"
            @click="encodeUrl"
            :disabled="!inputText"
          >
            URL编码
          </button>
          <button 
            class="primary-btn"
            @click="decodeUrl"
            :disabled="!inputText"
          >
            URL解码
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

    <div class="batch-section">
      <div class="section-header">
        <h3>批量处理</h3>
        <p class="section-desc">每行一个URL，支持同时处理多个URL</p>
      </div>

      <div class="batch-container">
        <div class="editor-section">
          <div class="section-header">
            <h3>输入区域</h3>
            <div class="actions">
              <button class="action-btn" @click="clearBatchInput">
                清空
              </button>
              <button class="action-btn" @click="pasteBatchFromClipboard">
                粘贴
              </button>
            </div>
          </div>

          <div class="editor-container">
            <textarea 
              ref="batchInputEditor"
              v-model="batchInputText"
              placeholder="请输入要处理的URL列表，每行一个URL"
              spellcheck="false"
            ></textarea>
          </div>

          <div class="operation-btns">
            <button 
              class="primary-btn"
              @click="encodeBatch"
              :disabled="!batchInputText"
            >
              批量编码
            </button>
            <button 
              class="primary-btn"
              @click="decodeBatch"
              :disabled="!batchInputText"
            >
              批量解码
            </button>
          </div>
        </div>

        <div class="output-section">
          <div class="section-header">
            <h3>输出结果</h3>
            <div class="actions">
              <button 
                class="action-btn"
                @click="copyBatchOutput"
                :disabled="!batchOutputText"
              >
                复制
              </button>
              <button 
                class="action-btn"
                @click="downloadBatchOutput"
                :disabled="!batchOutputText"
              >
                下载
              </button>
            </div>
          </div>

          <div class="editor-container">
            <textarea 
              ref="batchOutputEditor"
              v-model="batchOutputText"
              placeholder="批量处理结果将显示在这里"
              readonly
              spellcheck="false"
            ></textarea>
          </div>
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
          <span class="feature-icon">🔄</span>
          <h3>双向转换</h3>
          <p>支持URL编码和解码双向转换</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">📋</span>
          <h3>批量处理</h3>
          <p>支持多个URL同时编码解码</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">⚙️</span>
          <h3>自定义选项</h3>
          <p>提供多种编码选项满足需求</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🔒</span>
          <h3>本地处理</h3>
          <p>所有操作在本地完成，保护数据安全</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const inputText = ref('')
const outputText = ref('')
const batchInputText = ref('')
const batchOutputText = ref('')
const errorMessage = ref('')

const inputEditor = ref(null)
const outputEditor = ref(null)
const batchInputEditor = ref(null)
const batchOutputEditor = ref(null)

const encodeOptions = reactive({
  encodeAll: false,
  uppercase: false,
  spaceAsPlus: false
})

// 单个URL处理
const encodeUrl = () => {
  try {
    const input = inputText.value
    let output = ''

    if (encodeOptions.encodeAll) {
      output = encodeURIComponent(input)
    } else {
      output = encodeURI(input)
    }

    if (encodeOptions.spaceAsPlus) {
      output = output.replace(/%20/g, '+')
    }

    if (encodeOptions.uppercase) {
      output = output.replace(/%[0-9a-f]{2}/gi, match => match.toUpperCase())
    }

    outputText.value = output
    errorMessage.value = ''
  } catch (err) {
    errorMessage.value = '编码失败：' + err.message
  }
}

const decodeUrl = () => {
  try {
    const input = inputText.value.replace(/\+/g, '%20')
    outputText.value = decodeURIComponent(input)
    errorMessage.value = ''
  } catch (err) {
    errorMessage.value = '解码失败：' + err.message
  }
}

// 批量处理
const encodeBatch = () => {
  try {
    const urls = batchInputText.value.split('\n').filter(url => url.trim())
    const results = urls.map(url => {
      try {
        let output = encodeOptions.encodeAll ? encodeURIComponent(url) : encodeURI(url)
        if (encodeOptions.spaceAsPlus) {
          output = output.replace(/%20/g, '+')
        }
        if (encodeOptions.uppercase) {
          output = output.replace(/%[0-9a-f]{2}/gi, match => match.toUpperCase())
        }
        return output
      } catch (err) {
        return `错误: ${url} (${err.message})`
      }
    })
    batchOutputText.value = results.join('\n')
    errorMessage.value = ''
  } catch (err) {
    errorMessage.value = '批量编码失败：' + err.message
  }
}

const decodeBatch = () => {
  try {
    const urls = batchInputText.value.split('\n').filter(url => url.trim())
    const results = urls.map(url => {
      try {
        return decodeURIComponent(url.replace(/\+/g, '%20'))
      } catch (err) {
        return `错误: ${url} (${err.message})`
      }
    })
    batchOutputText.value = results.join('\n')
    errorMessage.value = ''
  } catch (err) {
    errorMessage.value = '批量解码失败：' + err.message
  }
}

// 辅助功能
const clearInput = () => {
  inputText.value = ''
  outputText.value = ''
  errorMessage.value = ''
}

const clearBatchInput = () => {
  batchInputText.value = ''
  batchOutputText.value = ''
  errorMessage.value = ''
}

const copyOutput = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
  } catch (err) {
    errorMessage.value = '复制失败'
  }
}

const copyBatchOutput = async () => {
  try {
    await navigator.clipboard.writeText(batchOutputText.value)
  } catch (err) {
    errorMessage.value = '复制失败'
  }
}

const downloadOutput = () => {
  const blob = new Blob([outputText.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'url_encoded.txt'
  link.click()
  URL.revokeObjectURL(url)
}

const downloadBatchOutput = () => {
  const blob = new Blob([batchOutputText.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'url_encoded_batch.txt'
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

const pasteBatchFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    batchInputText.value = text
  } catch (err) {
    errorMessage.value = '粘贴失败'
  }
}
</script>

<style lang="scss" scoped>
.url-encode {
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

.content-container,
.batch-container {
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

  .section-desc {
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin-top: 0.25rem;
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
  height: 200px;
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

.options-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    cursor: pointer;
  }

  .checkbox-text {
    color: var(--text-primary);
    font-size: 0.875rem;
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

.batch-section {
  margin-top: 3rem;
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

@media (max-width: 768px) {
  .url-encode {
    padding: 1.5rem 1rem;
  }

  .tool-header {
    margin-bottom: 1.5rem;

    h1 {
      font-size: 1.75rem;
    }
  }

  .editor-section,
  .output-section {
    padding: 1rem;
  }

  .editor-container {
    height: 150px;
  }

  .operation-btns {
    flex-direction: column;
  }

  .primary-btn {
    width: 100%;
  }

  .options-panel {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .checkbox {
    width: 100%;
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