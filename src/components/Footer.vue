<template>
  <footer>
    <div class="footer-content">
      <div class="footer-left">
        <div class="logo">
          <span class="logo-icon">⚡️</span>
          <span class="logo-text">工具箱</span>
        </div>
        <p class="footer-desc">简单高效的在线工具集合</p>
        <WechatQrcode />
      </div>
      <div class="footer-right">
        <div class="footer-links-group">
          <h4>关于我们</h4>
          <router-link to="/about">团队介绍</router-link>
          <router-link to="/help">使用帮助</router-link>
          <router-link to="/changelog">更新日志</router-link>
        </div>
        <div class="footer-links-group">
          <h4>工具分类</h4>
          <router-link to="/tools?category=dev">开发工具</router-link>
          <router-link to="/tools?category=design">设计工具</router-link>
          <router-link to="/tools?category=office">办公工具</router-link>
        </div>
        <div class="footer-links-group">
          <h4>联系我们</h4>
          <router-link to="/feedback">意见反馈</router-link>
          <router-link to="/report">问题反馈</router-link>
          <router-link to="/business">商务合作</router-link>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} 工具箱 All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import WechatQrcode from './WechatQrcode.vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style lang="scss" scoped>
footer {
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
  padding: 3rem 0 1.5rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.footer-left {
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo-icon {
    font-size: 1.75rem;
    line-height: 1;
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .social-links {
    margin-top: 0;
  }
}

.footer-desc {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;

  a {
    color: var(--text-secondary);
    font-size: 1.25rem;
    text-decoration: none;
    transition: all 0.2s;

    &:hover {
      color: var(--primary);
      transform: translateY(-2px);
    }
  }
}

.footer-right {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rem;
}

.footer-links-group {
  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1.25rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  a {
    display: block;
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.875rem;
    padding: 0.375rem 0;
    transition: all 0.2s;

    &:hover {
      color: var(--primary);
      transform: translateX(4px);
    }
  }
}

.footer-bottom {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  footer {
    padding: 2rem 1rem 1rem;
  }

  .footer-content {
    flex-direction: column;
    gap: 2.5rem;
  }

  .footer-left {
    max-width: none;
    text-align: center;
    padding: 0 1rem;
    align-items: center;

    .logo {
      justify-content: center;
    }

    .footer-desc {
      margin: 1rem 0;
    }

    .social-links {
      justify-content: center;
    }
  }

  .footer-right {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: space-around;
    padding: 0;
  }

  .footer-links-group {
    flex: 0 0 auto;
    min-width: 160px;
    text-align: center;

    h4 {
      margin-bottom: 1rem;
    }

    a {
      padding: 0.5rem 0;
      text-align: center;

      &:hover {
        transform: none;
      }
    }
  }
}

@media (max-width: 480px) {
  footer {
    padding: 1.5rem 1rem 1rem;
  }

  .footer-content {
    gap: 2rem;
  }

  .footer-right {
    display: flex;
    gap: 1.5rem;
  }

  .footer-links-group {
    min-width: 0;
    
    h4 {
      margin-bottom: 0.75rem;
    }

    a {
      padding: 0.375rem 0;
    }
  }

  .footer-bottom {
    margin-top: 1.5rem;
  }
}
</style> 