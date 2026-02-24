---
name: "Jusort-dev"
description: "定义 Jusort 开发规范与架构约定。编写 Vue 组件或业务逻辑时调用。"
---

# Jusort 开发规范

统一本项目的技术选型、目录组织、组件编写方式与集成策略。

## 技术栈

- 框架：Vue 3（Composition API）
- 语言：TypeScript
- 构建：Vite
- 状态管理：Pinia
- 路由：Vue Router
- UI 库：Element Plus
- 图形/画布：LogicFlow
- 工具：pnpm
- PDF 导出：html2canvas + jspdf

## 目录组织

- `src/views`：页面级组件
- `src/components`：可复用 UI 组件
- `src/layouts`：布局包装（如 `maker.vue`、`default.vue`）
- `src/stores`：Pinia Store（如 `editor.ts`）
- `src/assets`：静态资源与全局样式

## 代码约定

### 组件
- 使用 `<script setup lang="ts">`
- 组件文件命名使用 PascalCase（如 `ToolHeader.vue`）
- 样式使用 `scoped` 的 Less：`<style lang="less" scoped>`

### 状态管理（Pinia）
- Store 文件放置于 `src/stores/`
- 使用 `defineStore` + setup 语法（返回 state 与 actions）
  示例：
  ```ts
  export const useEditorStore = defineStore('editor', () => {
    const count = ref(0)
    function increment() { count.value++ }
    return { count, increment }
  })
  ```

### LogicFlow 集成
- LogicFlow 实例通过 Store 暴露，便于侧边栏/工具条组件交互
- 使用 `@logicflow/extension`（如 `DndPanel`、`SelectionSelect`）
- 在页面 `onMounted` 中注册插件与自定义节点

## 最佳实践

- 类型安全：为核心数据结构定义接口（如 `CanvasElement`）
- 异步组件：对重量或条件渲染的组件使用 `defineAsyncComponent` 提升性能
- 图标：优先使用 Iconify `<span>` 标签，减少打包体积
