<template>
  <div class="wechat-qrcode">
    <div class="qrcode-wrapper">
      <img src="@/assets/images/qrcode_for_gh_790f621387ef_1280.jpg" alt="公众号二维码" class="qrcode-img">
      <p class="tips">扫码关注获取更多功能</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.wechat-qrcode {
  .qrcode-wrapper {
    .qrcode-img {
      width: 120px;
      height: 120px;
      margin: 0 auto 8px;
      display: block;
    }

    .tips {
      color: var(--text-secondary);
      font-size: 12px;
      text-align: center;
    }
  }
}

@media (max-width: 768px) {
  .wechat-qrcode {
    margin: 1rem auto;
  }
}
</style> 