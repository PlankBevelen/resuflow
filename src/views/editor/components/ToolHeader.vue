<template>
  <header class="tool-header">
    <div class="header-left">
      <el-button class="back-btn" @click="goBack">
        <span class="iconify" data-icon="solar:alt-arrow-left-linear"></span>
      </el-button>
      <div class="divider"></div>
      
      <div class="title-container">
        <el-input 
            v-if="isEditingTitle" 
            ref="titleInputRef"
            v-model="store.title" 
            size="small" 
            @blur="isEditingTitle = false" 
            @keyup.enter="isEditingTitle = false"
            class="title-input w-200"
        />
        <h2 v-else class="doc-title w-200 text-ellipsis" @click="startEditTitle">{{ store.title }}</h2>
      </div>
      
      <span class="edit-btn" @click="startEditTitle" v-if="!isEditingTitle">
        <svg-icon name="edit" />
      </span>
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
              <svg-icon class="iconify" name="sq-square" />
            </button>
        </div>
    </div>
    <div class="header-right">
      <button class="preview-btn" @click="handlePreview">
        <span class="iconify" data-icon="solar:eye-linear"></span>
        预览
      </button>
      <button class="export-btn" @click="handleExport" :loading="exporting">
        <span class="iconify" data-icon="solar:download-minimalistic-linear"></span>
        {{ exporting ? '导出中...' : '导出 PDF' }}
      </button>
    </div>

    <!-- 预览弹窗 -->
    <el-dialog v-model="previewVisible" title="预览" width="80%" top="5vh">
        <div class="preview-container">
            <img v-if="previewImage" :src="previewImage" alt="预览图" style="max-width: 100%; border: 1px solid #eee; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
        </div>
    </el-dialog>
  </header>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useEditorStore } from '@/stores/editor';
