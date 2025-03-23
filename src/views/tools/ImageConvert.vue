<template>
  <div class="image-convert-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>图片格式转换</h1>
        <p class="tool-desc">在线图片格式转换工具，支持 JPG、PNG、WEBP、GIF 等格式互转</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="image-convert" />
      </div>
    </div>
    
    <div class="convert-container">
      <!-- 上传区域 -->
      <div class="upload-area">
        <div class="upload-zone" @drop.prevent="handleDrop" @dragover.prevent>
          <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*" multiple>
          <div class="upload-content">
            <div class="upload-icon">📁</div>
            <div class="upload-text">
              拖放图片到这里，或
              <button class="upload-button" @click="triggerFileInput">点击上传</button>
            </div>
            <div class="upload-hint">支持 JPG、PNG、WEBP、GIF 格式</div>
          </div>
        </div>
      </div>
      
      <!-- 转换设置 -->
      <div class="convert-settings">
        <h2>转换设置</h2>
        <div class="settings-group">
          <label>
            目标格式
            <select v-model="targetFormat">
              <option value="jpeg">JPG</option>
              <option value="png">PNG</option>
              <option value="webp">WEBP</option>
              <option value="gif">GIF</option>
            </select>
          </label>
          
          <label v-if="targetFormat === 'jpeg' || targetFormat === 'webp'">
            质量
            <div class="quality-control">
              <input type="range" v-model="quality" min="1" max="100">
              <span>{{ quality }}%</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

const fileInput = ref(null)
const targetFormat = ref('jpeg')
const quality = ref(80)

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileSelect = (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    // TODO: 处理文件选择逻辑
    console.log('Selected files:', files)
  }
}

const handleDrop = (event) => {
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    // TODO: 处理文件拖放逻辑
    console.log('Dropped files:', files)
  }
}
</script>

<style lang="scss" scoped>
.image-convert-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  .tool-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;

    .header-content {
      h1 {
        font-size: 2rem;
        margin: 0 0 0.5rem;
      }

      .tool-desc {
        color: #666;
        margin: 0;
      }
    }
  }

  .convert-container {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    padding: 2rem;

    .upload-area {
      margin-bottom: 2rem;

      .upload-zone {
        border: 2px dashed #ddd;
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
          border-color: #409eff;
          background: rgba(64, 158, 255, 0.05);
        }

        input[type="file"] {
          display: none;
        }

        .upload-content {
          .upload-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }

          .upload-text {
            margin-bottom: 0.5rem;
            
            .upload-button {
              color: #409eff;
              background: none;
              border: none;
              cursor: pointer;
              padding: 0;
              font-size: inherit;

              &:hover {
                text-decoration: underline;
              }
            }
          }

          .upload-hint {
            color: #999;
            font-size: 0.9rem;
          }
        }
      }
    }

    .convert-settings {
      h2 {
        font-size: 1.5rem;
        margin: 0 0 1rem;
      }

      .settings-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        label {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

          select {
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 200px;
          }

          .quality-control {
            display: flex;
            align-items: center;
            gap: 1rem;

            input[type="range"] {
              flex: 1;
              max-width: 200px;
            }

            span {
              min-width: 3rem;
            }
          }
        }
      }
    }
  }
}
</style> 