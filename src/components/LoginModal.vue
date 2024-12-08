<script setup>
import { ref } from 'vue'
import CaptchaCode from './CaptchaCode.vue'
// 导入图标
import qqLogo from '../assets/icons/qq_logo.png'
import weixinLogo from '../assets/icons/weixin_logo.png'

const isLogin = ref(true)
const showQRCode = ref(false)
const qrCodeType = ref('') // 'wechat' 或 'qq'
const emit = defineEmits(['close'])

const captchaRef = ref(null)
const captchaInput = ref('')

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
})

const formErrors = ref({
  username: '',
  password: '',
  confirmPassword: '',
  captcha: ''
})

// 邮箱验证正则表达式
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

// 验证邮箱格式
const validateEmail = (email) => {
  return emailRegex.test(email)
}

const switchMode = () => {
  isLogin.value = !isLogin.value
  showQRCode.value = false
}

const showQRCodeModal = (type) => {
  qrCodeType.value = type
  showQRCode.value = true
}

const hideQRCodeModal = () => {
  showQRCode.value = false
}

const validateCaptcha = () => {
  return captchaInput.value.toLowerCase() === captchaRef.value.captchaText.value.toLowerCase()
}

// 验证表单
const validateForm = () => {
  let isValid = true
  formErrors.value = {
    username: '',
    password: '',
    confirmPassword: '',
    captcha: ''
  }

  // 验证邮箱
  if (!formData.value.username.trim()) {
    formErrors.value.username = isLogin.value ? '请输入登录邮箱' : '请输入注册邮箱'
    isValid = false
  } else if (!validateEmail(formData.value.username)) {
    formErrors.value.username = '请输入正确的邮箱格式'
    isValid = false
  }

  // 验证密码
  if (!formData.value.password) {
    formErrors.value.password = '请输入密码'
    isValid = false
  }

  // 如果是注册模式，验证确认密码和验证码
  if (!isLogin.value) {
    if (!formData.value.confirmPassword) {
      formErrors.value.confirmPassword = '请确认密码'
      isValid = false
    } else if (formData.value.password !== formData.value.confirmPassword) {
      formErrors.value.confirmPassword = '两次输入的密码不一致'
      isValid = false
    }

    // 验证验证码
    if (!captchaInput.value) {
      formErrors.value.captcha = '请输入验证码'
      isValid = false
    } else if (!validateCaptcha()) {
      formErrors.value.captcha = '验证码错误'
      isValid = false
      // 验证码错误时自动刷新
      refreshCaptcha()
    }
  }

  return isValid
}

const handleSubmit = () => {
  if (!validateForm()) {
    return
  }
  // 处理表单提交
  console.log('表单提交', formData.value)
}

