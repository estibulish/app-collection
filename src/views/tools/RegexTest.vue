<template>
  <div class="regex-test">
    <div class="tool-header">
      <h1>正则表达式测试工具</h1>
      <p class="tool-desc">在线正则表达式测试工具，支持实时匹配、替换和常用正则模式</p>
      <div class="tool-actions">
        <FavoriteButton tool-id="regex-test" />
      </div>
    </div>

    <div class="editor-container">
      <div class="pattern-section">
        <div class="input-group">
          <label>正则表达式</label>
          <div class="pattern-input">
            <span class="pattern-delimiter">/</span>
            <input
              v-model="pattern"
              type="text"
              placeholder="输入正则表达式..."
              @input="handleTest"
            >
            <span class="pattern-delimiter">/</span>
            <input
              v-model="flags"
              type="text"
              class="flags-input"
              placeholder="flags"
              @input="handleTest"
            >
          </div>
        </div>

        <div class="quick-patterns">
          <button 
            v-for="item in commonPatterns" 
            :key="item.name"
            class="pattern-btn"
            @click="applyPattern(item)"
          >
            {{ item.name }}
          </button>
        </div>
      </div>

      <div class="test-section">
        <div class="input-group">
          <label>测试文本</label>
          <textarea
            v-model="testText"
            class="test-input"
            placeholder="输入要测试的文本..."
            @input="handleTest"
          ></textarea>
        </div>

        <div class="replace-section" v-if="mode === 'replace'">
          <div class="input-group">
            <label>替换为</label>
            <input
              v-model="replacement"
              type="text"
              placeholder="输入替换文本..."
              @input="handleTest"
            >
          </div>
        </div>
      </div>

      <div class="result-section">
        <div class="result-header">
          <div class="mode-switch">
            <button 
              class="mode-btn"
              :class="{ active: mode === 'match' }"
              @click="mode = 'match'"
            >
              匹配模式
            </button>
            <button 
              class="mode-btn"
              :class="{ active: mode === 'replace' }"
              @click="mode = 'replace'"
            >
              替换模式
            </button>
          </div>
          <div class="result-info" v-if="matches.length">
            找到 {{ matches.length }} 个匹配
          </div>
        </div>

        <div v-if="mode === 'match'" class="matches-list">
          <div 
            v-for="(match, index) in matches" 
            :key="index"
            class="match-item"
          >
            <div class="match-index">#{{ index + 1 }}</div>
            <div class="match-content">
              <div class="match-text">{{ match[0] }}</div>
              <div class="match-groups" v-if="match.length > 1">
                <div 
                  v-for="(group, groupIndex) in match.slice(1)" 
                  :key="groupIndex"
                  class="group-item"
                >
                  <span class="group-label">Group {{ groupIndex + 1 }}:</span>
                  <span class="group-value">{{ group }}</span>
                </div>
              </div>
              <div class="match-info">
                <span>位置: {{ match.index }}</span>
                <span>长度: {{ match[0].length }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="replace-result">
          <div class="result-header">
            <span>替换结果</span>
            <button 
              class="copy-btn"
              @click="copyResult"
              v-if="replacedText"
            >
              复制
            </button>
          </div>
          <div class="result-content">
            {{ replacedText || '无替换结果' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useFavoriteStore } from '../../stores/favorite'
import FavoriteButton from '../../components/FavoriteButton.vue'
import { getTool } from '../../config/tools'

const tool = getTool('regex-test')
const favoriteStore = useFavoriteStore()

const mode = ref('match')
const pattern = ref('')
const flags = ref('g')
const testText = ref('')
const replacement = ref('')
const matches = ref([])
const replacedText = ref('')

// 常用正则模式
const commonPatterns = [
  {
    name: '邮箱',
    pattern: '[\\w-]+@[\\w-]+\\.[\\w-]+',
    flags: 'g'
  },
  {
    name: '手机号',
    pattern: '1[3-9]\\d{9}',
    flags: 'g'
  },
  {
    name: 'URL',
    pattern: 'https?://[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?',
    flags: 'g'
  },
  {
    name: '日期',
    pattern: '\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])',
    flags: 'g'
  },
  {
    name: 'IP地址',
    pattern: '((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})(\\.((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})){3}',
    flags: 'g'
  }
]

// 应用预设模式
const applyPattern = (item) => {
  pattern.value = item.pattern
  flags.value = item.flags
  handleTest()
}

// 执行测试
const handleTest = () => {
  if (!pattern.value || !testText.value) {
    matches.value = []
    replacedText.value = ''
    return
  }

  try {
    const regex = new RegExp(pattern.value, flags.value)
    
    if (mode.value === 'match') {
      const results = []
      let match
      
      while ((match = regex.exec(testText.value)) !== null) {
        // 如果没有全局标志，防止无限循环
        if (!regex.global) break
        results.push(match)
      }
      
      matches.value = results
    } else {
      replacedText.value = testText.value.replace(regex, replacement.value)
    }
  } catch (error) {
    console.error('正则表达式错误:', error)
  }
}

// 复制替换结果
const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(replacedText.value)
    alert('已复制到剪贴板')
  } catch (error) {
    alert('复制失败')
  }
}

// 监听模式切换
watch(mode, handleTest)

// 更新最后使用时间
favoriteStore.updateLastUsed(tool.id)
</script>

<style lang="scss" scoped>
.regex-test {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.tool-header {
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .tool-desc {
    color: var(--text-secondary);
  }
}

.editor-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
}

.pattern-input {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.5rem;
  
  input {
    flex: 1;
    border: none;
    background: none;
    color: var(--text-primary);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    
    &:focus {
      outline: none;
    }
  }
  
  .pattern-delimiter {
    color: var(--text-secondary);
    padding: 0 0.5rem;
  }
  
  .flags-input {
    width: 60px;
    text-align: center;
  }
}

.quick-patterns {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.pattern-btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
}

.test-input {
  min-height: 150px;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
}

.result-section {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
}

.mode-switch {
  display: flex;
  gap: 0.5rem;
}

.mode-btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: none;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
  
  &.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }
}

.matches-list {
  padding: 1rem;
}

.match-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.match-index {
  padding: 0.25rem 0.5rem;
  background: var(--primary-50);
  color: var(--primary);
  border-radius: 4px;
  font-size: 0.875rem;
  height: fit-content;
}

.match-content {
  flex: 1;
}

.match-text {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  padding: 0.5rem;
  background: var(--bg-hover);
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.match-groups {
  margin-bottom: 0.5rem;
}

.group-item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
  padding: 0.25rem 0;
  
  .group-label {
    color: var(--text-secondary);
  }
}

.match-info {
  display: flex;
  gap: 1rem;
  color: var(--text-tertiary);
  font-size: 0.75rem;
}

.replace-result {
  padding: 1rem;
  
  .result-content {
    padding: 1rem;
    background: var(--bg-card);
    border-radius: 6px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    white-space: pre-wrap;
  }
}

.copy-btn {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: none;
  color: var(--text-secondary);
  font-size: 0.75rem;
  cursor: pointer;
  
  &:hover {
    border-color: var(--primary);
    color: var(--primary);
  }
}

@media (max-width: 768px) {
  .regex-test {
    padding: 1rem;
  }
  
  .pattern-input {
    flex-wrap: wrap;
    gap: 0.5rem;
    
    input {
      width: 100%;
    }
    
    .flags-input {
      width: 100%;
    }
  }
  
  .quick-patterns {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style> 