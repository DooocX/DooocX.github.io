# AGENTS.md — AI 协作入口

> 本文件是 AI 助手（Claude / Cursor / Codex 等）进入本仓库工作前**必须首先阅读**的入口地图。
> 目标：让每一次"新功能 / 修 bug / 样式调整"都能被快速定位到正确的文件，并按既定规范落地，避免大范围搜索与方向偏差。

---

## 1. 项目一句话简介

基于 **Hexo 7.3.0 + Quiet 主题** 的个人博客与游戏音频作品集（SHOWREEL），部署到 **GitHub Pages**（`DooocX.github.io`）。前端零构建、原生 ES6+，样式使用 Less，模板使用 EJS。

---

## 2. AI 必读顺序（每次任务开始前）

按下述顺序快速加载最少必要上下文：

1. **本文（AGENTS.md）** — 定位任务类型、找到改动地图
2. **`PROJECT_STRUCTURE.md`** — 目录结构与文件职责索引
3. **`docs/conventions/` 下相关规范** — 只读与本次任务相关的那一份（如改样式只读 `css-guidelines.md`）
4. **`docs/troubleshooting.md`** — 修 bug 前先查是否已知问题
5. **`specs/<相关 feature>/spec.md`** — 若改的是已规格化的模块（如 SHOWREEL / About 改版）
6. **`CHANGELOG.md`** — 仅当需要了解版本演进脉络时读，日常任务通常不需要

---

## 3. 目录导航（快速定位）

```
根目录
├── AGENTS.md                 ← 你现在在这里
├── PROJECT_STRUCTURE.md      ← 目录结构索引
├── CHANGELOG.md              ← 版本索引（一行一条，细节看 spec / troubleshooting）
├── README.md                 ← 项目门面（对外介绍）
│
├── docs/                     ← 文档中心
│   ├── conventions/          ←   编码规范（按领域拆分）
│   ├── runbooks/             ←   操作手册（"怎么做"）
│   ├── troubleshooting.md    ←   踩坑手册（"曾经错在哪"）
│   └── roadmap.md            ←   待办与规划
│
├── specs/                    ← 功能规格文档（"要做什么 / 为什么这么做"）
│   ├── README.md
│   ├── _template/            ←   spec 标准模板
│   └── <feature-vX.Y.Z>/spec.md
│
├── source/                   ← Hexo 内容源
│   ├── _posts/               ←   博客文章
│   ├── _showreel/            ←   作品（自定义 generator 处理）
│   ├── about/index.md        ←   关于页数据源（front-matter 驱动）
│   └── ...
│
├── themes/Quiet/             ← 主题（EJS 模板 + Less 样式 + JS）
├── scripts/showreel.js       ← Hexo 自定义 Generator
└── scaffolds/                ← hexo new 使用的模板
```

---

## 4. 常见任务 → 改动地图（Task Recipes）

> 下述"改动地图"给出任务的**入口文件清单 + 最小操作步骤**，AI 应据此聚焦读取，避免全库扫描。

### 4.1 新增/修改一篇博客文章

- **只需改**：`source/_posts/<文件名>.md`
- 遵循：文章 front-matter 见 `scaffolds/post.md`；图片走七牛云 CDN，见 `docs/runbooks/image-hosting.md`
- 无需改动主题、样式、JS

### 4.2 新增/修改一个 SHOWREEL 作品

- **只需改**：`source/_showreel/<slug>.md`
- 模板：`scaffolds/showreel.md`；命令：`hexo new showreel "作品标题"`
- 详细流程见 `docs/runbooks/new-showreel.md`
- **背后逻辑（一般不动）**：`scripts/showreel.js` 负责扫描目录并生成列表页与详情页

### 4.3 调整某个页面的样式

- **样式入口**：`themes/Quiet/source/css/index.less`（仅做 @import）
- **页面级样式**：`themes/Quiet/source/css/pages/<page>.less`
- **组件级样式**：`themes/Quiet/source/css/widget/<component>.less`
- **设计令牌**：`themes/Quiet/source/css/public/_variables.less`（颜色 / 间距 / 断点 / 字号）
- **通用 mixin**：`themes/Quiet/source/css/public/_mixins.less`（响应式断点、flex-center 等）
- **暗色模式覆盖**：`themes/Quiet/source/css/public/dark-mode.less`
- ⚠️ 改样式**必检**：是否需要在 `dark-mode.less` 联动覆盖；是否引入了硬编码颜色/断点（应改为变量）
- 规范：`docs/conventions/css-guidelines.md`

