---
title: 节点覆盖
author: 山雨竹韵
date: '2023-12-11'
---

一些最常用的 Lexical 节点由核心库拥有和维护。例如：`ParagraphNode`, `HeadingNode`, `QuoteNode`, `List(Item)Node` 等，这些由 Lexcial 库提供，这为某些编辑器功能提供了更简单的开箱即用体验，但很难覆盖它们的行为。例如，如果您想更改 ListNode 的行为，通常你会扩展该类并重写其方法。但是，您如何告诉 Lexical 在 ListPlugin 中使用 ListNode 子类而不是使用核心库提供的ListNode? 这就是节点覆盖可以提供帮助的地方。

节点覆盖允许您将编辑器中给定节点的所有实例替换为不同节点类的实例。这可通过在编辑器配置中的节点数组实现。

```javascript
const editorConfig = {
    ...
    nodes=[
        // Don't forget to register your custom node separately!
        CustomParagraphNode,
        {
            replace: ParagraphNode,
            with: (node: ParagraphNode) => {
                return new CustomParagraphNode();
            }
        }
    ]
}
```

一旦完成此操作，Lexical 将使用 `CustomParagraphNode` 实例替换所有 `ParagraphNode` 实例。此功能的一个重要用例是覆盖核心节点的序列化行为。查看下面的完整示例。

<!-- <iframe src="https://codesandbox.io/embed/ecstatic-maxwell-kw5utu?fontsize=14&hidenavigation=1&module=/src/Editor.js,/src/plugins/CollapsiblePlugin.ts,/src/nodes/CollapsibleContainerNode.ts&theme=dark&view=split" style={{width:"100%", height:"700px", border:0, borderRadius: "4px", overflow:"hidden"}} title="lexical-collapsible-container-plugin-example" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" ></iframe>  -->
[node override codesandbox](https://codesandbox.io/embed/ecstatic-maxwell-kw5utu?fontsize=14&hidenavigation=1&module=/src/Editor.js,/src/plugins/CollapsiblePlugin.ts,/src/nodes/CollapsibleContainerNode.ts&theme=dark&view=split)

