<template>
  <div class="text-format-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>文本格式化工具</h1>
        <p class="tool-desc">在线文本格式化工具，支持 JSON、XML、SQL、HTML 等多种格式的美化和压缩</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="text-format" />
      </div>
    </div>

    <div class="format-container">
      <div class="input-section">
        <div class="text-panel">
          <div class="panel-header">
            <h3>输入文本</h3>
            <div class="panel-actions">
              <select v-model="formatType">
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="sql">SQL</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="js">JavaScript</option>
              </select>
              <button class="action-btn" @click="clearText">清空</button>
              <button class="action-btn" @click="pasteText">粘贴</button>
            </div>
          </div>
          <textarea 
            v-model="text"
            :placeholder="getPlaceholder"
          ></textarea>
        </div>
      </div>

      <div class="options-section">
        <div class="format-options">
          <label>
            <span>操作类型</span>
            <select v-model="operation">
              <option value="beautify">格式化</option>
              <option value="minify">压缩</option>
            </select>
          </label>
          <label v-if="operation === 'beautify'">
            <span>缩进空格</span>
            <input 
              type="number" 
              v-model="indentSize" 
              min="1" 
              max="8"
            >
          </label>
          <label v-if="formatType === 'json'">
            <input type="checkbox" v-model="sortKeys">
            <span>排序键值</span>
          </label>
        </div>
        <div class="format-actions">
          <button class="format-btn" @click="formatText">
            {{ operation === 'beautify' ? '格式化' : '压缩' }}
          </button>
        </div>
      </div>

      <div class="result-section">
        <div class="result-panel">
          <div class="panel-header">
            <h3>格式化结果</h3>
            <div class="panel-actions">
              <button class="action-btn" @click="copyResult">复制结果</button>
            </div>
          </div>
          <pre class="result-content" v-html="highlightedResult"></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'
import { js_beautify, html_beautify, css_beautify } from 'js-beautify'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const text = ref('')
const formatType = ref('json')
const operation = ref('beautify')
const indentSize = ref(2)
const sortKeys = ref(false)
const result = ref('')

// 获取占位符文本
const getPlaceholder = computed(() => {
  const placeholders = {
    json: '请输入 JSON 文本',
    xml: '请输入 XML 文本',
    sql: '请输入 SQL 语句',
    html: '请输入 HTML 代码',
    css: '请输入 CSS 代码',
    js: '请输入 JavaScript 代码'
  }
  return placeholders[formatType.value]
})

// 语法高亮结果
const highlightedResult = computed(() => {
  if (!result.value) return ''
  const highlighted = hljs.highlight(result.value, { 
    language: formatType.value === 'js' ? 'javascript' : formatType.value 
  }).value
  return highlighted
})

// 清空文本
const clearText = () => {
  text.value = ''
  result.value = ''
}

// 粘贴文本
const pasteText = async () => {
  try {
    const clipboardText = await navigator.clipboard.readText()
    text.value = clipboardText
  } catch (err) {
    console.error('粘贴失败:', err)
  }
}

// 复制结果
const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(result.value)
    alert('已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 格式化文本
const formatText = () => {
  if (!text.value) return

  try {
    switch (formatType.value) {
      case 'json':
        formatJson()
        break
      case 'xml':
        formatXml()
        break
      case 'sql':
        formatSql()
        break
      case 'html':
        formatHtml()
        break
      case 'css':
        formatCss()
        break
      case 'js':
        formatJs()
        break
    }
  } catch (err) {
    console.error('格式化失败:', err)
    alert('格式化失败，请检查输入是否正确')
  }
}

// 格式化 JSON
const formatJson = () => {
  const parsed = JSON.parse(text.value)
  if (operation.value === 'beautify') {
    if (sortKeys.value) {
      const sorted = {}
      Object.keys(parsed).sort().forEach(key => {
        sorted[key] = parsed[key]
      })
      result.value = JSON.stringify(sorted, null, indentSize.value)
    } else {
      result.value = JSON.stringify(parsed, null, indentSize.value)
    }
  } else {
    result.value = JSON.stringify(parsed)
  }
}

// 格式化 HTML
const formatHtml = () => {
  const options = {
    indent_size: indentSize.value,
    indent_char: ' ',
    max_preserve_newlines: -1,
    preserve_newlines: false,
    indent_scripts: 'normal'
  }
  
  if (operation.value === 'beautify') {
    result.value = html_beautify(text.value, options)
  } else {
    options.indent_size = 0
    result.value = html_beautify(text.value, options)
  }
}

// 格式化 CSS
const formatCss = () => {
  const options = {
    indent_size: indentSize.value,
    indent_char: ' '
  }
  
  if (operation.value === 'beautify') {
    result.value = css_beautify(text.value, options)
  } else {
    options.indent_size = 0
    result.value = css_beautify(text.value, options)
  }
}

// 格式化 JavaScript
const formatJs = () => {
  const options = {
    indent_size: indentSize.value,
    indent_char: ' ',
    max_preserve_newlines: 2
  }
  
  if (operation.value === 'beautify') {
    result.value = js_beautify(text.value, options)
  } else {
    options.indent_size = 0
    result.value = js_beautify(text.value, options)
  }
}

// 格式化 XML
const formatXml = () => {
  // 实现 XML 格式化逻辑
}

// 格式化 SQL
const formatSql = () => {
  // 实现 SQL 格式化逻辑
}
</script>

<style lang="scss" scoped>
.text-format-page {
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

  .format-container {
    display: grid;
    gap: 2rem;

    .text-panel, .result-panel {
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
          align-items: center;

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
      }

      textarea {
        width: 100%;
        height: 300px;
        padding: 1rem;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-color);
        color: var(--text-primary);
        resize: vertical;
        font-family: monospace;
        line-height: 1.5;

        &:focus {
          border-color: var(--primary);
          outline: none;
        }
      }

      .result-content {
        padding: 1rem;
        margin: 0;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-color);
        max-height: 500px;
        overflow: auto;
        font-family: monospace;
        line-height: 1.5;
        white-space: pre-wrap;
        word-break: break-all;
      }
    }

    .options-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: var(--bg-card);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      .format-options {
        display: flex;
        gap: 1rem;
        align-items: center;

        label {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          span {
            color: var(--text-primary);
          }

          input[type="number"] {
            width: 60px;
            padding: 0.25rem;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--bg-color);
            color: var(--text-primary);
            text-align: center;

            &::-webkit-inner-spin-button,
            &::-webkit-outer-spin-button {
              opacity: 1;
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
      }

      .format-btn {
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