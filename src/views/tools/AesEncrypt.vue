<template>
  <div class="aes-encrypt-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>AES 加解密</h1>
        <p class="tool-desc">在线 AES 加密解密工具，支持多种加密模式和填充方式</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="aes-encrypt" />
      </div>
    </div>

    <div class="aes-container">
      <div class="settings-panel">
        <h2>加密设置</h2>
        <div class="settings-group">
          <label>
            操作类型
            <div class="operation-selector">
              <button 
                :class="['op-btn', { active: operation === 'encrypt' }]" 
                @click="operation = 'encrypt'"
              >
                加密
              </button>
              <button 
                :class="['op-btn', { active: operation === 'decrypt' }]" 
                @click="operation = 'decrypt'"
              >
                解密
              </button>
            </div>
          </label>

          <label>
            密钥
            <div class="key-input">
              <input 
                :type="showKey ? 'text' : 'password'" 
                v-model="key" 
                placeholder="请输入密钥"
              >
              <button class="toggle-btn" @click="showKey = !showKey">
                {{ showKey ? '隐藏' : '显示' }}
              </button>
            </div>
          </label>

          <label>
            加密模式
            <select v-model="mode">
              <option value="CBC">CBC (推荐)</option>
              <option value="ECB">ECB</option>
              <option value="CFB">CFB</option>
              <option value="OFB">OFB</option>
              <option value="CTR">CTR</option>
            </select>
          </label>

          <label v-if="mode !== 'ECB'">
            初始向量 (IV)
            <div class="iv-input">
              <input 
                :type="showIv ? 'text' : 'password'" 
                v-model="iv" 
                placeholder="请输入初始向量"
              >
              <button class="toggle-btn" @click="showIv = !showIv">
                {{ showIv ? '隐藏' : '显示' }}
              </button>
              <button class="generate-btn" @click="generateRandomIv">
                生成
              </button>
            </div>
          </label>

          <label>
            填充方式
            <select v-model="padding">
              <option value="Pkcs7">PKCS7 (推荐)</option>
              <option value="Iso10126">ISO10126</option>
              <option value="AnsiX923">ANSI X.923</option>
              <option value="Iso97971">ISO/IEC 9797-1</option>
              <option value="ZeroPadding">Zero Padding</option>
              <option value="NoPadding">No Padding</option>
            </select>
          </label>

          <label>
            输出格式
            <select v-model="outputFormat">
              <option value="base64">Base64</option>
              <option value="hex">Hex (十六进制)</option>
            </select>
          </label>
        </div>
      </div>

      <div class="content-panel">
        <div class="input-section">
          <h3>{{ operation === 'encrypt' ? '明文' : '密文' }}</h3>
          <textarea 
            v-model="inputText" 
            :placeholder="operation === 'encrypt' ? '请输入要加密的内容' : '请输入要解密的内容'"
          ></textarea>
        </div>

        <div class="action-buttons">
          <button class="process-btn" @click="processData">
            {{ operation === 'encrypt' ? '加密' : '解密' }}
          </button>
          <button class="clear-btn" @click="clearAll">
            清空
          </button>
        </div>

        <div class="output-section">
          <div class="output-header">
            <h3>{{ operation === 'encrypt' ? '密文' : '明文' }}</h3>
            <button class="copy-btn" @click="copyToClipboard(outputText)">
              复制
            </button>
          </div>
          <div class="output-content">
            {{ outputText || '等待处理...' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'
import CryptoJS from 'crypto-js'

const operation = ref('encrypt')
const key = ref('')
const showKey = ref(false)
const iv = ref('')
const showIv = ref(false)
const mode = ref('CBC')
const padding = ref('Pkcs7')
const outputFormat = ref('base64')
const inputText = ref('')
const outputText = ref('')

const generateRandomIv = () => {
  const randomIv = CryptoJS.lib.WordArray.random(16)
  iv.value = randomIv.toString()
}

const processData = () => {
  if (!inputText.value) {
    alert('请输入内容')
    return
  }

  if (!key.value) {
    alert('请输入密钥')
    return
  }

  if (mode.value !== 'ECB' && !iv.value) {
    alert('请输入初始向量')
    return
  }

  try {
    if (operation.value === 'encrypt') {
      encryptData()
    } else {
      decryptData()
    }
  } catch (error) {
    console.error('处理失败:', error)
    alert(`处理失败: ${error.message}`)
  }
}

const encryptData = () => {
  // 创建加密配置
  const options = {
    mode: CryptoJS.mode[mode.value],
    padding: CryptoJS.pad[padding.value]
  }

  // 如果不是 ECB 模式，添加 IV
  if (mode.value !== 'ECB') {
    options.iv = CryptoJS.enc.Utf8.parse(iv.value)
  }

  // 创建密钥
  const keyObj = CryptoJS.enc.Utf8.parse(key.value)

  // 加密
  const encrypted = CryptoJS.AES.encrypt(inputText.value, keyObj, options)

  // 根据输出格式转换
  if (outputFormat.value === 'base64') {
    outputText.value = encrypted.toString()
  } else {
    outputText.value = encrypted.ciphertext.toString(CryptoJS.enc.Hex)
  }
}

const decryptData = () => {
  // 创建加密配置
  const options = {
    mode: CryptoJS.mode[mode.value],
    padding: CryptoJS.pad[padding.value]
  }

  // 如果不是 ECB 模式，添加 IV
  if (mode.value !== 'ECB') {
    options.iv = CryptoJS.enc.Utf8.parse(iv.value)
  }

  // 创建密钥
  const keyObj = CryptoJS.enc.Utf8.parse(key.value)

  // 根据输入格式处理密文
  let cipherParams
  if (outputFormat.value === 'base64') {
    cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(inputText.value)
    })
  } else {
    cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(inputText.value)
    })
  }

  // 解密
  const decrypted = CryptoJS.AES.decrypt(cipherParams, keyObj, options)
  
  // 转换为 UTF-8 字符串
  outputText.value = decrypted.toString(CryptoJS.enc.Utf8)
}

