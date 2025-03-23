<template>
  <div class="image-merge-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>图片拼接</h1>
        <p class="tool-desc">在线图片拼接工具，支持横向、纵向拼接，可调整间距和背景</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="image-merge" />
      </div>
    </div>

    <div class="merge-container">
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
            <div class="upload-hint">支持多选，可拖拽排序</div>
          </div>
        </div>
      </div>

      <!-- 拼接设置 -->
      <div class="merge-settings">
        <h2>拼接设置</h2>
        <div class="settings-group">
          <label>
            拼接方向
            <select v-model="direction">
              <option value="horizontal">横向拼接</option>
              <option value="vertical">纵向拼接</option>
            </select>
          </label>

          <label>
            图片间距
            <div class="spacing-control">
              <input type="range" v-model="spacing" min="0" max="100">
              <span>{{ spacing }}px</span>
            </div>
          </label>

          <label>
            背景颜色
            <input type="color" v-model="backgroundColor">
          </label>

          <label>
            输出尺寸
            <select v-model="outputSize">
              <option value="original">原始尺寸</option>
              <option value="uniform">统一尺寸</option>
              <option value="custom">自定义尺寸</option>
            </select>
          </label>

          <template v-if="outputSize === 'custom'">
            <label>
              宽度
              <input type="number" v-model="customWidth" min="100" step="100">
            </label>
            <label>
              高度
              <input type="number" v-model="customHeight" min="100" step="100">
            </label>
          </template>
        </div>

        <div class="panel-actions">
          <button class="apply" @click="mergeImages">
            <span class="tool-icon">✓</span>
            开始拼接
          </button>
          <button class="cancel" @click="resetSettings">
            <span class="tool-icon">✕</span>
            重置
          </button>
        </div>
      </div>

      <!-- 图片列表 -->
      <div class="image-list" v-if="imageList.length > 0">
        <draggable 
          v-model="imageList"
          item-key="id"
          handle=".drag-handle"
          ghost-class="ghost"
        >
          <template #item="{ element }">
            <div class="image-item">
              <div class="drag-handle">⋮⋮</div>
              <img :src="element.preview" :alt="element.name">
              <div class="image-info">
                <span class="image-name">{{ element.name }}</span>
                <button class="remove-btn" @click="removeImage(element.id)">✕</button>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'
import draggable from 'vuedraggable'

const fileInput = ref(null)
const direction = ref('horizontal')
const spacing = ref(10)
const backgroundColor = ref('#ffffff')
const outputSize = ref('original')
const customWidth = ref(800)
const customHeight = ref(600)
const imageList = ref([])

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  // 处理文件选择
}

const handleDrop = (event) => {
  // 处理文件拖放
}

const mergeImages = () => {
  // 执行图片拼接
}

const removeImage = (id) => {
  // 移除图片
}

const resetSettings = () => {
  // 重置设置
}
</script>

<style lang="scss" scoped>
@use "sass:color";

.image-merge-page {
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

  .merge-container {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 2rem;
    margin-top: 1rem;

    .upload-area {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 2rem;

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

    .merge-settings {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;

      h2 {
        font-size: 1.5rem;
        margin: 0 0 1.5rem;
      }

      .settings-group {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;

        label {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

          select, input[type="text"], input[type="number"] {
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 100%;
            
            &:focus {
              border-color: #409eff;
              outline: none;
            }
          }

          input[type="color"] {
            width: 100%;
            height: 40px;
            padding: 2px;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
          }

          .spacing-control {
            display: flex;
            align-items: center;
            gap: 1rem;

            input[type="range"] {
              flex: 1;
            }

            span {
              min-width: 3rem;
            }
          }
        }
      }

      .panel-actions {
        margin-top: 2rem;
        display: flex;
        gap: 1rem;

        button {
          flex: 1;
          padding: 0.8rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;

          .tool-icon {
            font-size: 1.2rem;
          }

          &.apply {
            background: #409eff;
            color: white;

            &:hover {
              background: color.scale(#409eff, $lightness: -10%);
            }
          }

          &.cancel {
            background: #f5f7fa;
            color: #606266;

            &:hover {
              background: color.scale(#f5f7fa, $lightness: -5%);
            }
          }
        }
      }
    }
  }

  .image-list {
    grid-column: 1 / -1;
    margin-top: 2rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    
    .image-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: #fff;
      transition: all 0.2s;
      
      &:hover {
        border-color: #409eff;
        background: rgba(64, 158, 255, 0.02);
      }
      
      .drag-handle {
        cursor: move;
        color: #999;
        user-select: none;
        padding: 0.5rem;
        
        &:hover {
          color: #666;
        }
      }
      
      img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
      }
      
      .image-info {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .image-name {
          font-size: 0.9rem;
          color: #333;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .remove-btn {
          padding: 0.5rem;
          border: none;
          background: none;
          color: #999;
          cursor: pointer;
          transition: all 0.2s;
          
          &:hover {
            color: #ff4d4f;
          }
        }
      }
    }
    
    .ghost {
      opacity: 0.5;
      background: rgba(64, 158, 255, 0.1);
      border: 1px dashed #409eff;
    }
  }
}
</style> 