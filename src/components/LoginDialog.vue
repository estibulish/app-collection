<template>
  <Transition name="dialog">
    <div 
      v-show="modelValue" 
      class="dialog-overlay"
      @click="$emit('update:modelValue', false)"
    >
      <div 
        class="dialog-content"
        :class="{ 'dialog-enter-active': modelValue }"
        @click.stop
      >
        <button 
          class="close-btn" 
          @click="$emit('update:modelValue', false)"
        >×</button>
        
        <h2>登录</h2>
        <!-- <div class="login-tabs">
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
        </div> -->

        <!-- 邮箱登录表单 -->
        <form v-if="loginType === 'email'" @submit.prevent="handleEmailLogin" class="login-form">
          <div class="form-group">
            <label>邮箱</label>
            <input 
              type="email" 
              v-model="formData.email"
              placeholder="请输入邮箱"
              :class="{ error: v$.value?.email?.$error }"
              @blur="v$.value?.email?.$touch()"
            >
            <div class="error-message" v-if="v$.value?.email?.$error">
              <template v-if="v$.value?.email?.required?.$invalid">
                请输入邮箱
              </template>
              <template v-else-if="v$.value?.email?.email?.$invalid">
                请输入有效的邮箱地址
              </template>
            </div>
          </div>
          <div class="form-group">
            <label>验证码</label>
            <div class="code-input">
              <input 
                type="text" 
                v-model="formData.code"
                placeholder="请输入验证码"
                :class="{ error: v$.value?.code?.$error }"
                @blur="v$.value?.code?.$touch()"
              >
              <button 
                type="button"
                class="code-btn"
                :disabled="countdown > 0 || !isEmailValid"
                @click="sendCode"
              >
                {{ countdown > 0 ? `${countdown}s后重新发送` : '发送验证码' }}
              </button>
            </div>
            <div class="error-message" v-if="v$.value?.code?.$error">
              <template v-if="v$.value?.code?.required?.$invalid">
                请输入验证码
              </template>
              <template v-else-if="v$.value?.code?.minLength?.$invalid || v$.value?.code?.maxLength?.$invalid">
                验证码必须是6位数字
              </template>
              <template v-else-if="v$.value?.code?.numeric?.$invalid">
                验证码只能包含数字
              </template>
            </div>
          </div>
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="v$.value?.$invalid"
          >
            登录
          </button>
        </form>

        <!-- 微信登录 -->
        <div v-else class="wechat-login">
          <div class="qrcode-container">
            <div v-if="qrcodeUrl" class="qrcode">
              <img :src="qrcodeUrl" alt="微信登录二维码">
              <p>请使用微信扫码关注公众号登录</p>
            </div>
            <div v-else class="qrcode-error">
              <span class="error-icon">!</span>
              <p>获取二维码失败</p>
              <button class="retry-btn" @click="getWechatQrcode">
                点击重试
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, maxLength, numeric } from '@vuelidate/validators'
import Message from '@/utils/message'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])
const router = useRouter()
const userStore = useUserStore()

// 表单数据
const formData = ref({
  email: '',
  code: ''
})

const loginType = ref('email')
const countdown = ref(0)
const qrcodeUrl = ref('')
const scene = ref('')
let checkTimer = null
let countdownTimer = null

// 表单验证规则
const rules = computed(() => ({
  email: { 
    required,
    email 
  },
  code: { 
    required,
    minLength: minLength(6),
    maxLength: maxLength(6),
    numeric
  }
}))

const v$ = useVuelidate(rules, formData, { $lazy: true })

// 邮箱是否有效
const isEmailValid = computed(() => {
  if (!v$.value?.email) return false
  return !v$.value.email.$invalid && !v$.value.email.$pending
})

// 发送验证码
const sendCode = async () => {
  try {
    if (!v$.value?.email) return
    await v$.value.email.$touch()
    if (v$.value.email.$error) return
    
    await userStore.sendEmailCode(formData.value.email)
    countdown.value = 60
    startCountdown()
  } catch (error) {
    alert(error.message)
  }
}

// 倒计时
const startCountdown = () => {
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(countdownTimer)
    }
  }, 1000)
}

