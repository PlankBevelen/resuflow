<template>
  <header class="header-nav animate-fade-up">
    <div class="logo-container group" @click="goHome">
      <svg-icon name="icon" class="logo-icon"></svg-icon>
      <span class="logo-text">Jusort · 简序</span>
    </div>
    <div class="nav-links">
      <a href="#" class="nav-link group">
        模板仓库
        <span class="link-underline"></span>
      </a>
      <a href="#" class="nav-link group">
        我的仓库
        <span class="link-underline"></span>
      </a>
      <a href="#" class="nav-link group">
        价格
        <span class="link-underline"></span>
      </a>

      <div class="divider"></div>
      
      <div class="auth-actions">
        <template v-if="userStore.isAuthenticated">
          <el-button class="cta-button" @click="showEditor">开始制作</el-button>
          <div class="user-menu" @click="goProfile">
            <el-avatar :size="32" :src="userStore.user?.avatar" />
            <span class="username">{{ userStore.user?.username }}</span>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">登录</router-link>
          <el-button class="cta-button" @click="showEditor">开始制作</el-button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const showEditor = () => {
  // 允许未登录直接试用，或者跳转登录
  // 这里假设允许直接进入编辑器
  router.push({ name: 'editor' });
};

const goHome = () => {
    router.push('/');
}

const goProfile = () => {
    router.push('/profile');
}
</script>

<style lang="less" scoped>
@import './Header.less';

.auth-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.divider {
  width: 1px;
  height: 16px;
  background: #e2e8f0;
  margin: 0 4px;
}  

.user-menu {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: rgba(0,0,0,0.05);
    }
    
    .username {
        font-size: 14px;
        color: #333;
        font-weight: 500;
    }
}
</style>
