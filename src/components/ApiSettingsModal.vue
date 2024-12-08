<script setup>
import { ref, watch, computed } from 'vue'
import { modelConfigs, getModelConfig, getBadgeStyle, createModelApi } from '../config/models'

const emit = defineEmits(['close', 'save'])
const selectedModel = ref('public')
const publicModelType = ref('kimi')
const customModelType = ref('kimi')

const formData = ref({
  apiKey: '',
  apiEndpoint: ''
})

const showApiKey = ref(false)

// 获取当前选中的模型配置
const currentCustomModel = computed(() => 
  getModelConfig('custom', customModelType.value)
)

// 重置表单时使用默认接口地址
const resetForm = (modelId) => {
  const config = getModelConfig('custom', modelId)
  formData.value = {
    apiKey: '',
    apiEndpoint: config?.apiConfig?.defaultEndpoint || ''
  }
}

// 切换自定义模型时更新表单
watch(customModelType, (newValue) => {
  resetForm(newValue)
})

// 监听公用模型选择变化
watch(publicModelType, (newValue) => {
  if (newValue) {
    // 当选择公用模型时，切换到公用模式（收起自定义区域）
    selectedModel.value = 'public'
    // 注意：这里不清空 formData，保留用户输入
  }
})

// 监听模式切换
watch(selectedModel, (newValue) => {
  if (newValue === 'public') {
    // 切换到公用模式时，不清空自定义模式的输入
    // 只是收起自定义区域
  } else {
    // 切换到自定义模式时，清除公用模式的选择
    publicModelType.value = ''
  }
})

// 验证 API Key
const validateApiKey = () => {
  const model = currentCustomModel.value
  if (!model?.apiConfig?.validateKey) return true
  return model.apiConfig.validateKey(formData.value.apiKey)
}

// 保存时的处理
const handleSave = () => {
  if (selectedModel.value === 'custom') {
    if (!validateApiKey()) {
      // 显示错误提示
      formErrors.value.apiKey = `请输入正确的 ${currentCustomModel.value.name} API Key 格式`
      return
    }
    // ... 其他保存逻辑
  }
  
  // 创建对应的 API 实例
  const model = selectedModel.value === 'public'
    ? getModelConfig('public', publicModelType.value)
    : getModelConfig('custom', customModelType.value)
    
  const api = createModelApi(
    model,
    formData.value.apiKey,
    formData.value.apiEndpoint || model.apiConfig?.defaultEndpoint
  )
  
  // 存储 API 实例供后续使用
  // 可以通过 emit 事件传递出去，或者使用 store 管理
  emit('save', {
    type: selectedModel.value,
    modelId: selectedModel.value === 'public' ? publicModelType.value : customModelType.value,
    api
  })
}

const toggleApiKey = () => {
  showApiKey.value = !showApiKey.value
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <button class="close-btn" @click="emit('close')">×</button>
      
      <h2>API 设置</h2>
      
      <div class="model-selection">
        <!-- 公用大模型 -->
        <div 
          class="model-option" 
          :class="{ active: selectedModel === 'public' }"
          @click="selectedModel = 'public'"
        >
          <div class="model-header">
            <h3>{{ modelConfigs.public.name }}</h3>
            <span 
              class="badge"
              :style="getBadgeStyle(modelConfigs.public.badge.type)"
            >
              {{ modelConfigs.public.badge.text }}
            </span>
          </div>
          <p class="description">{{ modelConfigs.public.description }}</p>
          <div class="model-list">
            <button 
              v-for="model in modelConfigs.public.models"
              :key="model.id"
              class="model-btn"
              :class="{ active: publicModelType === model.id }"
              @click.stop="publicModelType = model.id"
            >
              {{ model.name }}
              <span class="model-version">v{{ model.version }}</span>
            </button>
          </div>
        </div>

        <!-- 自定义大模型 -->
        <div 
          class="model-option" 
          :class="{ active: selectedModel === 'custom' }"
          @click="selectedModel = 'custom'"
        >
          <div class="model-header">
            <h3>{{ modelConfigs.custom.name }}</h3>
            <span 
              class="badge"
              :style="getBadgeStyle(modelConfigs.custom.badge.type)"
            >
              {{ modelConfigs.custom.badge.text }}
            </span>
          </div>
          <p class="description">{{ modelConfigs.custom.description }}</p>
          
          <div v-if="selectedModel === 'custom'" class="custom-settings">
            <div class="model-list">
              <button 
                v-for="model in modelConfigs.custom.models"
                :key="model.id"
                class="model-btn"
                :class="{ active: customModelType === model.id }"
                @click="customModelType = model.id"
              >
                {{ model.name }}
                <span class="model-version">v{{ model.version }}</span>
              </button>
            </div>

            <div class="input-group">
              <label>API Key</label>
              <div class="password-input">
                <input 
                  :type="showApiKey ? 'text' : 'password'"
                  v-model="formData.apiKey"
                  :placeholder="currentCustomModel?.apiConfig?.keyPlaceholder"
                >
                <button 
                  type="button"
                  class="toggle-password"
                  @click="toggleApiKey"
                >
                  {{ showApiKey ? '隐藏' : '显示' }}
                </button>
              </div>
              <span class="hint">用于访问 {{ currentCustomModel?.name }} 服务的密钥</span>
            </div>
            
            <div class="input-group">
              <label>API 接口地址</label>
              <div class="input-wrapper">
                <input 
                  type="text" 
                  v-model="formData.apiEndpoint"
                  :placeholder="currentCustomModel?.apiConfig?.endpointPlaceholder"
                >
              </div>
              <span class="hint">{{ currentCustomModel?.name }} 服务的接口地址</span>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="cancel-btn" @click="emit('close')">取消</button>
        <button class="save-btn" @click="handleSave">保存</button>
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
  width: 600px;
  max-width: 90vw;
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

.model-selection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.model-option {
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: all 0.3s ease;
}

.model-option:hover {
  background: rgba(255, 255, 255, 0.05);
}

.model-option.active {
  border-color: var(--accent);
  background: rgba(255, 120, 73, 0.1);
}

.model-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.model-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.badge {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  background: var(--accent);
  color: white;
}

.badge.custom {
  background: #7B68EE;
}

.description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.model-list {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.model-btn {
  flex: 1;
  padding: 0.75rem 2rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.model-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.model-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

.custom-settings {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.input-group {
  margin-top: 2rem;
}

label {
  display: block;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.input-wrapper {
  position: relative;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: var(--accent);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 0 2px rgba(255, 120, 73, 0.1);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-btn, .save-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.save-btn {
  background: var(--accent);
  border: none;
  color: white;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.save-btn:hover {
  background: #ff8959;
}

.hint {
  display: block;
  color: var(--text-secondary);
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 0.5rem;
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

.model-version {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-left: 0.5rem;
}
</style> 