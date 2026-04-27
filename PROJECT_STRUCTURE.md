# 项目结构总结

## 项目概览

基于 **Hexo 7.3.0** 的个人博客项目，使用 **Quiet** 主题（v1.1.0），定位为**游戏音频博客与作品集**，部署到 GitHub Pages（`DooocX.github.io`）。

---

## 目录结构

```
DooocX.github.io/
├── _config.yml                 # Hexo 主配置文件（含 marked.lazyload 图片懒加载配置）
├── Rules.md                    # 编程规范文件
├── PROJECT_STRUCTURE.md        # 项目结构说明
├── .editorconfig               # 编辑器统一配置
├── .gitignore                  # Git 忽略规则
├── package.json                # 项目依赖
├── package-lock.json           # 依赖锁定
│
├── .github/                    # GitHub 配置
│   └── dependabot.yml          #   自动依赖更新
│
├── scaffolds/                  # 文章模板
│   ├── post.md                 #   新文章模板
│   ├── page.md                 #   新页面模板
│   ├── draft.md                #   草稿模板
│   └── showreel.md             #   [v1.1.0] 新作品模板（hexo new showreel "xxx"）
│
├── scripts/                    # [v1.1.0] Hexo 扩展脚本
│   └── showreel.js             #   SHOWREEL Generator：扫描 _showreel/ → 生成列表页与详情页
│
├── specs/                      # 规格文档
│   └── showreel-feature-v1.1.0/
│       └── spec.md             #   SHOWREEL 模块规格说明
│
├── source/                     # 内容源文件
│   ├── _posts/                 #   博客文章（4 篇）
│   │   ├── FIRST.md
│   │   ├── 【Wwise】101.md
│   │   ├── 【Wwise】版本控制与工作流.md
│   │   └── 【视频总结】手游领域打造3A音频效果.md
│   ├── _showreel/              #   [v1.1.0] 作品内容（下划线目录，由自定义 generator 处理）
│   ├── about/index.md          #   关于页
│   ├── tags/index.md           #   标签页
│   ├── categories/index.md     #   分类页
│   └── links/index.md          #   友链页
│
└── themes/Quiet/               # Quiet 主题
    ├── _config.yml             #   主题配置（唯一配置入口）
    ├── layout/                 #   EJS 模板
    │   ├── layout.ejs          #     根布局（含进度条 div + 主题初始化脚本）
    │   ├── index.ejs           #     首页
    │   ├── post.ejs            #     文章详情
    │   ├── archive.ejs         #     归档/分类归档
    │   ├── about.ejs           #     关于
    │   ├── categories.ejs      #     分类列表（[v1.1.0] 改造为分类/标签 Tab 切换）
    │   ├── tags.ejs            #     标签列表（独立页保留，顶部导航已移除）
    │   ├── tag.ejs             #     单标签文章列表
    │   ├── links.ejs           #     友链
    │   ├── 404.ejs             #     404 页面
    │   ├── showreel.ejs        #     [v1.1.0] SHOWREEL 作品列表页
    │   ├── showreel_post.ejs   #     [v1.1.0] SHOWREEL 作品详情页
    │   ├── _partial/           #     局部模板
    │   │   ├── head.ejs        #       HTML head
    │   │   ├── header.ejs      #       导航栏（含暗色模式切换按钮）
    │   │   ├── foot.ejs        #       页脚
    │   │   ├── home.ejs        #       首页文章列表
    │   │   ├── post_head.ejs   #       文章头部（含字数统计 + 阅读时间）
    │   │   ├── post_content.ejs#       文章正文（评论区已抽至 comment.ejs）
    │   │   ├── post_paging.ejs #       上下篇导航
    │   │   ├── comment.ejs     #       [v1.1.0] Giscus 评论公共 partial（文章/作品共享）
    │   │   ├── showreel_player.ejs #   [v1.1.0] 视频播放器抽象（bilibili / mp4 分支）
    │   │   └── showreel_paging.ejs #   [v1.1.0] 作品邻接导航（上一部/下一部）
    │   └── _widget/            #     小组件
    │       ├── analytics.ejs   #       百度统计（已禁用）
    │       ├── comment.ejs     #       Giscus 评论（已迁至 post_content.ejs）
    │       ├── gotop.ejs       #       回到顶部按钮
    │       ├── grouping.ejs    #       按年份分组列表
    │       ├── header_body.ejs #       页面 banner
    │       └── sidebar.ejs     #       移动端侧边栏（含暗色模式切换入口）
    └── source/                 #   主题静态资源
        ├── css/
        │   ├── index.less      #     样式入口（仅 @import）
        │   ├── public/         #     基础层
        │   │   ├── _variables.less  # 设计令牌系统
        │   │   ├── _mixins.less     # Mixin 工具库
        │   │   ├── article_content.less  # 文章正文排版样式
        │   │   ├── animation.less   # 内容进场动画
        │   │   ├── dark-mode.less   # 暗色模式全局覆盖样式（NEW）
        │   │   ├── progress-bar.less # 阅读进度条样式（NEW）
        │   │   └── code-copy.less   # 代码块复制按钮样式（NEW）
        │   ├── pages/          #     页面级样式（含 [v1.1.0] showreel.less / showreel_post.less）
        │   ├── widget/         #     组件样式
        │   │   ├── header.less #     含暗色切换按钮样式
        │   │   ├── footer.less
        │   │   ├── header_body.less
        │   │   ├── grouping.less
        │   │   ├── sidebar.less
        │   │   └── gotop.less
        │   ├── highlight/      #     代码高亮（Atom One Dark）
        │   └── plugin/         #     第三方插件样式（Fancybox、Giscus）
        ├── js/
        │   ├── index.js        #     主脚本（含暗色模式、进度条、代码复制）
        │   ├── fancybox.umd.js #     Fancybox 图片灯箱
        │   └── hljs.min.js     #     highlight.js 代码高亮
        └── image/
            ├── favicon.ico     #     网站图标
            ├── logo.png        #     网站 Logo
            ├── pattern.png     #     侧边栏背景纹理
            ├── 1776072826849.png  # 标签页图片
            └── 1776072828872.png  # 标签页图片
```

