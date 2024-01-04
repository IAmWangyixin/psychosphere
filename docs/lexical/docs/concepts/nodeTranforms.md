---
title: 节点转换
author: 山雨竹韵
date: '2023-12-20'
---

转换是响应 EditorState 更改的最有效机制。

举个例子：用户输入一个等于“congrats”的单词时你想把单词的颜色改成蓝色。我们以编程方式添加一个 `@Mention` 到编辑器中，这个 `@Mention` 紧挨着下一个 `@Mention` （ `@Mention@Mention` ）。由于我们认为这会使提及难以阅读，因此我们想要销毁/替换这两个提及并将它们呈现为普通的TextNode。

```
const removeTransform = editor.registerNodeTransform(TextNode, (textNode) => {
  if (textNode.getTextContent() === 'blue') {
    textNode.setTextContent('green');
  }
});
```

语法

