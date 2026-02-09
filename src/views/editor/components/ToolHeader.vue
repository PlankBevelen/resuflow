<template>
  <header class="tool-header">
    <div class="header-left">
      <el-button class="back-btn" @click="goBack">
        <span class="iconify" data-icon="solar:alt-arrow-left-linear"></span>
      </el-button>
      <div class="divider"></div>
      <h2 class="doc-title">我的简历 - 2026版</h2>
      <span class="update-badge">更新于: 2026-02-05</span>
    </div>
    <div class="header-right">
      <button class="preview-btn">
        <span class="iconify" data-icon="solar:eye-linear"></span>
        预览
      </button>
      <button class="export-btn">
        <span class="iconify" data-icon="solar:download-minimalistic-linear"></span>
        导出 PDF
      </button>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<style lang="less" scoped>
@import './ToolHeader.less';
</style>
