import { RectNode, RectNodeModel } from '@logicflow/core';

class CustomRectNodeModel extends RectNodeModel {
  setAttributes() {
    // 默认样式
    this.width = 100;
    this.height = 80;
    
    // 从 properties 中获取样式
    const { properties } = this;
    if (properties) {
        if (properties.width) this.width = properties.width;
        if (properties.height) this.height = properties.height;
        if (properties.fill) this.fill = properties.fill;
        if (properties.stroke) this.stroke = properties.stroke;
    }
  }

  getNodeStyle() {
      const style = super.getNodeStyle();
      const { properties } = this;
      
      if (properties.fill) {
          style.fill = properties.fill;
      }
      if (properties.stroke) {
          style.stroke = properties.stroke;
      }
      return style;
  }
}

export default {
  type: 'rect',
  model: CustomRectNodeModel,
  view: RectNode,
};
