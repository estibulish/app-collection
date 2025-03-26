<template>
  <div class="rsa-encrypt-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>RSA 加解密</h1>
        <p class="tool-desc">在线 RSA 加密解密工具，支持密钥生成、加密解密和签名验证</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="rsa-encrypt" />
      </div>
    </div>

    <div class="rsa-container">
      <div class="tabs">
        <button 
          :class="['tab-btn', { active: activeTab === 'encrypt' }]" 
          @click="activeTab = 'encrypt'"
        >
          加密/解密
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'sign' }]" 
          @click="activeTab = 'sign'"
        >
          签名/验证
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'generate' }]" 
          @click="activeTab = 'generate'"
        >
          密钥生成
        </button>
      </div>

      <!-- 加密/解密面板 -->
      <div v-if="activeTab === 'encrypt'" class="tab-panel">
        <div class="settings-panel">
          <h2>加密设置</h2>
          <div class="settings-group">
            <label>
              操作类型
              <div class="operation-selector">
                <button 
                  :class="['op-btn', { active: encryptOperation === 'encrypt' }]" 
                  @click="encryptOperation = 'encrypt'"
                >
                  加密
                </button>
                <button 
                  :class="['op-btn', { active: encryptOperation === 'decrypt' }]" 
                  @click="encryptOperation = 'decrypt'"
                >
                  解密
                </button>
              </div>
            </label>

            <label>
              {{ encryptOperation === 'encrypt' ? '公钥' : '私钥' }}
              <textarea 
                v-model="encryptKey" 
                :placeholder="encryptOperation === 'encrypt' ? '请输入 RSA 公钥' : '请输入 RSA 私钥'"
              ></textarea>
            </label>

            <label>
              填充方式
              <select v-model="encryptPadding">
                <option value="pkcs1">PKCS#1 v1.5</option>
                <option value="oaep">OAEP</option>
              </select>
            </label>

            <label>
              输出格式
              <select v-model="encryptOutputFormat">
                <option value="base64">Base64</option>
                <option value="hex">Hex (十六进制)</option>
              </select>
            </label>
          </div>
        </div>

        <div class="content-panel">
          <div class="input-section">
            <h3>{{ encryptOperation === 'encrypt' ? '明文' : '密文' }}</h3>
            <textarea 
              v-model="encryptInput" 
              :placeholder="encryptOperation === 'encrypt' ? '请输入要加密的内容' : '请输入要解密的内容'"
            ></textarea>
          </div>

          <div class="action-buttons">
            <button class="process-btn" @click="processEncrypt">
              {{ encryptOperation === 'encrypt' ? '加密' : '解密' }}
            </button>
            <button class="clear-btn" @click="clearEncrypt">
              清空
            </button>
          </div>

          <div class="output-section">
            <div class="output-header">
              <h3>{{ encryptOperation === 'encrypt' ? '密文' : '明文' }}</h3>
              <button class="copy-btn" @click="copyToClipboard(encryptOutput)">
                复制
              </button>
            </div>
            <div class="output-content">
              {{ encryptOutput || '等待处理...' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 签名/验证面板 -->
      <div v-if="activeTab === 'sign'" class="tab-panel">
        <div class="settings-panel">
          <h2>签名设置</h2>
          <div class="settings-group">
            <label>
              操作类型
              <div class="operation-selector">
                <button 
                  :class="['op-btn', { active: signOperation === 'sign' }]" 
                  @click="signOperation = 'sign'"
                >
                  签名
                </button>
                <button 
                  :class="['op-btn', { active: signOperation === 'verify' }]" 
                  @click="signOperation = 'verify'"
                >
                  验证
                </button>
              </div>
            </label>

            <label>
              {{ signOperation === 'sign' ? '私钥' : '公钥' }}
              <textarea 
                v-model="signKey" 
                :placeholder="signOperation === 'sign' ? '请输入 RSA 私钥' : '请输入 RSA 公钥'"
              ></textarea>
            </label>

            <label>
              哈希算法
              <select v-model="signHashAlgo">
                <option value="sha1">SHA-1</option>
                <option value="sha256">SHA-256</option>
                <option value="sha512">SHA-512</option>
              </select>
            </label>

            <label v-if="signOperation === 'verify'">
              签名值
              <textarea 
                v-model="signature" 
                placeholder="请输入签名值"
              ></textarea>
            </label>
          </div>
        </div>

        <div class="content-panel">
          <div class="input-section">
            <h3>待{{ signOperation === 'sign' ? '签名' : '验证' }}内容</h3>
            <textarea 
              v-model="signInput" 
              :placeholder="signOperation === 'sign' ? '请输入要签名的内容' : '请输入要验证的内容'"
            ></textarea>
          </div>

          <div class="action-buttons">
            <button class="process-btn" @click="processSign">
              {{ signOperation === 'sign' ? '签名' : '验证' }}
            </button>
            <button class="clear-btn" @click="clearSign">
              清空
            </button>
          </div>

          <div v-if="signOperation === 'sign'" class="output-section">
            <div class="output-header">
              <h3>签名结果</h3>
              <button class="copy-btn" @click="copyToClipboard(signOutput)">
                复制
              </button>
            </div>
            <div class="output-content">
              {{ signOutput || '等待处理...' }}
            </div>
          </div>

          <div v-else class="verify-result">
            <h3>验证结果</h3>
            <div 
              v-if="verifyResult !== null" 
              :class="['result-badge', verifyResult ? 'success' : 'error']"
            >
              {{ verifyResult ? '验证成功' : '验证失败' }}
            </div>
            <div v-else class="waiting">
              等待验证...
            </div>
          </div>
        </div>
      </div>

      <!-- 密钥生成面板 -->
      <div v-if="activeTab === 'generate'" class="tab-panel">
        <div class="generate-panel">
          <h2>RSA 密钥对生成</h2>
          <div class="key-settings">
            <label>
              密钥长度
              <select v-model="keySize">
                <option value="512">512 位 (不推荐)</option>
                <option value="1024">1024 位</option>
                <option value="2048">2048 位 (推荐)</option>
                <option value="4096">4096 位 (更安全但较慢)</option>
              </select>
            </label>

            <button class="generate-btn" @click="generateKeyPair">
              生成密钥对
            </button>
          </div>

          <div class="key-results">
            <div class="key-section">
              <div class="key-header">
                <h3>公钥</h3>
                <button class="copy-btn" @click="copyToClipboard(publicKey)">
                  复制
                </button>
              </div>
              <textarea 
                v-model="publicKey" 
                readonly 
                placeholder="生成的公钥将显示在这里"
              ></textarea>
            </div>

            <div class="key-section">
              <div class="key-header">
                <h3>私钥</h3>
                <button class="copy-btn" @click="copyToClipboard(privateKey)">
                  复制
                </button>
              </div>
              <textarea 
                v-model="privateKey" 
                readonly 
                placeholder="生成的私钥将显示在这里"
              ></textarea>
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
import CryptoJS from 'crypto-js'
import JSEncrypt from 'jsencrypt'

// 选项卡状态
const activeTab = ref('encrypt')

// 加密/解密选项
const encryptOperation = ref('encrypt')
const encryptKey = ref('')
const encryptPadding = ref('pkcs1')
const encryptOutputFormat = ref('base64')
const encryptInput = ref('')
const encryptOutput = ref('')

// 签名/验证选项
const signOperation = ref('sign')
const signKey = ref('')
const signHashAlgo = ref('sha256')
const signInput = ref('')
const signOutput = ref('')
const signature = ref('')
const verifyResult = ref(null)

// 密钥生成选项
const keySize = ref('2048')
const publicKey = ref('')
const privateKey = ref('')

// 加密/解密处理
const processEncrypt = () => {
  if (!encryptInput.value) {
    alert('请输入内容')
    return
  }

  if (!encryptKey.value) {
    alert('请输入密钥')
    return
  }

  try {
    const encrypt = new JSEncrypt()
    
    if (encryptOperation.value === 'encrypt') {
      encrypt.setPublicKey(encryptKey.value)
      const encrypted = encrypt.encrypt(encryptInput.value)
      if (encrypted) {
        encryptOutput.value = encrypted
      } else {
        throw new Error('加密失败，请检查公钥格式是否正确')
      }
    } else {
      encrypt.setPrivateKey(encryptKey.value)
      const decrypted = encrypt.decrypt(encryptInput.value)
      if (decrypted) {
        encryptOutput.value = decrypted
      } else {
        throw new Error('解密失败，请检查私钥格式或密文是否正确')
      }
    }
  } catch (error) {
    console.error('处理失败:', error)
    alert(`处理失败: ${error.message}`)
  }
}

const clearEncrypt = () => {
  encryptInput.value = ''
  encryptOutput.value = ''
}

// 签名/验证处理
const processSign = () => {
  if (!signInput.value) {
    alert('请输入内容')
    return
  }

  if (!signKey.value) {
    alert('请输入密钥')
    return
  }

  if (signOperation.value === 'verify' && !signature.value) {
    alert('请输入签名值')
    return
  }

  try {
    const sign = new JSEncrypt()
    
    if (signOperation.value === 'sign') {
      sign.setPrivateKey(signKey.value)
      const signed = sign.sign(signInput.value, CryptoJS[signHashAlgo.value.toUpperCase()], 'sha256')
      if (signed) {
        signOutput.value = signed
      } else {
        throw new Error('签名失败，请检查私钥格式是否正确')
      }
    } else {
      sign.setPublicKey(signKey.value)
      const verified = sign.verify(signInput.value, signature.value, CryptoJS[signHashAlgo.value.toUpperCase()])
      verifyResult.value = verified
    }
  } catch (error) {
    console.error('处理失败:', error)
    alert(`处理失败: ${error.message}`)
  }
}

const clearSign = () => {
  signInput.value = ''
  signOutput.value = ''
  signature.value = ''
  verifyResult.value = null
}

// 密钥生成
const generateKeyPair = () => {
  try {
    const keygen = new JSEncrypt({ default_key_size: keySize.value })
    keygen.getKey()
    publicKey.value = keygen.getPublicKey()
    privateKey.value = keygen.getPrivateKey()
  } catch (error) {
    console.error('生成密钥对失败:', error)
    alert(`生成密钥对失败: ${error.message}`)
  }
}

// 通用方法
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

.rsa-encrypt-page {
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

  .rsa-container {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .tabs {
      display: flex;
      border-bottom: 1px solid #ddd;

      .tab-btn {
        padding: 1rem 1.5rem;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 1rem;
        color: #606266;
        transition: all 0.2s;

        &:hover {
          color: var(--primary);
        }

        &.active {
          color: var(--primary);
          border-bottom: 2px solid var(--primary);
        }
      }
    }

    .tab-panel {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 1.5rem;
      padding: 1.5rem;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .settings-panel, .generate-panel {
      h2 {
        font-size: 1.5rem;
        margin: 0 0 1.5rem;
        color: #333;
      }

      .settings-group, .key-settings {
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

          select, textarea {
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 100%;
            
            &:focus {
              border-color: var(--primary);
              outline: none;
            }
          }

          textarea {
            min-height: 120px;
            font-family: monospace;
            font-size: 0.9rem;
            resize: vertical;
          }
        }

        .generate-btn {
          padding: 0.8rem;
          border: none;
          border-radius: 4px;
          background: var(--primary);
          color: white;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
          margin-top: 1rem;

          &:hover {
            background: var(--primary-dark);
          }
        }
      }
    }

    .content-panel {
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

      .verify-result {
        .result-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 500;
          
          &.success {
            background: #f0f9eb;
            color: var(--primary);
          }
          
          &.error {
            background: #fef0f0;
            color: #f56c6c;
          }
        }
        
        .waiting {
          color: #909399;
        }
      }
    }

    .generate-panel {
      grid-column: 1 / -1;

      .key-results {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-top: 1.5rem;
        
        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }

        .key-section {
          .key-header {
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

          textarea {
            width: 100%;
            min-height: 200px;
            padding: 1rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: vertical;
            font-family: monospace;
            font-size: 0.9rem;
            background: #f5f7fa;
            
            &:focus {
              border-color: var(--primary);
              outline: none;
            }
          }
        }
      }
    }
  }
}
</style> 