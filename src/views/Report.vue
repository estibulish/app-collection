<template>
  <div class="report-page">
    <h1>问题报告</h1>
    
    <div class="report-form">
      <div class="form-group">
        <label>问题类型</label>
        <select v-model="reportType">
          <option value="error">错误报告</option>
          <option value="security">安全问题</option>
          <option value="performance">性能问题</option>
          <option value="other">其他问题</option>
        </select>
      </div>

      <div class="form-group">
        <label>问题描述</label>
        <textarea 
          v-model="description"
          placeholder="请详细描述您遇到的问题，包括：
1. 问题发生的步骤
2. 期望的结果
3. 实际的结果"
          rows="8"
        ></textarea>
      </div>

      <div class="form-group">
        <label>系统环境</label>
        <div class="env-info">
          <div class="env-item">
            <span>浏览器：</span>
            <span>{{ browserInfo }}</span>
          </div>
          <div class="env-item">
            <span>操作系统：</span>
            <span>{{ osInfo }}</span>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>联系方式</label>
        <input 
          type="email" 
          v-model="email"
          placeholder="请留下您的邮箱，以便我们跟进问题"
        >
      </div>

      <button class="submit-btn" @click="submitReport">
        提交报告
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const reportType = ref('error')
const description = ref('')
const email = ref('')
const browserInfo = ref('')
const osInfo = ref('')

onMounted(() => {
  // 获取浏览器和系统信息
  browserInfo.value = navigator.userAgent
  osInfo.value = navigator.platform
})

const submitReport = () => {
  // TODO: 实现报告提交逻辑
  console.log({
    type: reportType.value,
    description: description.value,
    email: email.value,
    environment: {
      browser: browserInfo.value,
      os: osInfo.value
    }
  })
}
</script>

<style lang="scss" scoped>
.report-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;

  h1 {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 2rem;
    color: var(--text-primary);
  }
}

.report-form {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
    font-weight: 500;
  }

  input, select, textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-main);
    color: var(--text-primary);
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: var(--primary);
    }
  }

  textarea {
    resize: vertical;
    min-height: 160px;
    font-family: monospace;
  }
}

.env-info {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
}

.env-item {
  display: flex;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);

  &:last-child {
    margin-bottom: 0;
  }

  span:first-child {
    min-width: 80px;
    font-weight: 500;
  }
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: var(--primary-dark);
  }
}

@media (max-width: 640px) {
  .report-page {
    padding: 1rem;
  }

  .report-form {
    padding: 1rem;
  }
}
</style> 