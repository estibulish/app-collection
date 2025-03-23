<template>
  <div class="image-editor-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>图片编辑工具</h1>
        <p class="tool-desc">在线图片编辑工具，支持裁剪、滤镜、文字、贴纸等多种编辑功能</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="image-editor" />
      </div>
    </div>

    <div class="editor-container">
      <div v-if="!imageUrl" class="upload-area" @drop.prevent="handleDrop" @dragover.prevent>
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          class="file-input"
          @change="handleFileChange"
        >
        <div class="upload-content">
          <span class="upload-icon">🖼</span>
          <h3>选择或拖放图片</h3>
          <p>支持 JPG、PNG、GIF 等常见格式</p>
          <button class="upload-btn" @click="$refs.fileInput.click()">
            选择图片
          </button>
        </div>
      </div>

      <ImageEditor
        v-else
        :image="imageUrl"
        @save="handleSave"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ImageEditor from '@/components/ImageEditor.vue'
import FavoriteButton from '@/components/FavoriteButton.vue'
import { useFavoriteStore } from '@/stores/favorite'

const favoriteStore = useFavoriteStore()
const fileInput = ref(null)
const imageUrl = ref('')

// 处理文件选择
const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (file && file.type.startsWith('image/')) {
    loadImage(file)
  }
}

// 处理拖放
const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    loadImage(file)
  }
}

// 加载图片
const loadImage = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// 处理保存
const handleSave = (dataUrl) => {
  const link = document.createElement('a')
  link.download = 'edited-image.png'
  link.href = dataUrl
  link.click()
}

// 更新最后使用时间
favoriteStore.updateLastUsed('image-editor')
</script>

<style lang="scss" scoped>
.image-editor-page {
  padding: 2rem;
}

.editor-container {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  min-height: 700px;
}

.upload-area {
  width: 100%;
  min-height: 500px;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--primary);
    background: var(--primary-50);
  }
  
  .file-input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  
  .upload-content {
    text-align: center;
    padding: 2rem;
    
    .upload-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      display: block;
    }
    
    h3 {
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }
    
    p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }
    
    .upload-btn {
      padding: 0.75rem 1.5rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
      
      &:hover {
        background: var(--primary-dark);
      }
    }
  }
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;

  .header-content {
    flex: 1;
    
    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .tool-desc {
      color: var(--text-secondary);
      font-size: 1rem;
      line-height: 1.5;
    }
  }

  .tool-actions {
    margin-left: 1rem;
  }
}

@media (max-width: 768px) {
  .image-editor-page {
    padding: 1rem;
  }
  
  .editor-container {
    min-height: 500px;
  }
  
  .tool-header {
    flex-direction: column;
    gap: 1rem;
    
    .tool-actions {
      margin-left: 0;
      align-self: flex-end;
    }
  }
}
</style> 