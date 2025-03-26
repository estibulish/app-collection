<template>
  <div class="jwt-decoder-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>JWT 解析器</h1>
        <p class="tool-desc">在线 JWT 解析和验证工具，可查看 JWT 的头部、载荷和签名</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="jwt-decoder" />
      </div>
    </div>

    <div class="jwt-container">
      <div class="input-section">
        <h2>JWT Token</h2>
        <textarea 
          v-model="jwtToken" 
          placeholder="请输入 JWT Token"
          @input="decodeJwt"
        ></textarea>
      </div>

      <div class="result-section" v-if="isValidJwt">
        <div class="jwt-parts">
          <div class="part header">
            <div class="part-header">
              <h3>头部 (Header)</h3>
              <button class="copy-btn" @click="copyToClipboard(headerJson)">
                复制
              </button>
            </div>
            <pre class="json-content">{{ headerJson }}</pre>
          </div>

          <div class="part payload">
            <div class="part-header">
              <h3>载荷 (Payload)</h3>
              <button class="copy-btn" @click="copyToClipboard(payloadJson)">
                复制
              </button>
            </div>
            <pre class="json-content">{{ payloadJson }}</pre>
          </div>

          <div class="part signature">
            <div class="part-header">
              <h3>签名 (Signature)</h3>
              <button class="copy-btn" @click="copyToClipboard(signature)">
                复制
              </button>
            </div>
            <div class="signature-content">{{ signature }}</div>
          </div>
        </div>

        <div class="token-info">
          <h3>Token 信息</h3>
          <div class="info-grid">
            <div class="info-item" v-if="payload.iss">
              <div class="info-label">签发者 (iss)</div>
              <div class="info-value">{{ payload.iss }}</div>
            </div>
            <div class="info-item" v-if="payload.sub">
              <div class="info-label">主题 (sub)</div>
              <div class="info-value">{{ payload.sub }}</div>
            </div>
            <div class="info-item" v-if="payload.aud">
              <div class="info-label">受众 (aud)</div>
              <div class="info-value">{{ Array.isArray(payload.aud) ? payload.aud.join(', ') : payload.aud }}</div>
            </div>
            <div class="info-item" v-if="payload.exp">
              <div class="info-label">过期时间 (exp)</div>
              <div class="info-value" :class="{ expired: isExpired }">
                {{ formatDate(payload.exp) }}
                <span v-if="isExpired" class="expired-badge">已过期</span>
                <span v-else class="valid-badge">有效</span>
              </div>
            </div>
            <div class="info-item" v-if="payload.nbf">
              <div class="info-label">生效时间 (nbf)</div>
              <div class="info-value">{{ formatDate(payload.nbf) }}</div>
            </div>
            <div class="info-item" v-if="payload.iat">
              <div class="info-label">签发时间 (iat)</div>
              <div class="info-value">{{ formatDate(payload.iat) }}</div>
            </div>
            <div class="info-item" v-if="payload.jti">
              <div class="info-label">JWT ID (jti)</div>
              <div class="info-value">{{ payload.jti }}</div>
            </div>
          </div>
        </div>

        <div class="verification-section">
          <h3>签名验证</h3>
          <div class="verification-form">
            <label>
              签名算法
              <select v-model="algorithm">
                <option value="HS256">HS256 (HMAC + SHA256)</option>
                <option value="HS384">HS384 (HMAC + SHA384)</option>
                <option value="HS512">HS512 (HMAC + SHA512)</option>
                <option value="RS256">RS256 (RSA + SHA256)</option>
                <option value="RS384">RS384 (RSA + SHA384)</option>
                <option value="RS512">RS512 (RSA + SHA512)</option>
                <option value="ES256">ES256 (ECDSA + SHA256)</option>
                <option value="ES384">ES384 (ECDSA + SHA384)</option>
                <option value="ES512">ES512 (ECDSA + SHA512)</option>
              </select>
            </label>

            <label>
              密钥
              <textarea 
                v-model="secretKey" 
                :placeholder="isSymmetricAlgo ? '请输入密钥' : '请输入公钥'"
              ></textarea>
            </label>

            <button class="verify-btn" @click="verifySignature">
              验证签名
            </button>

            <div v-if="verificationResult !== null" class="verification-result">
              <div 
                :class="['result-badge', verificationResult ? 'success' : 'error']"
              >
                {{ verificationResult ? '签名验证成功' : '签名验证失败' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="jwtToken" class="invalid-jwt">
        <div class="error-icon">❌</div>
        <div class="error-message">无效的 JWT Token 格式</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'
import { jwtDecode } from 'jwt-decode'
import CryptoJS from 'crypto-js'

const jwtToken = ref('')
const header = ref({})
const payload = ref({})
const signature = ref('')
const algorithm = ref('HS256')
const secretKey = ref('')
const verificationResult = ref(null)

const isValidJwt = computed(() => {
  return Object.keys(header.value).length > 0 && Object.keys(payload.value).length > 0
})

const headerJson = computed(() => {
  return JSON.stringify(header.value, null, 2)
})

const payloadJson = computed(() => {
  return JSON.stringify(payload.value, null, 2)
})

const isExpired = computed(() => {
  if (!payload.value.exp) return false
  return Date.now() >= payload.value.exp * 1000
})

const isSymmetricAlgo = computed(() => {
  return algorithm.value.startsWith('HS')
})

const decodeJwt = () => {
  if (!jwtToken.value) {
    header.value = {}
    payload.value = {}
    signature.value = ''
    return
  }

  try {
    // 尝试解码 JWT
    const parts = jwtToken.value.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }

    // 解码头部
    header.value = jwtDecode(jwtToken.value, { header: true })
    
    // 解码载荷
    payload.value = jwtDecode(jwtToken.value)
    
    // 获取签名
    signature.value = parts[2]
    
    // 设置算法
    if (header.value.alg) {
      algorithm.value = header.value.alg
    }
  } catch (error) {
    console.error('JWT decode error:', error)
    header.value = {}
    payload.value = {}
    signature.value = ''
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000)
  return date.toLocaleString()
}

const verifySignature = () => {
  if (!secretKey.value) {
    alert('请输入密钥')
    return
  }

  try {
    // 这里简化处理，实际验证需要使用专门的 JWT 库
    // 对于 HMAC 算法，我们可以简单实现
    if (isSymmetricAlgo.value) {
      const parts = jwtToken.value.split('.')
      const headerPayload = parts[0] + '.' + parts[1]
      
      // 根据算法选择哈希函数
      let hashFunction
      if (algorithm.value === 'HS256') {
        hashFunction = CryptoJS.HmacSHA256
      } else if (algorithm.value === 'HS384') {
        hashFunction = CryptoJS.HmacSHA384
      } else if (algorithm.value === 'HS512') {
        hashFunction = CryptoJS.HmacSHA512
      }
      
      // 计算签名
      const computedSignature = hashFunction(headerPayload, secretKey.value)
        .toString(CryptoJS.enc.Base64)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
      
      // 比较签名
      verificationResult.value = computedSignature === signature.value
    } else {
      // 对于 RSA/ECDSA 算法，需要使用专门的库
      alert('RSA/ECDSA 验证需要使用专门的 JWT 库，此示例不支持')
      verificationResult.value = false
    }
  } catch (error) {
    console.error('Verification error:', error)
    alert(`验证失败: ${error.message}`)
    verificationResult.value = false
  }
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

.jwt-decoder-page {
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

  .jwt-container {
    .input-section {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      margin-bottom: 2rem;

      h2 {
        font-size: 1.5rem;
        margin: 0 0 1rem;
        color: #333;
      }

      textarea {
        width: 100%;
        min-height: 100px;
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

    .result-section {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;

      .jwt-parts {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;

        .part {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;

          .part-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;

            h3 {
              font-size: 1.2rem;
              margin: 0;
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

          .json-content, .signature-content {
            padding: 1rem;
            background: #f5f7fa;
            border-radius: 4px;
            font-family: monospace;
            word-break: break-all;
            font-size: 0.9rem;
            color: #606266;
            max-height: 300px;
            overflow-y: auto;
          }

          &.header {
            border-top: 4px solid #e6a23c;
          }

          &.payload {
            border-top: 4px solid var(--primary);
          }

          &.signature {
            border-top: 4px solid var(--primary);
          }
        }
      }

      .token-info {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;

        h3 {
          font-size: 1.2rem;
          margin: 0 0 1rem;
          color: #333;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;

          .info-item {
            .info-label {
              font-weight: 500;
              color: #606266;
              margin-bottom: 0.25rem;
            }

            .info-value {
              padding: 0.5rem;
              background: #f5f7fa;
              border-radius: 4px;
              font-family: monospace;
              word-break: break-all;
              font-size: 0.9rem;

              &.expired {
                color: #f56c6c;
              }

              .expired-badge, .valid-badge {
                display: inline-block;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                margin-left: 0.5rem;
                font-size: 0.8rem;
              }

              .expired-badge {
                background: #fef0f0;
                color: #f56c6c;
              }

              .valid-badge {
                background: #f0f9eb;
                color: var(--primary);
              }
            }
          }
        }
      }

      .verification-section {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;

        h3 {
          font-size: 1.2rem;
          margin: 0 0 1rem;
          color: #333;
        }

        .verification-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;

          label {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            color: #606266;

            select, textarea {
              padding: 0.5rem;
              border: 1px solid #ddd;
              border-radius: 4px;
              
              &:focus {
                border-color: var(--primary);
                outline: none;
              }
            }

            textarea {
              min-height: 100px;
              resize: vertical;
              font-family: monospace;
              font-size: 0.9rem;
            }
          }

          .verify-btn {
            padding: 0.8rem;
            border: none;
            border-radius: 4px;
            background: var(--primary);
            color: white;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.2s;

            &:hover {
              background: var(--primary-dark);
            }
          }

          .verification-result {
            margin-top: 1rem;

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
          }
        }
      }
    }

    .invalid-jwt {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 3rem;
      text-align: center;

      .error-icon {
        font-size: 3rem;
        color: #f56c6c;
        margin-bottom: 1rem;
      }

      .error-message {
        font-size: 1.2rem;
        color: #f56c6c;
      }
    }
  }
}
</style> 