### 4.4 修改某个页面的模板 / 交互

- **主题模板入口**：`themes/Quiet/layout/<page>.ejs`
- **公共局部**：`themes/Quiet/layout/_partial/*.ejs`（header / foot / post_head / comment / ...）
- **可复用组件**：`themes/Quiet/layout/_widget/*.ejs`（sidebar / gotop / grouping / ...）
- **全站 JS**：`themes/Quiet/source/js/index.js`（暗色模式、代码复制、Toast 等）
- ⚠️ EJS 中拼接含引号的 HTML 属性一律用 `<%- %>`，不要用 `<%= %>`（转义陷阱，见 troubleshooting）
- 规范：`docs/conventions/ejs-guidelines.md`

### 4.5 新增一个页面 / 功能模块（大改动）

**必须走 spec 流程**，顺序如下：

1. 复制 `specs/_template/spec.md` 到 `specs/<feature-name-vX.Y.Z>/spec.md`
2. 填完 spec 后与用户确认方向，**用户拍板后再动代码**
3. `themes/Quiet/layout/` 新增 `.ejs` 模板
4. `themes/Quiet/source/css/pages/` 新增同名 `.less` 页面样式
5. 主题 `_config.yml` 挂菜单（如需）
6. 如需独立内容目录（类似 `_showreel`），在 `scripts/` 下写自定义 generator
7. 更新 `PROJECT_STRUCTURE.md`（补上新文件的职责说明）
8. 更新 `specs/README.md` 的 spec 清单
9. 在 `CHANGELOG.md` 顶部追加一行版本条目，链接到 spec
10. 部署前本地 `hexo clean && hexo generate && hexo server` 验证

### 4.6 修 Bug

1. **先查** `docs/troubleshooting.md`，按关键词搜索是否已知问题（往往直接找到方案）
2. 定位到源码修复
3. **修完必须**：把"症状 + 根因 + 修复方案 + 规则"追加到 `docs/troubleshooting.md` 对应分类下
4. 在 `CHANGELOG.md` 当前版本条目下加一行简述 + 链接到 troubleshooting

### 4.7 部署上线

见 `docs/runbooks/deploy.md`。核心命令：`hexo clean && hexo deploy`（源码在 `hexo` 分支，静态产物由 `hexo deploy` 自动推送到 `main`）。

### 4.8 上传图片

见 `docs/runbooks/image-hosting.md`。当前使用**七牛云 CDN**（`cdn.docxaudioblog.top`）+ PicGo 上传。旧文章的 jsDelivr 链接可保留。

---

## 5. 分支 / 提交 / 部署（速览）

- **分支**：日常在 `hexo` 分支上开发；`main` 分支为部署产物，由 `hexo deploy` 自动推送，**禁止手动修改**
- **提交信息**：遵循 Conventional Commits（`feat / fix / style / refactor / perf / docs / chore / content`）
- **详细规范**：`docs/conventions/git-workflow.md`

---

## 6. 禁区（Do Not）

- ❌ 不要在 EJS 模板里写 `<style>` 标签（样式必须归入 Less 文件）
- ❌ 不要在 CSS/Less 里硬编码颜色、间距、断点数值（必须走 `_variables.less` 变量）
- ❌ 不要使用 jQuery（所有 DOM 操作用原生 ES6+ API）
- ❌ 不要用 `<%= %>` 输出含引号的 HTML 属性（转义陷阱，必须用 `<%- %>`）
- ❌ 不要手动修改 `main` 分支
- ❌ 不要在未确认方向的情况下直接开写大改动，**大改动先出 spec**
- ❌ 例外允许（**仅**）：页面私有的 JSON 数据岛 + IIFE 交互脚本可内联在对应 EJS 模板末尾，条件见 `docs/conventions/ejs-guidelines.md`

---

## 7. 用户与 AI 的协作偏好

- **语言**：对话使用中文，代码内注释使用中文
- **风格**：回答简洁、结构化；改动前先说方案，让用户拍板方向；改动后简短汇报动了哪些文件
- **粒度**：AI 应优先做**用户明确请求的事**，不主动扩大改动范围；不主动创建 Markdown / README 文件（用户明确要求除外）
- **验证**：如果修改的是主题样式或模板，改后建议提醒用户在本地 `hexo server` 预览
