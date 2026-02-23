import { RectNode, RectNodeModel } from '@logicflow/core';

class LineNodeModel extends RectNodeModel {
  setAttributes() {
    this.width = 300;
    this.height = 2; // Default line thickness
    this.stroke = '#000000';
    this.fill = '#000000';

    const { properties } = this;
    if (properties) {
        if (properties.width) this.width = properties.width;
        // 线条高度固定或很小，通常不调整高度来改变线条粗细，除非用于模拟矩形
        // 这里假设高度作为粗细
        if (properties.height) this.height = properties.height;
        if (properties.stroke) {
            this.stroke = properties.stroke;
            this.fill = properties.stroke; // 线条填充色同边框色
        }
    }
  }

  getNodeStyle() {
      const style = super.getNodeStyle();
      const { properties } = this;
      
      if (properties.stroke) {
          style.stroke = properties.stroke;
          style.fill = properties.stroke;
      }
      return style;
  }
}

class LineNode extends RectNode {
}

export default {
  type: 'line',
  model: LineNodeModel,
  view: LineNode,
};
