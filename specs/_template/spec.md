# Spec 模板 — <功能名称> vX.Y.Z

> 复制本文件到 `specs/<feature-name-vX.Y.Z>/spec.md`，填完后与用户确认方向，**用户拍板后再动代码**。

| 字段 | 值 |
| --- | --- |
| 版本 | vX.Y.Z |
| 状态 | 📝 待实施 / 🚧 进行中 / ✅ 已完成 / 🗄️ 已归档 |
| 创建日期 | YYYY-MM-DD |
| 完成日期 | YYYY-MM-DD（完成后填） |
| 关联 Changelog | `CHANGELOG.md` → [X.Y.Z] |
| 实施范围 | （列出涉及的目录 / 模块） |

---

## 1. 背景与目标

- **背景**：为什么现在要做这件事？当前存在什么问题？
- **目标**：这次改动要达成的可衡量结果（用户能感知的效果）

## 2. 非目标（Non-Goals）

- 明确本次**不做**的事，避免范围蔓延
- 例：本次只做前端展示，不涉及数据后台

## 3. 用户故事 / 使用场景

- 场景 1：作为 XX 用户，我希望能 XX，以便 XX
- 场景 2：...

## 4. 核心功能

### 4.1 <子功能 1>
- 具体表现 / 交互 / 视觉要求

### 4.2 <子功能 2>
- ...

## 5. 技术方案

### 5.1 整体方案
- 一句话描述总体思路

### 5.2 关键技术决策

| 决策点 | 选择 | 理由 |
| --- | --- | --- |
| （如：视频源） | （如：Partial 分支渲染） | （如：数据模型统一，扩展只改 partial） |

### 5.3 数据契约

（若涉及 front-matter / 数据结构，在此定义字段与类型）

```yaml
# 示例：source/_showreel/*.md front-matter
title: string
date: date
cover: string (url)
duration: string
tools: string[]
video:
  type: 'bilibili' | 'mp4'
  bvid?: string     # type=bilibili 时必填
  src?: string      # type=mp4 时必填
```

## 6. 目录 / 文件影响

- 新增：
  - `themes/Quiet/layout/xxx.ejs`
  - `themes/Quiet/source/css/pages/xxx.less`
- 修改：
  - `themes/Quiet/_config.yml`（挂菜单）
  - `PROJECT_STRUCTURE.md`（补新文件说明）
- 删除：
  - （若有）

## 7. 风险与预案

| 风险 | 预案 |
| --- | --- |
| 例：iframe 首次加载慢 | 预设 `will-change` 提示浏览器 |

## 8. 验收标准

- [ ] 桌面 / 平板 / 移动端三档响应式正常
- [ ] 暗色模式覆盖完备
- [ ] 无控制台报错
- [ ] `hexo clean && hexo server` 本地预览通过
- [ ] `CHANGELOG.md` 已追加版本条目
- [ ] `PROJECT_STRUCTURE.md` 已更新

## 9. 后续演进方向（可选）

- 未来可能的扩展点
