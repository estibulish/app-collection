<template>
  <div class="loan-calculator-page">
    <div class="tool-header">
      <div class="header-content">
        <h1>贷款计算器</h1>
        <p class="tool-desc">在线贷款计算工具，支持等额本息和等额本金两种还款方式，帮您快速计算还款金额</p>
      </div>
      <div class="tool-actions">
        <FavoriteButton tool-id="loan-calculator" />
      </div>
    </div>

    <div class="calculator-container">
      <div class="input-section">
        <div class="calculator-card">
          <h3>贷款信息</h3>
          <div class="input-group">
            <label>
              <span>贷款金额</span>
              <div class="input-with-unit">
                <input 
                  type="number" 
                  v-model.number="amount"
                  min="0"
                  step="1000"
                  placeholder="输入贷款金额"
                >
                <span class="unit">元</span>
              </div>
            </label>

            <label>
              <span>贷款期限</span>
              <div class="input-with-unit">
                <input 
                  type="number" 
                  v-model.number="years"
                  min="1"
                  max="30"
                  step="1"
                  placeholder="输入年限"
                >
                <span class="unit">年</span>
              </div>
            </label>

            <label>
              <span>年利率</span>
              <div class="input-with-unit">
                <input 
                  type="number" 
                  v-model.number="rate"
                  min="0"
                  step="0.01"
                  placeholder="输入年利率"
                >
                <span class="unit">%</span>
              </div>
            </label>

            <label>
              <span>还款方式</span>
              <select v-model="method">
                <option value="equal">等额本息</option>
                <option value="principal">等额本金</option>
              </select>
            </label>
          </div>

          <button class="calculate-btn" @click="calculate">计算还款</button>
        </div>

        <div class="result-card" v-if="hasResult">
          <h3>计算结果</h3>
          <div class="result-grid">
            <div class="result-item">
              <div class="item-label">还款总额</div>
              <div class="item-value">{{ formatMoney(totalAmount) }}元</div>
            </div>
            <div class="result-item">
              <div class="item-label">支付利息</div>
              <div class="item-value">{{ formatMoney(totalInterest) }}元</div>
            </div>
            <div class="result-item">
              <div class="item-label">{{ method === 'equal' ? '月供' : '首月还款' }}</div>
              <div class="item-value">{{ formatMoney(monthlyPayment) }}元</div>
            </div>
            <div class="result-item" v-if="method === 'principal'">
              <div class="item-label">月供递减</div>
              <div class="item-value">{{ formatMoney(monthlyDecrease) }}元</div>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-section" v-if="hasResult">
        <div class="detail-card">
          <h3>还款明细</h3>
          <div class="detail-table">
            <table>
              <thead>
                <tr>
                  <th>期数</th>
                  <th>月供</th>
                  <th>本金</th>
                  <th>利息</th>
                  <th>剩余本金</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in paymentDetails" :key="item.month">
                  <td>{{ item.month }}</td>
                  <td>{{ formatMoney(item.payment) }}</td>
                  <td>{{ formatMoney(item.principal) }}</td>
                  <td>{{ formatMoney(item.interest) }}</td>
                  <td>{{ formatMoney(item.remaining) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3>计算说明</h3>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">等额本息</div>
            <div class="info-value">
              每月还款金额相同，其中本金逐月递增，利息逐月递减。
              适合收入稳定、对每月还款金额要求稳定的借款人。
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">等额本金</div>
            <div class="info-value">
              每月归还等额的本金和剩余本金的利息，月供会逐月递减。
              总支付利息较等额本息少，但前期还款压力较大。
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

const amount = ref(null)
const years = ref(null)
const rate = ref(null)
const method = ref('equal')

const monthlyRate = computed(() => (rate.value || 0) / 100 / 12)
const months = computed(() => (years.value || 0) * 12)

const totalAmount = ref(0)
const totalInterest = ref(0)
const monthlyPayment = ref(0)
const monthlyDecrease = ref(0)
const paymentDetails = ref([])

const hasResult = computed(() => paymentDetails.value.length > 0)

// 计算等额本息
const calculateEqual = () => {
  const monthRate = monthlyRate.value
  const totalMonth = months.value
  const loan = amount.value

  // 月供
  const monthly = loan * monthRate * Math.pow(1 + monthRate, totalMonth) / 
                 (Math.pow(1 + monthRate, totalMonth) - 1)
  monthlyPayment.value = monthly

  // 还款明细
  let remaining = loan
  paymentDetails.value = []
  
  for (let i = 1; i <= totalMonth; i++) {
    const interest = remaining * monthRate
    const principal = monthly - interest
    remaining -= principal

    paymentDetails.value.push({
      month: i,
      payment: monthly,
      principal: principal,
      interest: interest,
      remaining: Math.max(0, remaining)
    })
  }

  totalAmount.value = monthly * totalMonth
  totalInterest.value = totalAmount.value - loan
}

// 计算等额本金
const calculatePrincipal = () => {
  const monthRate = monthlyRate.value
  const totalMonth = months.value
  const loan = amount.value

  // 每月本金
  const monthlyPrincipal = loan / totalMonth
  
  // 还款明细
  let remaining = loan
  let totalPay = 0
  paymentDetails.value = []
  
  for (let i = 1; i <= totalMonth; i++) {
    const interest = remaining * monthRate
    const payment = monthlyPrincipal + interest
    remaining -= monthlyPrincipal

    paymentDetails.value.push({
      month: i,
      payment: payment,
      principal: monthlyPrincipal,
      interest: interest,
      remaining: Math.max(0, remaining)
    })

    totalPay += payment
    
    if (i === 1) {
      monthlyPayment.value = payment
    } else if (i === 2) {
      monthlyDecrease.value = monthlyPayment.value - payment
    }
  }

  totalAmount.value = totalPay
  totalInterest.value = totalPay - loan
}

// 开始计算
const calculate = () => {
  if (!amount.value || !years.value || !rate.value) {
    alert('请填写完整的贷款信息')
    return
  }

  if (method.value === 'equal') {
    calculateEqual()
  } else {
    calculatePrincipal()
  }
}

// 格式化金额
const formatMoney = (num) => {
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
</script>

<style lang="scss" scoped>
.loan-calculator-page {
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

    .input-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;

      .calculator-card, .result-card {
        background: var(--bg-card);
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;

        h3 {
          font-size: 1.2rem;
          margin: 0 0 1rem;
          color: var(--text-primary);
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;

          label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;

            span {
              color: var(--text-primary);
            }

            .input-with-unit {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              flex: 1;

              input {
                flex: 1;
              }

              .unit {
                color: var(--text-secondary);
                white-space: nowrap;
              }
            }
          }

          input, select {
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

        .calculate-btn {
          width: 100%;
          margin-top: 1rem;
          padding: 0.8rem;
          border: none;
          border-radius: 4px;
          background: var(--primary);
          color: white;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: var(--primary-dark);
          }
        }

        .result-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;

          .result-item {
            padding: 1rem;
            background: var(--bg-color);
            border-radius: 4px;
            border: 1px solid var(--border-color);

            .item-label {
              font-size: 0.9rem;
              color: var(--text-secondary);
              margin-bottom: 0.5rem;
            }

            .item-value {
              font-size: 1.2rem;
              color: var(--text-primary);
              font-weight: 500;
            }
          }
        }
      }
    }

    .detail-section {
      .detail-card {
        background: var(--bg-card);
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;

        h3 {
          font-size: 1.2rem;
          margin: 0 0 1rem;
          color: var(--text-primary);
        }

        .detail-table {
          overflow-x: auto;

          table {
            width: 100%;
            border-collapse: collapse;

            th, td {
              padding: 0.8rem;
              text-align: right;
              border-bottom: 1px solid var(--border-color);
            }

            th {
              background: var(--bg-color);
              color: var(--text-primary);
              font-weight: 500;
            }

            td {
              color: var(--text-secondary);
            }

            tr:hover td {
              background: var(--bg-color);
            }
          }
        }
      }
    }

    .info-section {
      background: var(--bg-card);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;

      h3 {
        font-size: 1.2rem;
        margin: 0 0 1rem;
        color: var(--text-primary);
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;

        .info-item {
          padding: 1rem;
          background: var(--bg-color);
          border-radius: 4px;
          border: 1px solid var(--border-color);

          .info-label {
            font-size: 1rem;
            color: var(--text-primary);
            font-weight: 500;
            margin-bottom: 0.5rem;
          }

          .info-value {
            font-size: 0.9rem;
            color: var(--text-secondary);
            line-height: 1.5;
          }
        }
      }
    }
  }
}
</style> 