<template>
  <button 
    class="favorite-btn"
    :class="{ 'is-favorite': isFavorite }"
    @click.stop.prevent="toggleFavorite"
    :title="isFavorite ? '取消收藏' : '添加收藏'"
  >
    <span class="favorite-icon">{{ isFavorite ? '⭐️' : '☆' }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useFavoriteStore } from '../stores/favorite'

const props = defineProps({
  toolId: {
    type: String,
    required: true
  }
})

const favoriteStore = useFavoriteStore()

const isFavorite = computed(() => {
  return favoriteStore.favorites.includes(props.toolId)
})

const toggleFavorite = (event) => {
  // 阻止事件冒泡和默认行为
  event.stopPropagation()
  event.preventDefault()
  
  if (isFavorite.value) {
    favoriteStore.removeFavorite(props.toolId)
  } else {
    favoriteStore.addFavorite(props.toolId)
  }
}
</script>

<style lang="scss" scoped>
.favorite-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.2s;
  z-index: 1; // 确保按钮在上层

  &:hover {
    transform: scale(1.1);
  }

  .favorite-icon {
    font-size: 1.25rem;
    line-height: 1;
    color: var(--text-secondary);
    transition: color 0.2s;
  }

  &.is-favorite .favorite-icon {
    color: #f59e0b;
  }
}
</style> 