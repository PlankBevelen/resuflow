import { RectNode, RectNodeModel } from '@logicflow/core';

class CustomTextNodeModel extends RectNodeModel {
  setAttributes() {
    this.width = 100;
    this.height = 40;
    
    // 默认样式
    this.strokeWidth = 0;
    this.stroke = 'none';
    this.fill = 'rgba(255, 255, 255, 0)'; // Transparent but clickable

    // 从 properties 中获取样式
    const { properties } = this;
    if (properties) {
        if (properties.fontSize) this.fontSize = properties.fontSize;
        if (properties.width) this.width = properties.width;
        if (properties.height) this.height = properties.height;
    }
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    const { properties } = this;
    
    // 如果 properties 中有 stroke，则使用它（允许用户修改边框）
    if (properties.stroke) {
        style.stroke = properties.stroke;
        style.strokeWidth = 1; 
    } else {
        // 否则保持无边框
        style.stroke = 'none';
        style.strokeWidth = 0;
    }
    
    if (properties.fill) {
        style.fill = properties.fill;
    } else {
        style.fill = 'rgba(255, 255, 255, 0)';
    }

    return style;
  }

  getTextStyle() {
    const style = super.getTextStyle();
    const { properties } = this;
    if (properties.fontSize) {
      style.fontSize = properties.fontSize;
    }
    if (properties.color) {
      style.fill = properties.color;
    }
    return style;
  }
}

export default {
  type: 'text',
  model: CustomTextNodeModel,
  view: RectNode,
};
