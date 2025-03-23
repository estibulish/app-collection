<template>
  <div class="clock">
    <div class="clock-face">
      <!-- 时钟刻度和数字 -->
      <div v-for="n in 12" :key="n" class="hour-mark" :style="getHourMarkStyle(n)">
        <div class="mark"></div>
      </div>
      
      <!-- 时钟数字 -->
      <div v-for="n in 12" :key="`num-${n}`" class="number" :style="getNumberStyle(n)">
        {{ n }}
      </div>
      
      <!-- 时钟指针 -->
      <div class="hand hour-hand" :style="hourHandStyle"></div>
      <div class="hand minute-hand" :style="minuteHandStyle"></div>
      <div class="hand second-hand" :style="secondHandStyle"></div>
      
      <!-- 中心点 -->
      <div class="center-dot"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const hourHandStyle = ref({})
const minuteHandStyle = ref({})
const secondHandStyle = ref({})

const updateClock = () => {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  
  // 计算指针角度
  const secondDegrees = (seconds / 60) * 360
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360
  const hourDegrees = ((hours % 12 + minutes / 60) / 12) * 360
  
  // 更新指针样式
  secondHandStyle.value = {
    transform: `rotate(${secondDegrees}deg)`
  }
  minuteHandStyle.value = {
    transform: `rotate(${minuteDegrees}deg)`
  }
  hourHandStyle.value = {
    transform: `rotate(${hourDegrees}deg)`
  }
}

// 获取时钟刻度的样式
const getHourMarkStyle = (hour) => {
  const degrees = (hour * 30) // 360度/12小时 = 30度/小时
  return {
    transform: `rotate(${degrees}deg)`
  }
}

// 获取数字样式
const getNumberStyle = (hour) => {
  const degrees = hour * 30 // 360度/12小时 = 30度/小时
  const radius = 28 // 进一步减小半径
  // 调整角度计算，使12点位于顶部
  const radian = (degrees - 90) * (Math.PI / 180)
  const x = Math.cos(radian) * radius
  const y = Math.sin(radian) * radius
  
  return {
    transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`
  }
}

let timer = null

onMounted(() => {
  updateClock()
  timer = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style lang="scss" scoped>
.clock {
  position: relative;
  display: inline-block;
  width: 100px;
  height: 100px;
  margin-left: 20px;
  vertical-align: middle;
  
  .clock-face {
    position: relative;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    
    &:hover {
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    }

    // 时钟刻度
    .hour-mark {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      
      .mark {
        position: absolute;
        width: 1.5px;    // 减小刻度宽度
        height: 6px;     // 减小刻度长度
        background: #999;
        left: calc(50% - 0.75px);
        top: 6px;        // 调整刻度位置
      }
    }

    // 时钟数字
    .number {
      position: absolute;
      width: 16px;       // 减小数字容器尺寸
      height: 16px;
      left: 50%;
      top: 50%;
      font-size: 11px;   // 减小字体大小
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      user-select: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    // 时钟指针
    .hand {
      position: absolute;
      bottom: 50%;
      left: 50%;
      transform-origin: 50% 100%;
      border-radius: 4px;
      
      &.hour-hand {
        width: 3px;      // 减小时针宽度
        height: 25%;     // 减小时针长度
        background: #333;
        margin-left: -1.5px;
      }
      
      &.minute-hand {
        width: 2px;      // 减小分针宽度
        height: 35%;     // 减小分针长度
        background: #555;
        margin-left: -1px;
      }
      
      &.second-hand {
        width: 1.5px;    // 减小秒针宽度
        height: 40%;     // 减小秒针长度
        background: #f44336;
        margin-left: -0.75px;
        
        &::after {
          content: '';
          position: absolute;
          width: 4px;    // 减小秒针顶部圆点
          height: 4px;
          background: #f44336;
          border-radius: 50%;
          top: -2px;
          left: -1.25px;
        }
      }
    }

    // 中心点样式优化
    .center-dot {
      position: absolute;
      width: 6px;       // 减小中心点
      height: 6px;
      background: #f44336;
      border: 1.5px solid #fff;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
  }
}
</style> 