// 邮箱登录
const handleEmailLogin = async () => {
  try {
    if (!v$.value) return
    const isValid = await v$.value.$validate()
    if (!isValid) return
    
    await userStore.emailLogin(formData.value.email, formData.value.code)
    const redirect = router.currentRoute.value.query.redirect?.toString() || '/'
    router.push(redirect)
    handleLoginSuccess()
  } catch (error) {
    alert(error.message)
  }
}

// 获取微信登录二维码
const getWechatQrcode = async () => {
  try {
    qrcodeUrl.value = '' // 清空旧的二维码
    const data = await userStore.getWechatQrcode()
    
    // 校验返回结果
    if (!data?.qrcodeUrl || !data?.scene) {
      throw new Error('获取二维码失败')
    }
    
    qrcodeUrl.value = data.qrcodeUrl
    scene.value = data.scene
    startPolling()
  } catch (error) {
    console.error('获取二维码失败:', error)
    // 显示错误信息
    qrcodeUrl.value = ''
    scene.value = ''
    Message.error('获取二维码失败，请重试')
  }
}

// 检查微信登录状态
const startCheckingLogin = () => {
  checkTimer = setInterval(async () => {
    try {
      const isLoggedIn = await userStore.checkWechatLogin(scene.value)
      if (isLoggedIn) {
        clearInterval(checkTimer)
        const redirect = router.currentRoute.value.query.redirect?.toString() || '/'
        router.push(redirect)
        handleLoginSuccess()
      }
    } catch (error) {
      console.error(error)
    }
  }, 2000)
}

// 登录成功处理
const handleLoginSuccess = () => {
  emit('update:modelValue', false)
}

// 监听登录类型变化
watch(() => loginType.value, (newType) => {
  if (newType === 'wechat') {
    getWechatQrcode()
  } else {
    // 切换到其他登录方式时清理
    clearInterval(checkTimer)
    checkTimer = null
    qrcodeUrl.value = ''
    scene.value = ''
  }
})

// 监听弹框显示状态
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    // 弹框关闭时清理
    clearInterval(checkTimer)
    checkTimer = null
    scene.value = ''
    qrcodeUrl.value = ''
  }
})

// 组件卸载时清理
onUnmounted(() => {
  if (checkTimer) {
    clearInterval(checkTimer)
    checkTimer = null
  }
})

// 修改开始轮询函数
const startPolling = () => {
  // 先清除可能存在的旧定时器
  if (checkTimer) {
    clearInterval(checkTimer)
  }
  
  checkTimer = setInterval(async () => {
    try {
      const data = await userStore.checkWechatLogin(scene.value)
      if (data) {
        // 登录成功，清理定时器并关闭弹框
        clearInterval(checkTimer)
        checkTimer = null
        emit('update:modelValue', false)
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
      // 发生错误时也要清理定时器
      clearInterval(checkTimer)
      checkTimer = null
    }
  }, 2000)
}
</script>

<style lang="scss" scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s ease;
  
  .dialog-content {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  
  .dialog-content {
    transform: translateY(-20px);
    opacity: 0;
  }
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  
  .dialog-content {
    transform: translateY(0);
    opacity: 1;
  }
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  position: relative;
  width: 90%;
  max-width: 400px;
  padding: 2rem;
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transform: translateY(0);
  opacity: 1;
  will-change: transform, opacity;
  
  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--text-primary);
  }
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  
  &:hover {
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
      transition: border-color 0.2s;
      
      &:focus {
        outline: none;
        border-color: var(--primary);
      }
      
      &.error {
        border-color: var(--error);
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

  .qrcode-error {
    text-align: center;
    padding: 2rem;
    
    .error-icon {
      display: block;
      width: 40px;
      height: 40px;
      line-height: 40px;
      margin: 0 auto 1rem;
      border-radius: 50%;
      background: var(--error);
      color: white;
      font-size: 24px;
      font-weight: bold;
    }
    
    p {
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }
    
    .retry-btn {
      padding: 0.5rem 1.5rem;
      border: 1px solid var(--primary);
      border-radius: 6px;
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

@media (max-width: 480px) {
  .dialog-content {
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

.error {
  border-color: var(--error) !important;
}

.error-message {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--error);
}
</style> 