const clearAll = () => {
  inputText.value = ''
  outputText.value = ''
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
</script>

<style lang="scss" scoped>
@use "sass:color";

.aes-encrypt-page {
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

  .aes-container {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 2rem;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .settings-panel {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;

      h2 {
        font-size: 1.5rem;
        margin: 0 0 1.5rem;
        color: #333;
      }

      .settings-group {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;

        label {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          color: #606266;

          .operation-selector {
            display: flex;
            gap: 0.5rem;

            .op-btn {
              flex: 1;
              padding: 0.5rem;
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

          select, input {
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 100%;
            
            &:focus {
              border-color: var(--primary);
              outline: none;
            }
          }

          .key-input, .iv-input {
            display: flex;
            gap: 0.5rem;

            input {
              flex: 1;
            }

            .toggle-btn, .generate-btn {
              padding: 0.5rem;
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
            }
          }
        }
      }
    }

    .content-panel {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      h3 {
        font-size: 1.2rem;
        margin: 0 0 1rem;
        color: #333;
      }

      .input-section {
        textarea {
          width: 100%;
          min-height: 150px;
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

      .action-buttons {
        display: flex;
        gap: 1rem;

        button {
          padding: 0.8rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;

          &.process-btn {
            flex: 1;
            background: var(--primary);
            color: white;

            &:hover {
              background: var(--primary-dark);
            }
          }

          &.clear-btn {
            background: #f5f7fa;
            color: #606266;
            border: 1px solid #ddd;

            &:hover {
              border-color: #ff4d4f;
              color: #ff4d4f;
            }
          }
        }
      }

      .output-section {
        .output-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;

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

        .output-content {
          padding: 1rem;
          background: #f5f7fa;
          border-radius: 4px;
          font-family: monospace;
          word-break: break-all;
          font-size: 0.9rem;
          color: #606266;
          min-height: 100px;
          max-height: 300px;
          overflow-y: auto;
        }
      }
    }
  }
}
</style> 