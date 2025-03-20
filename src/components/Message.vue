<template>
  <Transition name="message">
    <div 
      v-if="visible"
      class="message"
      :class="type"
    >
      <span class="message-icon">{{ icon }}</span>
      <span class="message-content">{{ content }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { ref,computed } from 'vue'

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info'
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const visible = ref(false)
const icon = computed(() => {
  switch (props.type) {
    case 'success': return '✓'
    case 'error': return '✕'
    case 'warning': return '⚠'
    default: return 'ℹ'
  }
})

// 显示消息
const show = () => {
  visible.value = true
  if (props.duration > 0) {
    setTimeout(() => {
      visible.value = false
    }, props.duration)
  }
}

// 暴露方法给外部使用
defineExpose({ show })
</script>

<style lang="scss" scoped>
.message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 12px 24px;
  border-radius: 8px;
  background: var(--bg-card);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  
  &.success {
    border-left: 4px solid var(--success);
    .message-icon {
      color: var(--success);
    }
  }
  
  &.error {
    border-left: 4px solid var(--error);
    .message-icon {
      color: var(--error);
    }
  }
  
  &.warning {
    border-left: 4px solid var(--warning);
    .message-icon {
      color: var(--warning);
    }
  }
  
  &.info {
    border-left: 4px solid var(--primary);
    .message-icon {
      color: var(--primary);
    }
  }
  
  .message-icon {
    font-size: 16px;
  }
  
  .message-content {
    color: var(--text-primary);
  }
}

// 动画
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style> 