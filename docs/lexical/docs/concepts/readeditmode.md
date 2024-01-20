---
title: 读模式/写模式
author: 山雨竹韵
date: '2024-01-20'
---

Lexical 支持两种模式:

- 读模式
- 写模式

Lexical 默认是写模式，或者更准确地说不是只读模式。底层实现中，主要的实现细节是 contentEditable 根据模式设置成“true”或“false”. 特定的插件也可以监听模式的改变————允许他们根据模式自定义 UI 的部分内容。

## 设置模式

为了设置模式，可以在创建编辑器时完成如下内容：

```js
const editor = createEditor({
  editable: true,
  ...
})
```

如果您使用了 `lexical/react` 库，那么可以在 `<LexicalComposer>` 组件的 `initialConfig` 属性中完成配置：

```js
<LexicalComposer initialConfig={{ editable: true }}>...</LexicalComposer>
```

编辑器创建完成后，可通过如下方法强制更改模式：

```js
editor.setEditable(true);
```

## 读取模式

为了找到编辑器当前模式，您可以使用：

```js
const isEditable = editor.isEditable(); // 返回 true 或 false
```

当编辑器的只读模式发生更改时，您还可以收到通知：

```js
const removeEditableListener = editor.registerEditableListener((isEditable) => {
  // 编辑器模式传入!
  console.log(isEditable);
});

// 当不再需要时别忘了移除监听器!
removeEditableListener();
```