import { ref, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const router = useRouter();
const store = useEditorStore();

const isEditingTitle = ref(false);
const titleInputRef = ref<any>(null);

const previewVisible = ref(false);
const previewImage = ref('');
const exporting = ref(false);

const goBack = () => {
  router.back();
};

const startEditTitle = () => {
    isEditingTitle.value = true;
    nextTick(() => {
        titleInputRef.value?.focus();
    });
}

const handlePreview = () => {
    if (store.lf) {
        // 使用 LogicFlow 的 Snapshot 插件获取图片
        // 需要先确保 Snapshot 插件已注册
        store.lf.getSnapshotBase64().then((data: any) => {
             // data 可能是 string 或者 object { data: string, width, height }
             // LogicFlow 1.2+ getSnapshotBase64 return Promise resolving to object with data
             if (typeof data === 'string') {
                 previewImage.value = data;
             } else if (data && data.data) {
                 previewImage.value = data.data;
             }
             previewVisible.value = true;
        }).catch((err: any) => {
             console.error(err);
             ElMessage.error('生成预览失败');
        });
    }
}

const handleExport = async () => {
    if (exporting.value) return;
    exporting.value = true;
    
    try {
        const element = document.getElementById('resume-canvas');
        if (!element) {
            ElMessage.error('未找到画布元素');
            return;
        }

        // 1. 临时保存当前状态
        const originalTransform = element.style.transform;
        const originalMargin = element.style.margin;
        
        // 2. 重置变换以确保高清截图 (scale 1)
        // 注意：html2canvas 截图时如果元素被 scale 缩小，截图也会模糊或缩小
        // 我们需要临时将画布 scale 设置为 1，或者利用 html2canvas 的 scale 选项
        // 这里选择使用 html2canvas 的 scale 选项，通常设为 2 或更高以获得高清图
        // 但是 element 本身的 transform scale 可能会干扰，所以最好先重置 element 的 scale
        
        // 简单做法：直接截图，html2canvas 会尝试渲染 DOM
        // 如果 DOM 上有 transform: scale(...)，html2canvas 可能会截取缩放后的
        // 建议：暂时移除 transform，让它以 100% 大小渲染，截图后再恢复
        
        element.style.transform = 'scale(1)';
        element.style.margin = '0'; // 移除 margin 防止截图偏移
        
        // 等待 DOM 更新
        await nextTick();

        const canvas = await html2canvas(element, {
            scale: 2, // 提高清晰度
            useCORS: true, // 允许跨域图片
            logging: false,
            backgroundColor: '#ffffff'
        });

        // 3. 恢复状态
        element.style.transform = originalTransform;
        element.style.margin = originalMargin;

        // 4. 生成 PDF
        const contentWidth = canvas.width;
        const contentHeight = canvas.height;

        // 纸张尺寸 (A4)
        // A4 210mm x 297mm
        const pdfWidth = 595.28;
        const pdfHeight = 841.89;
        
        // 计算图片在 PDF 中的尺寸 (等比缩放)
        const imgWidth = pdfWidth;
        const imgHeight = (pdfWidth / contentWidth) * contentHeight;

        const pdf = new jsPDF('p', 'pt', 'a4');
        
        // 如果内容高度超过一页，需要分页处理 (这里暂只处理单页，或者简单的多页逻辑)
        // 简单逻辑：如果 imgHeight > pdfHeight，则添加新页
        // 但 html2canvas 生成的是单张大图，分页需要切割图片，较复杂。
        // 这里假设简历通常为 1-2 页，直接按比例放入
        
        let position = 0;
        // const pageHeight = pdfHeight; // 如果需要分页
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        
        // 如果高度超过一页 (简单处理：调整页面高度适应内容，或者让用户自己控制内容在 A4 内)
        // 简历场景通常建议用户控制在一页或两页。
        // 如果要严格分页，需要循环 addImage 并调整 position (offset)
        
        pdf.save(`${store.title || 'resume'}.pdf`);
        ElMessage.success('导出成功');

    } catch (error) {
        console.error('导出失败', error);
        ElMessage.error('导出 PDF 失败');
    } finally {
        exporting.value = false;
        // 再次确保恢复，防止 try 中出错未恢复
        const element = document.getElementById('resume-canvas');
        if(element) {
             // 我们在 try 块中已经恢复了，但如果 error 发生在恢复之前...
             // 这里无法简单获取 originalTransform，所以依赖 try 块中的恢复
             // 实际上 store.zoom 会驱动 style 更新，如果 transform 丢失，
             // 下次 zoom 变化时会自动恢复。或者我们可以调用 store.resetZoom() ?
             // 不，最好是在 catch 前确保恢复。
             // 改进：把恢复放在 finally? 不行，original 变量在 try 块内。
             // 就在 try 块最后恢复即可。
             
             // 强制触发一次更新确保样式正确
             element.style.transform = `scale(${store.zoom})`;
             // margin 是动态计算的，Vue 会自动接管吗？
             // 如果直接修改 style，Vue 的绑定可能不会立即覆盖回来，直到下一次 update
             // 最好不要直接操作 DOM，而是通过状态控制
             // 但为了 html2canvas，临时操作 DOM 是最快的。
        }
    }
}
</script>

<style lang="less" scoped>
@import './ToolHeader.less';

.w-200 {
  width: 200px;
}
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-left {
  .title-container {
      display: flex;
      align-items: center;
      min-width: 200px;
  }
  .title-input {
      font-size: 18px;
      font-weight: 600;
  }
  .doc-title {
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background-color 0.2s;
      &:hover {
          background-color: #f1f5f9;
      }
  }
  .edit-btn {
    color: #64748b;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 4px;
    &:hover {
        background-color: #f1f5f9;
        color: #2563eb;
    }
  }
}
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

.preview-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background: #f0f2f5;
    min-height: 400px;
}

@media print {
    .tool-header, .left-sidebar, .maker-sidebar-right, .paper-controls {
        display: none !important;
    }
    .editor {
        height: auto !important;
        overflow: visible !important;
    }
    .content {
        overflow: visible !important;
    }
    .main-content {
        background: white !important;
        overflow: visible !important;
    }
    .canvas-scroller {
        padding: 0 !important;
        overflow: visible !important;
        display: block !important;
    }
    .container {
        box-shadow: none !important;
        border: none !important;
        margin: 0 !important;
        transform: none !important; /* Ensure scale is 1 for print */
    }
}
</style>
