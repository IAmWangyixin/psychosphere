# 编辑器市场调研

## 技术选型

- 研究可选技术: 技术的特点、优缺点、适用场景、开发成本等。技术文档、文章、博客、技术论坛。
- 考虑时间和预算
- 定期评估

## 技术分析

富文本编辑器库

- draft.js facebook 旧版富文本编辑器开源库
- lexical facebook 可扩展的 JavaScript Web 文本编辑器框架，强调可靠性、可访问性和性能。react 框架友好、不兼容 ie11。
- quill 由两位就职于 slab 的开发人员开发与维护，社区成熟、兼容性好.

## 考察维度

- [ ] 基础功能、导入导出、可扩展性
- [ ] PC、移动端
- [ ] 多人协同

## lexical

基本功能支持情况：

1. 特点：meta（原 Facebook）出品，大厂质量保证，强调可靠性、可访问性和性能。自定义的数据结构 state. 这意味着导入导出其他格式是不能直接实现的。
2. 优缺点：
   优点： 原生支持 react, Lexical 本身是比较切合 React 的，对于 react 项目这个是天生自带的优势
   缺点: 刚开源，目前版本 0.xx，更新迭代很快。
3. 适用场景：
4. 开发成本：
5. 时间和成本：

6. 兼容性：

- firefox 52+
- chrome 49+
- Edge 79+ (when Edge switched to Chromium)
- Safari 11+
- iOS 11+ (Safari)
- iPad OS 13+ (Safari)
- Android Chrome 72+

7. 开源协议: MIT.

## quill

1. 特点：
2. 优缺点：
   -
   - 缺点：不直接支持表格，对嵌套结构的 DOM 不够友好。例如在 table 里面加 ui li 标签。需要自己开发相关的插件来支持，成本不小。
3. 适用场景：
4. 开发成本：
5. 时间和成本：
6. 兼容性：

- Android 9.0+
- firefox 73+
- chrome 79+
- Safari 11+

7. 开源协议： BSD 3-clause

- [ ] 数据不一致，多人协同操作

| quill    | lexical |
| -------- | ------- |
| 开源协议 |
| 最近更新 |
