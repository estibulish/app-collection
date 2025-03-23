<template>
  <div class="css-effects-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>CSS 效果合集</h1>
        <p class="tool-desc">常用 CSS 效果展示和代码片段</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="css-effects" />
      </div>
    </div>

    <div class="effects-container">
      <!-- 效果分类标签 -->
      <div class="effect-tags">
        <button 
          v-for="tag in tags" 
          :key="tag.id"
          :class="['tag-btn', { active: currentTag === tag.id }]"
          @click="currentTag = tag.id"
        >
          {{ tag.name }}
        </button>
      </div>

      <!-- 效果展示区域 -->
      <div class="effects-grid">
        <div 
          v-for="effect in filteredEffects" 
          :key="effect.id"
          class="effect-card"
        >
          <div class="effect-preview">
            <!-- 对于特殊效果，使用特殊的模板 -->
            <template v-if="effect.id === 'loading-dots'">
              <div :class="effect.className">
                <span>●</span>
                <span>●</span>
                <span>●</span>
              </div>
            </template>
            <!-- 魔法书翻页效果 -->
            <template v-else-if="effect.id === 'magic-book'">
              <div :class="effect.className">
                <div class="book-container">
                  <div class="book">
                    <div class="book-cover">
                      <div class="book-title">魔法书</div>
                      <div class="book-effect"></div>
                    </div>
                    <div class="pages">
                      <div class="page"></div>
                      <div class="page"></div>
                      <div class="page"></div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- 书本翻页效果 -->
            <template v-else-if="effect.id === 'book-page'">
              <div :class="effect.className">
                <div class="book">
                  <div class="cover">
                    <div class="front">
                      <h2>封面</h2>
                    </div>
                    <div class="back">
                      <h2>背面</h2>
                    </div>
                  </div>
                  <div class="page-wrapper">
                    <div class="page">
                      <div class="front">第一页</div>
                      <div class="back">第二页</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- 其他效果保持原样 -->
            <template v-else>
              <div :class="effect.className">
                {{ effect.previewText }}
              </div>
            </template>
          </div>
          <div class="effect-info">
            <h3>{{ effect.name }}</h3>
            <p>{{ effect.description }}</p>
            <div class="effect-actions">
              <button class="code-btn" @click="showCode(effect)">
                查看代码
              </button>
              <button class="copy-btn" @click="copyCode(effect)">
                复制代码
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 代码查看弹窗 -->
    <div v-if="showCodeDialog" class="code-dialog">
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>{{ currentEffect?.name }}</h3>
          <button class="close-btn" @click="showCodeDialog = false">×</button>
        </div>
        <div class="code-preview">
          <pre><code>{{ currentEffect?.code }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

// 效果分类
const tags = [
  { id: 'all', name: '全部' },
  { id: 'button', name: '按钮' },
  { id: 'loading', name: '加载' },
  { id: 'hover', name: '悬浮' },
  { id: 'text', name: '文字' },
  { id: 'card', name: '卡片' }
]

// 当前选中的分类
const currentTag = ref('all')
const showCodeDialog = ref(false)
const currentEffect = ref(null)

// CSS 效果列表
const effects = [
  {
    id: 'gradient-btn',
    name: '渐变按钮',
    description: '带有动态渐变背景的按钮效果',
    tags: ['button', 'hover'],
    className: 'gradient-btn',
    previewText: '渐变按钮',
    code: `// HTML
<button class="gradient-btn">渐变按钮</button>

// CSS
.gradient-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  background: linear-gradient(45deg, #12c2e9, #c471ed, #f64f59);
  background-size: 200% 200%;
  animation: gradient 5s ease infinite;
  cursor: pointer;
  transition: transform 0.2s;
}

.gradient-btn:hover {
  transform: translateY(-2px);
}

@keyframes gradient {
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
}`
  },
  {
    id: 'neon-text',
    name: '霓虹文字',
    description: '带有霓虹发光效果的文字',
    tags: ['text', 'hover'],
    className: 'neon-text',
    previewText: '霓虹文字',
    code: `// HTML
<div class="neon-text">霓虹文字</div>

// CSS
.neon-text {
  color: #fff;
  text-shadow: 0 0 7px #fff,
    0 0 10px #fff,
    0 0 21px #fff,
    0 0 42px #0fa,
    0 0 82px #0fa,
    0 0 92px #0fa,
    0 0 102px #0fa,
    0 0 151px #0fa;
  animation: flicker 1.5s infinite alternate;
  font-size: 24px;
}

@keyframes flicker {
  0%, 18%, 22%, 25%, 53%, 57%, 100% {
    text-shadow: 0 0 7px #fff,
      0 0 10px #fff,
      0 0 21px #fff,
      0 0 42px #0fa,
      0 0 82px #0fa,
      0 0 92px #0fa,
      0 0 102px #0fa,
      0 0 151px #0fa;
  }
  20%, 24%, 55% {
    text-shadow: none;
  }
}`
  },
  {
    id: 'loading-dots',
    name: '加载动画',
    description: '三点加载动画效果',
    tags: ['loading'],
    className: 'loading-dots',
    previewText: '●●●',
    code: `// HTML
<div class="loading-dots">
  <span>●</span>
  <span>●</span>
  <span>●</span>
</div>

// CSS
.loading-dots {
  color: #333;
  font-size: 24px;
  display: flex;
  gap: 8px;
}

.loading-dots span {
  display: inline-block;
  animation: bounce 1s infinite;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}`
  },
  {
    id: 'hover-card',
    name: '悬浮卡片',
    description: '带有3D悬浮效果的卡片',
    tags: ['card', 'hover'],
    className: 'hover-card',
    previewText: '悬浮卡片',
    code: `// HTML
<div class="hover-card">悬浮卡片</div>

// CSS
.hover-card {
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.hover-card:hover {
  transform: translateY(-10px) rotateX(5deg);
  box-shadow: 0 20px 30px rgba(0,0,0,0.15);
}`
  },
  {
    id: 'ripple-btn',
    name: '波纹按钮',
    description: '点击产生水波纹效果的按钮',
    tags: ['button'],
    className: 'ripple-btn',
    previewText: '点击我',
    code: `// HTML
<button class="ripple-btn">点击我</button>

// CSS
.ripple-btn {
  position: relative;
  padding: 12px 24px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: background 0.3s;
}

.ripple-btn::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 0.6s linear;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}`
  },
  {
    id: 'typing-text',
    name: '打字机效果',
    description: '模拟打字机输入的文字效果',
    tags: ['text'],
    className: 'typing-text',
    previewText: '这是打字机效果',
    code: `// HTML
<div class="typing-text">这是打字机效果</div>

// CSS
.typing-text {
  width: fit-content;
  border-right: 2px solid;
  white-space: nowrap;
  overflow: hidden;
  animation: typing 3s steps(14), blink 0.5s step-end infinite alternate;
}

@keyframes typing {
  from { width: 0 }
}

@keyframes blink {
  50% { border-color: transparent }
}`
  },
  {
    id: 'pulse-circle',
    name: '脉冲圆圈',
    description: '不断扩散的脉冲动画效果',
    tags: ['loading'],
    className: 'pulse-circle',
    previewText: '●',
    code: `// HTML
<div class="pulse-circle"></div>

// CSS
.pulse-circle {
  width: 20px;
  height: 20px;
  background: #4CAF50;
  border-radius: 50%;
  position: relative;
}

.pulse-circle::before,
.pulse-circle::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #4CAF50;
  animation: pulse 2s linear infinite;
}

.pulse-circle::after {
  animation-delay: 1s;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}`
  },
  {
    id: 'flip-card',
    name: '翻转卡片',
    description: '悬浮时实现3D翻转效果',
    tags: ['card', 'hover'],
    className: 'flip-card',
    previewText: '翻转卡片',
    code: `// HTML
<div class="flip-card">翻转卡片</div>

// CSS
.flip-card {
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.6s;
  transform-style: preserve-3d;
  cursor: pointer;
}

.flip-card:hover {
  transform: rotateY(180deg);
}`
  },
  {
    id: 'glowing-btn',
    name: '发光按钮',
    description: '带有霓虹发光效果的按钮',
    tags: ['button', 'hover'],
    className: 'glowing-btn',
    previewText: '发光按钮',
    code: `// HTML
<button class="glowing-btn">发光按钮</button>

// CSS
.glowing-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background: #1e9bff;
  color: white;
  cursor: pointer;
  position: relative;
  z-index: 0;
  overflow: hidden;
}

.glowing-btn:before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  background: linear-gradient(45deg,
    #ff0000,#ff7300,#fffb00,#48ff00,
    #00ffd5,#002bff,#7a00ff,#ff00c8,#ff0000
  );
  background-size: 400%;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  z-index: -1;
  animation: glowing 20s linear infinite;
}

@keyframes glowing {
  0% { background-position: 0 0; }
  50% { background-position: 400% 0; }
  100% { background-position: 0 0; }
}`
  },
  {
    id: 'shake-text',
    name: '抖动文字',
    description: '鼠标悬浮时的文字抖动效果',
    tags: ['text', 'hover'],
    className: 'shake-text',
    previewText: '抖动文字',
    code: `// HTML
<div class="shake-text">抖动文字</div>

// CSS
.shake-text {
  font-size: 24px;
  color: #333;
  cursor: pointer;
  display: inline-block;
}

.shake-text:hover {
  animation: shake 0.5s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px) rotate(-5deg); }
  75% { transform: translateX(5px) rotate(5deg); }
}`
  },
  {
    id: 'progress-bar',
    name: '进度条',
    description: '带有动画效果的进度条',
    tags: ['loading'],
    className: 'progress-bar',
    previewText: '',
    code: `// HTML
<div class="progress-bar"></div>

// CSS
.progress-bar {
  width: 200px;
  height: 6px;
  background: #ddd;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 40%;
  height: 100%;
  background: linear-gradient(90deg, #4cd964, #5ac8fa);
  animation: progress 2s ease infinite;
}

@keyframes progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(250%); }
}`
  },
  {
    id: 'floating-card',
    name: '漂浮卡片',
    description: '具有漂浮动画效果的卡片',
    tags: ['card'],
    className: 'floating-card',
    previewText: '漂浮卡片',
    code: `// HTML
<div class="floating-card">漂浮卡片</div>

// CSS
.floating-card {
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  animation: floating 3s ease-in-out infinite;
}

@keyframes floating {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}`
  },
  {
    id: 'book-page',
    name: '书本翻页',
    description: '逼真的3D书本翻页效果',
    tags: ['card', 'hover'],
    className: 'book-page',
    previewText: '翻页效果',
    code: `// HTML
<div class="book-page">
  <div class="book">
    <div class="cover">
      <div class="front">
        <h2>封面</h2>
      </div>
      <div class="back">
        <h2>背面</h2>
      </div>
    </div>
    <div class="page-wrapper">
      <div class="page">
        <div class="front">第一页</div>
        <div class="back">第二页</div>
      </div>
    </div>
  </div>
</div>

// CSS
.book-page {
  perspective: 2000px;
  width: 200px;
  height: 280px;
}

.book {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: rotateY(-30deg);
  transition: transform 1s;
}

.book:hover {
  transform: rotateY(0);
  
  .cover {
    transform: rotateY(-145deg);
  }
  
  .page-wrapper .page {
    transform: rotateY(-145deg);
  }
}

.cover, .page {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-origin: left;
  transition: transform 1.5s;
  transform-style: preserve-3d;
  background: white;
  border-radius: 4px;
}

.cover {
  z-index: 2;
  background: #2196F3;
  
  .front, .back {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
  }
  
  .back {
    transform: rotateY(180deg);
    background: #1976D2;
    border-left: 3px solid #0D47A1;
  }
}

.page-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1;
  
  .page {
    background: #fff;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    
    .front, .back {
      position: absolute;
      width: 100%;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      backface-visibility: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .back {
      transform: rotateY(180deg);
      background: #f8f8f8;
      border-left: 3px solid #ddd;
    }
  }
}
}`
  },
  {
    id: 'magic-book',
    name: '魔法书翻页',
    description: '带有魔法效果的3D书籍翻页动画',
    tags: ['card', 'hover'],
    className: 'magic-book',
    previewText: '',
    code: `// HTML
<div class="magic-book">
  <div class="book-container">
    <div class="book">
      <div class="book-cover">
        <div class="book-title">魔法书</div>
        <div class="book-effect"></div>
      </div>
      <div class="pages">
        <div class="page"></div>
        <div class="page"></div>
        <div class="page"></div>
      </div>
    </div>
  </div>
</div>

// CSS
.magic-book {
  perspective: 1000px;
  width: 200px;
  height: 280px;
}

.book-container {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: float 3s ease-in-out infinite;
}

.book {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: rotateY(-30deg);
}

.book-cover {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #1a237e, #3949ab);
  border-radius: 2px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: left;
  transition: transform 1s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.book-title {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.book-effect {
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  animation: shine 2s linear infinite;
}

.pages {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.page {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fff;
  transform-origin: left;
  transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
  border-radius: 1px;

  &:nth-child(1) { transform: rotateY(0deg); }
  &:nth-child(2) { transform: rotateY(0deg); }
  &:nth-child(3) { transform: rotateY(0deg); }
}

.magic-book:hover {
  .book-cover {
    transform: rotateY(-120deg);
    box-shadow: 0 0 50px rgba(63, 81, 181, 0.4);
  }
  
  .page:nth-child(1) { transform: rotateY(-30deg); }
  .page:nth-child(2) { transform: rotateY(-60deg); }
  .page:nth-child(3) { transform: rotateY(-90deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotateX(10deg); }
  50% { transform: translateY(-10px) rotateX(15deg); }
}

@keyframes shine {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}`
  }
]

// 根据标签筛选效果
const filteredEffects = computed(() => {
  if (currentTag.value === 'all') {
    return effects
  }
  return effects.filter(effect => effect.tags.includes(currentTag.value))
})

// 显示代码
const showCode = (effect) => {
  currentEffect.value = effect
  showCodeDialog.value = true
}

// 复制代码
const copyCode = async (effect) => {
  try {
    await navigator.clipboard.writeText(effect.code)
    // 可以添加复制成功的提示
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style lang="scss" scoped>
.css-effects-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.effects-container {
  margin-top: 2rem;
}

.effect-tags {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  .tag-btn {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 20px;
    background: none;
    color: var(--text-secondary);
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
}

.effects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.effect-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .effect-preview {
    padding: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-main);
    min-height: 150px;
  }

  .effect-info {
    padding: 1.5rem;

    h3 {
      margin: 0 0 0.5rem;
      font-size: 1.25rem;
      color: var(--text-primary);
    }

    p {
      margin: 0 0 1rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .effect-actions {
      display: flex;
      gap: 1rem;

      button {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: none;
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        &.code-btn {
          background: var(--primary);
          border-color: var(--primary);
          color: white;

          &:hover {
            background: var(--primary-dark);
          }
        }
      }
    }
  }
}

.code-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .dialog-content {
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    background: var(--bg-card);
    border-radius: 12px;
    overflow: hidden;
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);

    h3 {
      margin: 0;
      font-size: 1.25rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--text-secondary);
      cursor: pointer;

      &:hover {
        color: var(--text-primary);
      }
    }
  }

  .code-preview {
    padding: 1.5rem;
    overflow-x: auto;

    pre {
      margin: 0;
      padding: 1rem;
      background: var(--bg-main);
      border-radius: 8px;
      font-family: monospace;
      font-size: 0.875rem;
      line-height: 1.5;
    }
  }
}

