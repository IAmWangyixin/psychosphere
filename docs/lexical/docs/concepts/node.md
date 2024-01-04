---
title: 节点
author: 山雨竹韵
date: '2023-10-23'
---

## 基础节点

节点是 Lexical 中的核心概念。它们不仅形成可视化编辑器视图（作为 EditorState 的一部分），而且还代表在任何给定时间编辑器中存储的内容的基础数据模型。Lexical 有一个基于单一核心的节点，称为 LexicalNode，它在内部扩展以创建 Lexical 的五个基本节点：

- RootNode
- LineBreakNode
- ElementNode
- TextNode
- DecoratorNode

在这些节点中，其中三个是从词法包中公开的，这使得它们非常适合扩展：

- ElementNode
- TextNode
- DecoratorNode

### RootNode

EditorState 中只有一个 RootNode，它始终位于顶部，代表可编辑的内容本身。 这意味着 RootNode 没有父节点或兄弟节点。

- 要获取整个编辑器的文本内容，您应该使用 rootNode.getTextContent()。
- 为了避免选择问题，Lexical 禁止将文本节点直接插入 RootNode。

### 换行节点

​ 你的文本节点中不应该有“\n”，而应该使用代表“\n”的`LineBreakNode`，更重要的是，它可以在浏览器和操作系统之间一致地工作。

### 元素节点

用作其他节点的父节点，可以是块级（ParagraphNode、HeadingNode）和内联（LinkNode）。具有各种定义其行为的方法，可以在扩展期间覆盖（isInline、canBeEmpty、canInsertTextBefore 等）

### 文本节点

包含文本的叶节点类型。 它还包括一些特定于文本的属性：

- `format`粗体、斜体、下划线、删除线、代码、下标和上标的任意组合
- `mode`
  - `token` - 充当不可变节点，无法更改其内容并立即全部删除
  - `segmented` - 其内容按段删除（一次一个单词），尽管节点内容更新后将变为非分段，但它是可编辑的
- `style` 可用于将内联 css 样式应用于文本

### 装饰节点

用于在编辑器内插入任意视图（组件）的包装器节点。 装饰器节点渲染与框架无关，可以输出来自 React、vanilla js 或其他框架的组件。

## 节点属性

Lexical 节点可以具有属性。 重要的是，这些属性也是 JSON 可序列化的，因此您永远不应该将属性分配给作为函数、Symbol、Map、Set 或具有与内置函数不同原型的任何其他对象的节点。`null`、`undefined`、`number`、`string`、`boolean`、`{}` 和 `[]` 都是可以分配给节点的属性类型。

按照惯例，我们在属性前加上 `__` （双下划线），以便清楚地表明这些属性是私有的，并且应避免直接访问它们。 我们选择 `__` 而不是 `_`，因为某些构建工具会破坏并缩小单个 `_` 前缀属性以提高代码大小。 但是，如果您要在构建之外公开要扩展的节点，这种情况就会失败。

如果您要添加一个您希望可修改或可访问的属性，那么您应该始终在节点上为此属性创建一组 `get*()` 和 `set*()` 方法。 在这些方法中，您需要调用一些非常重要的方法，以确保与 Lexical 内部不可变系统的一致性。 这些方法是 `getWritable()` 和 `getLatest()`。

```javascript
import type { NodeKey } from 'lexical';

class MyCustomNode extends SomeOtherNode {
  __foo: string;

  constructor(foo: string, key?: NodeKey) {
    super(key);
    this.__foo = foo;
  }

  setFoo(foo: string) {
    // 如果需要，getWritable() 会创建节点的克隆，以确保我们不会尝试改变此节点的陈旧版本。
    const self = this.getWritable();
    self.__foo = foo;
  }

  getFoo(): string {
    // getLatest() ensures we are getting the most
    // up-to-date value from the EditorState.
    const self = this.getLatest();
    return self.__foo;
  }
}
```

