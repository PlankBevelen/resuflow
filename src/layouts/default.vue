<template>
  <div class="default-layout">
    <Header />
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from './components/Header.vue'
</script>