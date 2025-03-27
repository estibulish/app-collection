<template>
  <div class="name-generator-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>随机名字生成器</h1>
        <p class="tool-desc">生成随机的中英文名字，适用于各种场景</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="name-generator" />
      </div>
    </div>

    <div class="generator-container">
      <div class="settings-section">
        <div class="settings-panel">
          <div class="panel-header">
            <h3>生成设置</h3>
          </div>
          
          <div class="name-settings">
            <div class="setting-group">
              <h4>名字类型</h4>
              <div class="type-options">
                <label>
                  <input type="radio" v-model="nameType" value="chinese">
                  <span>中文名</span>
                </label>
                <label>
                  <input type="radio" v-model="nameType" value="english">
                  <span>英文名</span>
                </label>
                <label>
                  <input type="radio" v-model="nameType" value="mixed">
                  <span>中英混合</span>
                </label>
              </div>
            </div>
            
            <div class="setting-group">
              <h4>性别倾向</h4>
              <div class="gender-options">
                <label>
                  <input type="radio" v-model="gender" value="male">
                  <span>男性</span>
                </label>
                <label>
                  <input type="radio" v-model="gender" value="female">
                  <span>女性</span>
                </label>
                <label>
                  <input type="radio" v-model="gender" value="neutral">
                  <span>中性</span>
                </label>
              </div>
            </div>
            
            <div class="setting-group" v-if="nameType === 'chinese' || nameType === 'mixed'">
              <h4>中文姓氏</h4>
              <div class="surname-options">
                <label>
                  <input type="radio" v-model="surnameType" value="common">
                  <span>常见姓氏</span>
                </label>
                <label>
                  <input type="radio" v-model="surnameType" value="rare">
                  <span>生僻姓氏</span>
                </label>
                <label>
                  <input type="radio" v-model="surnameType" value="all">
                  <span>全部姓氏</span>
                </label>
              </div>
            </div>
            
            <div class="setting-group">
              <h4>生成数量</h4>
              <div class="count-setting">
                <input 
                  type="number" 
                  v-model.number="generateCount" 
                  min="1" 
                  max="50"
                >
                <span class="count-hint">（最多50个）</span>
              </div>
            </div>
          </div>
          
          <div class="generate-actions">
            <button 
              class="generate-btn" 
              @click="generateNames"
              :disabled="isGenerating"
            >
              {{ isGenerating ? '生成中...' : '生成名字' }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="result-section">
        <div class="result-panel">
          <div class="panel-header">
            <h3>生成结果</h3>
            <div class="panel-actions">
              <button 
                class="action-btn" 
                @click="copyAllNames"
                v-if="generatedNames.length > 0"
              >
                复制全部
              </button>
            </div>
          </div>
          
          <div class="name-results">
            <div v-if="generatedNames.length === 0" class="empty-result">
              <span class="empty-icon">📝</span>
              <p>点击"生成名字"按钮开始</p>
            </div>
            <div v-else class="name-list">
              <div 
                v-for="(name, index) in generatedNames" 
                :key="index"
                class="name-item"
              >
                <span class="name-text">{{ name }}</span>
                <button class="copy-btn" @click="copyName(name)">复制</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="favorites-section">
        <div class="favorites-panel">
          <div class="panel-header">
            <h3>收藏名字</h3>
            <div class="panel-actions">
              <button 
                class="action-btn" 
                @click="clearFavorites"
                v-if="favoriteNames.length > 0"
              >
                清空收藏
              </button>
            </div>
          </div>
          
          <div class="favorites-list">
            <div v-if="favoriteNames.length === 0" class="empty-favorites">
              <p>暂无收藏名字</p>
              <p class="hint">点击名字旁边的❤️收藏喜欢的名字</p>
            </div>
            <div v-else class="name-list">
              <div 
                v-for="(name, index) in favoriteNames" 
                :key="index"
                class="name-item"
              >
                <span class="name-text">{{ name }}</span>
                <div class="item-actions">
                  <button class="copy-btn" @click="copyName(name)">复制</button>
                  <button class="remove-btn" @click="removeFavorite(index)">移除</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

// 中文姓氏数据
const commonChineseSurnames = [
  '李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴',
  '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗',
  '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧',
  '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕'
]

const rareChineseSurnames = [
  '钱', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许',
  '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏',
  '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章',
  '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦'
]

// 英文名数据
const maleEnglishNames = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
  'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
  'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan',
  'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon'
]

