<template>
  <div class="app">
    <Header />
    <main class="main">
      <router-view></router-view>
    </main>
    <Footer />
    <WechatQrcode />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import WechatQrcode from './components/WechatQrcode.vue'
import Clock from '@/components/Clock.vue'

const userStore = useUserStore()

onMounted(() => {
  userStore.loadFromStorage()
})
</script>

<style lang="scss">
@use './styles/variables.scss';   

.app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .main {
    flex: 1;
  }
}
</style> 