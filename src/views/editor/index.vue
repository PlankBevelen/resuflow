<template>
  <div class="editor">
    <ToolHeader />
    <div class="content">
      <LeftSidebar />
      <div class="main-content">
        <div class="canvas-scroller">
            <div 
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
            <select :value="store.paperSize" @change="(e: any) => store.setPaperSize(e.target.value)">
                <option value="A4">A4</option>
                <option value="A5">A5</option>
            </select>
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
import { onMounted, ref } from 'vue';
import LogicFlow from '@logicflow/core';
import { DndPanel, SelectionSelect } from '@logicflow/extension';
import { useEditorStore } from '@/stores/editor';

const store = useEditorStore();
let lf: LogicFlow;
const container = ref<HTMLElement>()
const selectedNode = ref<any>(null)   // 选中节点

onMounted(() => {
  LogicFlow.use(DndPanel);
  LogicFlow.use(SelectionSelect);

  lf = new LogicFlow({
    container: container.value as HTMLElement,
    grid: {
      size: 20,
      visible: false,
    },
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

  store.setLogicFlow(lf);
  lf.render({});

  lf.on('element:click', ({ data }) => {
    store.selectElement(data.id);
  });

  lf.on('blank:click', () => {
    store.selectElement(null);
  });

  lf.on('node:drag', ({ data }) => {
      const { width, height } = store.paperDimensions[store.paperSize];
      const nodeModel = lf.graphModel.getNodeModelById(data.id);
      
      if (nodeModel) {
          let x = nodeModel.x;
          let y = nodeModel.y;
          const w = nodeModel.width;
          const h = nodeModel.height;
          
          let modified = false;

          if (x - w / 2 < 0) { x = w / 2; modified = true; }
          if (x + w / 2 > width) { x = width - w / 2; modified = true; }
          if (y - h / 2 < 0) { y = h / 2; modified = true; }
          if (y + h / 2 > height) { y = height - h / 2; modified = true; }
          
          if (modified) {
              nodeModel.x = x;
              nodeModel.y = y;
          }
      }
  });
})
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
      
      .canvas-scroller {
        flex: 1;
        overflow: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px;

        .container {
          background-color: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          flex-shrink: 0;
          transition: width 0.3s, height 0.3s, transform 0.3s;
          /* 确保 margin-bottom 随缩放变化，避免底部被截断 */
          margin-bottom: calc(v-bind('store.paperDimensions[store.paperSize].height * (store.zoom - 1)') * 1px);
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

          select {
              border: 1px solid #e2e8f0;
              border-radius: 4px;
              padding: 2px 4px;
              outline: none;
              color: #334155;
          }
      }
    }
  }
}
</style>

