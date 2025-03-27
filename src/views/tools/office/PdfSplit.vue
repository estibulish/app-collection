<template>
  <div class="pdf-split-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>PDF 拆分工具</h1>
        <p class="tool-desc">在线 PDF 拆分工具，支持按页码、页数等方式拆分 PDF 文件</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="pdf-split" />
      </div>
    </div>

    <div class="split-container">
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
              accept=".pdf"
              style="display: none"
            >
            <div v-if="!file" class="upload-placeholder">
              <span class="upload-icon">📄</span>
              <p>点击或拖拽 PDF 文件到此处上传</p>
              <p class="upload-hint">支持 .pdf 格式，最大 50MB</p>
            </div>
            <div v-else class="file-info">
              <span class="file-icon">📄</span>
              <div class="file-details">
                <p class="file-name">{{ file.name }}</p>
                <p class="file-size">{{ formatSize(file.size) }}</p>
                <p v-if="totalPages > 0" class="file-pages">共 {{ totalPages }} 页</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="options-section" v-if="file && totalPages > 0">
        <div class="split-options">
          <div class="option-group">
            <h4>拆分方式</h4>
            <div class="radio-group">
              <label>
                <input type="radio" v-model="splitMode" value="range">
                <span>按页码范围</span>
              </label>
              <label>
                <input type="radio" v-model="splitMode" value="every">
                <span>每隔固定页数</span>
              </label>
              <label>
                <input type="radio" v-model="splitMode" value="single">
                <span>拆分为单页</span>
              </label>
            </div>
          </div>

          <div class="option-group" v-if="splitMode === 'range'">
            <h4>页码范围</h4>
            <p class="option-desc">输入页码范围，例如：1-5,8,11-13</p>
            <input 
              type="text" 
              v-model="pageRanges"
              placeholder="例如：1-5,8,11-13"
            >
          </div>

          <div class="option-group" v-if="splitMode === 'every'">
            <h4>每隔页数</h4>
            <p class="option-desc">每个文件包含的页数</p>
            <input 
              type="number" 
              v-model.number="pagesPerFile"
              min="1"
              :max="totalPages"
            >
          </div>

          <div class="option-group">
            <h4>输出设置</h4>
            <label>
              <span>文件名前缀</span>
              <input 
                type="text" 
                v-model="filenamePrefix"
                placeholder="拆分后的文件名前缀"
              >
            </label>
          </div>
        </div>
        <div class="split-actions">
          <button 
            class="split-btn" 
            @click="splitPdf" 
            :disabled="isSplitting"
          >
            {{ isSplitting ? '拆分中...' : '开始拆分' }}
          </button>
        </div>
      </div>

      <div class="result-section" v-if="splitFiles.length > 0">
        <div class="result-panel">
          <div class="panel-header">
            <h3>拆分结果</h3>
            <div class="panel-actions">
              <button class="action-btn" @click="downloadAllFiles">全部下载</button>
            </div>
          </div>
          <div class="result-list">
            <div 
              v-for="(file, index) in splitFiles" 
              :key="index"
              class="result-item"
            >
              <span class="file-icon">📄</span>
              <div class="file-details">
                <p class="file-name">{{ file.name }}</p>
                <p class="file-info">{{ formatSize(file.size) }} | {{ file.pages }}页</p>
              </div>
              <button class="download-btn" @click="downloadFile(file)">
                下载
              </button>
            </div>
          </div>
          <div class="result-summary">
            <div class="summary-item">
              <span class="summary-label">总文件数</span>
              <span class="summary-value">{{ splitFiles.length }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">拆分用时</span>
              <span class="summary-value">{{ splitTime }}秒</span>
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
import { PDFDocument } from 'pdf-lib'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const fileInput = ref(null)
const file = ref(null)
const totalPages = ref(0)
const splitMode = ref('range')
const pageRanges = ref('1-5')
const pagesPerFile = ref(5)
const filenamePrefix = ref('')
const isSplitting = ref(false)
const splitFiles = ref([])
const splitTime = ref(0)

// 处理文件选择
const handleFileChange = async (event) => {
  const selectedFile = event.target.files[0]
  if (selectedFile && selectedFile.type === 'application/pdf') {
    file.value = selectedFile
    splitFiles.value = []
    
    try {
      // 读取 PDF 页数
      const arrayBuffer = await selectedFile.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      totalPages.value = pdf.getPageCount()
      
      // 设置默认页码范围
      if (splitMode.value === 'range') {
        pageRanges.value = `1-${Math.min(5, totalPages.value)}`
      }
      
      // 设置默认文件名前缀
      if (!filenamePrefix.value) {
        filenamePrefix.value = selectedFile.name.replace(/\.pdf$/i, '')
      }
    } catch (err) {
      console.error('读取 PDF 失败:', err)
      alert('无法读取 PDF 文件，请重试')
      clearFile()
    }
  } else {
    alert('请选择有效的 PDF 文件')
  }
}

// 处理文件拖放
const handleDrop = async (event) => {
  const droppedFile = event.dataTransfer.files[0]
  if (droppedFile && droppedFile.type === 'application/pdf') {
    file.value = droppedFile
    splitFiles.value = []
    
    try {
      // 读取 PDF 页数
      const arrayBuffer = await droppedFile.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      totalPages.value = pdf.getPageCount()
      
      // 设置默认页码范围
      if (splitMode.value === 'range') {
        pageRanges.value = `1-${Math.min(5, totalPages.value)}`
      }
      
      // 设置默认文件名前缀
      if (!filenamePrefix.value) {
        filenamePrefix.value = droppedFile.name.replace(/\.pdf$/i, '')
      }
    } catch (err) {
      console.error('读取 PDF 失败:', err)
      alert('无法读取 PDF 文件，请重试')
      clearFile()
    }
  } else {
    alert('请拖放有效的 PDF 文件')
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
  totalPages.value = 0
  splitFiles.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 解析页码范围
const parsePageRanges = (rangeStr, maxPages) => {
  const pages = new Set()
  
  // 分割逗号分隔的部分
  const parts = rangeStr.split(',')
  
  for (const part of parts) {
    const trimmed = part.trim()
    
    // 处理范围 (例如 1-5)
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()))
      
      if (isNaN(start) || isNaN(end)) continue
      
      // 确保范围有效
      const validStart = Math.max(1, Math.min(start, maxPages))
      const validEnd = Math.max(1, Math.min(end, maxPages))
      
      // 添加范围内的所有页码
      for (let i = validStart; i <= validEnd; i++) {
        pages.add(i)
      }
    } 
    // 处理单个页码
    else {
      const pageNum = parseInt(trimmed)
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
        pages.add(pageNum)
      }
    }
  }
  
  return Array.from(pages).sort((a, b) => a - b)
}

