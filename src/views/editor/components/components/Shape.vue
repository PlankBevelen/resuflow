<template>
  <div class="panel">
    <div class="panel-body">
      <div class="panel-title">基础图形</div>
      <div class="shape-grid">
        <div class="shape-item" @mousedown="startDrag('rect')" @click="addNode('rect')">
          <div class="icon-box">
            <svg-icon name="rectangle" style="color: black;"/>
          </div>
          <span class="label">矩形</span>
        </div>
        <div class="shape-item" @mousedown="startDrag('circle')" @click="addNode('circle')">
          <div class="icon-box">
            <svg-icon name="circle" style="color: black;"/>
          </div>
          <span class="label">圆形</span>
        </div>
        <div class="shape-item" @mousedown="startDrag('text')" @click="addNode('text')">
          <div class="icon-box">
            <svg-icon name="text" style="color: black;"/>
          </div>
          <span class="label">文本</span>
        </div>
        <div class="shape-item" @mousedown="startDrag('html')" @click="addNode('html')">
          <div class="icon-box">
            <svg-icon name="html" style="color: black;"/>
          </div>
          <span class="label">HTML</span>
        </div>
        <div class="shape-item" @mousedown="startDrag('line')" @click="addNode('line')">
          <div class="icon-box">
            <svg-icon name="line" style="color: black;"/>
          </div>
          <span class="label">线条</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/stores/editor';

const store = useEditorStore();

const startDrag = (type: string) => {
  if (store.lf) {
    store.lf.dnd.startDrag({
      type,
      text: type === 'text' ? '文本节点' : '',
    });
  } else {
    // Fallback for non-LogicFlow canvas (if we want to support legacy custom canvas via dnd in future)
    // For now, assume LF is target.
    console.warn('LogicFlow instance not found in store.');
  }
};

const addNode = (type: string) => {
  if (store.lf) {
    const { graphModel } = store.lf;
    const { width, height } = graphModel;
    // Add node to the center of the view
    store.lf.addNode({
      type,
      x: width / 2,
      y: height / 2,
      text: type === 'text' ? '文本节点' : '',
    });
  }
};
</script>

<style lang="less" scoped>
.panel {
  width: 280px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
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
