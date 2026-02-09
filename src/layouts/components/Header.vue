<template>
  <header class="header-nav animate-fade-up">
    <div class="logo-container group">
      <span class="iconify logo-icon" data-icon="solar:file-text-bold-duotone"></span>
      <span class="logo-text">ResuMaker</span>
    </div>
    <div class="nav-links">
      <a href="#" class="nav-link group">
        设计模板
        <span class="link-underline"></span>
      </a>
      <a href="#" class="nav-link group">
        成功案例
        <span class="link-underline"></span>
      </a>
      <a href="#" class="nav-link group">
        价格
        <span class="link-underline"></span>
      </a>
      <el-button class="cta-button" @click="showEditor">开始制作</el-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
const showEditor = () => {
  router.push({ name: 'editor' });
};
</script>

<style lang="less" scoped>
@import './Header.less';
</style>
