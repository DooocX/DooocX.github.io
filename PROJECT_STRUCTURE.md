# 项目结构总结

## 项目概览

基于 **Hexo 7.3.0** 的个人博客项目，使用 **Quiet** 主题（v1.1.0），定位为**游戏音频博客与作品集**，部署到 GitHub Pages（`DooocX.github.io`）。

---

## 目录结构

```
DooocX.github.io/
├── _config.yml                 # Hexo 主配置文件
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
│   └── draft.md                #   草稿模板
│
├── source/                     # 内容源文件
│   ├── _posts/                 #   博客文章（4 篇）
│   │   ├── FIRST.md
│   │   ├── 【Wwise】101.md
│   │   ├── 【Wwise】版本控制与工作流.md
│   │   └── 【视频总结】手游领域打造3A音频效果.md
│   ├── about/index.md          #   关于页
│   ├── tags/index.md           #   标签页
│   ├── categories/index.md     #   分类页
│   └── links/index.md          #   友链页
│
└── themes/Quiet/               # Quiet 主题
    ├── _config.yml             #   主题配置（唯一配置入口）
    ├── layout/                 #   EJS 模板
    │   ├── layout.ejs          #     根布局
    │   ├── index.ejs           #     首页
    │   ├── post.ejs            #     文章详情
    │   ├── archive.ejs         #     归档/分类归档
    │   ├── about.ejs           #     关于
    │   ├── categories.ejs      #     分类列表
    │   ├── tags.ejs            #     标签列表
    │   ├── tag.ejs             #     单标签文章列表
    │   ├── links.ejs           #     友链
    │   ├── 404.ejs             #     404 页面
    │   ├── _partial/           #     局部模板
    │   │   ├── head.ejs        #       HTML head
    │   │   ├── header.ejs      #       导航栏
    │   │   ├── foot.ejs        #       页脚
    │   │   ├── home.ejs        #       首页文章列表
    │   │   ├── post_head.ejs   #       文章头部
    │   │   ├── post_content.ejs#       文章正文
    │   │   └── post_paging.ejs #       上下篇导航
    │   └── _widget/            #     小组件
    │       ├── analytics.ejs   #       百度统计（已禁用）
    │       ├── comment.ejs     #       Gitalk 评论
    │       ├── gotop.ejs       #       回到顶部按钮
    │       ├── grouping.ejs    #       按年份分组列表
    │       ├── header_body.ejs #       页面 banner
    │       └── sidebar.ejs     #       移动端侧边栏
    └── source/                 #   主题静态资源
        ├── css/
        │   ├── index.less      #     样式入口（仅 @import）
        │   ├── public/         #     基础层
        │   │   ├── _variables.less  # 设计令牌系统
        │   │   ├── _mixins.less     # Mixin 工具库
        │   │   ├── article_content.less  # 文章正文排版样式
        │   │   └── animation.less   # 内容进场动画
        │   ├── pages/          #     页面级样式（8 个 .less 文件）
        │   ├── widget/         #     组件样式
        │   │   ├── header.less
        │   │   ├── footer.less
        │   │   ├── header_body.less
        │   │   ├── grouping.less
        │   │   ├── sidebar.less
        │   │   └── gotop.less
        │   ├── highlight/      #     代码高亮（Atom One Dark）
        │   └── plugin/         #     第三方插件样式（Fancybox、Gitalk）
        ├── js/
        │   ├── index.js        #     主脚本（原生 ES6+）
        │   ├── fancybox.umd.js #     Fancybox 图片灯箱
        │   ├── gitalk.min.js   #     Gitalk 评论插件
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
| `hexo-renderer-marked` | Markdown 渲染 |
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
- **导航栏**：HOME / ARCHIVE / CATEGORIES / TAGS / LINKS / ABOUT
- **代码高亮**：highlight.js（Atom One Dark 主题，仅文章页加载）
- **图片灯箱**：Fancybox（仅文章页加载）
- **评论系统**：Giscus（基于 GitHub Discussions，已启用）
- **统计**：百度统计（已禁用）
- **底部图标**：GitHub（链接到 `github.com/DooocX`）

---

## 架构特性

### 设计令牌系统
- 所有颜色、间距、断点等值集中在 `_variables.less` 中管理
- 通用 mixin 集中在 `_mixins.less` 中（响应式断点、过渡动画、flex 布局等）
- 禁止硬编码颜色/断点值

### 性能优化
- 移除 jQuery 依赖，使用原生 ES6+ DOM API
- JS 脚本 `defer` 非阻塞加载
- Fancybox / highlight.js 仅在文章详情页按需加载
- scroll 事件使用 `requestAnimationFrame` 节流

### SEO
- `<html lang="zh-CN">` 语言标识
- Open Graph / Twitter Card meta 标签
- 语义化 viewport（允许用户缩放）

---

## 待优化项

1. **Logo 文件偏大**：`logo.png` 约 1.03 MB，建议压缩至 200KB 以下
2. **关于页内容为空**：`source/about/index.md` 只有 front-matter，没有正文
3. **Gitalk 评论配置**：当前为占位值，如需启用需替换为真实 GitHub OAuth 凭据
4. **默认封面**：使用第三方随机图片 API，建议替换为本地或可控 CDN 图片
