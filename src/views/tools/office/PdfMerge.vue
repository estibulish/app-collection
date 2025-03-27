<template>
  <div class="pdf-merge-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>PDF 合并工具</h1>
        <p class="tool-desc">在线 PDF 合并工具，支持多个 PDF 文件合并为一个文件</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="pdf-merge" />
      </div>
    </div>

    <div class="merge-container">
      <div class="input-section">
        <div class="upload-panel">
          <div class="panel-header">
            <h3>上传文件</h3>
            <div class="panel-actions">
              <button class="action-btn" @click="clearFiles">清空全部</button>
              <button class="action-btn" @click="triggerUpload">添加文件</button>
            </div>
          </div>
          <div class="upload-area">
            <input 
              type="file" 
              ref="fileInput"
              @change="handleFileChange"
              accept=".pdf"
              multiple
              style="display: none"
            >
            <div 
              v-if="files.length === 0" 
              class="upload-placeholder"
              @drop.prevent="handleDrop"
              @dragover.prevent
              @click="triggerUpload"
            >
              <span class="upload-icon">📄</span>
              <p>点击或拖拽 PDF 文件到此处上传</p>
              <p class="upload-hint">支持多个 PDF 文件，可拖拽排序</p>
            </div>
            <div v-else class="file-list">
              <draggable 
                v-model="files" 
                item-key="id"
                handle=".drag-handle"
                ghost-class="ghost-item"
              >
                <template #item="{element, index}">
                  <div class="file-item">
                    <div class="drag-handle">⋮⋮</div>
                    <span class="file-icon">📄</span>
                    <div class="file-details">
                      <p class="file-name">{{ element.file.name }}</p>
                      <p class="file-size">{{ formatSize(element.file.size) }}</p>
                    </div>
                    <button class="remove-btn" @click="removeFile(index)">✕</button>
                  </div>
                </template>
              </draggable>
              <div 
                class="add-more"
                @drop.prevent="handleDrop"
                @dragover.prevent
                @click="triggerUpload"
              >
                <span>+ 添加更多文件</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="options-section">
        <div class="merge-options">
          <label>
            <span>输出文件名</span>
            <input 
              type="text" 
              v-model="outputFilename"
              placeholder="合并后的文件名"
            >
          </label>
          <label>
            <input type="checkbox" v-model="addBookmarks">
            <span>添加书签</span>
          </label>
          <label>
            <input type="checkbox" v-model="addPageNumbers">
            <span>添加页码</span>
          </label>
        </div>
        <div class="merge-actions">
          <button 
            class="merge-btn" 
            @click="mergePdfs" 
            :disabled="files.length < 2 || isMerging"
          >
            {{ isMerging ? '合并中...' : '开始合并' }}
          </button>
        </div>
      </div>

      <div class="result-section" v-if="mergedFile">
        <div class="result-panel">
          <div class="panel-header">
            <h3>合并结果</h3>
            <div class="panel-actions">
              <button class="action-btn" @click="downloadResult">下载</button>
            </div>
          </div>
          <div class="result-preview">
            <div class="preview-placeholder">
              <span class="preview-icon">📄</span>
              <p>PDF 文件已合并</p>
            </div>
          </div>
          <div class="result-info">
            <div class="info-item">
              <span class="info-label">文件名</span>
              <span class="info-value">{{ mergedFile.name }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">文件大小</span>
              <span class="info-value">{{ formatSize(mergedFile.size) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">页数</span>
              <span class="info-value">{{ totalPages }} 页</span>
            </div>
            <div class="info-item">
              <span class="info-label">合并用时</span>
              <span class="info-value">{{ mergeTime }}秒</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'
import { PDFDocument } from 'pdf-lib'
import { v4 as uuidv4 } from 'uuid'
import draggable from 'vuedraggable'

const fileInput = ref(null)
const files = ref([])
const outputFilename = ref('merged.pdf')
const addBookmarks = ref(true)
const addPageNumbers = ref(false)
const isMerging = ref(false)
const mergedFile = ref(null)
const mergeTime = ref(0)
const totalPages = ref(0) 

// 处理文件选择
const handleFileChange = (event) => {
  const selectedFiles = Array.from(event.target.files)
  
  for (const file of selectedFiles) {
    if (file.type === 'application/pdf') {
      files.value.push({
        id: uuidv4(),
        file: file
      })
    }
  }
  
  // 清空文件输入，以便可以重复选择相同的文件
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 处理拖放
const handleDrop = (event) => {
  const droppedFiles = Array.from(event.dataTransfer.files)
  
  for (const file of droppedFiles) {
    if (file.type === 'application/pdf') {
      files.value.push({
        id: uuidv4(),
        file: file
      })
    }
  }
}

// 触发文件上传
const triggerUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// 移除文件
const removeFile = (index) => {
  files.value.splice(index, 1)
}

// 清空所有文件
const clearFiles = () => {
  files.value = []
  mergedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 合并 PDF 文件
const mergePdfs = async () => {
  if (files.value.length < 2 || isMerging.value) return
  
  isMerging.value = true
  const startTime = Date.now()
  
  try {
    // 创建新的 PDF 文档
    const mergedPdf = await PDFDocument.create()
    let pageCount = 0
    
    // 处理每个 PDF 文件
    for (const fileObj of files.value) {
      const fileArrayBuffer = await fileObj.file.arrayBuffer()
      const pdf = await PDFDocument.load(fileArrayBuffer)
      
      // 复制页面到新文档
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      copiedPages.forEach(page => {
        mergedPdf.addPage(page)
        pageCount++
      })
    }
    
    // 保存合并后的 PDF
    const mergedPdfBytes = await mergedPdf.save()
    const fileName = outputFilename.value.endsWith('.pdf') ? 
      outputFilename.value : `${outputFilename.value}.pdf`
    
    mergedFile.value = new File([mergedPdfBytes], fileName, { type: 'application/pdf' })
    totalPages.value = pageCount
    mergeTime.value = ((Date.now() - startTime) / 1000).toFixed(1)
  } catch (err) {
    console.error('合并失败:', err)
    alert('合并失败，请重试')
  } finally {
    isMerging.value = false
  }
}

// 下载合并后的文件
const downloadResult = () => {
  if (mergedFile.value) {
    const url = URL.createObjectURL(mergedFile.value)
    const a = document.createElement('a')
    a.href = url
    a.download = mergedFile.value.name
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
.pdf-merge-page {
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

  .merge-container {
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

    .upload-placeholder {
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

    .file-list {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;

      .file-item {
        display: flex;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
        background: var(--bg-color);

        &:last-child {
          border-bottom: none;
        }

        .drag-handle {
          cursor: move;
          color: var(--text-secondary);
          margin-right: 0.5rem;
          user-select: none;
        }

        .file-icon {
          font-size: 1.5rem;
          color: var(--text-secondary);
          margin-right: 1rem;
        }

        .file-details {
          flex: 1;

          .file-name {
            margin: 0 0 0.25rem;
            color: var(--text-primary);
            font-weight: 500;
          }

          .file-size {
            margin: 0;
            color: var(--text-secondary);
            font-size: 0.9rem;
          }
        }

        .remove-btn {
          padding: 0.25rem 0.5rem;
          border: none;
          background: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            color: #f56c6c;
          }
        }
      }

      .add-more {
        padding: 1rem;
        text-align: center;
        background: var(--bg-color);
        color: var(--primary);
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: rgba(64, 158, 255, 0.05);
        }
      }
    }

    .ghost-item {
      opacity: 0.5;
      background: rgba(64, 158, 255, 0.1) !important;
      border: 1px dashed #409eff !important;
    }

    .options-section {
      background: var(--bg-card);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .merge-options {
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

          input[type="text"] {
            padding: 0.5rem;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--bg-color);
            color: var(--text-primary);
            width: 200px;

            &:focus {
              border-color: var(--primary);
              outline: none;
            }
          }
        }
      }

      .merge-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .merge-btn {
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