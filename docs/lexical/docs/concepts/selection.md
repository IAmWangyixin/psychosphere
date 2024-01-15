---
title: 选择器
author: 山雨竹韵
date: '2024-01-04'
---

## 选择器类型

Lexical 的选择是 `EditorState` 的一部分。这意味着编辑器的每一次更新或改变，选择始终和 `EditorState` 的节点树保持一致。

在 Lexical 中，有四种可选的选择类型：
- 范围选择器
- 节点选择器
- 表格选择器
- `null`

### 范围选择器

这是最常见的选择类型，是浏览器的DOM选择和范围API的规范化。范围选择器由三个主要属性组成：
- `anchor`（锚）：表示范围选择器的锚点 
- `focus`: 表示范围选择器的焦点
- `format`: 数字位标志，代表任何活动文本格式

“锚点”和“焦点”都是指表示编辑器特定部分的对象。RangeSelection 点的主要属性包括：
- `key` 表示被选中的 Lexical 节点的 `NodeKey`
- `offset` 表示其所选词法节点内的位置。对于文本类型，这是字符，对于元素类型，这是 ElementNode 中的子索引
- `type` 表示元素或文本

### 节点选择器

节点选择器代表多个任意节点的选择。举个例子，三个图片被同时选择。
- `getNodes()` 返回一个包含被选择的 LexicalNodes 的数组。

### 表格选择器

表格选择器表示类似表格的网格式选择。它存储了选择发生时父节点的键以及起始点和终点。表格选择器由三个主要属性组成：
- `gridKey` 表示选择发生时父节点的键
- `anchor` 表示一个网格选择的点
- `focus` 表示一个网格选择的点

例如，如果你在表格中选择行=1列=1到行=2列=2，可以按以下方式存储：
- `gridKey = 2` 表格键
- `anchor = 4` 单元格（键可能会有所不同）
- `focus = 10` 单元格（键可能会有所不同）

请注意，锚点和焦点的工作方式与 范围选择器 相同。

### `null`

这适用于编辑器没有任何活动选择的情况。当编辑器已经失去焦点或选择已移动到页面上的另一个编辑器时，这很常见。尝试在编辑器空间中选择不可编辑的组件时，也会发生这种情况。

## 使用选择器
可以在从 lexical 包中导出的 `$getSelection` 方法使用帮助中找到选择器。此函数可以用在更新、读取或命令监听器中。
```js
import {$getSelection, SELECTION_CHANGE_COMMAND} from 'lexical';

editor.update(() => {
  const selection = $getSelection();
});

editorState.read(() => {
  const selection = $getSelection();
});

// SELECTION_CHANGE_COMMAND fires when selection changes within a Lexical editor.
editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
  const selection = $getSelection();
});
```

在某些情况下你可能想创建一个新类型的选择器并将编辑器的选择设置成该种类型。这只能在更新或命令监听器中完成。
```js
import {$setSelection, $createRangeSelection, $createNodeSelection} from 'lexical';

editor.update(() => {
  // Set a range selection
  const rangeSelection = $createRangeSelection();
  $setSelection(rangeSelection);

  // You can also indirectly create a range selection, by calling some of the selection
  // methods on Lexical nodes.
  const someNode = $getNodeByKey(someKey);

  // On element nodes, this will create a RangeSelection with type "element",
  // referencing an offset relating to the child within the element.
  // On text nodes, this will create a RangeSelection with type "text",
  // referencing the text character offset.
  someNode.select();
  someNode.selectPrevious();
  someNode.selectNext();

  // You can use this on any node.
  someNode.selectStart();
  someNode.selectEnd();

  // Set a node selection
  const nodeSelection = $createNodeSelection();
  // Add a node key to the selection.
  nodeSelection.add(someKey);
  $setSelection(nodeSelection);

  // You can also clear selection by setting it to `null`.
  $setSelection(null);
});
```





