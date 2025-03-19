<template>
  <div class="json-format">
    <div class="tool-header">
      <h1>JSON格式化工具</h1>
      <p class="tool-desc">在线JSON格式化、压缩、校验工具，支持代码高亮和语法检查</p>
    </div>

    <div class="content-container">
      <div class="editor-section">
        <div class="section-header">
          <h3>输入区域</h3>
          <div class="actions">
            <button class="action-btn" @click="loadSample">
              加载示例
            </button>
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
            placeholder="请输入要格式化的JSON"
            spellcheck="false"
          ></textarea>
        </div>

        <div class="operation-btns">
          <button 
            class="primary-btn"
            @click="formatJson"
            :disabled="!inputText"
          >
            格式化
          </button>
          <button 
            class="primary-btn"
            @click="compressJson"
            :disabled="!inputText"
          >
            压缩
          </button>
          <button 
            class="primary-btn"
            @click="validateJson"
            :disabled="!inputText"
          >
            校验
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
            placeholder="格式化结果将显示在这里"
            readonly
            spellcheck="false"
          ></textarea>
        </div>
      </div>
    </div>

    <div class="options-panel">
      <div class="option-group">
        <label>缩进空格数</label>
        <div class="indent-selector">
          <button 
            v-for="size in indentSizes"
            :key="size"
            class="indent-btn"
            :class="{ active: indentSize === size }"
            @click="setIndentSize(size)"
          >
            {{ size }} 空格
          </button>
        </div>
      </div>

      <div class="option-group">
        <label class="checkbox">
          <input 
            type="checkbox"
            v-model="formatOptions.sortKeys"
          >
          <span class="checkbox-text">按键名排序</span>
        </label>
      </div>

      <div class="option-group">
        <label class="checkbox">
          <input 
            type="checkbox"
            v-model="formatOptions.escapeUnicode"
          >
          <span class="checkbox-text">转义Unicode字符</span>
        </label>
      </div>
    </div>

    <div class="validation-result" v-if="validationMessage">
      <div 
        class="message"
        :class="{ 'is-error': validationError }"
      >
        {{ validationMessage }}
      </div>
      <div class="error-position" v-if="errorPosition">
        位置：第 {{ errorPosition.line }} 行，第 {{ errorPosition.column }} 列
      </div>
    </div>

    <div class="features-section">
      <h2>功能特点</h2>
      <div class="features-grid">
        <div class="feature-card">
          <span class="feature-icon">🎨</span>
          <h3>格式美化</h3>
          <p>自动格式化JSON，支持自定义缩进</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🔍</span>
          <h3>语法检查</h3>
          <p>实时验证JSON语法，精确定位错误</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">⚡</span>
          <h3>快速压缩</h3>
          <p>一键压缩JSON，减小数据体积</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">⚙️</span>
          <h3>高级选项</h3>
          <p>支持键名排序、Unicode转义等功能</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const inputText = ref('')
const outputText = ref('')
const validationMessage = ref('')
const validationError = ref(false)
const errorPosition = ref(null)
const inputEditor = ref(null)
const outputEditor = ref(null)

const indentSizes = [2, 4, 8]
const indentSize = ref(2)

const formatOptions = reactive({
  sortKeys: false,
  escapeUnicode: false
})

const setIndentSize = (size) => {
  indentSize.value = size
  if (outputText.value) {
    formatJson()
  }
}

const formatJson = () => {
  try {
    const obj = JSON.parse(inputText.value)
    const formatted = JSON.stringify(obj, formatOptions.sortKeys ? Object.keys(obj).sort() : null, indentSize.value)
    outputText.value = formatOptions.escapeUnicode ? formatted : formatted.replace(/\\u[\dA-F]{4}/gi, match => {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
    })
    validationMessage.value = 'JSON格式正确'
    validationError.value = false
    errorPosition.value = null
  } catch (err) {
    handleJsonError(err)
  }
}

const compressJson = () => {
  try {
    const obj = JSON.parse(inputText.value)
    outputText.value = JSON.stringify(obj)
    validationMessage.value = 'JSON压缩成功'
    validationError.value = false
    errorPosition.value = null
  } catch (err) {
    handleJsonError(err)
  }
}

const validateJson = () => {
  try {
    JSON.parse(inputText.value)
    validationMessage.value = 'JSON格式正确'
    validationError.value = false
    errorPosition.value = null
  } catch (err) {
    handleJsonError(err)
  }
}

const handleJsonError = (err) => {
  validationMessage.value = err.message
  validationError.value = true

  // 尝试解析错误位置
  const match = err.message.match(/position\s+(\d+)/)
  if (match) {
    const pos = parseInt(match[1])
    const lines = inputText.value.slice(0, pos).split('\n')
    errorPosition.value = {
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    }
  } else {
    errorPosition.value = null
  }
}

const loadSample = () => {
  inputText.value = JSON.stringify({
    name: '示例JSON',
    description: '这是一个JSON示例',
    number: 42,
    boolean: true,
    null: null,
    array: [1, 2, 3],
    object: {
      key1: 'value1',
      key2: 'value2'
    }
  }, null, 2)
}

const clearInput = () => {
  inputText.value = ''
  outputText.value = ''
  validationMessage.value = ''
  validationError.value = false
  errorPosition.value = null
}

const copyOutput = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const downloadOutput = () => {
  const blob = new Blob([outputText.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'formatted.json'
  link.click()
  URL.revokeObjectURL(url)
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
  } catch (err) {
    console.error('粘贴失败:', err)
  }
}
</script>

<style lang="scss" scoped>
.json-format {
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
  height: 400px;
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
    tab-size: 2;
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

.options-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.option-group {
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 500;
  }
}

.indent-selector {
  display: flex;
  gap: 0.5rem;
}

.indent-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
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

.validation-result {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;

  .message {
    color: #059669;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;

    &.is-error {
      color: #dc2626;
    }
  }

  .error-position {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
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
  .json-format {
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
    height: 300px;
  }

  .operation-btns {
    flex-direction: column;
  }

  .primary-btn {
    width: 100%;
  }

  .options-panel {
    padding: 1rem;
    gap: 1rem;
  }

  .option-group {
    width: 100%;
  }

  .indent-selector {
    width: 100%;
  }

  .indent-btn {
    flex: 1;
    text-align: center;
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