// 拆分 PDF
const splitPdf = async () => {
  if (!file.value || isSplitting.value) return
  
  isSplitting.value = true
  const startTime = Date.now()
  
  try {
    const arrayBuffer = await file.value.arrayBuffer()
    const sourcePdf = await PDFDocument.load(arrayBuffer)
    const pageCount = sourcePdf.getPageCount()
    
    // 根据不同的拆分模式处理
    let splitResult = []
    
    if (splitMode.value === 'range') {
      // 按页码范围拆分
      const pageNumbers = parsePageRanges(pageRanges.value, pageCount)
      
      if (pageNumbers.length === 0) {
        throw new Error('无效的页码范围')
      }
      
      // 创建新的 PDF 文档
      const newPdf = await PDFDocument.create()
      const copiedPages = await newPdf.copyPages(sourcePdf, pageNumbers.map(p => p - 1))
      
      copiedPages.forEach(page => {
        newPdf.addPage(page)
      })
      
      const pdfBytes = await newPdf.save()
      const prefix = filenamePrefix.value || file.value.name.replace(/\.pdf$/i, '')
      const fileName = `${prefix}_pages_${pageNumbers.join('-')}.pdf`
      
      splitResult.push({
        name: fileName,
        data: pdfBytes,
        size: pdfBytes.length,
        pages: pageNumbers.length
      })
    } 
    else if (splitMode.value === 'every') {
      // 每隔固定页数拆分
      const pagesPerDoc = Math.max(1, pagesPerFile.value)
      const totalDocs = Math.ceil(pageCount / pagesPerDoc)
      
      for (let i = 0; i < totalDocs; i++) {
        const startPage = i * pagesPerDoc
        const endPage = Math.min((i + 1) * pagesPerDoc - 1, pageCount - 1)
        const pageRange = Array.from({ length: endPage - startPage + 1 }, (_, j) => startPage + j)
        
        // 创建新的 PDF 文档
        const newPdf = await PDFDocument.create()
        const copiedPages = await newPdf.copyPages(sourcePdf, pageRange)
        
        copiedPages.forEach(page => {
          newPdf.addPage(page)
        })
        
        const pdfBytes = await newPdf.save()
        const prefix = filenamePrefix.value || file.value.name.replace(/\.pdf$/i, '')
        const fileName = `${prefix}_part_${i + 1}.pdf`
        
        splitResult.push({
          name: fileName,
          data: pdfBytes,
          size: pdfBytes.length,
          pages: pageRange.length
        })
      }
    }
    else if (splitMode.value === 'single') {
      // 拆分为单页
      for (let i = 0; i < pageCount; i++) {
        // 创建新的 PDF 文档
        const newPdf = await PDFDocument.create()
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [i])
        
        newPdf.addPage(copiedPage)
        
        const pdfBytes = await newPdf.save()
        const prefix = filenamePrefix.value || file.value.name.replace(/\.pdf$/i, '')
        const fileName = `${prefix}_page_${i + 1}.pdf`
        
        splitResult.push({
          name: fileName,
          data: pdfBytes,
          size: pdfBytes.length,
          pages: 1
        })
      }
    }
    
    // 更新结果
    splitFiles.value = splitResult.map(result => {
      return {
        name: result.name,
        size: result.size,
        pages: result.pages,
        blob: new Blob([result.data], { type: 'application/pdf' })
      }
    })
    
    splitTime.value = ((Date.now() - startTime) / 1000).toFixed(1)
  } catch (err) {
    console.error('拆分 PDF 失败:', err)
    alert('拆分失败，请重试: ' + err.message)
  } finally {
    isSplitting.value = false
  }
}

