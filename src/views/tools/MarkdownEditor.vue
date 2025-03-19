<template>
  <div class="markdown-editor">
    <div class="tool-header">
      <h1>Markdown编辑器</h1>
      <p class="tool-desc">在线 Markdown 编辑器，支持实时预览、导出 HTML/PDF</p>
      <div class="tool-actions">
        <FavoriteButton tool-id="markdown-editor" />
      </div>
    </div>

    <div class="editor-toolbar">
      <div class="toolbar-group">
        <button class="toolbar-btn" title="加粗" @click="insertMarkdown('bold')">
          <span class="icon">B</span>
        </button>
        <button class="toolbar-btn" title="斜体" @click="insertMarkdown('italic')">
          <span class="icon">I</span>
        </button>
        <button class="toolbar-btn" title="删除线" @click="insertMarkdown('strike')">
          <span class="icon">S</span>
        </button>
      </div>

      <div class="toolbar-group">
        <button class="toolbar-btn" title="标题" @click="insertMarkdown('heading')">
          <span class="icon">H</span>
        </button>
        <button class="toolbar-btn" title="引用" @click="insertMarkdown('quote')">
          <span class="icon">❝</span>
        </button>
        <button class="toolbar-btn" title="代码块" @click="insertMarkdown('code')">
          <span class="icon">{'}'}</span>
        </button>
      </div>

      <div class="toolbar-group">
        <button class="toolbar-btn" title="链接" @click="insertMarkdown('link')">
          <span class="icon">🔗</span>
        </button>
        <button class="toolbar-btn" title="图片" @click="insertMarkdown('image')">
          <span class="icon">🖼</span>
        </button>
        <button class="toolbar-btn" title="表格" @click="insertMarkdown('table')">
          <span class="icon">☷</span>
        </button>
      </div>

      <div class="toolbar-group">
        <button class="toolbar-btn" title="无序列表" @click="insertMarkdown('ul')">
          <span class="icon">•</span>
        </button>
        <button class="toolbar-btn" title="有序列表" @click="insertMarkdown('ol')">
          <span class="icon">1.</span>
        </button>
        <button class="toolbar-btn" title="任务列表" @click="insertMarkdown('task')">
          <span class="icon">☐</span>
        </button>
      </div>

      <div class="toolbar-group">
        <button class="toolbar-btn" @click="clearContent">
          清空
        </button>
        <button class="toolbar-btn" @click="loadSample">
          示例
        </button>
      </div>

      <div class="toolbar-group">
        <button class="toolbar-btn" @click="exportHtml">
          导出HTML
        </button>
        <button class="toolbar-btn" @click="exportPdf">
          导出PDF
        </button>
      </div>
    </div>

    <div class="editor-container">
      <div class="editor-wrapper">
        <div class="editor-header">
          <span>Markdown</span>
          <div class="editor-info">{{ getWordCount() }} 字</div>
        </div>
        <textarea
          v-model="markdownContent"
          class="markdown-input"
          placeholder="在此输入 Markdown 内容..."
          @input="handleInput"
          @scroll="syncScroll"
          ref="editor"
        ></textarea>
      </div>

      <div class="preview-wrapper">
        <div class="editor-header">
          <span>预览</span>
          <div class="preview-actions">
            <button 
              class="preview-btn"
              :class="{ active: previewMode === 'rendered' }"
              @click="previewMode = 'rendered'"
            >
              渲染视图
            </button>
            <button 
              class="preview-btn"
              :class="{ active: previewMode === 'html' }"
              @click="previewMode = 'html'"
            >
              HTML源码
            </button>
          </div>
        </div>
        <div 
          class="preview-content"
          ref="preview"
          @scroll="syncScroll"
        >
          <div v-if="previewMode === 'rendered'" v-html="renderedContent"></div>
          <pre v-else><code>{{ renderedHtml }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { marked } from 'marked'
import { useFavoriteStore } from '../../stores/favorite'
import FavoriteButton from '../../components/FavoriteButton.vue'
import { getTool } from '../../config/tools'

const tool = getTool('markdown-editor')
const favoriteStore = useFavoriteStore()

const markdownContent = ref('')
const previewMode = ref('rendered')
const editor = ref(null)
const preview = ref(null)
const isScrolling = ref(false)

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true
})

// 渲染 Markdown
const renderedContent = computed(() => {
  return marked(markdownContent.value)
})

// 获取HTML源码
const renderedHtml = computed(() => {
  return renderedContent.value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
})

// 插入 Markdown 语法
const insertMarkdown = (type) => {
  const textarea = editor.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = markdownContent.value
  
  const insertText = {
    bold: ['**', '**'],
    italic: ['*', '*'],
    strike: ['~~', '~~'],
    heading: ['### ', ''],
    quote: ['> ', ''],
    code: ['```\n', '\n```'],
    link: ['[', '](url)'],
    image: ['![alt text](', ')'],
    table: ['| Header | Header |\n|---------|----------|\n| Cell | Cell |', ''],
    ul: ['- ', ''],
    ol: ['1. ', ''],
    task: ['- [ ] ', '']
  }[type]

  const selectedText = text.slice(start, end)
  const replacement = insertText[0] + selectedText + insertText[1]
  
  markdownContent.value = text.slice(0, start) + replacement + text.slice(end)
  
  // 恢复光标位置
  setTimeout(() => {
    textarea.focus()
    if (selectedText) {
      textarea.setSelectionRange(
        start + insertText[0].length,
        start + insertText[0].length + selectedText.length
      )
    } else {
      textarea.setSelectionRange(
        start + insertText[0].length,
        start + insertText[0].length
      )
    }
  })
}

