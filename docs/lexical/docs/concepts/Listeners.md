---
title: 监听器
author: 山雨竹韵
date: '2023-12-11'
---

侦听器是一种机制，可让编辑器实例在发生特定操作时通知用户。 所有侦听器都遵循反应模式(reactive pattern)，您可以对将来发生的事情进行操作。 所有侦听器还返回一个函数，该函数可以轻松地允许侦听器注销。 以下是 Lexical 目前支持的不同侦听器：

## `registerUpdateListener`

当 Lexical 提交对 DOM 的更新时收到通知：

```js
const removeUpdateListener = editor.registerUpdateListener(({editorState}) => {
  // 最新的 EditorState 可以通过 `editorState` 找到.
  // 读取内容对应的 EditorState, 可以使用如下API:

  editorState.read(() => {
    // 就像 editor.update() 一样, .read() 需要一个闭包，你可以在闭包中使用 $ 前缀的帮助函数.
  });
});

// 当你不再需要的时候别忘了注销监听器！
removeUpdateListener();
```

该更新监听器回调函数接收包含以下属性的单个参数：
- `editorState` 最新更新的编辑器状态
- `prevEditorState` 上一次的编辑器状态
- `tags` 传递给更新的所有标签的集合

需要注意的一件事是“瀑布式”更新。 您可以在此处安排更新侦听器内的更新，如下所示：

```js
editor.registerUpdateListener(({editorState}) => {
  // 读取编辑器状态并获取需要的值。
  editorState.read(() => {
    // ...
  });

  // 然后安排另一次更新。
  editor.update(() => {
    // ...
  });
});
```

这种模式的问题在于，这意味着我们最终会进行两次 DOM 更新，而我们本来可以在一次 DOM 更新中完成它。 这可能会对性能产生影响，这在文本编辑器中很重要。 为了避免这种情况，我们建议研究节点转换，它允许您监听节点更改并将它们作为同一给定更新的一部分进行转换，这意味着没有瀑布！

## `registerTextContentListener`

当 Lexical 提交对 DOM 的更新并且编辑器文本内容较编辑器之前的状态有变化时收到通知。如果更新之间的文本内容相同，监听器将不会收到通知。

```js
const removeTextContentListener = editor.registerTextContentListener(
  (textContent) => {
    // 编辑器最新的文本内容!
    console.log(textContent);
  },
);

// 当你不再需要的时候别忘了注销监听器！
removeTextContentListener();
```

## `registerMutationListener`

当特定类型的 Lexical 节点发生编译时收到通知。突变有三种状态：
- 已创建
- 被摧毁
- 更新

突变监听器非常适合跟踪特定类型节点的生命周期。它们可用于处理与特定类型节点相关的外部UI状态和UI功能。

```js
const removeMutationListener = editor.registerMutationListener(
  MyCustomNode,
  (mutatedNodes) => {
    // 突变节点是一个Map, 其中每个键都是NodeKey, 键值是突变状态。 
    for (let [nodeKey, mutation] of mutatedNodes) {
      console.log(nodeKey, mutation)
    }
  },
);

// 当你不再需要的时候别忘了注销监听器！
removeMutationListener();
```

## `registerEditableListener`

当编辑器模式变化时收到通知。编辑器模式可以通过`editor.setEditable(boolean)`。
```js
const removeEditableListener = editor.registerEditableListener(
  (editable) => {
    // 编辑器模式已传入！
    console.log(editable);
  },
);

// 当你不再需要的时候别忘了注销监听器！
removeEditableListener();
```

## `registerDecoratorListener`

当编辑器的装饰器对象(decorator object)变化时收到通知。装饰对象包含所有`DecoratorNode`键 -> 它们的装饰值。这主要与外部UI框架一起使用。

```js
const removeDecoratorListener = editor.registerDecoratorListener(
  (decorators) => {
    // 编辑器装饰器对象已传入！
    console.log(decorators);
  },
);

// 当你不再需要的时候别忘了注销监听器！
removeDecoratorListener();
```

## `registerRootListener`

当编辑器的根 DOM 元素（可编辑 Lexical 附加的内容）发生更改时收到通知。 这主要用于将事件侦听器附加到根元素。 根侦听器函数在注册时直接执行，然后在任何后续更新时执行。

```js
const removeRootListener = editor.registerRootListener(
  (rootElement, prevRootElement) => {
   // 添加监听器到新的根元素
   // 从旧的根元素移除监听器
  },
);

// 当你不再需要的时候别忘了注销监听器！
removeRootListener();
```
