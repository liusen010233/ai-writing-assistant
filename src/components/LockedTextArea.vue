<template>
  <div class="locked-text-area">
    <div class="section-header">
      <h3>锁定文本</h3>
      <span class="description">无论AI如何编辑，被锁定文本一定会出现</span>
    </div>
    <!-- ... 其他内容保持不变 ... -->
  </div>
</template>

<style scoped>
/* ... 其他样式保持不变 ... */

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

h3 {
  margin: 0;
  color: var(--accent);
  font-size: 1.1rem;
  white-space: nowrap;
}

.description {
  color: var(--text-secondary);
  font-size: 0.85rem;
  opacity: 0.8;
}
</style> 