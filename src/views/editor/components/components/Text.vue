<template>
  <div class="panel">
    <div class="panel-body">
      <div class="form-item">
        <label class="label">
          <span class="iconify" data-icon="solar:text-field-linear"></span>
          字体家族
        </label>
        <select class="select-input" @change="onFamilyChange">
          <option value="思源黑体">思源黑体</option>
          <option value="思源宋体">思源宋体</option>
          <option value="PingFang SC">PingFang SC</option>
          <option value="Roboto">Roboto</option>
        </select>
      </div>

      <div class="grid-2">
        <div class="form-item">
          <label class="label">字号</label>
          <div class="input-wrapper">
            <input class="text-input" type="number" :value="size" @input="onSizeChange" />
            <span class="suffix">px</span>
          </div>
        </div>
        <div class="form-item">
          <label class="label">颜色</label>
          <div class="color-picker">
            <input class="color-input" type="color" :value="color" @input="onColorChange" />
            <span class="color-label">选色</span>
          </div>
        </div>
      </div>

      <div class="btn-group">
        <button class="style-btn" @click="toggleBold">
          <span class="iconify" data-icon="solar:text-bold-bold"></span>
        </button>
        <button class="style-btn" @click="toggleItalic">
          <span class="iconify" data-icon="solar:text-italic-bold"></span>
        </button>
        <button class="style-btn" @click="toggleUnderline">
          <span class="iconify" data-icon="solar:text-underline-bold"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'style-change', key: string, value: any): void
}>();

const size = ref(16);
const color = ref('#000000');
const bold = ref(false);
const italic = ref(false);
const underline = ref(false);

function onFamilyChange(e: Event) {
  const v = (e.target as HTMLSelectElement).value;
  emit('style-change', 'fontFamily', v);
}
function onSizeChange(e: Event) {
  const v = parseInt((e.target as HTMLInputElement).value || '16');
  size.value = v;
  emit('style-change', 'fontSize', v + 'px');
}
function onColorChange(e: Event) {
  const v = (e.target as HTMLInputElement).value;
  color.value = v;
  emit('style-change', 'color', v);
}
function toggleBold() {
  bold.value = !bold.value;
  emit('style-change', 'fontWeight', bold.value ? 'bold' : 'normal');
}
function toggleItalic() {
  italic.value = !italic.value;
  emit('style-change', 'fontStyle', italic.value ? 'italic' : 'normal');
}
function toggleUnderline() {
  underline.value = !underline.value;
  emit('style-change', 'textDecoration', underline.value ? 'underline' : 'none');
}
</script>

<style lang="less" scoped>
.panel {
  width: 280px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
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
  display: flex;
  align-items: center;
  gap: 4px;
}
.select-input,
.text-input {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  outline: none;
}
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.input-wrapper {
  position: relative;
}
.suffix {
  position: absolute;
  right: 12px;
  top: 8px;
  font-size: 12px;
  color: #94a3b8;
}
.color-picker {
  display: flex;
  gap: 8px;
  align-items: center;
  height: 38px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 8px;
}
.color-input {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
}
.color-label {
  font-size: 12px;
  color: #94a3b8;
}
.btn-group {
  display: flex;
  gap: 8px;
}
.style-btn {
  flex: 1;
  padding: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
  color: #64748b;
}
</style>