// 同步滚动
const syncScroll = (e) => {
  if (isScrolling.value) return
  isScrolling.value = true

  const source = e.target
  const target = source === editor.value ? preview.value : editor.value
  
  const percentage = source.scrollTop / (source.scrollHeight - source.clientHeight)
  target.scrollTop = percentage * (target.scrollHeight - target.clientHeight)
  
  setTimeout(() => {
    isScrolling.value = false
  }, 20)
}

// 获取字数统计
const getWordCount = () => {
  return markdownContent.value.length
}

// 导出HTML
const exportHtml = () => {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Markdown Export</title>
  <style>
    body {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  ${renderedContent.value}
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'markdown-export.html'
  a.click()
  URL.revokeObjectURL(url)
}

// 导出PDF
const exportPdf = () => {
  window.print()
}

// 清空内容
const clearContent = () => {
  if (confirm('确定要清空所有内容吗？')) {
    markdownContent.value = ''
  }
}

// 加载示例
const loadSample = () => {
  markdownContent.value = `# Markdown 示例

## 基本语法

### 标题
# 一级标题
## 二级标题
### 三级标题

### 强调
**粗体文本**
*斜体文本*
~~删除线文本~~

### 列表
- 无序列表项
- 另一个列表项
  - 嵌套列表项

1. 有序列表项
2. 另一个列表项
   1. 嵌套列表项

### 任务列表
- [x] 已完成任务
- [ ] 未完成任务

### 引用
> 这是一段引用文本
> 可以有多行

### 代码
\`\`\`javascript
function hello() {
  console.log('Hello World!')
}
\`\`\`

### 链接和图片
[Markdown 指南](https://www.markdownguide.org)
![示例图片](https://example.com/image.jpg)

### 表格
| 表头 1 | 表头 2 |
|--------|---------|
| 单元格 | 单元格 |
| 单元格 | 单元格 |
`
}

onMounted(() => {
  favoriteStore.updateLastUsed(tool.id)
})
</script>

<style lang="scss" scoped>
.markdown-editor {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.tool-header {
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .tool-desc {
    color: var(--text-secondary);
  }
}

.editor-toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow-x: auto;
  
  .toolbar-group {
    display: flex;
    gap: 0.25rem;
    padding: 0 0.5rem;
    
    &:not(:last-child) {
      border-right: 1px solid var(--border-color);
    }
  }
}

.toolbar-btn {
  padding: 0.5rem;
  border: none;
  background: none;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background: var(--bg-hover);
    color: var(--primary);
  }
  
  .icon {
    font-size: 1rem;
    line-height: 1;
  }
}

.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  height: calc(100vh - 300px);
  min-height: 500px;
}

.editor-wrapper,
.preview-wrapper {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.markdown-input {
  flex: 1;
  padding: 1rem;
  border: none;
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  resize: none;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }
}

.preview-content {
  flex: 1;
  padding: 1rem;
  overflow: auto;
  background: var(--bg-card);
  
  :deep(h1) {
    font-size: 2em;
    margin: 0.67em 0;
  }
  
  :deep(h2) {
    font-size: 1.5em;
    margin: 0.83em 0;
  }
  
  :deep(h3) {
    font-size: 1.17em;
    margin: 1em 0;
  }
  
  :deep(p) {
    margin: 1em 0;
  }
  
  :deep(pre) {
    background: var(--bg-hover);
    padding: 1rem;
    border-radius: 6px;
    overflow: auto;
  }
  
  :deep(code) {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    font-size: 0.875rem;
  }
  
  :deep(blockquote) {
    margin: 1em 0;
    padding-left: 1em;
    border-left: 4px solid var(--primary);
    color: var(--text-secondary);
  }
  
  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
    
    th, td {
      border: 1px solid var(--border-color);
      padding: 0.5rem;
    }
    
    th {
      background: var(--bg-hover);
    }
  }
}

.preview-actions {
  display: flex;
  gap: 0.5rem;
}

.preview-btn {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: none;
  color: var(--text-secondary);
  font-size: 0.75rem;
  cursor: pointer;
  
  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
  
  &.active {
    background: var(--primary-50);
    color: var(--primary);
    border-color: var(--primary);
  }
}

@media (max-width: 768px) {
  .markdown-editor {
    padding: 1rem;
  }
  
  .editor-container {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .editor-toolbar {
    flex-wrap: wrap;
  }
  
  .toolbar-group {
    &:not(:last-child) {
      border-right: none;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.5rem;
      margin-bottom: 0.5rem;
    }
  }
}

@media print {
  .tool-header,
  .editor-toolbar,
  .editor-wrapper {
    display: none;
  }
  
  .preview-wrapper {
    border: none;
  }
  
  .editor-header {
    display: none;
  }
  
  .preview-content {
    padding: 0;
  }
}
</style> 