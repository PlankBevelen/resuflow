import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';
import type LogicFlow from '@logicflow/core';

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'rect' | 'circle' | 'html' | 'line';
  x: number;
  y: number;
  text?: {
      value: string;
      x: number;
      y: number;
  };
  properties: Record<string, any>;
}

export const useEditorStore = defineStore('editor', () => {
  // LogicFlow 实例，使用 shallowRef 避免深度响应式导致的性能问题
  const lf = shallowRef<LogicFlow | null>(null);
  
  // 当前选中的节点 ID
  const selectedId = ref<string | null>(null);
  
  // 画布缩放比例
  const zoom = ref(1);

  // 纸张尺寸配置
  const paperSize = ref<'A4' | 'A5'>('A4');
  const paperDimensions = {
    A4: { width: 794, height: 1123 }, // 96 DPI
    A5: { width: 559, height: 794 }
  };

  // 切换纸张尺寸
  function setPaperSize(size: 'A4' | 'A5') {
    paperSize.value = size;
    // 需要通知 LogicFlow 更新画布区域限制（如果 LogicFlow 支持动态调整容器大小）
    // 或者在视图层通过响应式 width/height 调整容器
  }

  // 初始化 LogicFlow
  function setLogicFlow(instance: LogicFlow) {
    lf.value = instance;
    
    // 监听缩放事件，同步 zoom 状态
    instance.on('graph:transform', (data) => {
        if(data && data.transform) {
             zoom.value = (data.transform as any).k;
        }
    });
  }

  // 选中元素
  function selectElement(id: string | null) {
    selectedId.value = id;
    if (lf.value) {
        if (id) {
            lf.value.selectElementById(id, true);
        } else {
            lf.value.clearSelectElements();
        }
    }
  }
  
  // 缩放画布
  function zoomGraph(value: number) {
      zoom.value = value;
      // if(lf.value) {
      //     lf.value.zoom(value);
      // }
  }
  
  // 重置缩放
  function resetZoom() {
      zoom.value = 1;
      // if(lf.value) {
      //     lf.value.resetZoom();
      // }
  }
  
  // 撤销
  function undo() {
      if(lf.value) {
          lf.value.undo();
      }
  }

  // 重做
  function redo() {
      if(lf.value) {
          lf.value.redo();
      }
  }

  return {
    lf,
    selectedId,
    zoom,
    setLogicFlow,
    selectElement,
    zoomGraph,
    resetZoom,
    undo,
    redo,
    paperSize,
    paperDimensions,
    setPaperSize
  };
});
