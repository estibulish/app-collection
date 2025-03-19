<template>
  <div class="unicode-tool">
    <div class="tool-header">
      <h1>Unicode转换工具</h1>
      <p class="tool-desc">在线Unicode编码解码工具，支持中文和特殊字符转换</p>
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
            <button class="action-btn" @click="loadSample">
              加载示例
            </button>
          </div>
        </div>

        <div class="editor-container">
          <textarea 
            ref="inputEditor"
            v-model="inputText"
            placeholder="请输入要转换的文本"
            spellcheck="false"
          ></textarea>
        </div>

        <div class="options-panel">
          <label class="checkbox">
            <input 
              type="checkbox"
              v-model="convertOptions.useShortNotation"
            >
            <span class="checkbox-text">使用短格式（\u）</span>
          </label>
          <label class="checkbox">
            <input 
              type="checkbox"
              v-model="convertOptions.uppercase"
            >
            <span class="checkbox-text">使用大写字母</span>
          </label>
          <label class="checkbox">
            <input 
              type="checkbox"
              v-model="convertOptions.addPrefix"
            >
            <span class="checkbox-text">添加U+前缀</span>
          </label>
        </div>

        <div class="operation-btns">
          <button 
            class="primary-btn"
            @click="encodeUnicode"
            :disabled="!inputText"
          >
            转换为Unicode
          </button>
          <button 
            class="primary-btn"
            @click="decodeUnicode"
            :disabled="!inputText"
          >
            Unicode转文本
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
            placeholder="转换结果将显示在这里"
            readonly
            spellcheck="false"
          ></textarea>
        </div>

        <div class="char-info" v-if="selectedChar">
          <div class="info-header">
            <h3>字符信息</h3>
          </div>
          <div class="info-content">
            <div class="info-item">
              <span class="info-label">字符：</span>
              <span class="info-value">{{ selectedChar.char }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Unicode：</span>
              <span class="info-value">U+{{ selectedChar.code }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">UTF-16：</span>
              <span class="info-value">\u{{ selectedChar.utf16 }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">UTF-8：</span>
              <span class="info-value">{{ selectedChar.utf8 }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">HTML实体：</span>
              <span class="info-value">&amp;#x{{ selectedChar.code }};</span>
            </div>
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
          <p>支持Unicode编码和解码双向转换</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">ℹ️</span>
          <h3>字符信息</h3>
          <p>查看字符的Unicode、UTF-8、UTF-16编码</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">⚙️</span>
          <h3>自定义选项</h3>
          <p>提供多种编码格式和显示选项</p>
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
import { ref, reactive, computed } from 'vue'

const inputText = ref('')
const outputText = ref('')
const errorMessage = ref('')
const selectedChar = ref(null)

const inputEditor = ref(null)
const outputEditor = ref(null)

const convertOptions = reactive({
  useShortNotation: true,
  uppercase: false,
  addPrefix: false
})

const encodeUnicode = () => {
  try {
    const input = inputText.value
    let output = ''

    for (let i = 0; i < input.length; i++) {
      const char = input.charAt(i)
      const code = input.charCodeAt(i)
      
      if (code <= 127) {
        output += char
      } else {
        let hex = code.toString(16)
        if (convertOptions.uppercase) {
          hex = hex.toUpperCase()
        }
        if (convertOptions.useShortNotation) {
          output += '\\u' + hex.padStart(4, '0')
        } else {
          if (convertOptions.addPrefix) {
            output += 'U+' + hex.padStart(4, '0')
          } else {
            output += '\\u{' + hex + '}'
          }
        }
      }
    }

    outputText.value = output
    errorMessage.value = ''
  } catch (err) {
    errorMessage.value = '编码失败：' + err.message
  }
}

const decodeUnicode = () => {
  try {
    const input = inputText.value
    let output = ''

    // 匹配不同格式的Unicode编码
    const regex = /\\u([0-9a-fA-F]{4})|\\u\{([0-9a-fA-F]+)\}|U\+([0-9a-fA-F]{4,6})/g
    
    let lastIndex = 0
    let match

    while ((match = regex.exec(input)) !== null) {
      // 添加未匹配的普通文本
      output += input.slice(lastIndex, match.index)
      
      // 解码Unicode
      const hex = match[1] || match[2] || match[3]
      const charCode = parseInt(hex, 16)
      output += String.fromCharCode(charCode)
      
      lastIndex = regex.lastIndex
    }

    // 添加剩余的普通文本
    output += input.slice(lastIndex)

    outputText.value = output
    errorMessage.value = ''
  } catch (err) {
    errorMessage.value = '解码失败：' + err.message
  }
}

const showCharInfo = (char) => {
  const code = char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')
  const utf16 = code.padStart(4, '0')
  
  // 计算UTF-8编码
  const codePoint = char.charCodeAt(0)
  let utf8 = ''
  
  if (codePoint <= 0x7F) {
    utf8 = codePoint.toString(16).padStart(2, '0')
  } else if (codePoint <= 0x7FF) {
    utf8 = (
      ((0xC0 | (codePoint >> 6)).toString(16).padStart(2, '0')) +
      ' ' +
      ((0x80 | (codePoint & 0x3F)).toString(16).padStart(2, '0'))
    )
  } else {
    utf8 = (
      ((0xE0 | (codePoint >> 12)).toString(16).padStart(2, '0')) +
      ' ' +
      ((0x80 | ((codePoint >> 6) & 0x3F)).toString(16).padStart(2, '0')) +
      ' ' +
      ((0x80 | (codePoint & 0x3F)).toString(16).padStart(2, '0'))
    )
  }

  selectedChar.value = {
    char,
    code,
    utf16,
    utf8: utf8.toUpperCase()
  }
}

const loadSample = () => {
  inputText.value = '你好，世界！Hello World! ❤️ 🌍'
}

const clearInput = () => {
  inputText.value = ''
  outputText.value = ''
  errorMessage.value = ''
  selectedChar.value = null
}

const copyOutput = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
  } catch (err) {
    errorMessage.value = '复制失败'
  }
}

const downloadOutput = () => {
  const blob = new Blob([outputText.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'unicode_converted.txt'
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
</script>

<style lang="scss" scoped>
.unicode-tool {
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

.char-info {
  margin-top: 2rem;
  padding: 1rem;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.info-header {
  margin-bottom: 1rem;

  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }
}

.info-content {
  display: grid;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .info-label {
    color: var(--text-secondary);
    font-size: 0.875rem;
    min-width: 80px;
  }

  .info-value {
    color: var(--text-primary);
    font-family: monospace;
    font-size: 0.875rem;
    background: var(--bg-card);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
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

@media (max-width: 768px) {
  .unicode-tool {
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

  .char-info {
    margin-top: 1.5rem;
    padding: 0.75rem;
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

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;

    .info-label {
      min-width: auto;
    }

    .info-value {
      width: 100%;
      text-align: center;
    }
  }
}
</style> 