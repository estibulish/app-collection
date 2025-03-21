<template>
  <div class="wechat-qrcode">
    <!-- 悬浮按钮 -->
    <button class="float-btn" @click="showQrcode = true">
      <span class="btn-icon">💬</span>
      <span class="btn-text">公众号</span>
    </button>

    <!-- 二维码弹窗 -->
    <Transition name="popup">
      <div v-if="showQrcode" class="qrcode-popup">
        <button class="close-btn" @click="showQrcode = false">×</button>
        <h3>关注公众号</h3>
        <div class="qrcode-wrapper">
          <img src="@/assets/images/qrcode_for_gh_790f621387ef_1280.jpg" alt="公众号二维码" class="qrcode-img">
          <p class="tips">扫码关注获取更多功能</p>
        </div>
      </div>
    </Transition>

    <!-- 透明遮罩层 -->
    <div v-if="showQrcode" class="overlay" @click="showQrcode = false"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showQrcode = ref(false)
</script>

<style lang="scss" scoped>
.wechat-qrcode {
  .float-btn {
    position: fixed;
    right: 20px;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 12px;
    width: 60px;
    height: 60px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s;
    z-index: 99;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .btn-icon {
      font-size: 24px;
      line-height: 1;
    }

    .btn-text {
      font-size: 12px;
      line-height: 1;
    }
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 98;
}

.qrcode-popup {
  position: fixed;
  right: 20px;
  bottom: 100px; // 在悬浮按钮上方
  background: var(--bg-card);
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 100;

  h3 {
    margin-bottom: 20px;
    color: var(--text-primary);
  }

  .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    font-size: 24px;
    color: var(--text-tertiary);
    cursor: pointer;
    padding: 4px;

    &:hover {
      color: var(--text-primary);
    }
  }

  .qrcode-wrapper {
    .qrcode-img {
      width: 200px;
      height: 200px;
      margin: 0 auto 16px;
      display: block;
    }

    .tips {
      color: var(--text-secondary);
      font-size: 14px;
    }
  }
}

// 弹出动画
.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

// 遮罩层动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .wechat-qrcode {
    .float-btn {
      width: 48px;
      height: 48px;
      padding: 8px;
      
      .btn-icon {
        font-size: 20px;
      }
      
      .btn-text {
        font-size: 10px;
      }
    }
  }

  .qrcode-popup {
    right: 50%;
    transform: translateX(50%);
    bottom: 100px;
  }
}
</style> 