---

## 插件依赖

| 插件 | 用途 |
|---|---|
| `hexo-deployer-git` | Git 一键部署 |
| `hexo-generator-archive/category/index/tag` | 页面生成器 |
| `hexo-renderer-ejs` | EJS 模板渲染 |
| `hexo-renderer-less` | Less CSS 编译 |
| `hexo-renderer-marked` | Markdown 渲染（含图片懒加载） |
| `hexo-server` | 本地开发服务器 |

---

## 文章内容

| 文章 | 分类 | 标签 |
|---|---|---|
| MarkDown语法示例 | Markdown | Markdown |
| 【Wwise】101笔记 | Wwise | Wwise笔记, Wwise |
| 【Wwise】版本控制与工作流 | Wwise | 音频策划, 版本控制, Wwise |
| 【音效设计】手游领域打造3A音频效果 | 音效设计 | 音效设计, 视频总结 |

---

## 主题配置要点

- **首页布局**：`block-card`（图文块状卡片）
- **导航栏**：HOME / SHOWREEL / ARCHIVE / CATEGORIES / LINKS / ABOUT + 暗色模式切换
- **SHOWREEL 模块**（v1.1.0）：音效作品展示，`source/_showreel/` 管理，`hexo new showreel "标题"` 创建；支持 B 站 iframe 嵌入，架构预留 mp4 扩展
- **分类/标签合并**（v1.1.0）：`/categories` 页内 Tab 切换，支持 `#tags` hash 直达
- **暗色模式**：跟随系统偏好自动切换，支持手动切换，localStorage 持久化
- **代码高亮**：highlight.js（Atom One Dark 主题，仅文章页加载）
- **图片灯箱**：Fancybox（仅文章页加载）
- **评论系统**：Giscus（基于 GitHub Discussions，已启用，主题跟随暗色模式）
- **阅读进度条**：仅文章页顶部显示，3px 主色调进度条
- **代码复制**：代码块右上角一键复制按钮
- **字数统计**：文章头部显示字数和预计阅读时间
- **图片懒加载**：通过 `marked.lazyload: true` 自动为 Markdown 图片添加 `loading="lazy"`
- **统计**：百度统计（已禁用）
- **底部图标**：GitHub（链接到 `github.com/DooocX`）

---

## 架构特性

### 设计令牌系统
- 所有颜色、间距、断点等值集中在 `_variables.less` 中管理
- 通用 mixin 集中在 `_mixins.less` 中（响应式断点、过渡动画、flex 布局等）
- 暗色模式使用 `[data-theme="dark"]` CSS 选择器覆盖，不破坏现有 LESS 变量体系

### 性能优化
- 移除 jQuery 依赖，使用原生 ES6+ DOM API
- JS 脚本 `defer` 非阻塞加载
- Fancybox / highlight.js 仅在文章详情页按需加载
- scroll 事件使用 `requestAnimationFrame` 节流
- 图片懒加载（`loading="lazy"`）减少首屏加载负担

### SEO
- `<html lang="zh-CN">` 语言标识
- Open Graph / Twitter Card meta 标签
- 语义化 viewport（允许用户缩放）

---

## 待优化项

1. **Logo 文件偏大**：`logo.png` 约 1.03 MB，建议压缩至 200KB 以下
2. **关于页内容为空**：`source/about/index.md` 只有 front-matter，没有正文
3. **默认封面**：使用第三方随机图片 API，建议替换为本地或可控 CDN 图片
4. **搜索功能**：待添加全站搜索
5. **TOC 目录**：所有文章 `toc: false`，待开启并优化悬浮定位
6. **404 页面**：依赖外部 CDN 图片，建议本地化
7. **社交图标**：待添加 B 站、邮箱等联系方式
