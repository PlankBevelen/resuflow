<template>
  <div class="panel">
    <div class="panel-body">
      <div class="form-item">
        <label class="label">上传图片</label>
        <div class="upload-row">
          <input ref="fileInput" class="hidden-input" type="file" accept="image/*" @change="handleUpload" />
          <button class="upload-btn" @click="triggerUpload">
            <span class="iconify" data-icon="solar:upload-linear"></span>
            选择图片
          </button>
        </div>
      </div>

      <div v-if="preview" class="preview" draggable="true" @dragstart="startDrag">
        <img :src="preview" alt="预览" />
        <div class="drag-tip">拖拽图片到画布</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useEditorStore } from '@/stores/editor';

const store = useEditorStore();
const fileInput = ref<HTMLInputElement | null>(null);
const preview = ref<string>('');

function triggerUpload() {
  fileInput.value?.click();
}

function handleUpload(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const result = ev.target?.result as string;
    preview.value = result;
  };
  reader.readAsDataURL(file);
  input.value = '';
}

function startDrag(e: DragEvent) {
    if (store.lf && preview.value) {
        // LogicFlow 的 DndPanel 插件会拦截 drag 事件
        // 需要设置一些必要的属性，例如 text (尽管图片节点不需要显示文本)
        store.lf.dnd.startDrag({
            type: 'image',
            text: '', // 某些版本 LogicFlow 可能需要 text 字段
            properties: {
                src: preview.value,
                width: 200,
                height: 150
            }
        });
    }
}
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.label {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
}
.upload-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #2563eb;
  color: #fff;
  border-radius: 8px;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
}
.hidden-input {
  display: none;
}
.preview {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  background: #f8fafc;
  cursor: grab;
  position: relative;
  transition: all 0.2s;
  
  &:hover {
      border-color: #3b82f6;
      box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
  }
}
.preview img {
  width: 100%;
  display: block;
  border-radius: 6px;
  pointer-events: none; /* 防止图片本身的拖拽干扰 */
}
.drag-tip {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0,0,0,0.5);
    color: white;
    font-size: 10px;
    text-align: center;
    padding: 4px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    opacity: 0;
    transition: opacity 0.2s;
}
.preview:hover .drag-tip {
    opacity: 1;
}
</style>
