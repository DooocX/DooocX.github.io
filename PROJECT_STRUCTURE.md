# 项目结构

> 本文件是**目录结构索引**，仅描述"文件在哪里 + 做什么"。
> 版本演进请看 [`CHANGELOG.md`](./CHANGELOG.md)，待办计划请看 [`docs/roadmap.md`](./docs/roadmap.md)。

---

## 项目概览

基于 **Hexo 7.3.0** 的个人博客与游戏音频作品集，使用 **Quiet** 主题（深度定制），部署到 **GitHub Pages**（`DooocX.github.io`）。

---

## 目录结构

```
DooocX.github.io/
├── README.md                    # 项目门面
├── AGENTS.md                    # AI 协作入口地图
├── CHANGELOG.md                 # 版本索引
├── PROJECT_STRUCTURE.md         # 本文件
├── Rules.md                     # 规范指路 stub → docs/conventions/
├── _config.yml                  # Hexo 主配置（含 marked.lazyload）
├── package.json                 # 项目依赖
├── .editorconfig                # 编辑器统一配置
├── .gitignore                   # Git 忽略规则
│
├── docs/                        # 文档中心
│   ├── conventions/             #   编码规范（按领域拆分）
│   │   ├── coding-style.md      #     通用编码风格（缩进/命名/注释/JS）
│   │   ├── git-workflow.md      #     Git 分支与提交
│   │   ├── directory-structure.md  #  目录组织原则
│   │   ├── css-guidelines.md    #     CSS/Less 规范
│   │   └── ejs-guidelines.md    #     EJS 模板规范
│   ├── runbooks/                #   操作手册
│   │   ├── new-post.md          #     发布新文章
│   │   ├── new-showreel.md      #     发布新 SHOWREEL 作品
│   │   ├── deploy.md            #     部署上线
│   │   └── image-hosting.md     #     七牛云图床使用
│   ├── troubleshooting.md       #   踩坑手册（症状/根因/修复/规则）
│   └── roadmap.md               #   待办与规划
│
├── specs/                       # 功能规格文档
│   ├── README.md                #   spec 索引
│   ├── _template/spec.md        #   标准 spec 模板
│   └── showreel-feature-v1.1.0/spec.md
│
├── .github/                     # GitHub 配置
│   └── dependabot.yml           #   自动依赖更新
│
├── scaffolds/                   # hexo new 使用的模板
│   ├── post.md                  #   新文章模板
│   ├── page.md                  #   新页面模板
│   ├── draft.md                 #   草稿模板
│   └── showreel.md              #   新作品模板
│
├── scripts/                     # Hexo 扩展脚本（自动加载）
│   └── showreel.js              #   SHOWREEL Generator：扫描 _showreel/ → 生成列表页与详情页
│
├── source/                      # 内容源文件
│   ├── _posts/                  #   博客文章
│   ├── _showreel/               #   作品（下划线目录，由 generator 处理）
│   ├── about/index.md           #   关于页（front-matter 驱动：experiences / works / skills / email）
│   ├── categories/index.md      #   分类页（Tab 化，含标签）
│   ├── tags/index.md            #   独立标签页（保留可访问，导航已移除）
│   ├── links/index.md           #   友链页
│   └── 404.md                   #   404 入口
│
└── themes/Quiet/                # Quiet 主题
    ├── _config.yml              #   主题配置（唯一配置入口）
    ├── layout/                  #   EJS 模板
    │   ├── layout.ejs           #     根布局（主题初始化脚本）
    │   ├── index.ejs            #     首页
    │   ├── post.ejs             #     文章详情
    │   ├── archive.ejs          #     归档 / 分类归档
    │   ├── about.ejs            #     关于页（Hero / 时间线 / 作品卡片 + Modal / 技能栈；含 works JSON 数据岛 + IIFE）
    │   ├── categories.ejs       #     分类列表（Tab 化：分类 + 标签）
    │   ├── tags.ejs             #     标签列表（独立页保留）
    │   ├── tag.ejs              #     单标签文章列表
    │   ├── links.ejs            #     友链
    │   ├── 404.ejs              #     404 页面
    │   ├── showreel.ejs         #     SHOWREEL 作品列表页
    │   ├── showreel_post.ejs    #     SHOWREEL 作品详情页
    │   ├── _partial/            #     局部模板
    │   │   ├── head.ejs         #       HTML <head>
    │   │   ├── header.ejs       #       导航栏（含暗色切换按钮）
    │   │   ├── foot.ejs         #       页脚
    │   │   ├── home.ejs         #       首页文章列表
    │   │   ├── post_head.ejs    #       文章头部（字数统计 + 阅读时间）
    │   │   ├── post_content.ejs #       文章正文
    │   │   ├── post_paging.ejs  #       上下篇导航
    │   │   ├── comment.ejs      #       Giscus 评论公共 partial（文章/作品共享）
    │   │   ├── showreel_player.ejs  #   视频播放器抽象（bilibili / mp4 分支）
    │   │   └── showreel_paging.ejs  #   作品邻接导航
    │   └── _widget/             #     可复用小组件
    │       ├── analytics.ejs    #       百度统计（已禁用）
    │       ├── comment.ejs      #       Giscus（已迁至 _partial/comment.ejs）
    │       ├── gotop.ejs        #       回到顶部
    │       ├── grouping.ejs     #       按年份分组
    │       ├── header_body.ejs  #       页面 banner
    │       └── sidebar.ejs      #       移动端侧边栏（含暗色切换入口）
    └── source/                  #   主题静态资源
        ├── css/
        │   ├── index.less       #     样式入口（仅 @import）
        │   ├── public/          #     基础层
        │   │   ├── _variables.less     # 设计令牌系统
        │   │   ├── _mixins.less        # Mixin 工具库
        │   │   ├── article_content.less # 文章正文排版
        │   │   ├── animation.less      # 内容进场动画
        │   │   ├── dark-mode.less      # 暗色模式全局覆盖
        │   │   ├── code-copy.less      # 代码块复制按钮
        │   │   └── toast.less          # 全局 Toast 提示组件
        │   ├── pages/           #     页面级样式（home / post / about / archive / categories / tags / tag / links / showreel / showreel_post）
        │   ├── widget/          #     组件样式（header / footer / sidebar / gotop / grouping / header_body / toc）
        │   ├── highlight/       #     代码高亮（Atom One Dark）
        │   └── plugin/          #     第三方插件样式（Fancybox / Giscus）
        ├── js/
        │   ├── index.js         #     主脚本（暗色模式、代码复制、Toast、Fancybox 初始化等）
        │   ├── fancybox.umd.js  #     Fancybox 图片灯箱
        │   └── hljs.min.js      #     highlight.js 代码高亮
        └── image/
            ├── favicon.ico      #     网站图标
            ├── logo.png         #     网站 Logo
            ├── pattern.png      #     侧边栏背景纹理
            └── icon-*.svg       #     底部社交图标（GitHub / B站 / 邮箱）
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

## 主题配置要点

- **首页布局**：`block-card`（图文块状卡片）
- **导航栏**：HOME → SHOWREEL → ARCHIVE → CATEGORIES → LINKS → ABOUT + 暗色模式切换
- **SHOWREEL 模块**：音效作品展示，`source/_showreel/` 管理，支持 B 站 iframe / mp4
- **分类/标签合并**：`/categories` 页内 Tab 切换，支持 `#tags` hash 直达
- **暗色模式**：跟随系统偏好 + 手动切换 + localStorage 持久化
- **代码高亮**：highlight.js（Atom One Dark，仅文章页加载）
- **图片灯箱**：Fancybox（仅文章页加载）
- **评论系统**：Giscus（基于 GitHub Discussions，主题跟随暗色模式）
- **代码复制**：代码块右上角一键复制按钮
- **字数统计**：文章头部显示字数与预计阅读时间
- **图片懒加载**：`marked.lazyload: true` 自动为图片加 `loading="lazy"`
- **图床**：七牛云 CDN `cdn.docxaudioblog.top`（详见 [`docs/runbooks/image-hosting.md`](./docs/runbooks/image-hosting.md)）

---

## 架构特性

### 设计令牌系统
- 所有颜色、间距、断点等值集中在 `_variables.less`
- 通用 mixin 集中在 `_mixins.less`（响应式断点、过渡动画、flex 布局等）
- 暗色模式使用 `[data-theme="dark"]` CSS 选择器覆盖，不破坏 LESS 变量体系

### 性能优化
- 移除 jQuery，使用原生 ES6+ DOM API
- JS 脚本 `defer` 非阻塞加载
- Fancybox / highlight.js 仅在文章详情页按需加载
- scroll 事件使用 `requestAnimationFrame` 节流
- 图片懒加载（`loading="lazy"`）减少首屏加载负担

### SEO
- `<html lang="zh-CN">` 语言标识
- Open Graph / Twitter Card meta 标签
- 语义化 viewport（允许用户缩放）

---

## 相关文档

- 编码规范：[`docs/conventions/`](./docs/conventions/)
- 操作手册：[`docs/runbooks/`](./docs/runbooks/)
- 踩坑手册：[`docs/troubleshooting.md`](./docs/troubleshooting.md)
- 待办规划：[`docs/roadmap.md`](./docs/roadmap.md)
- 功能规格：[`specs/`](./specs/)
