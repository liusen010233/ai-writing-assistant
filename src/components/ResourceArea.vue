<template>
  <div class="resource-area">
    <div class="section-header">
      <h3>笔记本</h3>
      <span class="description">输入内容即可作为资料依据，可开启"依据编辑"与"依据审批"功能</span>
    </div>
    <div class="notebook-section">
      <div class="content-box">笔记本内容区域</div>
    </div>
    
    <div class="section-header">
      <h3>锁定文本</h3>
      <span class="description">无论AI如何编辑，被锁定文本一定会出现</span>
    </div>
    <div class="locked-text-section">
      <div class="content-box">锁定文本内容区域</div>
    </div>
  </div>
</template>

<style scoped>
.resource-area {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: calc(100vh - 120px);
}

.notebook-section {
  flex: 2;
  display: flex;
  flex-direction: column;
}

.locked-text-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.content-box {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
}

h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.1rem;
  white-space: nowrap;
}

.description {
  color: var(--text-secondary);
  font-size: 0.85rem;
  opacity: 0.8;
}
</style> 