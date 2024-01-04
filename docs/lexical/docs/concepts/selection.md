---
title: 选择
author: 山雨竹韵
date: '2024-01-04'
---

## 选择类型

Lexical 的选择是 `EditorState` 的一部分。这意味着编辑器的每一次更新或改变，选择始终和 `EditorState` 的节点树保持一致。

在 Lexical 中，有四种可选的选择类型：
- `RangeSelection`
- `NodeSelection`
- `GridSelection`
- `null`

## `RangeSelection`

这是最常见的选择类型，是浏览器的DOM选择和范围API的规范化。`RangeSelection` 由三个主要属性组成：
- `anchor`（锚）：表示 `RangeSelection` 的锚点 
- `focus`: 表示 `RangeSelection` 的焦点
- `format`: 数字位标志，代表任何活动文本格式

“锚点”和“焦点”都是指表示编辑器特定部分的对象。RangeSelection 点的主要属性包括：
- `key` 代表被选中的 Lexical 节点的 `NodeKey`
- `offset` 表示其所选词法节点内的位置。对于文本类型，这是字符，对于元素类型，这是 ElementNode 中的子索引
- `type` 表示元素或文本

## `NodeSelection`

NodeSelection 代表多个任意节点的选择。举个例子，三个图片被同时选择。
- `getNodes()` 返回一个包含被选择的 LexicalNodes 的数组。

## `GridSelection`

GridSelection 表示类似表格的网格式选择。它存储发生选择的父节点的键以及起点和终点。GridSelection 由三个主要属性组成：





