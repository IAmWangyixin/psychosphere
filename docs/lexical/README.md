---
title: Lexical 中文文档
author: 山雨竹韵
date: '2023-10-08'
---

## 简介

Lexical 是一个可扩展的 JavaScript 网页文本编辑器框架，重点是可靠性、可访问性和性能。Lexical 旨在提供一流的开发者体验，使您可以轻松地原型设计和自信地构建功能。结合高度可扩展的架构，Lexical 允许开发人员创建独特且可扩展的文本编辑体验，无论是在规模还是功能上。

有关 Lexical 的文档和更多信息，请务必访问[Lexical 网站](https://lexical.dev/)。

以下是一些使用 Lexical 进行开发的实例：

- [Lexical Playground](https://playground.lexical.dev/)
- [纯文本沙箱](https://codesandbox.io/s/lexical-plain-text-example-g932e)
- [富文本沙箱](https://codesandbox.io/s/lexical-rich-text-example-5tncvy?file=/src/Editor.js)

## 概览

- 使用 react 创建实例
- lexical 是一个框架
- 使用 lexical 工作
- 共建 lexical

## 使用 react 创建实例

> 提示：Lexical 不仅限于 React。它可以支持任何基于 DOM 的底层库。

安装 `lexical` 和 `@lexical/react`：

`npm install --save lexical @lexical/react`

以下是一个基于`lexical` 和 `@lexical/react`的基础纯文本编辑器示例：

```jsx
import { $getRoot, $getSelection } from 'lexical';
import { useEffect } from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

const theme = {
  // Theme styling goes here
  // ...
};

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();

    console.log(root, selection);
  });
}

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
  console.error(error);
}

function Editor() {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PlainTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin onChange={onChange} />
      <HistoryPlugin />
      <MyCustomAutoFocusPlugin />
    </LexicalComposer>
  );
}
```

## Lexical 是一个框架

Lexical 的核心是一个无依赖关系的文本编辑器框架，它使开发人员能够构建功能强大、简单或复杂的编辑器界面。Lexical 有几个值得探索的概念。

### 编辑器实例

编辑器实例是将所有内容连接在一起的核心。您可以将一个可满足的 DOM 元素附加到编辑器实例上，并注册监听器和命令。最重要的是，编辑器允许更新其 EditorState。您可以使用 createEditor() API 创建一个编辑器实例，但是当您使用诸如`@lexical/react`之类的框架绑定时，通常不需要担心，因为这会为您处理。

### 编辑器状态

编辑器状态是表示要在 DOM 上显示的内容的基本数据模型。编辑器状态包含两部分：

- Lexical 节点树
- Lexical 选择对象

一旦创建，编辑器状态就是不可变的。为了创建一个编辑器状态，您必须通过 editor.update(() => {...})来创建。然而，您也可以通过节点转换或命令处理器来“钩住”现有的更新 - 这是在现有更新工作流程中调用的，以防止更新的级联/瀑布。您可以使用 editor.getEditorState()检索当前编辑器状态。

编辑器状态也完全可序列化为 JSON，并且可以轻松使用 editor.parseEditorState()序列化回编辑器。

### 编辑器更新

当您想要更改编辑器状态中的某些内容时，必须通过更新 `editor.update(() => {...})` 来完成。传递给更新调用的闭包很重要。在这里，您拥有活动编辑器状态的完整“词汇”上下文，并且它公开了对底层编辑器状态节点树的访问。我们提倡在这种情况下使用 `$` 前缀的函数，因为它表示可以专门使用它们的地方。尝试在更新之外使用它们将触发运行时错误并显示相应的错误。对于熟悉 `React Hooks` 的人来说，您可以认为它们具有类似的功能（除了 `$` 函数可以按任何顺序使用）。

### DOM 协调器

Lexical 有自己的 DOM 协调器，它采用一组编辑器状态（始终是“当前”和“待定”）并对它们应用“差异”。然后，它使用此 diff 来仅更新 DOM 中需要更改的部分。您可以将其视为一种虚拟 DOM，但 Lexical 能够跳过大部分比较工作，因为它知道给定更新中发生了哪些变化。 DOM 协调器采用性能优化，有利于内容可编辑的典型启发式方法，并且能够自动确保 LTR 和 RTL 语言的一致性。

### 监听器、节点转换和命令

除了调用更新之外，Lexical 完成的大部分工作都是通过侦听器、节点转换和命令完成的。这些都源于编辑器，并需要提前注册（registry）。另一个重要的特性是所有的注册方法都返回一个函数来轻松取消订阅它们。例如，这是您监听词汇编辑器更新的方式:

```javascript
const unregisterListener = editor.registerUpdateListener(({ editorState }) => {
  // An update has occurred!
  console.log(editorState);
});

// Ensure we remove the listener later!
unregisterListener();
```

命令是 Lexical 中用于将所有内容连接在一起的通信系统。可以使用 `createCommand()` 创建自定义命令，并使用 `editor.dispatchCommand(command, Payload)` 分派到编辑器。当按键被触发以及其他重要信号发生时，Lexical 会在内部调度命令。还可以使用 `editor.registerCommand(handler,priority)` 处理命令，传入的命令按优先级通过所有处理程序传播，直到处理程序停止传播（与浏览器中的事件传播类似）。

## 使用 Lexical

本节介绍如何独立于任何框架或库使用 Lexical。对于那些打算在 React 应用程序中使用 Lexical 的人，建议查看 @lexical/react 中附带的钩子的源代码。

### 创建编辑器并使用它

当您使用 Lexical 时，您通常使用单个编辑器实例。编辑器实例可以被认为是负责将 EditorState 与 DOM 连接起来的实例。编辑器也是您可以注册自定义节点、添加侦听器和转换的地方。

可以从 lexical 包创建编辑器实例，并接受允许主题和其他选项的可选配置对象：

```javascript
import {createEditor} from 'lexical';

const config = {
  namespace: 'MyEditor',
  theme: {
    ...
  },
};

const editor = createEditor(config);
```

拥有编辑器实例后，准备就绪后，您可以将编辑器实例与文档中内容可编辑的 `<div>` 元素关联起来:

```javascript
const contentEditableElement = document.getElementById('editor');

editor.setRootElement(contentEditableElement);
```

如果要从元素中清除编辑器实例，可以传递 null。或者，如果需要，您可以切换到另一个元素，只需将替代元素引用传递给 setRootElement() 即可。

### 使用编辑器状态

对于 Lexical，事实来源不是 DOM，而是 Lexical 维护并与编辑器实例关联的底层状态模型。您可以通过调用 editor.getEditorState() 从编辑器获取最新的编辑器状态。

编辑器状态可序列化为 JSON，并且编辑器实例提供了一种有用的方法来反序列化字符串化编辑器状态。

```javascript
const stringifiedEditorState = JSON.stringify(editor.getEditorState().toJSON());

const newEditorState = editor.parseEditorState(stringifiedEditorState);
```

### 更新编辑器

可以使用以下方式更新编辑器实例：

- 使用 `editor.update()` 触发更新
- 使用 `editor.setEditorState()` 设置编辑器状态
- 通过 `editor.registerNodeTransform()` 将更改作为现有更新的一部分应用
- 使用命令监听器 `editor.registerCommand(EXAMPLE_COMMAND, () => {...}, priority)`

更新编辑器的最常见方法是使用 `editor.update()`。调用此函数需要传入一个函数，该函数将提供改变底层编辑器状态的访问权限。开始全新更新时，将克隆当前编辑器状态并将其用作起点。从技术角度来看，这意味着 Lexical 在更新期间利用了一种称为双缓冲的技术。有一个编辑器状态代表屏幕上当前的内容，另一个正在进行的编辑器状态代表未来的更改。

创建更新通常是一个异步过程，允许 Lexical 在单个更新中批量处理多个更新，从而提高性能。当 Lexical 准备好将更新提交到 DOM 时，更新中的底层突变和更改将形成新的不可变编辑器状态。然后，调用 editor.getEditorState() 将根据更新的更改返回最新的编辑器状态。

以下是如何更新编辑器实例的示例：

```javascript
import { $getRoot, $getSelection, $createParagraphNode } from 'lexical';

// Inside the `editor.update` you can use special $ prefixed helper functions.
// These functions cannot be used outside the closure, and will error if you try.
// (If you're familiar with React, you can imagine these to be a bit like using a hook
// outside of a React function component).
editor.update(() => {
  // Get the RootNode from the EditorState
  const root = $getRoot();

  // Get the selection from the EditorState
  const selection = $getSelection();

  // Create a new ParagraphNode
  const paragraphNode = $createParagraphNode();

  // Create a new TextNode
  const textNode = $createTextNode('Hello world');

  // Append the text node to the paragraph
  paragraphNode.append(textNode);

  // Finally, append the paragraph to the root
  root.append(paragraphNode);
});
```

如果您想知道编辑器何时更新以便对更改做出反应，可以向编辑器添加更新侦听器，如下所示：

```javascript
editor.registerUpdateListener(({ editorState }) => {
  // The latest EditorState can be found as `editorState`.
  // To read the contents of the EditorState, use the following API:

  editorState.read(() => {
    // Just like editor.update(), .read() expects a closure where you can use
    // the $ prefixed helper functions.
  });
});
```
