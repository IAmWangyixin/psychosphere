---
title: 命令
author: 竹子
date: '2023-10-11'
---

## Done

- [x] lexical 介绍翻译
- [x] 富文本编辑
- [x] 更新现有内容（选中的文本使用其他内容替换）selection.insetText()

## Daily To Do

- [ ] @lexical/yjs demo

## Weekly To Do

- [ ] @lexical/yjs demo
- [ ] 后端技术选型

- [ ] 唤起菜单，菜单编辑
- [ ] 插入功能，插入图片
- [ ] 拖拽
- [ ] 文档保存？
- [ ] 多人协作，移动端

## next week to do

- [ ] quill 文档 and demo

命令是 Lexical 的一个非常强大的功能，它允许您注册 `KEY_ENTER_COMMAND` 或 `KEY_TAB_COMMAND` 等事件的侦听器，并根据上下文随时随地对它们做出反应。

此模式对于构建工具栏或复杂的插件和节点（例如需要对选择、键盘事件等进行特殊处理的 TablePlugin）非常有用。

注册命令时，您提供一个优先级，并且可以返回 true 将其标记为“已处理”，这会阻止其他侦听器接收该事件。 如果您没有显式处理命令，则可能会在 RichTextPlugin 或 PlainTextPlugin 中默认处理该命令。
