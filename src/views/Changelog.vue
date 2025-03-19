<template>
  <div class="changelog-page">
    <h1>更新记录</h1>
    
    <div class="changelog-content">
      <div v-for="release in releases" :key="release.version" class="release-item">
        <div class="release-header">
          <h2>{{ release.version }}</h2>
          <time>{{ release.date }}</time>
        </div>
        
        <div class="changes-list">
          <div v-for="(changes, type) in release.changes" :key="type" class="change-group">
            <h3>{{ type }}</h3>
            <ul>
              <li v-for="(change, index) in changes" :key="index">
                {{ change }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const releases = [
  {
    version: 'v1.0.0',
    date: '2024-03-20',
    changes: {
      '新功能': [
        'Base64编解码工具',
        'JSON格式化工具'
      ],
      '优化': [
        '优化页面加载速度',
        '改进工具搜索功能'
      ],
      '修复': [
        '修复暗色模式下的显示问题'
      ]
    }
  }
]
</script>

<style lang="scss" scoped>
.changelog-page {
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

.release-item {
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.release-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  time {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
}

.change-group {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
    color: var(--text-primary);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      position: relative;
      padding-left: 1.5rem;
      margin-bottom: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.9375rem;

      &:last-child {
        margin-bottom: 0;
      }

      &::before {
        content: "•";
        position: absolute;
        left: 0.5rem;
        color: var(--primary);
      }
    }
  }
}

@media (max-width: 640px) {
  .changelog-page {
    padding: 1rem;
  }

  .release-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .release-item {
    padding: 1rem;
  }
}
</style> 