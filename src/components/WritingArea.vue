<script setup>
import { ref, onMounted } from 'vue'
import { useModProStore } from '../stores/modpro'

const isExpanded = ref(false)
const isContinueActive = ref(false)
const isLocking = ref(false)
const isShaking = ref(false)

const modproStore = useModProStore()
const activeModuleName = ref('')

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

onMounted(() => {
  // 页面加载后开始晃动动画
  isShaking.value = true
  
  // 5次晃动后停止（一次晃动 = 0.8s，总共4秒）
  setTimeout(() => {
    isShaking.value = false
  }, 4000)
})

const handleContinue = () => {
  isContinueActive.value = true
  
  // 短暂延迟后取消选中状态
  setTimeout(() => {
    isContinueActive.value = false
  }, 200) // 200ms 后取消选中，提供足够的视觉反馈
}

const toggleLock = () => {
  isLocking.value = !isLocking.value
}

const selectModule = (moduleId) => {
  const module = modproStore.selectedModules.find(m => m.id === moduleId)
  if (module) {
    activeModuleName.value = module.name
  }
}
</script>

<template>
  <div class="writing-area" :class="{ expanded: isExpanded }">
    <div class="toolbar top-toolbar">
      <input 
        type="text" 
        placeholder="输入写作目的 AI会理解更好" 
        class="input" 
      />
      <div class="ai-functions">
        <span 
          class="ai-functions-title" 
          :class="{ 'shake-animation': isShaking }"
        >
          AI功能
        </span>
        <div class="ai-buttons">
          <button 
            class="action-btn"
            :class="{ active: isContinueActive }"
            @click="handleContinue"
          >
            续写
          </button>
          <div class="dropdown">
            <button class="dropdown-toggle">编辑 ▼</button>
            <div class="dropdown-menu">
              <button class="dropdown-item">直接编辑</button>
              <button class="dropdown-item">依据笔记本编辑</button>
            </div>
          </div>
          <div class="dropdown">
            <button class="dropdown-toggle">审批 ▼</button>
            <div class="dropdown-menu">
              <button class="dropdown-item">直接审批</button>
              <button class="dropdown-item">依据笔记本审批</button>
            </div>
          </div>
          <button 
            class="action-btn"
            :class="{ active: isLocking }"
            @click="toggleLock"
          >
            {{ isLocking ? '锁定添加中...' : '锁定文本' }}
          </button>
        </div>
      </div>
      <div class="mod-pro">
        <span class="ai-functions-title" style="margin-right: 0.75rem">ModPro</span>
        <div class="dropdown">
          <button class="dropdown-toggle">
            {{ activeModuleName || (modproStore.selectedModules.length > 0 ? '已选择专家模块' : '请选择专家模块') }}
          </button>
          <div class="dropdown-menu">
            <div v-if="modproStore.selectedModules.length === 0" class="dropdown-item no-modules">
              请在设置中进行ModPro设定
            </div>
            <button 
              v-for="module in modproStore.selectedModules"
              :key="module.id"
              class="dropdown-item"
              @click="selectModule(module.id)"
            >
              {{ module.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="content-area">
      写作内容
      <button class="expand-toggle" @click="toggleExpand">
        {{ isExpanded ? '<' : '>' }}
      </button>
    </div>

    <div class="toolbar bottom-toolbar">
      <button>上传文件</button>
      <button>下载Word</button>
    </div>
  </div>
</template>

<style scoped>
.writing-area {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  position: relative;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--bg-light);
  width: 100%;
  transform-origin: left center;
}

.writing-area.expanded {
  position: relative;
  width: calc(166.67% + 4px);
  z-index: 100;
}

.expand-toggle {
  position: absolute;
  right: -15px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 30px;
  border-radius: 0 16px 16px 0;
  writing-mode: horizontal-tb;
  text-orientation: mixed;
  padding: 0;
  background: #ffffff;
  color: #000000;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  border: none;
  z-index: 101;
  transition: none;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-weight: bold;
}

.expand-toggle:hover {
  background: #ffffff;
  transform: translateY(-50%);
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 0.5rem;
  min-width: 150px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.35rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-primary);
}

.dropdown-item:last-child {
  margin-bottom: 0;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.toolbar {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  gap: 0.5rem;
}

.content-area {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.bottom-toolbar {
  border-top: 1px solid var(--border-color);
  border-bottom: none;
  padding: 0.75rem 1rem;
  margin-top: 0.25rem;
}

.bottom-toolbar button {
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
}

button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.8rem;
}

button:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: var(--text-primary);
  margin-right: 0.5rem;
  font-size: 0.8rem;
}

.input::placeholder {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.ai-functions {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.ai-functions-title {
  color: var(--text-secondary);
  font-size: 0.9rem;
  white-space: nowrap;
  font-weight: bold;
}

.ai-buttons {
  display: flex;
  gap: 0.5rem;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-2px);
  }
  40% {
    transform: translateX(2px);
  }
  60% {
    transform: translateX(-2px);
  }
  80% {
    transform: translateX(2px);
  }
}

.shake-animation {
  animation: shake 0.8s ease-in-out infinite;
  animation-iteration-count: 5;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.8rem;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.action-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

.mod-pro {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.mod-pro .dropdown-toggle {
  min-width: 160px;
  text-align: left;
  position: relative;
  padding-right: 2rem;
  font-size: 0.8rem;
}

.mod-pro .dropdown-toggle::after {
  content: '▼';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.no-modules {
  color: var(--text-secondary);
  font-style: italic;
  cursor: default;
  padding: 0.5rem 0.75rem;
}
</style> 