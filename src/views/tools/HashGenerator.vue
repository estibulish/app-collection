<template>
  <div class="hash-generator-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>哈希生成器</h1>
        <p class="tool-desc">在线哈希生成工具，支持 MD5、SHA-1、SHA-256、SHA-512 等多种哈希算法</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="hash-generator" />
      </div>
    </div>

    <div class="hash-container">
      <div class="input-section">
        <h2>输入内容</h2>
        <div class="input-type-selector">
          <button 
            :class="['type-btn', { active: inputType === 'text' }]" 
            @click="inputType = 'text'"
          >
            文本输入
          </button>
          <button 
            :class="['type-btn', { active: inputType === 'file' }]" 
            @click="inputType = 'file'"
          >
            文件输入
          </button>
        </div>

        <div v-if="inputType === 'text'" class="text-input">
          <textarea 
            v-model="inputText" 
            placeholder="请输入要计算哈希的文本内容"
            @input="calculateHash"
          ></textarea>
        </div>

        <div v-else class="file-input">
          <div class="upload-zone" @drop.prevent="handleDrop" @dragover.prevent>
            <input type="file" ref="fileInput" @change="handleFileSelect">
            <div class="upload-content">
              <div class="upload-icon">📁</div>
              <div class="upload-text">
                拖放文件到这里，或
                <button class="upload-button" @click="triggerFileInput">点击上传</button>
              </div>
              <div v-if="selectedFile" class="file-info">
                已选择: {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
              </div>
            </div>
          </div>
          <button 
            v-if="selectedFile" 
            class="calculate-btn" 
            @click="calculateFileHash"
            :disabled="isCalculating"
          >
            {{ isCalculating ? '计算中...' : '计算哈希' }}
          </button>
        </div>
      </div>

      <div class="hash-results">
        <h2>哈希结果</h2>
        <div class="algorithm-selector">
          <button 
            v-for="algo in algorithms" 
            :key="algo.name"
            :class="['algo-btn', { active: selectedAlgorithms.includes(algo.name) }]"
            @click="toggleAlgorithm(algo.name)"
          >
            {{ algo.label }}
          </button>
        </div>

        <div class="results-list">
          <div 
            v-for="algo in algorithms" 
            :key="algo.name"
            v-show="selectedAlgorithms.includes(algo.name)"
            class="result-item"
          >
            <div class="result-header">
              <span class="algo-name">{{ algo.label }}</span>
              <button class="copy-btn" @click="copyToClipboard(hashResults[algo.name])">
                复制
              </button>
            </div>
            <div class="result-value">
              {{ hashResults[algo.name] || '等待计算...' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'
import CryptoJS from 'crypto-js'

const inputType = ref('text')
const inputText = ref('')
const fileInput = ref(null)
const selectedFile = ref(null)
const isCalculating = ref(false)

const algorithms = [
  { name: 'md5', label: 'MD5' },
  { name: 'sha1', label: 'SHA-1' },
  { name: 'sha256', label: 'SHA-256' },
  { name: 'sha512', label: 'SHA-512' },
  { name: 'sha3', label: 'SHA-3' },
  { name: 'ripemd160', label: 'RIPEMD-160' }
]

const selectedAlgorithms = ref(['md5', 'sha1', 'sha256'])
const hashResults = reactive({})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    // 清空之前的结果
    clearResults()
  }
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) {
    selectedFile.value = file
    // 清空之前的结果
    clearResults()
  }
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' bytes'
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB'
  else return (bytes / 1048576).toFixed(2) + ' MB'
}

const toggleAlgorithm = (algo) => {
  const index = selectedAlgorithms.value.indexOf(algo)
  if (index === -1) {
    selectedAlgorithms.value.push(algo)
  } else {
    selectedAlgorithms.value.splice(index, 1)
  }
  
  // 如果是文本输入，重新计算
  if (inputType.value === 'text' && inputText.value) {
    calculateHash()
  }
}

const calculateHash = () => {
  if (!inputText.value) {
    clearResults()
    return
  }
  
  selectedAlgorithms.value.forEach(algo => {
    switch (algo) {
      case 'md5':
        hashResults[algo] = CryptoJS.MD5(inputText.value).toString()
        break
      case 'sha1':
        hashResults[algo] = CryptoJS.SHA1(inputText.value).toString()
        break
      case 'sha256':
        hashResults[algo] = CryptoJS.SHA256(inputText.value).toString()
        break
      case 'sha512':
        hashResults[algo] = CryptoJS.SHA512(inputText.value).toString()
        break
      case 'sha3':
        hashResults[algo] = CryptoJS.SHA3(inputText.value).toString()
        break
      case 'ripemd160':
        hashResults[algo] = CryptoJS.RIPEMD160(inputText.value).toString()
        break
    }
  })
}

