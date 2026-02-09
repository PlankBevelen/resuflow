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

      <div v-if="preview" class="preview">
        <img :src="preview" alt="预览" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'add-image', src: string): void
}>();

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
    emit('add-image', result);
  };
  reader.readAsDataURL(file);
  input.value = '';
}
</script>

<style lang="less" scoped>
.panel {
  width: 280px;
  background: #fff;
  border-left: 1px solid #e2e8f0;
}
.panel-body {
  padding: 1.5rem;
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
}
.preview img {
  width: 100%;
  display: block;
  border-radius: 6px;
}
</style>
