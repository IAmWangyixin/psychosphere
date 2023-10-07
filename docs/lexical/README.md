# lexical 中文文档

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

### 使用 react 创建实例

> 提示：Lexical 不仅限于 React。它可以支持任何基于 DOM 的底层库。

安装 `lexical` 和 `@lexical/react`：
`npm install --save lexical @lexical/react`

以下是一个基于`lexical` 和 `@lexical/react`的基础纯文本编辑器示例：

```
import {$getRoot, $getSelection} from 'lexical';
import {useEffect} from 'react';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

const theme = {
  // Theme styling goes here
  // ...
}

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

### Lexical 是一个框架

Lexical 的核心是一个无依赖关系的文本编辑器框架，它使开发人员能够构建功能强大、简单或复杂的编辑器界面。Lexical 有几个值得探索的概念：

#### 编辑器实例

编辑器实例是将所有内容连接在一起的核心。您可以将一个可满足的 DOM 元素附加到编辑器实例上，并注册监听器和命令。最重要的是，编辑器允许更新其 EditorState。您可以使用 createEditor() API 创建一个编辑器实例，但是当您使用诸如`@lexical/react`之类的框架绑定时，通常不需要担心，因为这会为您处理。

#### 编辑器状态

编辑器状态是表示要在 DOM 上显示的内容的基本数据模型。编辑器状态包含两部分：

- Lexical 节点树
- Lexical 选择对象

一旦创建，编辑器状态就是不可变的。为了创建一个编辑器状态，您必须通过 editor.update(() => {...})来创建。然而，您也可以通过节点转换或命令处理器来“钩住”现有的更新 - 这是在现有更新工作流程中调用的，以防止更新的级联/瀑布。您可以使用 editor.getEditorState()检索当前编辑器状态。

编辑器状态也完全可序列化为 JSON，并且可以轻松使用 editor.parseEditorState()序列化回编辑器。

#### 编辑器更新

当您想要更改编辑器状态中的某些内容时，您必须通过更新 editor.update(() => {...})来进行。传递给更新的闭包非常重要。这是您具有活动编辑器状态的完整“词法”上下文的地方，并且它公开了对底层编辑器状态的节点树的访问。我们在此上下文中推广使用以`$`开头的函数，因为它表示可以专门使用这些函数的地方。尝试在更新之外使用它们将引发适当的运行时错误。对于熟悉 ReactHooks 的人来说，您可以将其视为具有类似功能的钩子（除了`$`函数可以以任何顺序使用）。
