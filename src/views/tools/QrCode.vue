<template>
  <div class="qr-code">
    <div class="tool-header">
      <h1>二维码生成器</h1>
      <p class="tool-desc">在线生成自定义二维码，支持文本、链接、名片等多种格式</p>
    </div>

    <div class="content-container">
      <div class="input-section">
        <div class="type-selector">
          <button 
            v-for="type in contentTypes" 
            :key="type.id"
            class="type-btn"
            :class="{ active: currentType === type.id }"
            @click="setContentType(type.id)"
          >
            <span class="type-icon">{{ type.icon }}</span>
            <span class="type-name">{{ type.name }}</span>
          </button>
        </div>

        <div class="input-area">
          <template v-if="currentType === 'text'">
            <div class="input-group">
              <label>文本内容</label>
              <textarea 
                v-model="textContent"
                placeholder="请输入要生成二维码的文本内容"
                rows="4"
              ></textarea>
            </div>
          </template>

          <template v-if="currentType === 'url'">
            <div class="input-group">
              <label>网址链接</label>
              <input 
                type="url"
                v-model="urlContent"
                placeholder="请输入网址，例如：https://example.com"
              >
            </div>
          </template>

          <template v-if="currentType === 'vcard'">
            <div class="input-group">
              <label>姓名</label>
              <input 
                type="text"
                v-model="vcardContent.name"
                placeholder="请输入姓名"
              >
            </div>
            <div class="input-group">
              <label>电话</label>
              <input 
                type="tel"
                v-model="vcardContent.phone"
                placeholder="请输入电话号码"
              >
            </div>
            <div class="input-group">
              <label>邮箱</label>
              <input 
                type="email"
                v-model="vcardContent.email"
                placeholder="请输入邮箱地址"
              >
            </div>
            <div class="input-group">
              <label>公司</label>
              <input 
                type="text"
                v-model="vcardContent.company"
                placeholder="请输入公司名称"
              >
            </div>
          </template>
        </div>

        <div class="style-options">
          <h3>样式设置</h3>
          <div class="options-grid">
            <div class="option-group">
              <label>尺寸</label>
              <div class="size-selector">
                <button 
                  v-for="size in sizes"
                  :key="size.value"
                  class="size-btn"
                  :class="{ active: currentSize === size.value }"
                  @click="setSize(size.value)"
                >
                  {{ size.label }}
                </button>
              </div>
            </div>
            <div class="option-group">
              <label>前景色</label>
              <input 
                type="color"
                v-model="foregroundColor"
                class="color-picker"
              >
            </div>
            <div class="option-group">
              <label>背景色</label>
              <input 
                type="color"
                v-model="backgroundColor"
                class="color-picker"
              >
            </div>
            <div class="option-group">
              <label>容错级别</label>
              <select v-model="errorLevel">
                <option value="L">低 (7%)</option>
                <option value="M">中 (15%)</option>
                <option value="Q">高 (25%)</option>
                <option value="H">最高 (30%)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="preview-section">
        <div class="qr-preview">
          <div class="preview-container" ref="previewContainer">
            <!-- 二维码将在这里显示 -->
          </div>
          <div class="preview-actions">
            <button class="action-btn" @click="downloadPNG">
              <span class="btn-icon">💾</span>
              下载PNG
            </button>
            <button class="action-btn" @click="downloadSVG">
              <span class="btn-icon">📊</span>
              下载SVG
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="features-section">
      <h2>功能特点</h2>
      <div class="features-grid">
        <div class="feature-card">
          <span class="feature-icon">🎨</span>
          <h3>自定义样式</h3>
          <p>支持自定义二维码颜色、大小和容错级别</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">📱</span>
          <h3>多种格式</h3>
          <p>支持文本、链接、名片等多种内容格式</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">💫</span>
          <h3>高清导出</h3>
          <p>支持PNG和SVG格式的高清导出</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🔒</span>
          <h3>本地生成</h3>
          <p>所有操作在本地完成，保护隐私安全</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import QRCode from 'qrcode'

const contentTypes = [
  { id: 'text', name: '文本', icon: '📝' },
  { id: 'url', name: '网址', icon: '🔗' },
  { id: 'vcard', name: '名片', icon: '👤' }
]

const sizes = [
  { value: 128, label: '小' },
  { value: 256, label: '中' },
  { value: 512, label: '大' }
]

const currentType = ref('text')
const textContent = ref('')
const urlContent = ref('')
const vcardContent = reactive({
  name: '',
  phone: '',
  email: '',
  company: ''
})

