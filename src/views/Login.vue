<template>
  <div class="login-page">
    <div class="login-container">
      <h2>登录</h2>
      <div class="login-tabs">
        <button 
          :class="['tab-btn', { active: loginType === 'email' }]"
          @click="loginType = 'email'"
        >
          邮箱登录
        </button>
        <button 
          :class="['tab-btn', { active: loginType === 'wechat' }]"
          @click="loginType = 'wechat'"
        >
          微信登录
        </button>
      </div>

      <!-- 邮箱登录表单 -->
      <form v-if="loginType === 'email'" @submit.prevent="handleEmailLogin" class="login-form">
        <div class="form-group">
          <label>邮箱</label>
          <input 
            type="email" 
            v-model="email"
            placeholder="请输入邮箱"
            required
          >
        </div>
        <div class="form-group">
          <label>验证码</label>
          <div class="code-input">
            <input 
              type="text" 
              v-model="code"
              placeholder="请输入验证码"
              required
            >
            <button 
              type="button"
              class="code-btn"
              :disabled="countdown > 0"
              @click="sendCode"
            >
              {{ countdown > 0 ? `${countdown}s后重新发送` : '发送验证码' }}
            </button>
          </div>
        </div>
        <button type="submit" class="submit-btn">登录</button>
      </form>

      <!-- 微信登录 -->
      <div v-else class="wechat-login">
        <div class="qrcode-container">
          <div ref="qrcode" class="qrcode"></div>
          <p>请使用微信扫码关注公众号登录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import QRCode from 'qrcode'

const router = useRouter()
const userStore = useUserStore()
const loginType = ref('email')
const email = ref('')
const code = ref('')
const countdown = ref(0)

// 发送验证码
const sendCode = async () => {
  if (!email.value) {
    alert('请输入邮箱')
    return
  }
  
  try {
    await userStore.sendEmailCode(email.value)
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    alert(error.message)
  }
}

// 邮箱登录
const handleEmailLogin = async () => {
  try {
    await userStore.emailLogin(email.value, code.value)
    router.push('/')
  } catch (error) {
    alert(error.message)
  }
}

// 生成微信二维码
const generateQRCode = async () => {
  try {
    const qrcodeElement = document.getElementById('qrcode')
    await QRCode.toCanvas(qrcodeElement, 'https://mp.weixin.qq.com/xxx', {
      width: 200,
      margin: 2
    })
  } catch (error) {
    console.error(error)
  }
}

// 监听微信登录状态
const checkWechatLogin = () => {
  // 轮询检查登录状态
  const timer = setInterval(async () => {
    try {
      const isLoggedIn = await userStore.checkWechatLogin()
      if (isLoggedIn) {
        clearInterval(timer)
        router.push('/')
      }
    } catch (error) {
      console.error(error)
    }
  }, 2000)
}

onMounted(() => {
  if (loginType.value === 'wechat') {
    generateQRCode()
    checkWechatLogin()
  }
})
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--bg-main);
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--text-primary);
  }
}

.login-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  .tab-btn {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: none;
    color: var(--text-secondary);
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

.login-form {
  .form-group {
    margin-bottom: 1.5rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }
    
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      background: var(--bg-card);
      color: var(--text-primary);
      
      &:focus {
        outline: none;
        border-color: var(--primary);
      }
    }
  }
}

.code-input {
  display: flex;
  gap: 0.5rem;
  
  input {
    flex: 1;
  }
  
  .code-btn {
    padding: 0 1rem;
    border: 1px solid var(--primary);
    border-radius: 6px;
    background: none;
    color: var(--primary);
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover:not(:disabled) {
      background: var(--primary);
      color: white;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.submit-btn {
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: 6px;
  background: var(--primary);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: var(--primary-dark);
  }
}

.wechat-login {
  text-align: center;
  
  .qrcode-container {
    display: inline-block;
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    
    .qrcode {
      width: 200px;
      height: 200px;
      margin-bottom: 1rem;
    }
    
    p {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 1.5rem;
  }
  
  .code-input {
    flex-direction: column;
    
    .code-btn {
      width: 100%;
      padding: 0.75rem;
    }
  }
}
</style> 