最后，所有节点都应该有一个静态 `getType()` 方法和一个静态 `clone()` 方法。 Lexical 使用该类型能够在反序列化期间用其关联的类原型重建节点（对于复制 + 粘贴很重要！）。Lexical 使用克隆来确保新 `EditorState` 快照创建之间的一致性。

使用这些方法扩展上面的示例：

```javascript
class MyCustomNode extends SomeOtherNode {
  __foo: string;

  static getType(): string {
    return 'custom-node';
  }

  static clone(node: MyCustomNode): MyCustomNode {
    return new MyCustomNode(node.__foo, node.__key);
  }

  constructor(foo: string, key?: NodeKey) {
    super(key);
    this.__foo = foo;
  }

  setFoo(foo: string) {
    // getWritable() creates a clone of the node
    // if needed, to ensure we don't try and mutate
    // a stale version of this node.
    const self = this.getWritable();
    self.__foo = foo;
  }

  getFoo(): string {
    // getLatest() ensures we are getting the most
    // up-to-date value from the EditorState.
    const self = this.getLatest();
    return self.__foo;
  }
}
```

## 创建自定义节点

如上所述，Lexical 暴露了三个可以扩展的基础节点。

> 你可知道？ Lexical 已经在核心中扩展了 ElementNode 等节点，例如 ParagraphNode 和 RootNode！

### 扩展`ElementNode`

下面是如何扩展 `ElementNode` 的示例：

```javascript
import { ElementNode } from 'lexical';

export class CustomParagraph extends ElementNode {
  static getType(): string {
    return 'custom-paragraph';
  }

  static clone(node: ParagraphNode): ParagraphNode {
    return new CustomParagraph(node.__key);
  }

  createDOM(): HTMLElement {
    // Define the DOM element here
    const dom = document.createElement('p');
    return dom;
  }

  updateDOM(prevNode: CustomParagraph, dom: HTMLElement): boolean {
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    return false;
  }
}
```

为您的自定义 ElementNode 提供一些 $ 前缀的实用函数也是一种很好的礼仪，以便其他人可以轻松使用和验证节点是否是您的自定义节点。对于上面的示例，您可以这样做：

```javascript
export function $createCustomParagraphNode(): ParagraphNode {
  return new CustomParagraph();
}

export function $isCustomParagraphNode(node: LexicalNode | null | undefined): node is CustomParagraph  {
  return node instanceof CustomParagraph;
}
```

### 扩展 `TextNode`

```javascript
export class ColoredNode extends TextNode {
  __color: string;

  constructor(text: string, color: string, key?: NodeKey): void {
    super(text, key);
    this.__color = color;
  }

  static getType(): string {
    return 'colored';
  }

  static clone(node: ColoredNode): ColoredNode {
    return new ColoredNode(node.__text, node.__color, node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    element.style.color = this.__color;
    return element;
  }

  updateDOM(
    prevNode: ColoredNode,
    dom: HTMLElement,
    config: EditorConfig,
  ): boolean {
    const isUpdated = super.updateDOM(prevNode, dom, config);
    if (prevNode.__color !== this.__color) {
      dom.style.color = this.__color;
    }
    return isUpdated;
  }
}

export function $createColoredNode(text: string, color: string): ColoredNode {
  return new ColoredNode(text, color);
}

export function $isColoredNode(node: LexicalNode | null | undefined): node is ColoredNode {
  return node instanceof ColoredNode;
}
```

### 扩展 `DecoratorNode`

```javascript
export class VideoNode extends DecoratorNode<ReactNode> {
  __id: string;

  static getType(): string {
    return 'video';
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(node.__id, node.__key);
  }

  constructor(id: string, key?: NodeKey) {
    super(key);
    this.__id = id;
  }

  createDOM(): HTMLElement {
    return document.createElement('div');
  }

  updateDOM(): false {
    return false;
  }

  decorate(): ReactNode {
    return <VideoPlayer videoID={this.__id} />;
  }
}

export function $createVideoNode(id: string): VideoNode {
  return new VideoNode(id);
}

export function $isVideoNode(node: LexicalNode | null | undefined): node is VideoNode {
  return node instanceof VideoNode;
}
```
