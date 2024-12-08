<script setup>
import { ref } from 'vue'

const activeTab = ref('edit') // 'edit' 或 'approve'
</script>

<template>
  <div class="ai-response-drawer">
    <div class="tabs">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'edit' }"
        @click="activeTab = 'edit'"
      >
        AI编辑结果
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'approve' }"
        @click="activeTab = 'approve'"
      >
        AI审批结果
      </button>
    </div>
    
    <div class="content" v-if="activeTab === 'edit'">
      AI编辑结果内容区域
    </div>
    
    <div class="content" v-if="activeTab === 'approve'">
      AI审批结果内容区域
    </div>
  </div>
</template>

<style scoped>
.ai-response-drawer {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.75rem;
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  background: var(--bg-light);
  width: calc(100% - 1rem);
  margin-right: 1rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.tab-btn {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-btn.active {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border-color: var(--accent);
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.content {
  flex: 1;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.75rem;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.02);
}
</style> 