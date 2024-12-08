<script setup>
import TheHeader from './components/TheHeader.vue'
import WritingArea from './components/WritingArea.vue'
import ResourceArea from './components/ResourceArea.vue'
import AIResponseDrawer from './components/AIResponseDrawer.vue'
</script>

<template>
  <div class="app-container">
    <TheHeader />
    
    <main class="main-content">
      <WritingArea />
      <ResourceArea />
      <AIResponseDrawer />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 50% calc(33.33% - 20px) calc(16.67% + 20px);
  gap: 1rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}
</style>