@media (max-width: 768px) {
  .effects-grid {
    grid-template-columns: 1fr;
  }

  .effect-card .effect-preview {
    min-height: 120px;
  }
}

// 效果样式
.gradient-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  background: linear-gradient(45deg, #12c2e9, #c471ed, #f64f59);
  background-size: 200% 200%;
  animation: gradient 5s ease infinite;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
}

@keyframes gradient {
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
}

.neon-text {
  color: #fff;
  text-shadow: 0 0 7px #fff,
    0 0 10px #fff,
    0 0 21px #fff,
    0 0 42px #0fa,
    0 0 82px #0fa,
    0 0 92px #0fa,
    0 0 102px #0fa,
    0 0 151px #0fa;
  animation: flicker 1.5s infinite alternate;
  font-size: 24px;
}

@keyframes flicker {
  0%, 18%, 22%, 25%, 53%, 57%, 100% {
    text-shadow: 0 0 7px #fff,
      0 0 10px #fff,
      0 0 21px #fff,
      0 0 42px #0fa,
      0 0 82px #0fa,
      0 0 92px #0fa,
      0 0 102px #0fa,
      0 0 151px #0fa;
  }
  20%, 24%, 55% {
    text-shadow: none;
  }
}

.loading-dots {
  color: #333;
  font-size: 24px;
  display: flex;
  gap: 8px;

  span {
    display: inline-block;
    animation: bounce 1s infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.hover-card {
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px) rotateX(5deg);
    box-shadow: 0 20px 30px rgba(0,0,0,0.15);
  }
}

