<template>
  <div class="unit-price-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>单价计算器</h1>
        <p class="tool-desc">在线单价计算工具，帮助您比较不同规格商品的性价比</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="unit-price" />
      </div>
    </div>

    <div class="calculator-container">
      <div class="items-section">
        <div 
          v-for="(item, index) in items" 
          :key="index"
          class="item-card"
        >
          <div class="card-header">
            <h3>商品 {{ index + 1 }}</h3>
            <button 
              v-if="items.length > 2" 
              class="delete-btn"
              @click="removeItem(index)"
            >
              删除
            </button>
          </div>

          <div class="input-group">
            <label>
              <span>商品名称</span>
              <input 
                type="text" 
                v-model="item.name"
                placeholder="输入商品名称"
              >
            </label>
          </div>

          <div class="input-group">
            <label>
              <span>价格</span>
              <input 
                type="number" 
                v-model.number="item.price"
                min="0"
                step="0.01"
                placeholder="输入价格"
              >
            </label>
          </div>

          <div class="input-group">
            <label>
              <span>数量</span>
              <input 
                type="number" 
                v-model.number="item.quantity"
                min="0"
                step="0.01"
                placeholder="输入数量"
              >
            </label>
          </div>

          <div class="input-group">
            <label>
              <span>单位</span>
              <input 
                type="text" 
                v-model="item.unit"
                placeholder="如: 克、个、ml"
              >
            </label>
          </div>

          <div class="unit-price">
            <span>单价:</span>
            <span class="price" :class="{ best: isBestValue(index) }">
              {{ calculateUnitPrice(item) }}
              {{ item.unit ? `元/${item.unit}` : '元/单位' }}
            </span>
          </div>
        </div>

        <button 
          v-if="items.length < 5"
          class="add-btn"
          @click="addItem"
        >
          添加商品
        </button>
      </div>

      <div class="comparison-section" v-if="hasValidItems">
        <h3>对比结果</h3>
        <div class="comparison-content">
          <div 
            v-for="(item, index) in sortedItems" 
            :key="index"
            class="comparison-item"
            :class="{ best: index === 0 }"
          >
            <div class="item-name">{{ item.name || `商品 ${item.originalIndex + 1}` }}</div>
            <div class="item-price">
              {{ calculateUnitPrice(item) }}
              {{ item.unit ? `元/${item.unit}` : '元/单位' }}
            </div>
            <div class="price-diff" v-if="index > 0">
              比最优贵 {{ calculatePriceDiff(item) }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FavoriteButton from '@/components/FavoriteButton.vue'

const items = ref([
  { name: '', price: null, quantity: null, unit: '' },
  { name: '', price: null, quantity: null, unit: '' }
])

// 计算单价
const calculateUnitPrice = (item) => {
  if (!item.price || !item.quantity) return '0.00'
  return (item.price / item.quantity).toFixed(2)
}

// 添加商品
const addItem = () => {
  if (items.value.length < 5) {
    items.value.push({ name: '', price: null, quantity: null, unit: '' })
  }
}

// 删除商品
const removeItem = (index) => {
  if (items.value.length > 2) {
    items.value.splice(index, 1)
  }
}

// 是否有有效的商品数据
const hasValidItems = computed(() => {
  return items.value.some(item => item.price && item.quantity)
})

// 按单价排序的商品列表
const sortedItems = computed(() => {
  return items.value
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter(item => item.price && item.quantity)
    .sort((a, b) => {
      const priceA = a.price / a.quantity
      const priceB = b.price / b.quantity
      return priceA - priceB
    })
})

// 计算价格差异百分比
const calculatePriceDiff = (item) => {
  if (!sortedItems.value.length) return '0'
  const bestPrice = sortedItems.value[0].price / sortedItems.value[0].quantity
  const itemPrice = item.price / item.quantity
  return ((itemPrice - bestPrice) / bestPrice * 100).toFixed(1)
}

// 判断是否最优性价比
const isBestValue = (index) => {
  if (!hasValidItems.value) return false
  return sortedItems.value[0]?.originalIndex === index
}
</script>

<style lang="scss" scoped>
.unit-price-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  .tool-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;

    .header-content {
      flex: 1;

      h1 {
        font-size: 1.8rem;
        margin: 0 0 0.5rem;
        color: var(--text-primary);
      }

      .tool-desc {
        margin: 0;
        color: var(--text-secondary);
      }
    }

    .tool-actions {
      margin-left: 2rem;
    }
  }

  .calculator-container {
    display: grid;
    gap: 2rem;

    .items-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;

      .item-card {
        background: var(--bg-card);
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;

          h3 {
            font-size: 1.2rem;
            margin: 0;
            color: var(--text-primary);
          }

          .delete-btn {
            padding: 0.5rem;
            border: none;
            background: none;
            color: #f56c6c;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
              opacity: 0.8;
            }
          }
        }

        .input-group {
          margin-bottom: 1rem;

          label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;

            span {
              color: var(--text-primary);
            }

            input {
              flex: 1;
              padding: 0.5rem;
              border: 1px solid var(--border-color);
              border-radius: 4px;
              background: var(--bg-color);
              color: var(--text-primary);

              &:focus {
                border-color: var(--primary);
                outline: none;
              }
            }
          }
        }

        .unit-price {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
          
          .price {
            font-size: 1.2rem;
            font-weight: 500;
            color: var(--text-primary);

            &.best {
              color: var(--primary);
            }
          }
        }
      }

      .add-btn {
        padding: 1.5rem;
        border: 2px dashed var(--border-color);
        border-radius: 8px;
        background: none;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
      }
    }

    .comparison-section {
      background: var(--bg-card);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;

      h3 {
        font-size: 1.2rem;
        margin: 0 0 1rem;
        color: var(--text-primary);
      }

      .comparison-content {
        display: grid;
        gap: 1rem;

        .comparison-item {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 1rem;
          align-items: center;
          padding: 1rem;
          background: var(--bg-color);
          border-radius: 4px;
          border: 1px solid var(--border-color);

          &.best {
            border-color: var(--primary);
            background: #f0f9eb;
          }

          .item-name {
            color: var(--text-primary);
          }

          .item-price {
            font-weight: 500;
            color: var(--text-primary);
          }

          .price-diff {
            color: #f56c6c;
          }
        }
      }
    }
  }
}
</style> 