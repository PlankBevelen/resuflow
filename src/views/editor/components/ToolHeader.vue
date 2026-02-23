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
    <div class="header-center">
        <div class="zoom-controls">
            <button class="zoom-btn" @click="store.zoomGraph(store.zoom - 0.1)">
                <span class="iconify" data-icon="solar:minus-circle-linear"></span>
            </button>
            <span class="zoom-value">{{ Math.round(store.zoom * 100) }}%</span>
            <button class="zoom-btn" @click="store.zoomGraph(store.zoom + 0.1)">
                <span class="iconify" data-icon="solar:add-circle-linear"></span>
            </button>
            <div class="divider"></div>
            <button class="zoom-btn" @click="store.resetZoom()">
                <span class="iconify" data-icon="solar:re-square-linear"></span>
            </button>
        </div>
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
import { useEditorStore } from '@/stores/editor';

const router = useRouter();
const store = useEditorStore();

const goBack = () => {
  router.back();
};
</script>

<style lang="less" scoped>
@import './ToolHeader.less';

.header-center {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;

  .zoom-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 4px;
    color: #64748b;
    font-size: 1.25rem;

    &:hover {
      background: #eff6ff;
      color: #2563eb;
    }
  }

  .zoom-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: #334155;
    min-width: 48px;
    text-align: center;
    user-select: none;
  }

  .divider {
    width: 1px;
    height: 16px;
    background: #e2e8f0;
    margin: 0 4px;
  }
}
</style>
