<template>
  <div class="editor">
    <ToolHeader />
    <div class="content">
      <LeftSidebar />
      <div class="main-content">
        <div ref="container" class="container" />
        <div class="toolbox">

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
    stopMoveGraph: true,
    stopScrollGraph: true,
    stopZoomGraph: true,
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
      overflow: auto;
      position: relative;
      .container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 700px;
        width: 400px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        border: 1px solid #e2e8f0;
      }
    }
  }
}
</style>

