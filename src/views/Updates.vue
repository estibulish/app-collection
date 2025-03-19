<template>
  <div class="updates-page">
    <h1>更新日志</h1>
    <div class="updates-list">
      <div v-for="update in updates" :key="update.date" class="update-item">
        <div class="update-header">
          <h2>{{ update.version }}</h2>
          <time>{{ update.date }}</time>
        </div>
        <ul class="changes-list">
          <li v-for="(change, index) in update.changes" :key="index">
            {{ change }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const updates = [
  {
    version: 'v1.0.0',
    date: '2024-03-20',
    changes: [
      '初始版本发布',
      '添加Base64编解码工具',
      '添加JSON格式化工具'
    ]
  }
]
</script>

<style lang="scss" scoped>
.updates-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;

  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
    color: var(--text-primary);
  }
}

.update-item {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.update-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  time {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
}

.changes-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.9375rem;

    &::before {
      content: "•";
      position: absolute;
      left: 0.5rem;
      color: var(--primary);
    }
  }
}
</style> 