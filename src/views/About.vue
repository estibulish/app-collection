<template>
  <div class="about-page">
    <h1>关于我们</h1>
    <div class="content">
      <section class="intro-section">
        <h2>项目简介</h2>
        <p>这是一个在线工具集合平台，旨在为开发者和普通用户提供便捷、高效的在线工具。所有工具都在本地运行，保证数据安全。</p>
      </section>

      <section class="features-section">
        <h2>特色功能</h2>
        <div class="features-grid">
          <div class="feature-card">
            <span class="feature-icon">🚀</span>
            <h3>快速高效</h3>
            <p>所有工具都经过优化，确保处理速度快捷。</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🔒</span>
            <h3>安全可靠</h3>
            <p>数据本地处理，无需担心隐私泄露。</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">💻</span>
            <h3>开源免费</h3>
            <p>代码完全开源，永久免费使用。</p>
          </div>
        </div>
      </section>

      <section class="contact-section">
        <h2>联系我们</h2>
        <p>如果您有任何问题或建议，欢迎通过以下方式联系我们：</p>
        <ul class="contact-list">
          <li>
            <span class="contact-icon">📧</span>
            <span>邮箱：support@example.com</span>
          </li>
          <li>
            <span class="contact-icon">💬</span>
            <span>GitHub Issues</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.about-page {
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

section {
  margin-bottom: 3rem;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
    line-height: 1.6;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.feature-card {
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-align: center;

  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    display: block;
  }

  h3 {
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }

  p {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

.contact-list {
  list-style: none;
  padding: 0;
  margin-top: 1rem;

  li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    color: var(--text-secondary);
    
    .contact-icon {
      font-size: 1.25rem;
    }
  }
}
</style> 