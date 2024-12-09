<script setup>
import { ref } from 'vue'
import { publicModules } from '../config/modpro'
import { useModProStore } from '../stores/modpro'

const emit = defineEmits(['close'])
const selectedType = ref('public')
const modproStore = useModProStore()

// 自定义模块列表
const customModules = ref([])

const handleClose = () => {
  emit('close')
}

const switchType = (type) => {
  selectedType.value = type
}

const selectModule = (module) => {
  if (modproStore.selectedModules.find(m => m.id === module.id)) {
    modproStore.removeModule(module.id)
  } else {
    modproStore.addModule(module)
  }
}

const isModuleSelected = (moduleId) => {
  return modproStore.selectedModules.some(m => m.id === moduleId)
}

const newModPro = ref({
  name: '',
  description: '',
  botToken: '',
  botAddress: '',
  source: '扣子'  // 默认选择
})

const handleAddModPro = () => {
  // 添加新的空行到列表中
  customModules.value.push({
    name: '',
    description: '',
    botToken: '',
    botAddress: '',
    source: '扣子',
    isEditing: true
  })
}

const handleSave = (index) => {
  const module = customModules.value[index]
  
  // 验证必填字段
  if (!module.name || !module.botToken || !module.botAddress || !module.source) {
    alert('请填写所有必填项(ModPro名称、Bot令牌、Bot地址、来源)')
    return
  }
  
  // 保存该行数据
  module.isEditing = false
}

const handleDelete = (index) => {
  // 删除该行数据
  customModules.value.splice(index, 1)
}

const handleEdit = (index) => {
  // 设置行为可编辑状态
  customModules.value[index].isEditing = true
}
</script>

<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <h3>ModPro 设定</h3>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      
      <div class="type-selector">
        <button 
          class="type-btn"
          :class="{ active: selectedType === 'public' }"
          @click="switchType('public')"
        >
          公用专家模块
        </button>
        <button 
          class="type-btn"
          :class="{ active: selectedType === 'custom' }"
          @click="switchType('custom')"
        >
          自定义专家模块
        </button>
      </div>

      <div class="content-area">
        <div v-if="selectedType === 'public'">
          <div class="modules-description">
            点击"+", 即可在写作区上方的ModPro中选择对应专家模块。点击"×"取消选择。
          </div>
          <div class="modules-grid">
            <div 
              v-for="module in publicModules" 
              :key="module.id"
              class="module-card"
              :class="{ selected: isModuleSelected(module.id) }"
            >
              <div class="module-content">
                <h5>{{ module.name }}</h5>
                <p>{{ module.description }}</p>
              </div>
              <button 
                class="select-btn"
                @click="selectModule(module)"
              >
                {{ isModuleSelected(module.id) ? '×' : '+' }}
              </button>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="custom-module-header">
            自定义专家模块
          </div>
          <div class="custom-module-description">
            您可自由填入左平台的智能体，它将显示在写作区上方的ModPro中
          </div>
          
          <div class="custom-module-table">
            <div class="table-header">
              <div class="header-cell">ModPro名称 *</div>
              <div class="header-cell">简介</div>
              <div class="header-cell">Bot令牌 *</div>
              <div class="header-cell">Bot地址 *</div>
              <div class="header-cell">来源 *</div>
              <div class="header-cell">操作</div>
            </div>
            
            <!-- 已添加的模块列表 -->
            <div v-for="(module, index) in customModules" :key="index" class="table-row">
              <div class="table-cell">
                <input 
                  v-if="module.isEditing"
                  type="text" 
                  v-model="module.name"
                  placeholder="输入名称(必填)"
                  required
                />
                <span v-else>{{ module.name }}</span>
              </div>
              <div class="table-cell">
                <input 
                  v-if="module.isEditing"
                  type="text" 
                  v-model="module.description"
                  placeholder="输入简介"
                />
                <span v-else>{{ module.description }}</span>
              </div>
              <div class="table-cell">
                <input 
                  v-if="module.isEditing"
                  type="text" 
                  v-model="module.botToken"
                  placeholder="输入Bot令牌(必填)"
                  required
                />
                <span v-else>{{ module.botToken }}</span>
              </div>
              <div class="table-cell">
                <input 
                  v-if="module.isEditing"
                  type="text" 
                  v-model="module.botAddress"
                  placeholder="输入Bot地址(必填)"
                  required
                />
                <span v-else>{{ module.botAddress }}</span>
              </div>
              <div class="table-cell">
                <select v-if="module.isEditing" v-model="module.source" required>
                  <option value="">请选择来源</option>
                  <option value="扣子">扣子</option>
                </select>
                <span v-else>{{ module.source }}</span>
              </div>
              <div class="table-cell actions">
                <button 
                  v-if="module.isEditing"
                  class="save-btn" 
                  @click="handleSave(index)"
                >
                  保存
                </button>
                <button 
                  v-else
                  class="edit-btn"
                  @click="handleEdit(index)"
                >
                  编辑
                </button>
                <button class="delete-btn" @click="handleDelete(index)">删除</button>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="add-btn" @click="handleAddModPro">
              <span class="plus-icon">+</span>
              新增ModPro
            </button>
          </div>
        </div>
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
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-light);
  border-radius: 16px;
  width: 95%;
  max-width: 1000px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 1.5rem;
  position: relative;
  border: 1px solid var(--border-color);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.type-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.type-btn {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.type-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.type-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

.content-area {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.content-area h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.modules-description {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  line-height: 1.4;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  padding: 0.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.module-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.75rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  transition: all 0.3s ease;
  min-width: 0;
}

.module-card:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
}

.module-content {
  flex: 1;
}

.module-content h5 {
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.module-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.7rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.select-btn {
  width: 20px;
  height: 20px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: var(--accent);
  border: none;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.select-btn:hover {
  transform: scale(1.1);
}

.module-card.selected {
  border-color: var(--accent);
  background: rgba(var(--accent-rgb), 0.1);
}

.module-card.selected .select-btn {
  background: #ff4757;
}

@media (max-width: 768px) {
  .modules-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .modules-grid {
    grid-template-columns: 1fr;
  }
}

.custom-module-header {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.custom-module-description {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

.custom-module-table {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid var(--border-color);
}

.header-cell {
  flex: 1;
  padding: 0.75rem;
  color: var(--text-primary);
  font-size: 0.9rem;
  text-align: center;
  font-weight: bold;
}

.table-row {
  display: flex;
  border-bottom: 1px solid var(--border-color);
}

.table-cell {
  flex: 1;
  padding: 0.5rem;
}

.table-cell input,
.table-cell select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  font-size: 0.85rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-right: 1rem;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 2rem;
  background: var(--accent);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(var(--accent-rgb), 0.3);
}

.plus-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.save-btn,
.edit-btn,
.delete-btn {
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.save-btn {
  background: #2ecc71;
}

.edit-btn {
  background: #3498db;
}

.delete-btn {
  background: #e74c3c;
}

.save-btn:hover,
.edit-btn:hover,
.delete-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.1);
}
</style> 