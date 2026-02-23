<template>
  <div class="editor">
    <ToolHeader />
    <div class="content">
      <LeftSidebar />
      <div class="main-content">
        <div class="canvas-scroller" ref="scroller">
            <div 
                id="resume-canvas"
                ref="container" 
                class="container" 
                :style="{ 
                    width: store.paperDimensions[store.paperSize].width + 'px', 
                    height: store.paperDimensions[store.paperSize].height + 'px',
                    transform: `scale(${store.zoom})`,
                    transformOrigin: 'center top'
                }" 
            />
        </div>
        <div class="paper-controls">
            <span>{{ store.paperDimensions[store.paperSize].width }} x {{ store.paperDimensions[store.paperSize].height }} px</span>
            <el-select
              class="paper-size-select"
              :model-value="store.paperSize"
              size="small"
              @change="(v: 'A4'|'A5') => store.setPaperSize(v)"
            >
              <el-option label="A4" value="A4" />
              <el-option label="A5" value="A5" />
            </el-select>
        </div>
      </div>
      <RightSidebar />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ToolHeader from './components/ToolHeader.vue';
import LeftSidebar from './components/LeftSidebar.vue';
import RightSidebar from './components/RightSidebar.vue';
import { onMounted, ref, watch, nextTick } from 'vue';
import LogicFlow from '@logicflow/core';
import { DndPanel, SelectionSelect, NodeResize, Snapshot } from '@logicflow/extension';
import { useEditorStore } from '@/stores/editor';

import LineNode from './components/nodes/LineNode';
import HtmlNode from './components/nodes/HtmlNode';
import CircleNode from './components/nodes/CircleNode';
import RectNode from './components/nodes/RectNode';
import TextNode from './components/nodes/TextNode';
import ImageNode from './components/nodes/ImageNode';

const store = useEditorStore();
let lf: LogicFlow;
const container = ref<HTMLElement>()
const scroller = ref<HTMLElement>()
const selectedNode = ref<any>(null)   // 选中节点

onMounted(() => {
  LogicFlow.use(DndPanel);
  LogicFlow.use(SelectionSelect);
  LogicFlow.use(NodeResize);
  LogicFlow.use(Snapshot);  // 启用快照功能
  
  // Register custom nodes
  lf = new LogicFlow({
    container: container.value as HTMLElement,
    grid: {
      size: 1,
      visible: false,
    },
    nodeTextEdit: true, // Allow double click to edit text for all nodes that support it
    snapline: true,
    stopMoveGraph: true, // 禁止画布拖拽
    stopScrollGraph: true, // 禁止滚轮缩放/移动
    stopZoomGraph: true, // 禁止滚轮缩放
    width: store.paperDimensions[store.paperSize].width,
    height: store.paperDimensions[store.paperSize].height,
    keyboard: {
      enabled: true,
      shortcuts: [
        {
          keys: ["ctrl + c"],
          callback: () => {
            if (selectedNode.value) {
               // Clone the data deeply
               const nodeModel = lf.graphModel.getNodeModelById(selectedNode.value.id);
               if (nodeModel) {
                 // Save to clipboard (local variable)
                 // We use a global or outer scope variable, or just attach to window for simplicity in this demo context, 
                 // but let's use a module level variable.
                 (window as any)._clipboardData = nodeModel.getData();
               }
            }
            return false; // prevent default
          }
        },
        {
          keys: ["ctrl + v"],
          callback: () => {
            const data = (window as any)._clipboardData;
            if (data) {
              // 创建新节点
               const newNode = JSON.parse(JSON.stringify(data));
               newNode.id = undefined;
               newNode.x = newNode.x + 20;
               newNode.y = newNode.y + 20;
               if (newNode.text && typeof newNode.text === 'object') {
                  newNode.text.x = newNode.x;
                  newNode.text.y = newNode.y;
               }
               lf.addNode(newNode);
            }
            return false;
          }
        }
      ]
    },
    allowResize: true,
  });

  lf.register(LineNode);
  lf.register(HtmlNode);
  lf.register(CircleNode);
  lf.register(RectNode);
  lf.register(TextNode);
  lf.register(ImageNode);

  store.setLogicFlow(lf);
  lf.render(store.data || {});
  
  // 确保 SVG 尺寸正确
  const { width, height } = store.paperDimensions[store.paperSize];
  lf.resize(width, height);

  lf.on('element:click', ({ data }) => {
    store.selectElement(data.id);
  });

  lf.on('blank:click', () => {
    store.selectElement(null);
  });

  const constrainNode = (nodeModel: any) => {
      const { width, height } = store.paperDimensions[store.paperSize];
      let x = nodeModel.x;
      let y = nodeModel.y;
      
      let w = nodeModel.width;
      let h = nodeModel.height;
      
      if (nodeModel.type === 'circle') {
          const r = (nodeModel as any).r;
          if (r) {
              w = r * 2;
              h = r * 2;
          }
      }

      // Round to 0.1 precision
      x = Math.round(x * 10) / 10;
      y = Math.round(y * 10) / 10;
      w = Math.round(w * 10) / 10;
      h = Math.round(h * 10) / 10;

      let modified = false;
      
      // Update model if rounded values differ
      if (x !== nodeModel.x || y !== nodeModel.y) {
          modified = true;
      }
      if (w !== nodeModel.width || h !== nodeModel.height) {
          // Only update if not circle (circle uses r)
          if (nodeModel.type !== 'circle') {
              nodeModel.width = w;
              nodeModel.height = h;
              // No need to set modified=true for width/height as we set them directly here? 
              // But x/y are set at end.
          } else {
             // For circle, we might need to update r?
             // But NodeResize usually updates rx/ry or r.
             // If we just round x/y that's fine.
          }
      }

      // 边界计算：
      // LogicFlow 节点中心点为 (x, y)，宽高为 w, h
      // 左边界：x - w/2
      // 右边界：x + w/2
      // 上边界：y - h/2
      // 下边界：y + h/2
      
      if (x - w / 2 < 0) { x = w / 2; modified = true; }
      if (x + w / 2 > width) { x = width - w / 2; modified = true; }
      if (y - h / 2 < 0) { y = h / 2; modified = true; }
      if (y + h / 2 > height) { y = height - h / 2; modified = true; }
      
      if (modified) {
        nodeModel.x = x;
        nodeModel.y = y;
      }
  }

  lf.on('node:drag', ({ data }) => {
      const nodeModel = lf.graphModel.getNodeModelById(data.id);
      if (nodeModel) constrainNode(nodeModel);
  });

  lf.on('node:resize', ({ data }) => {
      const nodeModel = lf.graphModel.getNodeModelById(data.id);
      if (nodeModel) constrainNode(nodeModel);
  });

  lf.on('node:add', ({ data }) => {
      const nodeModel = lf.graphModel.getNodeModelById(data.id);
      if (nodeModel) constrainNode(nodeModel);
  });
  
  // 首次渲染后居中
  centerHorizontally();
})