const femaleEnglishNames = [
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
  'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle',
  'Carol', 'Amanda', 'Dorothy', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia',
  'Kathleen', 'Amy', 'Angela', 'Shirley', 'Anna', 'Brenda', 'Pamela', 'Emma', 'Nicole', 'Helen'
]

const neutralEnglishNames = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Avery', 'Quinn', 'Blake',
  'Cameron', 'Hayden', 'Dakota', 'Reese', 'Skyler', 'Finley', 'Rowan', 'River', 'Emerson', 'Phoenix',
  'Sage', 'Kai', 'Remy', 'Justice', 'Frankie', 'Shawn', 'Kendall', 'Robin', 'Eden', 'Harley'
]

// 中文名字数据
const maleChineseNameChars = [
  '伟', '强', '磊', '勇', '军', '杰', '涛', '斌', '超', '刚',
  '建', '峰', '辉', '亮', '明', '鹏', '飞', '鸿', '博', '志',
  '宇', '浩', '东', '帆', '晨', '睿', '昊', '天', '聪', '俊',
  '健', '轩', '嘉', '宏', '文', '武', '振', '辰', '翔', '旭'
]

const femaleChineseNameChars = [
  '芳', '娜', '敏', '静', '婷', '玲', '娟', '文', '琳', '雪',
  '倩', '颖', '红', '梅', '洁', '琼', '云', '莉', '霞', '香',
  '月', '莹', '艳', '珍', '凤', '兰', '秀', '荣', '华', '燕',
  '彩', '春', '菊', '珊', '萍', '嫦', '瑶', '璐', '娥', '怡'
]

const neutralChineseNameChars = [
  '佳', '雨', '子', '晴', '宁', '安', '然', '心', '琪', '瑾',
  '雯', '楠', '青', '林', '欣', '悦', '晨', '辰', '宇', '洋',
  '海', '岩', '阳', '山', '川', '景', '天', '奇', '平', '乐',
  '和', '清', '泽', '远', '朋', '鑫', '昕', '信', '忠', '义'
]

// 状态
const nameType = ref('chinese')
const gender = ref('neutral')
const surnameType = ref('common')
const generateCount = ref(10)
const isGenerating = ref(false)
const generatedNames = ref([])
const favoriteNames = ref([])

// 从本地存储加载收藏的名字
const loadFavorites = () => {
  const saved = localStorage.getItem('favoriteNames')
  if (saved) {
    try {
      favoriteNames.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load favorites:', e)
    }
  }
}

// 保存收藏的名字到本地存储
const saveFavorites = () => {
  localStorage.setItem('favoriteNames', JSON.stringify(favoriteNames.value))
}

// 初始化时加载收藏
loadFavorites()

// 生成随机中文名
const generateChineseName = () => {
  // 选择姓氏
  let surnames = commonChineseSurnames
  if (surnameType.value === 'rare') {
    surnames = rareChineseSurnames
  } else if (surnameType.value === 'all') {
    surnames = [...commonChineseSurnames, ...rareChineseSurnames]
  }
  
  const surname = surnames[Math.floor(Math.random() * surnames.length)]
  
  // 选择名字字符
  let nameChars
  if (gender.value === 'male') {
    nameChars = maleChineseNameChars
  } else if (gender.value === 'female') {
    nameChars = femaleChineseNameChars
  } else {
    nameChars = [...maleChineseNameChars, ...femaleChineseNameChars, ...neutralChineseNameChars]
  }
  
  // 随机生成1-2个字的名字
  const nameLength = Math.random() > 0.5 ? 2 : 1
  let firstName = ''
  
  for (let i = 0; i < nameLength; i++) {
    const char = nameChars[Math.floor(Math.random() * nameChars.length)]
    firstName += char
  }
  
  return surname + firstName
}

// 生成随机英文名
const generateEnglishName = () => {
  let names
  if (gender.value === 'male') {
    names = maleEnglishNames
  } else if (gender.value === 'female') {
    names = femaleEnglishNames
  } else {
    names = [...maleEnglishNames, ...femaleEnglishNames, ...neutralEnglishNames]
  }
  
  return names[Math.floor(Math.random() * names.length)]
}

// 生成中英混合名
const generateMixedName = () => {
  const chineseName = generateChineseName()
  const englishName = generateEnglishName()
  
  return `${englishName} (${chineseName})`
}

// 生成名字
const generateNames = () => {
  if (isGenerating.value) return
  
  isGenerating.value = true
  generatedNames.value = []
  
  // 模拟生成过程
  setTimeout(() => {
    const count = Math.min(Math.max(generateCount.value, 1), 50)
    
    for (let i = 0; i < count; i++) {
      let name
      
      if (nameType.value === 'chinese') {
        name = generateChineseName()
      } else if (nameType.value === 'english') {
        name = generateEnglishName()
      } else {
        name = generateMixedName()
      }
      
      generatedNames.value.push(name)
    }
    
    isGenerating.value = false
  }, 500)
}