const currentSize = ref(256)
const foregroundColor = ref('#000000')
const backgroundColor = ref('#FFFFFF')
const errorLevel = ref('M')

const previewContainer = ref(null)

const setContentType = (type) => {
  currentType.value = type
}

const setSize = (size) => {
  currentSize.value = size
}

const getContent = () => {
  switch (currentType.value) {
    case 'text':
      return textContent.value
    case 'url':
      return urlContent.value
    case 'vcard':
      return `BEGIN:VCARD
VERSION:3.0
FN:${vcardContent.name}
TEL:${vcardContent.phone}
EMAIL:${vcardContent.email}
ORG:${vcardContent.company}
END:VCARD`
    default:
      return ''
  }
}

const generateQR = async () => {
  if (!previewContainer.value) return

  const content = getContent()
  if (!content) return

  try {
    const canvas = document.createElement('canvas')
    await QRCode.toCanvas(canvas, content, {
      width: currentSize.value,
      margin: 1,
      color: {
        dark: foregroundColor.value,
        light: backgroundColor.value
      },
      errorCorrectionLevel: errorLevel.value
    })

    previewContainer.value.innerHTML = ''
    previewContainer.value.appendChild(canvas)
  } catch (err) {
    console.error('生成二维码失败:', err)
  }
}

const downloadPNG = async () => {
  const content = getContent()
  if (!content) return

  try {
    const dataUrl = await QRCode.toDataURL(content, {
      width: currentSize.value,
      margin: 1,
      color: {
        dark: foregroundColor.value,
        light: backgroundColor.value
      },
      errorCorrectionLevel: errorLevel.value
    })

    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = dataUrl
    link.click()
  } catch (err) {
    console.error('下载PNG失败:', err)
  }
}

const downloadSVG = async () => {
  const content = getContent()
  if (!content) return

  try {
    const svg = await QRCode.toString(content, {
      type: 'svg',
      width: currentSize.value,
      margin: 1,
      color: {
        dark: foregroundColor.value,
        light: backgroundColor.value
      },
      errorCorrectionLevel: errorLevel.value
    })

    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'qrcode.svg'
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('下载SVG失败:', err)
  }
}

watch(
  [
    currentType,
    textContent,
    urlContent,
    () => vcardContent.name,
    () => vcardContent.phone,
    () => vcardContent.email,
    () => vcardContent.company,
    currentSize,
    foregroundColor,
    backgroundColor,
    errorLevel
  ],
  generateQR
)
</script>

<style lang="scss" scoped>
.qr-code {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.tool-header {
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .tool-desc {
    color: var(--text-secondary);
    font-size: 1rem;
  }
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.input-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.type-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.type-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-main);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  &.active {
    background: var(--primary);
    border-color: var(--primary);
    color: white;
  }

  .type-icon {
    font-size: 1.25rem;
  }
}

.input-area {
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 500;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-main);
    color: var(--text-primary);
    font-size: 0.875rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: var(--primary);
    }

    &::placeholder {
      color: var(--text-secondary);
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
}

.style-options {
  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.option-group {
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 500;
  }

  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-main);
    color: var(--text-primary);
    font-size: 0.875rem;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: var(--primary);
    }
  }
}

.size-selector {
  display: flex;
  gap: 0.5rem;
}

.size-btn {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-main);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  &.active {
    background: var(--primary);
    border-color: var(--primary);
    color: white;
  }
}

.color-picker {
  width: 100%;
  height: 40px;
  padding: 0;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 5px;
  }
}

.preview-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.qr-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.preview-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  min-height: 300px;

  canvas {
    max-width: 100%;
    height: auto;
  }
}

.preview-actions {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-main);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  .btn-icon {
    font-size: 1.25rem;
  }
}

.features-section {
  margin-top: 3rem;
  text-align: center;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2rem;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  padding: 2rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
  }

  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    display: block;
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
  }

  p {
    color: var(--text-secondary);
    font-size: 0.875rem;
    line-height: 1.6;
  }
}

@media (max-width: 768px) {
  .qr-code {
    padding: 1.5rem 1rem;
  }

  .tool-header {
    margin-bottom: 1.5rem;

    h1 {
      font-size: 1.75rem;
    }
  }

  .type-selector {
    flex-wrap: wrap;
  }

  .type-btn {
    flex: 1;
    justify-content: center;
  }

  .preview-container {
    min-height: 250px;
  }
}

@media (max-width: 480px) {
  .tool-header h1 {
    font-size: 1.5rem;
  }

  .preview-actions {
    flex-direction: column;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }
}
</style> 