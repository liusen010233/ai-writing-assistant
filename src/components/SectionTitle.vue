<template>
  <div class="section-header">
    <h3>{{ title }}</h3>
    <span class="description">{{ description }}</span>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String
})
</script>

<style scoped>
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