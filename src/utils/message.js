import { createVNode, render } from 'vue'
import MessageComponent from '@/components/Message.vue'

let messageInstance = null
let container = null

const Message = (options) => {
  // 创建容器
  if (!container) {
    container = document.createElement('div')
    document.body.appendChild(container)
  }
  
  // 清除旧的消息
  if (messageInstance) {
    render(null, container)
  }
  
  // 创建新消息
  messageInstance = createVNode(MessageComponent, {
    content: typeof options === 'string' ? options : options.content,
    type: options.type || 'info',
    duration: options.duration || 3000,
    onDestroy: () => {
      render(null, container)
      messageInstance = null
    }
  })
  
  render(messageInstance, container)
  
  // 获取组件实例并显示消息
  const vm = messageInstance.component
  vm.exposed.show()
}

// 添加便捷方法
;['success', 'error', 'warning', 'info'].forEach(type => {
  Message[type] = (content, duration) => {
    return Message({
      type,
      content,
      duration
    })
  }
})

export default Message 