// 调整预览区域样式
.effect-preview {
  background: var(--bg-main);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border-radius: 8px 8px 0 0;
  min-height: 150px;
  position: relative;
  overflow: hidden;

  // 添加网格背景
  background-image: linear-gradient(45deg, var(--border-color) 25%, transparent 25%),
    linear-gradient(-45deg, var(--border-color) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--border-color) 75%),
    linear-gradient(-45deg, transparent 75%, var(--border-color) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

// 新增效果的样式
.ripple-btn {
  position: relative;
  padding: 12px 24px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #1976D2;
  }

  &:active::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    animation: ripple 0.6s linear;
  }
}

@keyframes ripple {
  to {
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
  }
}

.typing-text {
  width: fit-content;
  border-right: 2px solid;
  white-space: nowrap;
  overflow: hidden;
  animation: typing 3s steps(14), blink 0.5s step-end infinite alternate;
}

@keyframes typing {
  from { width: 0 }
}

@keyframes blink {
  50% { border-color: transparent }
}

.pulse-circle {
  width: 20px;
  height: 20px;
  background: #4CAF50;
  border-radius: 50%;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: #4CAF50;
    animation: pulse 2s linear infinite;
  }

  &::after {
    animation-delay: 1s;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

.flip-card {
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.6s;
  transform-style: preserve-3d;
  cursor: pointer;

  &:hover {
    transform: rotateY(180deg);
  }
}

// 新增效果样式
.glowing-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background: #1e9bff;
  color: white;
  cursor: pointer;
  position: relative;
  z-index: 0;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    background: linear-gradient(45deg,
      #ff0000,#ff7300,#fffb00,#48ff00,
      #00ffd5,#002bff,#7a00ff,#ff00c8,#ff0000
    );
    background-size: 400%;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    z-index: -1;
    animation: glowing 20s linear infinite;
  }
}

