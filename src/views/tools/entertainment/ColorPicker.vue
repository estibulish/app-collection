<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// 选项卡配置
const pickerTabs = [
  { id: 'rgb', name: 'RGB' },
  { id: 'hsl', name: 'HSL' },
  { id: 'hex', name: 'HEX' }
]

// 当前选项卡
const currentTab = ref('rgb')

// 颜色值
const rgb = reactive({ r: 0, g: 0, b: 0 })
const hsl = reactive({ h: 0, s: 0, l: 0 })
const hexColor = ref('000000')
const currentColor = ref('#000000')

// 保存的颜色
const savedColors = ref(JSON.parse(localStorage.getItem('savedColors') || '[]'))

// 调和色计算
const harmonicColors = computed(() => {
  const { h, s, l } = hsl
  return [
    getHslColor(h, s, l), // 原色
    getHslColor((h + 30) % 360, s, l), // 邻近色
    getHslColor((h + 60) % 360, s, l),
    getHslColor((h + 180) % 360, s, l), // 补色
    getHslColor((h + 150) % 360, s, l),
    getHslColor((h + 210) % 360, s, l),
  ]
})

// 类比色计算
const analogousColors = computed(() => {
  const { h, s, l } = hsl
  return [
    getHslColor((h - 30 + 360) % 360, s, l),
    getHslColor((h - 15 + 360) % 360, s, l),
    getHslColor(h, s, l),
    getHslColor((h + 15) % 360, s, l),
    getHslColor((h + 30) % 360, s, l),
  ]
})

// 三分色计算
const triadicColors = computed(() => {
  const { h, s, l } = hsl
  return [
    getHslColor(h, s, l),
    getHslColor((h + 120) % 360, s, l),
    getHslColor((h + 240) % 360, s, l),
  ]
})

// 从 RGB 更新
const updateFromRgb = () => {
  // 限制范围
  rgb.r = clamp(rgb.r, 0, 255)
  rgb.g = clamp(rgb.g, 0, 255)
  rgb.b = clamp(rgb.b, 0, 255)
  
  // 更新 HEX
  hexColor.value = rgbToHex(rgb.r, rgb.g, rgb.b)
  
  // 更新 HSL
  const newHsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  hsl.h = newHsl.h
  hsl.s = newHsl.s
  hsl.l = newHsl.l
  
  // 更新当前颜色
  currentColor.value = `#${hexColor.value}`
}

// 从 HSL 更新
const updateFromHsl = () => {
  // 限制范围
  hsl.h = clamp(hsl.h, 0, 360)
  hsl.s = clamp(hsl.s, 0, 100)
  hsl.l = clamp(hsl.l, 0, 100)
  
  // 更新 RGB
  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l)
  rgb.r = newRgb.r
  rgb.g = newRgb.g
  rgb.b = newRgb.b
  
  // 更新 HEX
  hexColor.value = rgbToHex(rgb.r, rgb.g, rgb.b)
  
  // 更新当前颜色
  currentColor.value = `#${hexColor.value}`
}

// 从 HEX 更新
const updateFromHex = () => {
  // 验证 HEX 格式
  const hexRegex = /^[0-9A-Fa-f]{6}$/
  if (!hexRegex.test(hexColor.value)) return
  
  // 更新 RGB
  const newRgb = hexToRgb(hexColor.value)
  rgb.r = newRgb.r
  rgb.g = newRgb.g
  rgb.b = newRgb.b
  
  // 更新 HSL
  const newHsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  hsl.h = newHsl.h
  hsl.s = newHsl.s
  hsl.l = newHsl.l
  
  // 更新当前颜色
  currentColor.value = `#${hexColor.value}`
}

// 保存当前颜色
const saveCurrentColor = () => {
  if (!savedColors.value.includes(currentColor.value)) {
    savedColors.value.push(currentColor.value)
    localStorage.setItem('savedColors', JSON.stringify(savedColors.value))
  }
}

// 选择保存的颜色
const selectSavedColor = (color) => {
  currentColor.value = color
  hexColor.value = color.substring(1)
  updateFromHex()
}

// 移除保存的颜色
const removeSavedColor = (index) => {
  savedColors.value.splice(index, 1)
  localStorage.setItem('savedColors', JSON.stringify(savedColors.value))
}

// 复制到剪贴板
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      alert(`已复制: ${text}`)
    })
    .catch(err => {
      console.error('复制失败:', err)
    })
}

// 辅助函数
const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}

// RGB 转 HEX
const rgbToHex = (r, g, b) => {
  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

// HEX 转 RGB
const hexToRgb = (hex) => {
  const bigint = parseInt(hex, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  }
}

// RGB 转 HSL
const rgbToHsl = (r, g, b) => {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    
    h /= 6
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

// HSL 转 RGB
const hslToRgb = (h, s, l) => {
  h /= 360
  s /= 100
  l /= 100
  
  let r, g, b
  
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

// 获取 HSL 颜色字符串
const getHslColor = (h, s, l) => {
  return `hsl(${h}, ${s}%, ${l}%)`
}
</script> 