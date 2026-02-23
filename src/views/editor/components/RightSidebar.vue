<template>
  <aside class="maker-sidebar-right">
    <div class="sidebar-content">
      <h3 class="section-title">属性编辑</h3>
      
      <div v-if="!selectedElement" class="empty-state">
        <div class="empty-icon">
          <span class="iconify" data-icon="solar:magic-stick-3-linear"></span>
        </div>
        <p class="empty-text">选择画布中的元素<br>开始自定义设计</p>
      </div>

      <div v-else class="controls-container">
        <el-form label-position="top" :model="form" class="el-form-compact">
          <!-- 基本信息 -->
          <el-form-item label="ID">
            <el-input v-model="form.id" disabled />
          </el-form-item>
          <el-form-item label="类型">
            <el-input v-model="form.type" disabled />
          </el-form-item>
          <el-form-item label="X">
            <el-input v-model.number="form.x" type="number" @change="commitNumber('x', form.x)" />
          </el-form-item>
          <el-form-item label="Y">
            <el-input v-model.number="form.y" type="number" @change="commitNumber('y', form.y)" />
          </el-form-item>

          <!-- 文本节点 -->
          <template v-if="selectedElement.type === 'text'">
            <el-form-item label="文本内容">
              <el-input v-model="form.text" @change="(v:any)=> updateText(v)" />
            </el-form-item>
            <el-form-item label="字体大小">
              <el-input v-model.number="form.fontSize" type="number" @change="commitNumber('fontSize', form.fontSize)" />
            </el-form-item>
            <el-form-item label="颜色">
              <input class="color-input" type="color" v-model="form.color" @change="(e:any)=>updateProperty('color', e.target.value)" />
            </el-form-item>
          </template>

          <!-- 形状节点 -->
          <template v-if="['rect','circle','line'].includes(selectedElement.type)">
            <el-form-item label="宽度">
              <el-input v-model.number="form.width" type="number" @change="commitNumber('width', form.width)" />
            </el-form-item>
            <el-form-item label="高度">
              <el-input v-model.number="form.height" type="number" @change="commitNumber('height', form.height)" />
            </el-form-item>
            <el-form-item label="填充颜色" v-if="selectedElement.type !== 'line'">
              <input class="color-input" type="color" v-model="form.fill" @change="(e:any)=>updateProperty('fill', e.target.value)" />
            </el-form-item>
            <el-form-item label="边框颜色">
              <input class="color-input" type="color" v-model="form.stroke" @change="(e:any)=>updateProperty('stroke', e.target.value)" />
            </el-form-item>
          </template>
        </el-form>
      </div>
    </div>

    <div class="sidebar-footer">
      <button class="delete-btn" @click="deleteElement" :disabled="!selectedElement">
        <span class="iconify" data-icon="solar:trash-bin-trash-bold"></span>
        删除选中元素
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { ElForm, ElFormItem, ElInput } from 'element-plus';

const store = useEditorStore();

const selectedElement = computed(() => {
  if (!store.selectedId || !store.lf) return null;
  return store.lf.graphModel.getNodeModelById(store.selectedId) as any; // Cast to any to avoid strict type checks
});

const form = reactive({
  id: '',
  type: '',
  x: 0,
  y: 0,
  text: '',
  fontSize: 12,
  color: '#000000',
  width: 100,
  height: 80,
  fill: '#ffffff',
  stroke: '#000000'
});

watch(selectedElement, (el) => {
  if (!el) return;
  form.id = el.id || '';
  form.type = el.type || '';
  form.x = el.x || 0;
  form.y = el.y || 0;
  form.text = el.text?.value || '';
  form.fontSize = el.properties?.fontSize ?? 12;
  form.color = el.properties?.color ?? '#000000';
  form.width = el.properties?.width ?? el.width ?? 100;
  form.height = el.properties?.height ?? el.height ?? 80;
  form.fill = el.properties?.fill ?? '#ffffff';
  form.stroke = el.properties?.stroke ?? '#000000';
}, { immediate: true });

const updateProperty = (key: string, value: any) => {
  if (selectedElement.value && store.lf) {
      if (['x', 'y'].includes(key)) {
         // Update position directly via model
          const model = store.lf.graphModel.getNodeModelById(selectedElement.value.id);
          if(model) {
              model[key] = value;
          }
      } else {
         store.lf.setProperties(selectedElement.value.id, { [key]: value });
      }
  }
};

const commitNumber = (key: 'x'|'y'|'width'|'height'|'fontSize', value: number) => {
  if (key === 'x' || key === 'y') {
    updateProperty(key, Number(value));
  } else {
    updateProperty(key, Number(value));
  }
};

const updateText = (value: string) => {
    if (selectedElement.value && store.lf) {
        store.lf.updateText(selectedElement.value.id, value);
    }
}

const deleteElement = () => {
    if (store.selectedId && store.lf) {
        store.lf.deleteNode(store.selectedId);
        store.selectedId = null;
    }
}

</script>

<style lang="less" scoped>
.maker-sidebar-right {
  background: #fff;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  z-index: 10;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  height: 100%;

  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 1.5rem 0 1.5rem;   
  }

  .section-title {
    font-size: 0.875rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1rem;
  }

  .empty-state {
    text-align: center;
    padding: 2.5rem 0;
    
    .empty-icon {
      width: 4rem;
      height: 4rem;
      background: #f8fafc;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      
      .iconify {
        font-size: 1.875rem;
        color: #cbd5e1;
      }
    }

    .empty-text {
      font-size: 0.875rem;
      color: #94a3b8;
      line-height: 1.5;
    }
  }

  .controls-container {
    animation: fadeUp 0.3s ease-out;
    min-width: 0;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 1rem;
    
    &:last-child {
        border-bottom: none;
    }
  }

  .form-item {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-width: 0;
  }

  .label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    min-width: 0;
  }

  .text-input {
    width: 100%;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px #dbeafe;
    }
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
  }
  
  .color-input {
      width: 100%;
      height: 40px;
      padding: 0 4px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      cursor: pointer;
  }

  .sidebar-footer {
    margin-top: auto;
    padding: 1.5rem;
    border-top: 1px solid #f1f5f9;
  }

  .delete-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border: 2px solid #fef2f2;
    color: #f87171;
    background: transparent;
    border-radius: 0.75rem;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: #fef2f2;
      color: #ef4444;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
  }
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