const refreshCaptcha = () => {
  captchaInput.value = ''
  captchaRef.value.generateCaptcha()
}

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const togglePassword = (field) => {
  if (field === 'password') {
    showPassword.value = !showPassword.value
  } else {
    showConfirmPassword.value = !showConfirmPassword.value
  }
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <button class="close-btn" @click="emit('close')">×</button>
      
      <h2>{{ isLogin ? '登录' : '注册' }}</h2>
      
      <div class="form" v-if="!showQRCode">
        <div class="input-group">
          <label>{{ isLogin ? '登录邮箱' : '注册邮箱' }}</label>
          <input 
            type="email" 
            v-model="formData.username"
            :placeholder="isLogin ? '请输入登录邮箱' : '请输入注册邮箱'"
            :class="{ 'error': formErrors.username }"
          >
          <span class="error-message" v-if="formErrors.username">
            {{ formErrors.username }}
          </span>
        </div>
        
        <div class="input-group">
          <label>密码</label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'"
              v-model="formData.password"
              placeholder="请输入密码"
              :class="{ 'error': formErrors.password }"
            >
            <button 
              type="button"
              class="toggle-password"
              @click="togglePassword('password')"
            >
              {{ showPassword ? '隐藏' : '显示' }}
            </button>
          </div>
          <span class="error-message" v-if="formErrors.password">
            {{ formErrors.password }}
          </span>
        </div>
        
        <div class="input-group" v-if="!isLogin">
          <label>确认密码</label>
          <div class="password-input">
            <input 
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="formData.confirmPassword"
              placeholder="请再次输入密码"
              :class="{ 'error': formErrors.confirmPassword }"
            >
            <button 
              type="button"
              class="toggle-password"
              @click="togglePassword('confirm')"
            >
              {{ showConfirmPassword ? '隐���' : '显示' }}
            </button>
          </div>
          <span class="error-message" v-if="formErrors.confirmPassword">
            {{ formErrors.confirmPassword }}
          </span>
        </div>

        <div class="input-group captcha-group" v-if="!isLogin">
          <label>验证码</label>
          <div class="captcha-input-group">
            <input 
              type="text" 
              v-model="captchaInput"
              placeholder="请输入验证码"
              maxlength="4"
              :class="{ 'error': formErrors.captcha }"
            >
            <CaptchaCode ref="captchaRef" />
            <button class="refresh-btn" @click.prevent="refreshCaptcha" title="刷新验证码">
              ↻
            </button>
          </div>
          <span class="error-message" v-if="formErrors.captcha">
            {{ formErrors.captcha }}
          </span>
        </div>
        
        <button class="submit-btn" @click="handleSubmit">
          {{ isLogin ? '登录' : '注册' }}
        </button>

        <div class="social-login">
          <div class="divider">
            <span>或使用社交账号{{ isLogin ? '登录' : '注册' }}</span>
          </div>
          <div class="social-buttons">
            <button class="social-btn wechat" @click="showQRCodeModal('wechat')">
              <img :src="weixinLogo" alt="微信" class="social-icon">
              微信
            </button>
            <button class="social-btn qq" @click="showQRCodeModal('qq')">
              <img :src="qqLogo" alt="QQ" class="social-icon">
              QQ
            </button>
          </div>
        </div>
        
        <div class="switch-mode">
          {{ isLogin ? '还没有账号？' : '已有账号？' }}
          <button class="text-btn" @click="switchMode">
            {{ isLogin ? '立即注册' : '去登录' }}
          </button>
        </div>
      </div>

      <div class="qrcode-container" v-if="showQRCode">
        <h3>{{ qrCodeType === 'wechat' ? '微信' : 'QQ' }}扫码{{ isLogin ? '登录' : '注册' }}</h3>
        <div class="qrcode-box">
          <div class="qrcode-placeholder">
            {{ qrCodeType === 'wechat' ? '微信' : 'QQ' }}二维码
          </div>
        </div>
        <p class="qrcode-tip">请使用{{ qrCodeType === 'wechat' ? '微信' : 'QQ' }}扫描二维码</p>
        <button class="back-btn" @click="hideQRCodeModal">
          返回账号{{ isLogin ? '登录' : '注册' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-light);
  border-radius: 16px;
  padding: 2rem;
  width: 400px;
  position: relative;
  border: 1px solid var(--border-color);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: 50%;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

h2 {
  color: var(--text-primary);
  margin-bottom: 2rem;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: var(--accent);
}

.submit-btn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.submit-btn:hover {
  background: #ff8959;
  transform: none;
}

.switch-mode {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.text-btn {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
}

.text-btn:hover {
  text-decoration: underline;
  background: none;
  transform: none;
}

.social-login {
  margin-top: 1rem;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-color);
}

.divider span {
  padding: 0 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.social-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.social-btn.wechat {
  border-color: #07C160;
  color: #07C160;
}

.social-btn.qq {
  border-color: #12B7F5;
  color: #12B7F5;
}

.qrcode-container {
  text-align: center;
}

.qrcode-box {
  width: 200px;
  height: 200px;
  margin: 2rem auto;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
}

.qrcode-placeholder {
  color: var(--text-secondary);
}

.qrcode-tip {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.back-btn {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  cursor: pointer;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.social-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

/* 删除之前的图标样式 */
.icon-wechat::before,
.icon-qq::before {
  display: none;
}

.captcha-group .captcha-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.captcha-group input {
  width: 120px;
}

.refresh-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.2rem;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: none;
}

input.error {
  border-color: #ff4d4f;
}

.error-message {
  color: #ff4d4f;
  font-size: 0.8rem;
  margin-top: 0.2rem;
}

/* 调整验证码错误提示的位置 */
.captcha-group .error-message {
  position: absolute;
  bottom: -1.2rem;
  left: 0;
}

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input input {
  flex: 1;
  padding-right: 4rem;
  /* 隐藏原生的密码显示按钮 */
  &::-ms-reveal,
  &::-ms-clear {
    display: none;
  }
  &::-webkit-contacts-auto-fill-button,
  &::-webkit-credentials-auto-fill-button {
    visibility: hidden;
    display: none !important;
    pointer-events: none;
    height: 0;
    width: 0;
    margin: 0;
  }
}

.toggle-password {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  padding: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.toggle-password:hover {
  opacity: 1;
  background: none;
  transform: none;
}
</style> 