// 当纸张尺寸或缩放变化时，保持水平居中
watch(
  () => store.paperSize,
  () => {
    const { width, height } = store.paperDimensions[store.paperSize];
    lf?.resize(width, height);
    centerHorizontally();
  }
);

watch(
  () => store.zoom,
  () => {
    centerHorizontally();
  }
);

function centerHorizontally() {
  nextTick(() => {
    const el = scroller.value;
    if (!el) return;
    // 将滚动容器水平滚动到内容正中
    const target = (el.scrollWidth - el.clientWidth) / 2;
    el.scrollLeft = target > 0 ? target : 0;
  });
}
</script>

<style scoped lang="less">
.editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .content {
    flex: 1;
    display: flex;
    overflow: hidden;
    .main-content {
      flex: 1;
      overflow: hidden;
      position: relative;
      background-color: #f1f5f9;
      display: flex;
      flex-direction: column;
      z-index: 1; /* Ensure canvas is above sidebars if they overlap */
      
      .canvas-scroller {
        flex: 1;
        overflow: auto;
        display: flex;
        flex-direction: column;
        /* Remove explicit align-items: center to avoid left-overflow issues on zoom */
        /* But wait, user wants centered. The best way for zoomable centered content with scroll is margin: auto on child */
        
        padding: 40px;
        box-sizing: border-box;

        .container {
          margin: auto; /* This centers the item if it's smaller than container, and allows scroll if larger */
          background-color: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          flex-shrink: 0;
          will-change: transform;
          backface-visibility: hidden;
          transition: width 0.3s, height 0.3s, transform 0.3s;
          /* 
             Fix bottom margin for zoom. 
             When zoomed, the element visually expands.
             We need to ensure there is space at the bottom.
             The visual height increase is height * (zoom - 1).
             Plus we want 40px base margin.
          */
          margin-bottom: calc(40px + v-bind('store.paperDimensions[store.paperSize].height * (store.zoom - 1)') * 1px);
          
          /* 
             Horizontal margin fix for zoom scaling.
             The element scales from 'center top', so width expands symmetrically.
             To prevent overflow clipping and ensure scrollbars appear correctly, we need to add margins.
          */
          margin-left: auto;
          margin-right: auto;
          
          /* 
            Since transform doesn't affect layout flow, we need to simulate the expanded width 
            if the zoomed element exceeds the container.
            However, margin: auto handles centering. 
            The issue is ensuring scrollbars appear when zoomed content is larger than viewport.
            The wrapper needs to be large enough.
          */
          
          /* 禁用 LogicFlow 内部元素的过渡效果，防止拖拽延迟 */
          & :deep(*) {
              transition: none !important;
          }

          /* 允许 SVG 内容溢出，防止节点被裁剪 */
          & :deep(svg) {
              overflow: visible !important;
          }
        }
      }
      
      .paper-controls {
          position: fixed;
          bottom: 20px;
          right: 320px; /* 紧挨右侧侧边栏 (288px + margin) */
          background: white;
          padding: 8px 12px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
          z-index: 20;

          .paper-size-select {
            min-width: 96px;
          }
      }      
    }
  }
  /* 指针样式：悬停到节点时显示为 pointer，不影响拖拽 */
  :deep(.lf-node),
  :deep(.lf-node *) {
    cursor: pointer;
  }
}
</style>

