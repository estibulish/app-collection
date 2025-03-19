<template>
  <div class="business-page">
    <h1>商务合作</h1>
    
    <div class="content">
      <section class="intro-section">
        <h2>合作方式</h2>
        <div class="cooperation-types">
          <div class="type-card">
            <span class="type-icon">🤝</span>
            <h3>技术合作</h3>
            <p>提供技术支持、定制开发、API接口等服务</p>
          </div>
          <div class="type-card">
            <span class="type-icon">💼</span>
            <h3>商务合作</h3>
            <p>广告投放、品牌推广、联合运营等合作</p>
          </div>
          <div class="type-card">
            <span class="type-icon">🎯</span>
            <h3>战略合作</h3>
            <p>长期深度合作、资源共享、共同发展</p>
          </div>
        </div>
      </section>

      <section class="contact-section">
        <h2>联系方式</h2>
        <div class="contact-info">
          <div class="info-item">
            <span class="info-icon">📧</span>
            <div class="info-content">
              <h4>商务邮箱</h4>
              <p>business@example.com</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">📱</span>
            <div class="info-content">
              <h4>商务电话</h4>
              <p>+86 xxx-xxxx-xxxx</p>
            </div>
          </div>
        </div>
      </section>

      <section class="form-section">
        <h2>合作咨询</h2>
        <form class="contact-form" @submit.prevent="submitForm">
          <div class="form-group">
            <label>公司名称</label>
            <input 
              type="text" 
              v-model="form.company"
              placeholder="请输入您的公司名称"
              required
            >
          </div>
          <div class="form-group">
            <label>联系人</label>
            <input 
              type="text" 
              v-model="form.name"
              placeholder="请输入联系人姓名"
              required
            >
          </div>
          <div class="form-group">
            <label>联系方式</label>
            <input 
              type="text" 
              v-model="form.contact"
              placeholder="请输入邮箱或电话"
              required
            >
          </div>
          <div class="form-group">
            <label>合作意向</label>
            <textarea 
              v-model="form.message"
              placeholder="请简要描述您的合作意向"
              rows="4"
              required
            ></textarea>
          </div>
          <button type="submit" class="submit-btn">
            提交咨询
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  company: '',
  name: '',
  contact: '',
  message: ''
})

const submitForm = () => {
  // TODO: 实现表单提交逻辑
  console.log(form)
}
</script>

<style lang="scss" scoped>
.business-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;

  h1 {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 2rem;
    color: var(--text-primary);
  }
}

section {
  margin-bottom: 3rem;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: var(--text-primary);
    text-align: center;
  }
}

.cooperation-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.type-card {
  padding: 2rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-align: center;

  .type-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }

  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
    font-size: 0.875rem;
    line-height: 1.6;
  }
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;

  .info-icon {
    font-size: 2rem;
  }

  .info-content {
    h4 {
      font-size: 1rem;
      margin-bottom: 0.25rem;
      color: var(--text-primary);
    }

    p {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
  }
}

.contact-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
    font-weight: 500;
  }

  input, textarea {
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
    min-height: 100px;
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

@media (max-width: 768px) {
  .business-page {
    padding: 1rem;
  }

  section {
    margin-bottom: 2rem;
  }

  .contact-form {
    padding: 1rem;
  }
}
</style> 