const calculateFileHash = async () => {
  if (!selectedFile.value) return
  
  isCalculating.value = true
  clearResults()
  
  try {
    const fileReader = new FileReader()
    
    fileReader.onload = (event) => {
      const wordArray = CryptoJS.lib.WordArray.create(event.target.result)
      
      selectedAlgorithms.value.forEach(algo => {
        switch (algo) {
          case 'md5':
            hashResults[algo] = CryptoJS.MD5(wordArray).toString()
            break
          case 'sha1':
            hashResults[algo] = CryptoJS.SHA1(wordArray).toString()
            break
          case 'sha256':
            hashResults[algo] = CryptoJS.SHA256(wordArray).toString()
            break
          case 'sha512':
            hashResults[algo] = CryptoJS.SHA512(wordArray).toString()
            break
          case 'sha3':
            hashResults[algo] = CryptoJS.SHA3(wordArray).toString()
            break
          case 'ripemd160':
            hashResults[algo] = CryptoJS.RIPEMD160(wordArray).toString()
            break
        }
      })
      
      isCalculating.value = false
    }
    
    fileReader.readAsArrayBuffer(selectedFile.value)
  } catch (error) {
    console.error('Error calculating file hash:', error)
    isCalculating.value = false
  }
}

const clearResults = () => {
  algorithms.forEach(algo => {
    hashResults[algo.name] = ''
  })
}

const copyToClipboard = (text) => {
  if (!text) return
  
  navigator.clipboard.writeText(text)
    .then(() => {
      alert('已复制到剪贴板')
    })
    .catch(err => {
      console.error('复制失败:', err)
    })
}

onMounted(() => {
  // 初始化
})
</script>

<style lang="scss" scoped>
@use "sass:color";

.hash-generator-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  .tool-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;

    .header-content {
      h1 {
        font-size: 2rem;
        margin: 0 0 0.5rem;
      }

      .tool-desc {
        color: #666;
        margin: 0;
      }
    }
  }

  .hash-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .input-section, .hash-results {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;

      h2 {
        font-size: 1.5rem;
        margin: 0 0 1.5rem;
        color: #333;
      }
    }

    .input-type-selector, .algorithm-selector {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;

      .type-btn, .algo-btn {
        padding: 0.5rem 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: #f5f7fa;
        color: #606266;
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
    }

    .text-input {
      textarea {
        width: 100%;
        min-height: 200px;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        resize: vertical;
        font-family: monospace;
        font-size: 0.9rem;
        
        &:focus {
          border-color: var(--primary);
          outline: none;
        }
      }
    }

    .file-input {
      .upload-zone {
        border: 2px dashed #ddd;
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
        transition: all 0.3s;
        cursor: pointer;
        margin-bottom: 1rem;

        &:hover {
          border-color: var(--primary);
          background: rgba(var(--primary), 0.05);
        }

        input[type="file"] {
          display: none;
        }

        .upload-content {
          .upload-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }

          .upload-text {
            margin-bottom: 0.5rem;
            
            .upload-button {
              color: var(--primary);
              background: none;
              border: none;
              cursor: pointer;
              padding: 0;
              font-size: inherit;

              &:hover {
                text-decoration: underline;
              }
            }
          }

          .file-info {
            margin-top: 1rem;
            padding: 0.5rem;
            background: #f0f9eb;
            border-radius: 4px;
            color: var(--primary);
          }
        }
      }

      .calculate-btn {
        width: 100%;
        padding: 0.8rem;
        border: none;
        border-radius: 4px;
        background: var(--primary);
        color: white;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 1rem;

        &:hover:not(:disabled) {
          background: var(--primary-dark);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }

    .results-list {
      .result-item {
        margin-bottom: 1.5rem;
        
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          
          .algo-name {
            font-weight: 500;
            color: #333;
          }
          
          .copy-btn {
            padding: 0.25rem 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #f5f7fa;
            color: #606266;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.2s;
            
            &:hover {
              border-color: var(--primary);
              color: var(--primary);
            }
          }
        }
        
        .result-value {
          padding: 1rem;
          background: #f5f7fa;
          border-radius: 4px;
          font-family: monospace;
          word-break: break-all;
          font-size: 0.9rem;
          color: #606266;
        }
      }
    }
  }
}
</style> 