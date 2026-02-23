import { HtmlNode, HtmlNodeModel } from '@logicflow/core';

class CustomHtmlNodeModel extends HtmlNodeModel {
  setAttributes() {
    this.width = 300;
    this.height = 100;
    this.text.editable = false;
    
    const { properties } = this;
    if (properties) {
        if (properties.width) this.width = properties.width;
        if (properties.height) this.height = properties.height;
    }

    // 确保 properties.html 有初始值
    if (!this.properties.html) {
      this.properties.html = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">Custom HTML Content</div>';
    }
  }
}

class CustomHtmlNode extends HtmlNode {
  setHtml(rootEl: HTMLElement | SVGForeignObjectElement) {
    const { properties } = this.props.model;
    // 直接使用 properties.html，如果未定义或为空，则默认为空字符串
    const content = (properties.html as string) ?? '';
    
    /* const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.innerHTML = content; */
    
    // 如果内容为空，清空 innerHTML
    if (content === '') {
        rootEl.innerHTML = '';
    } else {
        rootEl.innerHTML = content;
    }
  }
}

export default {
  type: 'html',
  model: CustomHtmlNodeModel,
  view: CustomHtmlNode,
};
