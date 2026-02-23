<template>
  <aside class="left-sidebar">
    <button class="tool-btn group" @click="handleChoice('shape')">
      <div class="icon-box">
        <span class="iconify" data-icon="solar:box-bold"></span>
      </div>
      <span class="label">图形</span>
    </button>
    <button class="tool-btn group" @click="handleChoice('image')">
      <div class="icon-box">
        <span class="iconify" data-icon="solar:gallery-bold"></span>
      </div>
      <span class="label">图片</span>
    </button>
    
    <div class="bottom-tools">
      <button class="settings-btn">
        <span class="iconify" data-icon="solar:settings-linear"></span>
      </button>
    </div>
  </aside>

  <transition name="fade" mode="out-in">
    <component :is="choiceComp" />
  </transition>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, shallowRef } from 'vue';

const Text = defineAsyncComponent(() => import('./components/Text.vue'));
const Image = defineAsyncComponent(() => import('./components/Image.vue'));
const Shape = defineAsyncComponent(() => import('./components/Shape.vue'));

const choiceComp = shallowRef<any>(Shape);

function handleChoice(type: string) {
  if (type === 'shape') choiceComp.value = Shape;
  else if (type === 'text') choiceComp.value = Text;
  else if (type === 'image') choiceComp.value = Image;
}

</script>

<style lang="less" scoped>
.left-sidebar {
  width: 100px;
  box-sizing: border-box;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 0;
  gap: 2rem;
  z-index: 10;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.05);
  position: relative;

  .tool-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    width: 100%;
    cursor: pointer;
    border: none;
    background: transparent;
    padding: 0;
    
    .icon-box {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      color: #475569;
      border-radius: 0.75rem;
      transition: all 0.2s;
      font-size: 1.5rem;
    }

    .label {
      font-size: 10px;
      font-weight: 700;
      color: #94a3b8;
      transition: color 0.2s;
    }

    &:hover {
      .icon-box {
        background: #eff6ff;
        color: #2563eb;
        transform: scale(1.1);
      }
      .label {
        color: #2563eb;
      }
    }
  }

  .hidden-input {
    display: none;
  }

  .bottom-tools {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .settings-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 1.5rem;
      transition: all 0.2s;

      &:hover {
        color: #475569;
        transform: rotate(90deg);
      }
    }
  }
}
</style>
