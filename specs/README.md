# Specs 规格文档索引

本目录存放 DocX 个人博客各功能模块的规格说明（Specification）文档。每一份 spec 描述一个功能的**产品目标、技术方案、目录结构、数据契约、实现注意事项**，作为开发实施与后续回溯的单一事实来源（Single Source of Truth）。

## 目录约定

```
specs/
├── README.md                        # 本索引
├── _template/                       # 标准 spec 模板（新建 spec 时复制它）
│   └── spec.md
└── <feature-name-vX.Y.Z>/           # 每个功能一个子目录，目录名 = 功能标识 + 版本号
    └── spec.md                      # 规格主文档
```

版本号规则遵循项目 `CHANGELOG.md` 中的 SemVer 约定。

## 当前 Specs 清单

| 版本 | 功能 | 状态 | 文档 |
| --- | --- | --- | --- |
| v1.1.0 | SHOWREEL 音效作品展示模块 + 导航栏 Categories/Tags Tab 合并 | ✅ 已完成 | [showreel-feature-v1.1.0/spec.md](./showreel-feature-v1.1.0/spec.md) |

## 状态图例

- 📝 待实施：spec 已确认，尚未开始编码
- 🚧 进行中：正在实施
- ✅ 已完成：功能上线，对应版本已发布
- 🗄️ 已归档：功能被替代或废弃（文档保留作历史参考）

## 使用约定

1. **新增功能前**：复制 `_template/spec.md` 到新子目录，填完后与用户确认，**用户拍板后再动代码**
2. **实施过程中**：若方案发生重大调整，同步更新对应 spec，避免文档与代码漂移
3. **功能上线后**：更新上方"状态"列，并在 `CHANGELOG.md` 中对应版本条目引用 spec 链接

## 相关文档

- AI 协作入口：[`AGENTS.md`](../AGENTS.md)（4.5 节说明大改动如何走 spec 流程）
- 版本索引：[`CHANGELOG.md`](../CHANGELOG.md)
- 待办规划：[`docs/roadmap.md`](../docs/roadmap.md)
