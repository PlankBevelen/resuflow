import { RectNode, RectNodeModel, h } from '@logicflow/core';

class ImageNodeModel extends RectNodeModel {
  setAttributes() {
    this.width = 100;
    this.height = 100;
    const { properties } = this;
    if (properties.width) {
      this.width = properties.width;
    }
    if (properties.height) {
      this.height = properties.height;
    }
    // Remove stroke and fill for image node by default
    this.stroke = 'none';
    this.fill = 'transparent';
  }
}

class ImageNode extends RectNode {
  getShape() {
    const { model } = this.props;
    const { x, y, width, height, properties } = model;
    
    // x, y are center coordinates.
    // image x, y are top-left relative to the group transform.
    // LogicFlow handles the group transform (translate(x, y)) for the node container if we were using base Node,
    // but RectNode's getShape usually returns the shape centered at x,y?
    // Wait, RectNode implementation:
    // getShape() { ... return h('rect', { x: x - width/2, y: y - height/2, ... }) }
    // So we should do the same.
    
    const href = properties.src || '';
    
    return h(
      'g',
      {},
      [
        h('image', {
          x: x - width / 2,
          y: y - height / 2,
          width,
          height,
          href,
          preserveAspectRatio: 'none',
        })
      ]
    );
  }
}

export default {
  type: 'image',
  view: ImageNode,
  model: ImageNodeModel,
};
