<template>
  <component :is="layoutComponent">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </component>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, shallowRef, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const layouts = import.meta.glob('./*.vue');
const layoutComponent = shallowRef();

watch(
  () => route.meta.layout,
  async (newLayout) => {
    const layoutName = (newLayout as string) || 'default';
    const componentPath = `./${layoutName}.vue`;
    const loader = layouts[componentPath];
    if(loader) {
      layoutComponent.value = defineAsyncComponent(loader as any);
    }else {
      const defaultLoader = layouts['./default.vue'];
      if (defaultLoader) {
        layoutComponent.value = defineAsyncComponent(defaultLoader as any);
      }
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>