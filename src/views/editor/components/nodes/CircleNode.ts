import { CircleNode, CircleNodeModel } from '@logicflow/core';

class CustomCircleNodeModel extends CircleNodeModel {
  setAttributes() {
    // 默认半径
    this.r = 40; 
    
    // 从 properties 中获取样式
    const { properties } = this;
    
    if (properties) {
        // 如果 properties 中有 width/height，优先使用它们来计算半径
        // 圆形只有半径 r，通常取宽高的较小值的一半，或者只用 width 控制
        if (properties.width) {
            this.r = properties.width / 2;
        }
        
        if (properties.fill) {
            this.fill = properties.fill;
        }
        
        if (properties.stroke) {
            this.stroke = properties.stroke;
        }
    }
  }

  // 重写 getNodeStyle，确保属性面板修改 properties 后能实时生效
  getNodeStyle() {
      const style = super.getNodeStyle();
      const { properties } = this;
      
      // 实时计算半径
      if (properties.width) {
          // LogicFlow 的 CircleNodeModel 使用 this.r 控制大小
          // 但 getNodeStyle 返回的是样式对象，不直接控制半径
          // 我们需要更新 model 的属性
          this.r = properties.width / 2;
      }

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
  type: 'circle',
  model: CustomCircleNodeModel,
  view: CircleNode,
};
