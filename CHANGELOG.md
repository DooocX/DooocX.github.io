# 更新日志 | Changelog

> 本文件为**版本索引**：每次改动一行一条，细节请跳转到对应的 spec / troubleshooting / roadmap。
>
> - 详细技术方案 → `specs/<feature-vX.Y.Z>/spec.md`
> - Bug 根因与规则 → `docs/troubleshooting.md`
> - 待办规划 → `docs/roadmap.md`

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 规范，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)：`主版本号.次版本号.修订号`。

- **Major**：不兼容的重大改版（如主题整体重构）
- **Minor**：新增功能，向下兼容（如加了暗色模式、TOC 等）
- **Patch**：小修复、样式微调、文案修改

---

## [Unreleased] - 待办

计划项已迁移到 [`docs/roadmap.md`](./docs/roadmap.md)。

---

## [1.1.3] - 2026-09-20

### 🎉 新增 (Added)
- About 页专业化改版（Hero / 工作经历时间线 / 参与作品长条卡片 + Modal / 技能栈网格），内容由 `source/about/index.md` front-matter 驱动

### 🔄 变更 (Changed)
- 联系方式模块下沉：删除页面末尾"联系方式"独立区块，邮箱统一迁移到 Hero 区

### 🔧 修复 (Fixed)
- Modal 打开抖动 + fixed header 右缩进 → [troubleshooting](./docs/troubleshooting.md#1-modal-打开时页面抖动--fixed-header-右缩进高危)
- Modal 打开时页面变白（深色模式下背景穿透）→ [troubleshooting](./docs/troubleshooting.md#2-modal-打开时页面变白深色模式)
- Modal 内容无法滚动 → [troubleshooting](./docs/troubleshooting.md#3-modal-内容无法滚动)
- 毛玻璃背景首次加载延迟 → [troubleshooting](./docs/troubleshooting.md#4-毛玻璃背景backdrop-filter首次加载延迟)
- 深色模式下工作经历黑字看不清 → [troubleshooting](./docs/troubleshooting.md#2-深色模式下工作经历about-页时间线黑字看不清)
- 时间线圆点未穿过竖轴中心 → [troubleshooting](./docs/troubleshooting.md#4-时间线圆点未穿过竖轴中心)

### 📝 文档 (Docs)
- `PROJECT_STRUCTURE.md` About 页描述扩写为五段式模块说明
- `Rules.md` 新增例外条款：页面私有 JSON 数据岛 + IIFE 交互脚本允许内联在 EJS 模板末尾（现已迁移到 `docs/conventions/ejs-guidelines.md`）

---

## [1.1.2] - 2026-04-27

### ✨ 优化 (Changed)
- 文章详情页标题区收紧 + 三档响应式补齐（桌面 140/96、平板 116/72、移动 104/56）
- 标题区四元素（tag / h1 / 头像 / 字数）左基准线严格对齐；tag 胶囊瘦身
- 中文全角开括号标题智能首行缩进（`text-indent: -0.5em`）

### 🔧 修复 (Fixed)
- EJS 属性输出转义陷阱（`<%= %>` vs `<%- %>`）→ [troubleshooting](./docs/troubleshooting.md#1-ejs-属性输出转义陷阱高危)

---

## [1.1.1] - 2026-04-27

### 🔧 修复 (Fixed)
- SHOWREEL 详情页视频被 fixed header 遮挡（三档避让 padding）→ [troubleshooting](./docs/troubleshooting.md#3-showreel-详情页视频被-fixed-header-遮挡)
- 文章详情页 banner 强制使用第三方随机图（改为 `page.cover || theme.default_cover`）
- 移动端侧边栏菜单右侧被裁切 → [troubleshooting](./docs/troubleshooting.md#1-移动端侧边栏菜单右侧被裁切)
- 移动端侧边栏菜单链接 `display: grid` 误用 → [troubleshooting](./docs/troubleshooting.md#2-移动端侧边栏菜单链接-display-grid-误用导致省略号失效)
- 暗色模式下移动端汉堡按钮显示为蓝色实心方块 → [troubleshooting](./docs/troubleshooting.md#1-深色模式下移动端汉堡按钮显示为蓝色实心方块)

### ✨ 优化 (Changed)
- 侧边栏主题切换按钮由居中改为靠右对齐
- 侧边栏菜单项新增 hover 效果（亮色/暗色统一）
- 全站图标 hover 风格统一：footer 与侧边栏底部社交图标去除变蓝 filter；暗色下侧边栏底部图标补 `filter: invert(1)`

---

## [1.1.0] - 2026-04-27

### 🎉 新增 (Added)
- **🎬 SHOWREEL 音效作品展示模块** → [spec](./specs/showreel-feature-v1.1.0/spec.md)
  - `/showreel/` 列表页 + `/showreel/<slug>/` 详情页
  - 视频源抽象：B 站 iframe / mp4，架构预留扩展
  - `source/_showreel/` 内容管理 + `hexo new showreel "标题"` 命令
  - 自定义 Generator `scripts/showreel.js`
- **🏷️ CATEGORIES 页 Tab 化改造**：合并"分类 / 标签"为同页 Tab，支持 `#tags` hash 直达
- **💬 公共评论 Partial** `_partial/comment.ejs`：文章页与作品页共享

### 🔄 变更 (Changed)
- 顶部导航重排：移除独立 `TAGS`，新增 `SHOWREEL`

### 🔧 修复 (Fixed)
- Giscus 暗色模式首次加载不同步 → [troubleshooting](./docs/troubleshooting.md#1-暗色模式下-giscus-首次加载不同步)
- Windows 下 CRLF/BOM 导致 SHOWREEL front-matter 解析失败 → [troubleshooting](./docs/troubleshooting.md#1-windows-下-crlf--bom-导致-showreel-front-matter-解析失败)

---

## [1.0.1] - 2026-04-23

### 🔧 修复 (Fixed)
- **404 页面本地化**：移除外部 CDN 图片依赖，改为纯 CSS 实现（渐变数字 + 文案 + 返回首页按钮），支持暗色模式 + 响应式；新增 `source/404.md` 入口修复原项目 `404.ejs` 从未被 Hexo 渲染的问题

---

## [1.0.0] - 2026-04-23

首个正式版本，博客具备完整的阅读、互动与个性化体验。

### 🎉 新增 (Added)
- **暗色模式**：深蓝黑色系配色，跟随系统偏好，localStorage 持久化，Giscus 主题同步
- **文章目录 (TOC)**：悬浮左侧，滚动高亮，折叠展开，宽屏（≥1500px）自动显示
- **关于页面 (About)**：个人简介 / 技能栈 / 正在做什么 / 联系方式 / 关于博客
- **代码块一键复制**：右上角复制按钮 + Toast 反馈
- **字数统计 & 阅读时间**：显示在文章标题下方
- **图片懒加载**：`marked.lazyload: true`
- **底部社交图标**：GitHub / B站 / 邮箱（本地 SVG，无外部依赖）
- **通用 Toast 组件**：全局 `showToast()`，主题自适应

### ⚡ 优化 (Changed)
- Logo 图片压缩：1058 KB → 118 KB（-88.84%）
- 导航栏视觉修复：纯色背景，滚动缩小无白色缝隙

### 🔥 移除 (Removed)
- 阅读进度条

---

## 维护约定

1. **每次功能改动后**，在本文件顶部追加新版本块（一行一条，细节链接外部）
2. 版本块包含：版本号、日期、分类（新增 / 优化 / 修复 / 移除）
3. **未完成的想法**写入 [`docs/roadmap.md`](./docs/roadmap.md)
4. **Bug 根因与规则**写入 [`docs/troubleshooting.md`](./docs/troubleshooting.md)
5. **大改动**先在 [`specs/`](./specs/) 建 spec，本文条目链接到 spec
