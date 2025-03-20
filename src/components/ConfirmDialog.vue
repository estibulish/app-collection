<template>
  <Transition name="dialog">
    <div v-if="modelValue" class="dialog-overlay" @click="$emit('update:modelValue', false)">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>{{ title }}</h3>
          <button class="close-btn" @click="$emit('update:modelValue', false)">×</button>
        </div>
        <div class="dialog-body">
          {{ message }}
        </div>
        <div class="dialog-footer">
          <button class="cancel-btn" @click="$emit('update:modelValue', false)">
            {{ cancelText }}
          </button>
          <button class="confirm-btn" @click="handleConfirm">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: '确认'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const handleConfirm = () => {
  emit('update:modelValue', false)
  emit('confirm')
}
</script>

<style lang="scss" scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: var(--bg-card);
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  h3 {
    margin: 0;
    color: var(--text-primary);
  }
}

.dialog-body {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: var(--text-primary);
  }
}

.cancel-btn,
.confirm-btn {
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.cancel-btn {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  
  &:hover {
    border-color: var(--text-primary);
    color: var(--text-primary);
  }
}

.confirm-btn {
  background: var(--primary);
  border: 1px solid var(--primary);
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
}

// 动画
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
</style> 