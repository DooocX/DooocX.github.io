# 踩坑手册 (Troubleshooting)

> 记录本项目在开发过程中遇到的**高危陷阱、根因、修复方案与预防规则**。
> **修 bug 前请先在本文档搜索关键词**，避免重复推导；修完后请把新踩坑同步追加到对应分类。

---

## 目录

- [EJS 模板类](#ejs-模板类)
- [Modal / 弹层类](#modal--弹层类)
- [Giscus 评论](#giscus-评论)
- [暗色模式](#暗色模式)
- [响应式与移动端](#响应式与移动端)
- [Hexo Generator](#hexo-generator)
- [图片与图床](#图片与图床)

---

## EJS 模板类

### 1. EJS 属性输出转义陷阱（高危）

- **症状**：`class` 属性被转成 `&quot;xxx&quot;`，浏览器解析后 className 变成带引号的字符串，CSS 选择器（`.xxx`）永远命中失败
- **根因**：`<%= %>` 会对输出做 HTML 转义，其中的引号被转成 `&quot;`
- **修复**：拼装含引号的 HTML 属性片段一律用 `<%- %>`（不转义输出）；`<%= %>` 仅用于纯文本内容
- **来源**：v1.1.2 — `post_head.ejs` 中文全角开括号标题智能缩进的 class 拼装失效

---

## Modal / 弹层类

### 1. Modal 打开时页面抖动 + fixed header 右缩进（高危）

- **症状**：Modal 打开瞬间页面右缩几像素，顶部 fixed header 也整体错位
- **根因**：`overflow: hidden` 锁滚动会移除垂直滚动条宽度，导致 `width: 100vw` 的 fixed header 与内容整体右移
- **修复**：打开 Modal 时预先测量滚动条宽度：
  ```js
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  ```
  同步给 `<body>` 加 `padding-right: {scrollbarWidth}px`，并给 fixed header 同宽 `padding-right` 补偿；关闭时清理
- **来源**：v1.1.3 About 页作品 Modal

### 2. Modal 打开时页面变白（深色模式）

- **症状**：深色模式下打开 Modal，背后内容区域整体变白
- **根因**：Modal 遮罩层挂在内容区容器（有 `background: #fff`）之上，深色模式下白底穿透显示
- **修复**：将 Modal DOM 从内容容器（如 `.about-page`）内**移到 `<body>` 末尾**，脱离父容器背景污染；同时 `z-index` 提升到 `9999`，确保覆盖 fixed header
- **预防规则**：**Modal / 全屏遮罩类 DOM 一律挂到 `<body>` 末尾**
- **来源**：v1.1.3

### 3. Modal 内容无法滚动

- **症状**：Modal 内容超过视口高度时无法上下滚动
- **修复**：遮罩层与内容层拆分。遮罩层仅负责点击关闭；内容层设 `max-height: 85vh; overflow-y: auto`
- **来源**：v1.1.3

### 4. 毛玻璃背景（backdrop-filter）首次加载延迟

- **症状**：Modal 第一次打开时毛玻璃模糊有明显闪烁 / 延迟
- **根因**：`backdrop-filter` 首次触发浏览器需要编译合成层
- **修复**：在遮罩元素上预设 `will-change: backdrop-filter`，提示浏览器提前预热合成层
- **来源**：v1.1.3

---

## Giscus 评论

### 1. 暗色模式下 Giscus 首次加载不同步

- **症状**：首次打开空评论页面时 Giscus iframe 保持白色，不跟随站点暗色模式
- **根因**：原有 postMessage 判定逻辑过严，iframe 首次加载信号未被识别
- **修复**：放宽 postMessage 判定条件，iframe 首次加载事件即触发主题同步（`light` / `dark_dimmed`）
- **影响范围**：博客文章页与 SHOWREEL 作品详情页（共享 `_partial/comment.ejs`）
- **来源**：v1.1.0

---

## 暗色模式

### 1. 深色模式下移动端汉堡按钮显示为蓝色实心方块

- **症状**：移动端顶部三横线菜单在暗色模式下变成蓝色实心方块，图标不可见
- **根因**：`dark-mode.less` 中 `.h-right-close svg path[fill]` 选择器过宽，命中了透明占位 `<path fill="none">`
- **修复**：改为 `.h-right-close svg path[fill]:not([fill="none"])`，精确排除透明占位 path
- **来源**：v1.1.1

### 2. 深色模式下工作经历（About 页时间线）黑字看不清

- **症状**：暗色模式下 About 页时间线的公司名 / 职位 / 亮点 / 标签仍是深色字，与深色背景对比度不足
- **修复**：`about.less` 追加深色覆盖段，四类文本统一替换为深色语义色：
  - 公司名 `#e0e0e0`
  - 职位 `#c8d0dc`
  - 亮点 `#8a9bb0`
  - 标签 `#7ab7ff`
- **预防规则**：新增页面级样式后，**必须**在 `dark-mode.less`（或页面 less 的深色段）补齐暗色覆盖
- **来源**：v1.1.3

### 3. 侧边栏底部社交图标在暗色下不可见

- **症状**：暗色模式下侧边栏底部社交 SVG 图标（GitHub / Bilibili / 邮箱）颜色与背景过接近
- **修复**：暗色模式下追加 `filter: invert(1)` 反色
- **来源**：v1.1.1

---

## 响应式与移动端

### 1. 移动端侧边栏菜单右侧被裁切

- **症状**：SHOWREEL / CATEGORIES 等长文本菜单项在移动侧边栏中被右侧截断
- **根因**：`<ul>` 默认 `padding-left: 40px` 挤占了可用宽度
- **修复**：清除 `<ul>` 浏览器默认 `padding-left: 40px`
- **来源**：v1.1.1

### 2. 移动端侧边栏菜单链接 `display: grid` 误用导致省略号失效

- **修复**：菜单链接改为 `display: block`，并补齐三件套：`white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`
- **来源**：v1.1.1

### 3. SHOWREEL 详情页视频被 fixed header 遮挡

- **症状**：作品详情页顶部视频播放器上边缘被 fixed header 遮挡
- **修复**：`.showreel-post` 容器分档新增顶部避让 padding（移动端/平板/桌面各 50-70px）
- **预防规则**：新页面若有紧贴顶部的内容，必须与 fixed header 高度联动避让（未来 Header 响应式重构后可统一走变量，见 `docs/roadmap.md`）
- **来源**：v1.1.1

### 4. 时间线圆点未穿过竖轴中心

- **症状**：About 页时间线的圆点视觉上偏离竖轴
- **修复**：`::before` 从 `left: -6px` 精确调整为 `left: -5px`，配合 `width: 10px`，使圆点直径中点严格落在 `1px` 竖轴上
- **来源**：v1.1.3

---

## Hexo Generator

### 1. Windows 下 CRLF / BOM 导致 SHOWREEL front-matter 解析失败

- **症状**：在 Windows 下新建作品 md 后，`scripts/showreel.js` 读取 front-matter 报错或解析为空
- **根因**：Windows 编辑器保存的 md 带 CRLF 或 BOM，`hexo-front-matter` 解析器兼容不足
- **修复**：generator 读取 md 内容前先归一化换行符（`\r\n` → `\n`）并去除 BOM
- **来源**：v1.1.0

---

## 图片与图床

### 1. 七牛云图床接入排错（关键错误码）

| 错误码 | 症状 | 根因 | 修复 |
|---|---|---|---|
| 401 | 认证失败 | AK/SK 错误 / Bucket 名拼错 / 区域填错 | 在七牛「密钥管理」新建一对密钥重填，Bucket 名 `doxcxblogimage`（易拼错） |
| 631 | `incorrect region` | 华南 Bucket 区域没写 z2 | PicGo 区域填 `z2` 或 upHost 填 `https://up-z2.qiniu.com` |
| —— | 图裂 | 链接缺 `https://` 协议头 | 访问网址必须带协议头，否则 Markdown 会当相对路径 |
| —— | 混合内容拦截 | CDN 域名未开 HTTPS | 七牛控制台必须为 CDN 域名启用免费 HTTPS 证书 |

### 2. 根域名 CNAME 冲突

- **背景**：根域名 `docxaudioblog.top` 已 CNAME 到 GitHub Pages
- **规则**：七牛 CDN **只能**用子域名 `cdn.docxaudioblog.top`，避免与 Pages 的 CNAME 冲突
- **来源**：2026-08-13 图床迁移日志

### 3. PicGo 相册无法真正删除云端图片

- **注意**：PicGo 相册的"删除"只会移除本地记录，**不会**同步删除七牛云端文件
- **正确删除方式**：
  1. 七牛控制台「对象存储 → doxcxblogimage → 文件管理」勾选删除（推荐，支持批量 / 搜索 / 前缀筛选）
  2. 命令行工具 `qshell`
  3. Python `qiniu` SDK 脚本调用 `bucket.delete`
- **注意**：官方 FAQ 明确说明 PicGo 原生不支持图床远端同步删除，不存在可靠的 `picgo-plugin-qiniu-delete` 插件
- **来源**：2026-08-13 图床日常管理踩坑
