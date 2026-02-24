<template>
  <div class="home-page">
    <main class="main-content">
      <div class="hero-section">
        <div class="badge animate-fade-up delay-100">
          ✨ 2026年最佳简历设计工具
        </div>
        
        <h1 class="hero-title animate-fade-up delay-200">
          打造令人心动的<br>
          <span class="text-shimmer">职业简历</span>
        </h1>
        
        <p class="hero-desc animate-fade-up delay-300">
          不仅仅是一个编辑器。Jusort 提供专业的智能布局、精美的设计模板和实时可视化编辑，让你的简历在面试官眼中脱颖而出。
        </p>
        
        <div class="hero-actions animate-fade-up delay-400">
          <button class="btn-primary group" @click="showEditor">
            立即免费创建
            <span class="iconify arrow-icon" data-icon="solar:arrow-right-linear"></span>
          </button>
          <button class="btn-secondary group">
            查看模板库
          </button>
        </div>
        
        <div class="social-proof animate-fade-up delay-500">
          <div class="avatars">
             <img alt="User Avatar" class="avatar" src="https://modao.cc/agent-py/media/generated_images/2026-02-05/708864ab7a4e4796bbf17d38c3dfdade.jpg">
             <img alt="User Avatar" class="avatar" src="https://modao.cc/agent-py/media/generated_images/2026-02-05/dbefc2ab4fb849419f7f53052a1f11ca.jpg">
             <img alt="User Avatar" class="avatar" src="https://modao.cc/agent-py/media/generated_images/2026-02-05/e46e07bc1b244e87af2473e708cba020.jpg">
          </div>
          <span>已有 <strong class="highlight">10,000+</strong> 求职者成功获得 Offer</span>
        </div>
      </div>

      <div class="hero-image-container animate-fade-up delay-300">
        <div class="bg-decoration animate-sway"></div>
        
        <div class="image-wrapper animate-float">
          <img alt="App Preview" class="app-preview" src="https://modao.cc/agent-py/media/generated_images/2026-02-05/eef9113ef5cb4d32bc4a555b87c76a5e.jpg">
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
const showEditor = () => {
  console.log('Show editor');
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
