---
name: "Jusort-style"
description: "定义 Jusort 视觉设计系统。用于创建/修改 UI 组件或页面时调用，确保风格一致。"
---

# Jusort 视觉设计规范

用于在项目中统一颜色、排版、组件样式与动效。创建新页面或组件时必须遵循本规范。

## 颜色（Colors）

基础色板（参考 Tailwind Slate/Blue）：
- 主色（Primary）: `#2563eb`（Blue-600）
- 背景（Background）: `#f8fafc`（Slate-50）
- 正文主色: `#1e293b`（Slate-800）
- 正文常规: `#334155`（Slate-700）
- 次要文字: `#64748b`（Slate-500）
- 基础边框: `#e2e8f0`（Slate-200）

优先使用 `src/assets/css/variable.less` 中的变量：
- `@primary-color`
- `@bg-color`
- `@text-color-primary`
- `@border-color-base`

## 排版（Typography）
- 字体族：Inter / 系统无衬线
- 响应式字号：使用 `clamp()`（见 `variable.less`）
  - 基础：`clamp(14px, 1vw + 10px, 16px)`
  - 标题 H1：`clamp(36px, 4vw + 24px, 60px)`

## 图标（Icons）
- 使用 Iconify（Solar 图标集）
  示例：
  ```html
  <span class="iconify" data-icon="solar:box-bold"></span>
  ```
- 如果有svg并且更适合用svg, 使用 svg-icon组件
  示例：
  ```html
  <svg-icon name="add" />
  ```

## 组件（UI Components）
- UI 库：Element Plus
- 全局覆盖：见 `src/assets/css/common.less`
- 按钮：主按钮使用主色；次按钮使用浅蓝背景（`#eff6ff`）+ 蓝色文字

## 动画（Animations）
在 `common.less` 中定义，可复用：
- `.animate-fade-up`：向上淡入
-. `.animate-float`：悬浮漂浮
- `.animate-sway`：缓慢摆动
- `.text-shimmer`：文字流光

## 布局（Layout）
- 使用 Flex 布局
- `.container`：居中自适应宽度容器（见 `common.less`）
- `.hide-scrollbar`：隐藏滚动条工具类
