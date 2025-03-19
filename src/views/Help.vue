<template>
  <div class="help-page">
    <h1>帮助中心</h1>
    
    <div class="help-content">
      <section class="search-section">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索帮助文档..."
          class="search-input"
        >
      </section>

      <section class="faq-section">
        <h2>常见问题</h2>
        <div class="faq-list">
          <div 
            v-for="(faq, index) in filteredFaqs" 
            :key="index"
            class="faq-item"
          >
            <div 
              class="faq-question"
              @click="toggleFaq(index)"
              :class="{ 'active': activeFaq === index }"
            >
              <span>{{ faq.question }}</span>
              <span class="arrow">{{ activeFaq === index ? '↑' : '↓' }}</span>
            </div>
            <div 
              class="faq-answer"
              :class="{ 'show': activeFaq === index }"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </section>

      <section class="contact-support">
        <h2>联系支持</h2>
        <p>如果您没有找到需要的帮助信息，可以通过以下方式联系我们：</p>
        <div class="support-options">
          <a href="#" class="support-option">
            <span class="option-icon">📧</span>
            <span>发送邮件</span>
          </a>
          <a href="#" class="support-option">
            <span class="option-icon">💬</span>
            <span>提交反馈</span>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const activeFaq = ref(null)

const faqs = [
  {
    question: '如何使用JSON格式化工具？',
    answer: '将JSON文本粘贴到输入框中，系统会自动进行格式化。您也可以点击"格式化"按钮手动触发格式化操作。'
  },
  {
    question: '工具是否收费？',
    answer: '所有工具完全免费使用，无需付费。'
  },
  {
    question: '数据是否安全？',
    answer: '所有数据处理都在本地完成，不会上传到服务器，请放心使用。'
  }
]

const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs
  const query = searchQuery.value.toLowerCase()
  return faqs.filter(faq => 
    faq.question.toLowerCase().includes(query) || 
    faq.answer.toLowerCase().includes(query)
  )
})

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}
</script>

<style lang="scss" scoped>
.help-page {
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

.search-section {
  margin-bottom: 2rem;

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 1rem;
    background: var(--bg-card);
    color: var(--text-primary);

    &:focus {
      outline: none;
      border-color: var(--primary);
    }
  }
}

.faq-section {
  margin-bottom: 3rem;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: var(--text-primary);
  }
}

.faq-item {
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-card);
  cursor: pointer;
  color: var(--text-primary);
  font-weight: 500;

  &.active {
    background: var(--primary);
    color: white;
  }

  .arrow {
    font-size: 1.25rem;
  }
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  background: var(--bg-main);
  color: var(--text-secondary);

  &.show {
    max-height: 500px;
    padding: 1rem;
  }
}

.contact-support {
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
  }
}

.support-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.support-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.2s;

  &:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
  }

  .option-icon {
    font-size: 1.5rem;
  }
}
</style> 