<template>
  <div class="excel-to-json-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>Excel 转 JSON 工具</h1>
        <p class="tool-desc">在线 Excel 转 JSON 工具，支持 Excel、CSV 等格式转换为 JSON 数据</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="excel-to-json" />
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
              accept=".xlsx,.xls,.csv"
              style="display: none"
            >
            <div v-if="!file" class="upload-placeholder">
              <span class="upload-icon">📄</span>
              <p>点击或拖拽文件到此处上传</p>
              <p class="upload-hint">支持 .xlsx、.xls、.csv 格式</p>
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
            <span>工作表</span>
            <select v-model="selectedSheet" :disabled="!sheets.length">
              <option v-for="sheet in sheets" :key="sheet" :value="sheet">
                {{ sheet }}
              </option>
            </select>
          </label>
          <label>
            <input type="checkbox" v-model="hasHeader">
            <span>首行为表头</span>
          </label>
          <label>
            <input type="checkbox" v-model="trimValues">
            <span>去除单元格首尾空格</span>
          </label>
          <label>
            <input type="checkbox" v-model="skipEmptyRows">
            <span>忽略空行</span>
          </label>
        </div>
        <div class="convert-actions">
          <button class="convert-btn" @click="convertToJson" :disabled="!file">
            转换为 JSON
          </button>
        </div>
      </div>

      <div class="result-section">
        <div class="result-panel">
          <div class="panel-header">
            <h3>JSON 结果</h3>
            <div class="panel-actions">
              <button class="action-btn" @click="copyJson">复制</button>
              <button class="action-btn" @click="downloadJson">下载</button>
            </div>
          </div>
          <pre class="json-content" v-if="jsonResult">{{ formattedJson }}</pre>
          <div v-else class="no-data">
            暂无数据，请上传文件并点击转换按钮
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'
import * as XLSX from 'xlsx'

const fileInput = ref(null)
const file = ref(null)
const sheets = ref([])
const selectedSheet = ref('')
const hasHeader = ref(true)
const trimValues = ref(true)
const skipEmptyRows = ref(true)
const jsonResult = ref(null)

// 格式化 JSON 显示
const formattedJson = computed(() => {
  return jsonResult.value ? JSON.stringify(jsonResult.value, null, 2) : ''
})

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
const handleFile = async (uploadedFile) => {
  if (!uploadedFile.name.match(/\.(xlsx|xls|csv)$/)) {
    alert('请上传 Excel 或 CSV 文件')
    return
  }

  file.value = uploadedFile
  const workbook = await readWorkbook(uploadedFile)
  sheets.value = workbook.SheetNames
  selectedSheet.value = sheets.value[0]
}

// 读取工作簿
const readWorkbook = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        resolve(workbook)
      } catch (err) {
        reject(err)
      }
    }
    reader.readAsArrayBuffer(file)
  })
}

// 转换为 JSON
const convertToJson = async () => {
  if (!file.value) return

  try {
    const workbook = await readWorkbook(file.value)
    const worksheet = workbook.Sheets[selectedSheet.value]
    const data = XLSX.utils.sheet_to_json(worksheet, {
      header: hasHeader.value ? undefined : 1,
      raw: false,
      defval: ''
    })

    if (skipEmptyRows.value) {
      jsonResult.value = data.filter(row => 
        Object.values(row).some(value => value.toString().trim())
      )
    } else {
      jsonResult.value = data
    }

    if (trimValues.value) {
      jsonResult.value = jsonResult.value.map(row => {
        const newRow = {}
        for (const key in row) {
          newRow[key] = row[key].toString().trim()
        }
        return newRow
      })
    }
  } catch (err) {
    console.error('转换失败:', err)
    alert('转换失败，请检查文件格式是否正确')
  }
}

// 复制 JSON
const copyJson = async () => {
  if (!jsonResult.value) return

  try {
    await navigator.clipboard.writeText(formattedJson.value)
    alert('已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 下载 JSON
const downloadJson = () => {
  if (!jsonResult.value) return

  const blob = new Blob([formattedJson.value], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'data.json'
  link.click()
}

// 清空文件
const clearFile = () => {
  file.value = null
  sheets.value = []
  selectedSheet.value = ''
  jsonResult.value = null
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
</script>

<style lang="scss" scoped>
.excel-to-json-page {
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

      .json-content {
        padding: 1rem;
        margin: 0;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-color);
        color: var(--text-primary);
        font-family: monospace;
        line-height: 1.5;
        white-space: pre-wrap;
        word-break: break-all;
        max-height: 500px;
        overflow: auto;
      }

      .no-data {
        padding: 2rem;
        text-align: center;
        color: var(--text-secondary);
        background: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: 4px;
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

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
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