<template>
  <div class="text-to-table-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>文本转表格工具</h1>
        <p class="tool-desc">在线文本转表格工具，支持多种分隔符，可导出为 Excel、CSV 等格式</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="text-to-table" />
      </div>
    </div>

    <div class="convert-container">
      <div class="input-section">
        <div class="text-panel">
          <div class="panel-header">
            <h3>输入文本</h3>
            <div class="panel-actions">
              <button class="action-btn" @click="clearText">清空</button>
              <button class="action-btn" @click="pasteText">粘贴</button>
            </div>
          </div>
          <textarea 
            v-model="text"
            placeholder="请输入或粘贴要转换的文本，每行一条数据"
          ></textarea>
        </div>
      </div>

      <div class="options-section">
        <div class="separator-options">
          <label>
            <span>列分隔符</span>
            <select v-model="columnSeparator">
              <option value="\t">制表符 (Tab)</option>
              <option value=",">逗号 (,)</option>
              <option value=";">分号 (;)</option>
              <option value="|">竖线 (|)</option>
              <option value=" ">空格</option>
              <option value="custom">自定义</option>
            </select>
          </label>
          <input 
            v-if="columnSeparator === 'custom'"
            type="text"
            v-model="customSeparator"
            placeholder="输入自定义分隔符"
          >
        </div>
        <div class="table-options">
          <label>
            <input type="checkbox" v-model="hasHeader">
            <span>首行为表头</span>
          </label>
          <label>
            <input type="checkbox" v-model="trimCells">
            <span>去除单元格首尾空格</span>
          </label>
          <label>
            <input type="checkbox" v-model="skipEmptyRows">
            <span>忽略空行</span>
          </label>
        </div>
        <div class="convert-actions">
          <button class="convert-btn" @click="convertToTable">转换为表格</button>
        </div>
      </div>

      <div class="result-section">
        <div class="result-panel">
          <div class="panel-header">
            <h3>表格预览</h3>
            <div class="panel-actions">
              <button class="action-btn" @click="exportExcel">导出 Excel</button>
              <button class="action-btn" @click="exportCsv">导出 CSV</button>
              <button class="action-btn" @click="copyHtml">复制 HTML</button>
            </div>
          </div>
          <div class="table-container" v-if="tableData.length">
            <table>
              <thead v-if="hasHeader">
                <tr>
                  <th v-for="(cell, index) in tableData[0]" :key="index">{{ cell }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in hasHeader ? tableData.slice(1) : tableData" :key="rowIndex">
                  <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="no-data">
            暂无数据，请输入文本并点击转换按钮
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

const text = ref('')
const columnSeparator = ref('\t')
const customSeparator = ref('')
const hasHeader = ref(true)
const trimCells = ref(true)
const skipEmptyRows = ref(true)
const tableData = ref([])

// 清空文本
const clearText = () => {
  text.value = ''
  tableData.value = []
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

// 获取实际分隔符
const getActualSeparator = () => {
  return columnSeparator.value === 'custom' ? customSeparator.value : columnSeparator.value
}

// 转换为表格
const convertToTable = () => {
  if (!text.value) return

  const separator = getActualSeparator()
  const rows = text.value.split('\n')
  
  tableData.value = rows
    .filter(row => !skipEmptyRows.value || row.trim())
    .map(row => {
      const cells = row.split(separator)
      return trimCells.value ? cells.map(cell => cell.trim()) : cells
    })
}

// 导出 Excel
const exportExcel = () => {
  if (!tableData.value.length) return

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(tableData.value)
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, 'table.xlsx')
}

// 导出 CSV
const exportCsv = () => {
  if (!tableData.value.length) return

  const csvContent = tableData.value
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'table.csv'
  link.click()
}

// 复制 HTML
const copyHtml = async () => {
  if (!tableData.value.length) return

  const htmlContent = `
    <table>
      ${hasHeader.value ? `
        <thead>
          <tr>
            ${tableData.value[0].map(cell => `<th>${cell}</th>`).join('')}
          </tr>
        </thead>
      ` : ''}
      <tbody>
        ${(hasHeader.value ? tableData.value.slice(1) : tableData.value)
          .map(row => `
            <tr>
              ${row.map(cell => `<td>${cell}</td>`).join('')}
            </tr>
          `).join('')}
      </tbody>
    </table>
  `

  try {
    await navigator.clipboard.writeText(htmlContent)
    alert('HTML 代码已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style lang="scss" scoped>
.text-to-table-page {
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

      .table-container {
        overflow: auto;
        max-height: 500px;
        border: 1px solid var(--border-color);
        border-radius: 4px;

        table {
          width: 100%;
          border-collapse: collapse;
          background: var(--bg-color);

          th, td {
            padding: 0.75rem;
            border: 1px solid var(--border-color);
            text-align: left;
          }

          th {
            background: var(--bg-secondary);
            font-weight: 500;
          }

          tr:nth-child(even) {
            background: var(--bg-hover);
          }
        }
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

      .separator-options,
      .table-options {
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

        select, input[type="text"] {
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