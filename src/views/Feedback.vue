<template>
  <div class="feedback-page">
    <h1>意见反馈</h1>
    
    <div class="feedback-form">
      <div class="form-group">
        <label>反馈类型</label>
        <select v-model="feedbackType">
          <option value="bug">问题反馈</option>
          <option value="feature">功能建议</option>
          <option value="other">其他</option>
        </select>
      </div>

      <div class="form-group">
        <label>标题</label>
        <input 
          type="text" 
          v-model="title"
          placeholder="请简要描述您的反馈"
        >
      </div>

      <div class="form-group">
        <label>详细描述</label>
        <textarea 
          v-model="content"
          placeholder="请详细描述您遇到的问题或建议..."
          rows="6"
        ></textarea>
      </div>

      <div class="form-group">
        <label>联系方式（选填）</label>
        <input 
          type="text" 
          v-model="contact"
          placeholder="邮箱或其他联系方式"
        >
      </div>

      <button class="submit-btn" @click="submitFeedback">
        提交反馈
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const feedbackType = ref('bug')
const title = ref('')
const content = ref('')
const contact = ref('')

const submitFeedback = () => {
  // TODO: 实现反馈提交逻辑
  console.log({
    type: feedbackType.value,
    title: title.value,
    content: content.value,
    contact: contact.value
  })
}
</script>

<style lang="scss" scoped>
.feedback-page {
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

.feedback-form {
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
    min-height: 120px;
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
  .feedback-page {
    padding: 1rem;
  }

  .feedback-form {
    padding: 1rem;
  }
}
</style> 