// 复制单个名字
const copyName = (name) => {
  navigator.clipboard.writeText(name)
    .then(() => {
      alert(`已复制: ${name}`)
    })
    .catch(err => {
      console.error('复制失败:', err)
    })
}

// 复制所有名字
const copyAllNames = () => {
  const text = generatedNames.value.join('\n')
  navigator.clipboard.writeText(text)
    .then(() => {
      alert('已复制全部名字')
    })
    .catch(err => {
      console.error('复制失败:', err)
    })
}

// 添加到收藏
const addToFavorites = (name) => {
  if (!favoriteNames.value.includes(name)) {
    favoriteNames.value.push(name)
    saveFavorites()
  }
}

// 从收藏中移除
const removeFavorite = (index) => {
  favoriteNames.value.splice(index, 1)
  saveFavorites()
}

// 清空收藏
const clearFavorites = () => {
  if (confirm('确定要清空所有收藏的名字吗？')) {
    favoriteNames.value = []
    saveFavorites()
  }
}
</script>

<style lang="scss" scoped>
.name-generator-page {
  padding: 2rem;
  
  .tool-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    
    .header-content {
      h1 {
        margin: 0 0 0.5rem;
        font-size: 1.8rem;
        color: var(--text-primary);
      }
      
      .tool-desc {
        margin: 0;
        color: var(--text-secondary);
      }
    }
  }
  
  .generator-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    
    .settings-section {
      grid-column: 1;
      grid-row: 1;
    }
    
    .result-section {
      grid-column: 2;
      grid-row: 1;
    }
    
    .favorites-section {
      grid-column: 1 / span 2;
      grid-row: 2;
    }
  }
  
  .settings-panel,
  .result-panel,
  .favorites-panel {
    background: var(--bg-card);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    height: 100%;
    
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      
      h3 {
        margin: 0;
        font-size: 1.2rem;
        color: var(--text-primary);
      }
    }
  }
  
  .name-settings {
    .setting-group {
      margin-bottom: 1.5rem;
      
      h4 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
        color: var(--text-primary);
      }
      
      .type-options,
      .gender-options,
      .surname-options {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        
        label {
          display: flex;
          align-items: center;
          cursor: pointer;
          
          input {
            margin-right: 0.5rem;
          }
          
          span {
            color: var(--text-primary);
          }
        }
      }
      
      .count-setting {
        display: flex;
        align-items: center;
        
        input {
          width: 5rem;
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background: var(--bg-input);
          color: var(--text-primary);
        }
        
        .count-hint {
          margin-left: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
      }
    }
  }
  
  .generate-actions {
    margin-top: 2rem;
    
    .generate-btn {
      width: 100%;
      padding: 0.75rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
      
      &:hover {
        background: var(--primary-dark);
      }
      
      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
  }
  
  .name-results,
  .favorites-list {
    .empty-result,
    .empty-favorites {
      text-align: center;
      padding: 3rem 0;
      color: var(--text-secondary);
      
      .empty-icon {
        font-size: 3rem;
        display: block;
        margin-bottom: 1rem;
      }
      
      p {
        margin: 0.5rem 0;
      }
      
      .hint {
        font-size: 0.9rem;
        margin-top: 1rem;
      }
    }
    
    .name-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      
      .name-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-color);
        
        .name-text {
          font-size: 1rem;
          color: var(--text-primary);
        }
        
        .item-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .copy-btn,
        .remove-btn {
          padding: 0.25rem 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background: none;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .copy-btn {
          color: var(--primary);
          
          &:hover {
            border-color: var(--primary);
            background: rgba(var(--primary-rgb), 0.1);
          }
        }
        
        .remove-btn {
          color: var(--danger);
          
          &:hover {
            border-color: var(--danger);
            background: rgba(var(--danger-rgb), 0.1);
          }
        }
      }
    }
  }
  
  .action-btn {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-color);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
  }
}

@media (max-width: 768px) {
  .name-generator-page {
    padding: 1rem;
    
    .generator-container {
      grid-template-columns: 1fr;
      
      .settings-section {
        grid-column: 1;
        grid-row: 1;
      }
      
      .result-section {
        grid-column: 1;
        grid-row: 2;
      }
      
      .favorites-section {
        grid-column: 1;
        grid-row: 3;
      }
    }
  }
}
</style> 