@keyframes glowing {
  0% { background-position: 0 0; }
  50% { background-position: 400% 0; }
  100% { background-position: 0 0; }
}

.shake-text {
  font-size: 24px;
  color: #333;
  cursor: pointer;
  display: inline-block;

  &:hover {
    animation: shake 0.5s ease-in-out infinite;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px) rotate(-5deg); }
  75% { transform: translateX(5px) rotate(5deg); }
}

.progress-bar {
  width: 200px;
  height: 6px;
  background: #ddd;
  border-radius: 3px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 40%;
    height: 100%;
    background: linear-gradient(90deg, #4cd964, #5ac8fa);
    animation: progress 2s ease infinite;
  }
}

@keyframes progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(250%); }
}

.floating-card {
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  animation: floating 3s ease-in-out infinite;
}

@keyframes floating {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

// 书本翻页效果
.book-page {
  perspective: 2000px;
  width: 200px;
  height: 280px;

  .book {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transform: rotateY(-30deg);
    transition: transform 1s;
  }

  .book:hover {
    transform: rotateY(0);
    
    .cover {
      transform: rotateY(-145deg);
    }
    
    .page-wrapper .page {
      transform: rotateY(-145deg);
    }
  }

  .cover, .page {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-origin: left;
    transition: transform 1.5s;
    transform-style: preserve-3d;
    background: white;
    border-radius: 4px;
  }

  .cover {
    z-index: 2;
    background: #2196F3;
    
    .front, .back {
      position: absolute;
      width: 100%;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      backface-visibility: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
    
    .back {
      transform: rotateY(180deg);
      background: #1976D2;
      border-left: 3px solid #0D47A1;
    }
  }

  .page-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1;
    
    .page {
      background: #fff;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      
      .front, .back {
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        backface-visibility: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .back {
        transform: rotateY(180deg);
        background: #f8f8f8;
        border-left: 3px solid #ddd;
      }
    }
  }
}

// 魔法书效果
.magic-book {
  perspective: 1000px;
  width: 200px;
  height: 280px;

  .book-container {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    animation: float 3s ease-in-out infinite;
  }

  .book {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transform: rotateY(-30deg);
  }

  .book-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #1a237e, #3949ab);
    border-radius: 2px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    transform-origin: left;
    transition: transform 1s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  .book-title {
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }

  .book-effect {
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.1) 50%,
      transparent 100%
    );
    animation: shine 2s linear infinite;
  }

  .pages {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
  }

  .page {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fff;
    transform-origin: left;
    transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
    border-radius: 1px;

    &:nth-child(1) { transform: rotateY(0deg); }
    &:nth-child(2) { transform: rotateY(0deg); }
    &:nth-child(3) { transform: rotateY(0deg); }
  }

  &:hover {
    .book-cover {
      transform: rotateY(-120deg);
      box-shadow: 0 0 50px rgba(63, 81, 181, 0.4);
    }
    
    .page:nth-child(1) { transform: rotateY(-30deg); }
    .page:nth-child(2) { transform: rotateY(-60deg); }
    .page:nth-child(3) { transform: rotateY(-90deg); }
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotateX(10deg); }
  50% { transform: translateY(-10px) rotateX(15deg); }
}

@keyframes shine {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}
</style> 