// 下载单个文件
const downloadFile = (file) => {
  saveAs(file.blob, file.name)
}

// 下载所有文件
const downloadAllFiles = async () => {
  if (splitFiles.value.length === 0) return
  
  if (splitFiles.value.length === 1) {
    // 只有一个文件，直接下载
    downloadFile(splitFiles.value[0])
    return
  }
  
  // 多个文件，打包为 ZIP
  const zip = new JSZip()
  
  splitFiles.value.forEach(file => {
    zip.file(file.name, file.blob)
  })
  
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  const prefix = filenamePrefix.value || file.value.name.replace(/\.pdf$/i, '')
  saveAs(zipBlob, `${prefix}_split_files.zip`)
}

// 格式化文件大小
const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  else return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}
</script>

<style lang="scss" scoped>
.pdf-split-page {
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

  .split-container {
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
          margin: 0;
          color: var(--text-primary);
        }

        .panel-actions {
          display: flex;
          gap: 0.5rem;
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
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
      }

      .file-info {
        display: flex;
        align-items: center;
        gap: 1rem;

        .file-icon {
          font-size: 2.5rem;
          color: var(--text-secondary);
        }

        .file-details {
          text-align: left;

          .file-name {
            margin: 0 0 0.25rem;
            color: var(--text-primary);
            font-weight: 500;
          }

          .file-size, .file-pages {
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

      .split-options {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        .option-group {
          h4 {
            margin: 0 0 0.5rem;
            color: var(--text-primary);
          }

          .option-desc {
            margin: 0 0 0.5rem;
            color: var(--text-secondary);
            font-size: 0.9rem;
          }

          .radio-group {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;

            label {
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }
          }

          input[type="text"], input[type="number"] {
            padding: 0.5rem;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--bg-color);
            color: var(--text-primary);
            width: 100%;
            max-width: 300px;

            &:focus {
              border-color: var(--primary);
              outline: none;
            }
          }

          label {
            display: flex;
            align-items: center;
            gap: 0.5rem;

            span {
              min-width: 100px;
            }
          }
        }
      }

      .split-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .split-btn {
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

    .result-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      max-height: 400px;
      overflow-y: auto;

      .result-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-color);

        .file-icon {
          font-size: 1.5rem;
          color: var(--text-secondary);
        }

        .file-details {
          flex: 1;

          .file-name {
            margin: 0 0 0.25rem;
            color: var(--text-primary);
            font-weight: 500;
          }

          .file-info {
            margin: 0;
            color: var(--text-secondary);
            font-size: 0.9rem;
          }
        }

        .download-btn {
          padding: 0.25rem 0.75rem;
          border: 1px solid var(--primary);
          border-radius: 4px;
          background: none;
          color: var(--primary);
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: var(--primary);
            color: white;
          }
        }
      }
    }

    .result-summary {
      display: flex;
      justify-content: space-between;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);

      .summary-item {
        .summary-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-right: 0.5rem;
        }

        .summary-value {
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