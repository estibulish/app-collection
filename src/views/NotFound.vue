<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1>页面未找到</h1>
      <p>抱歉，您访问的页面不存在或已被移除</p>
      <div class="actions">
        <router-link to="/" class="home-btn">
          返回首页
        </router-link>
        <button class="back-btn" @click="$router.back()">
          返回上页
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.not-found-content {
  text-align: center;
  max-width: 480px;
}

.error-code {
  font-size: 6rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
  margin-bottom: 1rem;
  font-family: 'Monaco', monospace;
}

h1 {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.home-btn,
.back-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.home-btn {
  background: var(--primary);
  color: white;
  text-decoration: none;
  
  &:hover {
    background: var(--primary-dark);
  }
}

.back-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  
  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
}

@media (max-width: 768px) {
  .error-code {
    font-size: 4rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style> 