<template>
  <div class="panel">
    <div class="panel-body">
      <div class="panel-title">基础图形</div>
      <div class="shape-grid">
        <div class="shape-item" @mousedown="startDrag('rect')">
          <div class="icon-box">
            <span class="iconify" data-icon="solar:card-linear"></span>
          </div>
          <span class="label">矩形</span>
        </div>
        <div class="shape-item" @mousedown="startDrag('circle')">
          <div class="icon-box">
            <span class="iconify" data-icon="solar:circle-linear"></span>
          </div>
          <span class="label">圆形</span>
        </div>
        <div class="shape-item" @mousedown="startDrag('text')">
          <div class="icon-box">
            <span class="iconify" data-icon="solar:text-field-linear"></span>
          </div>
          <span class="label">文本</span>
        </div>
        <div class="shape-item" @mousedown="startDrag('html')">
          <div class="icon-box">
            <span class="iconify" data-icon="solar:code-linear"></span>
          </div>
          <span class="label">HTML</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'style-change', key: string, value: any): void
}>();

import LogicFlow from '@logicflow/core';
import "@logicflow/core/lib/style/index.css";
import { DndPanel, SelectionSelect } from '@logicflow/extension';
import '@logicflow/extension/lib/style/index.css'



</script>

<style lang="less" scoped>
.panel {
  width: 280px;
  background: #fff;
  border-left: 1px solid #e2e8f0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-body {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.panel-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #94a3b8;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.shape-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.shape-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  cursor: grab;
  transition: all 0.2s;

  &:hover {
    background: #fff;
    border-color: #3b82f6;
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
    
    .icon-box {
      color: #3b82f6;
    }
    .label {
      color: #3b82f6;
    }
  }

  &:active {
    cursor: grabbing;
    transform: scale(0.98);
  }

  .icon-box {
    font-size: 2rem;
    color: #64748b;
    transition: color 0.2s;
  }

  .label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    transition: color 0.2s;
  }
}
</style>
