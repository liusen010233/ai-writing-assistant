<script setup>
import { ref, onMounted } from 'vue'
import LoginModal from './LoginModal.vue'
import ApiSettingsModal from './ApiSettingsModal.vue'

const showTips = ref(false)
const showLoginModal = ref(false)
const showSettingsDropdown = ref(false)
const showApiSettings = ref(false)

onMounted(() => {
  showTips.value = true
})

const closeTips = () => {
  showTips.value = false
}
</script>

<template>
  <header class="header">
    <div class="logo-section">
      <div class="logo">牛马宝</div>
      <button class="tips-btn" @click="showTips = true">使用小贴士</button>
    </div>
    <div class="actions">
      <button class="btn" @click="showLoginModal = true">登录/注册</button>
      <div class="settings-dropdown">
        <button 
          class="btn" 
          @click="showSettingsDropdown = !showSettingsDropdown"
        >
          设置
        </button>
        <div class="dropdown-menu" v-if="showSettingsDropdown">
          <button 
            class="dropdown-item"
            @click="showApiSettings = true; showSettingsDropdown = false"
          >
            API 设定
          </button>
        </div>
      </div>
    </div>

    <!-- 提示弹窗 -->
    <div class="tips-modal" v-if="showTips">
      <div class="tips-content">
        <div class="tips-text">欢迎使用牛马宝AI自动撰写平台</div>
        <button class="close-btn" @click="closeTips">×</button>
      </div>
    </div>

    <!-- 登录弹窗 -->
    <LoginModal 
      v-if="showLoginModal" 
      @close="showLoginModal = false"
    />

    <!-- API 设置弹窗 -->
    <ApiSettingsModal 
      v-if="showApiSettings"
      @close="showApiSettings = false"
    />
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--bg-light);
  border-bottom: 1px solid var(--border-color);
  position: relative;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--accent);
}

.tips-btn {
  background: rgba(255, 243, 230, 0.2);
  backdrop-filter: blur(10px);
  color: #FFE4C4;
  border: 1px solid rgba(255, 243, 230, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tips-btn:hover {
  background: rgba(255, 243, 230, 0.3);
}

.actions {
  display: flex;
  gap: 1rem;
}

.tips-modal {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  animation: slideDown 0.3s ease;
}

.tips-content {
  background: rgba(255, 243, 230, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tips-text {
  color: #4A4A4A;
  font-size: 0.95rem;
}

.close-btn {
  background: none;
  border: none;
  color: #4A4A4A;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

@keyframes slideDown {
  from {
    transform: translate(-50%, -20px);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

.settings-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: #252542;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.5rem;
  min-width: 120px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background: #2d2d54;
}
</style> 