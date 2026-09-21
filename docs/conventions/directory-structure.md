# 编码规范 — 目录组织

## 1. 主题目录结构

```
themes/Quiet/
├── _config.yml                 # 主题配置（唯一配置入口）
├── layout/                     # EJS 模板
│   ├── layout.ejs              #   根布局（不含业务逻辑）
│   ├── index.ejs               #   首页
│   ├── post.ejs                #   文章详情
│   ├── *.ejs                   #   其他页面模板
│   ├── _partial/               #   页面级局部模板
│   │   ├── head.ejs            #     HTML <head>
│   │   ├── header.ejs          #     导航栏
│   │   ├── foot.ejs            #     页脚
│   │   └── ...
│   └── _widget/                #   可复用小组件
│       ├── sidebar.ejs
│       ├── gotop.ejs
│       └── ...
└── source/                     # 静态资源
    ├── css/
    │   ├── index.less          #   样式入口（仅 @import）
    │   ├── public/             #   基础层（变量、mixin、全局样式）
    │   ├── pages/              #   页面级样式
    │   ├── widget/             #   组件级样式
    │   ├── highlight/          #   代码高亮主题
    │   └── plugin/             #   第三方插件样式
    ├── js/                     #   脚本文件
    └── image/                  #   图片资源
```

完整的项目目录索引见 `PROJECT_STRUCTURE.md`。

---

## 2. 组织原则

### 2.1 模板与样式一一对应

每个 EJS 模板文件应有对应的 Less 样式文件：

- `layout/about.ejs` ↔ `source/css/pages/about.less`
- `layout/showreel.ejs` ↔ `source/css/pages/showreel.less`
- `layout/_widget/sidebar.ejs` ↔ `source/css/widget/sidebar.less`

### 2.2 分层职责

| 层 | 目录 | 职责 |
|---|---|---|
| 入口 | `css/index.less` | 只做 `@import`，不含具体样式规则 |
| 基础层 | `css/public/` | 变量、mixin、全局样式（`_variables.less`、`_mixins.less`、`article_content.less`、`dark-mode.less`、`animation.less`、`code-copy.less`、`toast.less`） |
| 页面级 | `css/pages/` | 单个页面的样式（`home.less`、`post.less`、`about.less`、`showreel.less` 等） |
| 组件级 | `css/widget/` | 跨页面复用的组件（`header.less`、`footer.less`、`sidebar.less`、`gotop.less` 等） |
| 插件 | `css/plugin/` | 第三方插件样式（`fancybox.css`、`giscus.css`） |
| 高亮 | `css/highlight/` | 代码高亮主题（`atom-one-dark.less`） |

### 2.3 禁止项

- ❌ 禁止在模板中内联 `<style>` 或业务 `<script>`（所有样式归入 Less，所有脚本归入 JS）
  - 例外：见 `docs/conventions/ejs-guidelines.md` 中的"页面私有交互脚本"条款
- ❌ `index.less` 只做 `@import`，不包含任何具体样式规则
- ❌ 静态资源不允许混放（CSS / JS / 图片必须分别在各自目录）

---

## 3. 内容源目录

```
source/
├── _posts/               # 博客文章（Hexo 原生识别）
├── _showreel/            # 作品（下划线目录，由 scripts/showreel.js 处理）
├── about/index.md        # 关于页数据源（front-matter 驱动）
├── categories/index.md   # 分类页（Tab 化，含标签）
├── tags/index.md         # 独立标签页（保留可访问，导航已移除）
├── links/index.md        # 友链页
└── 404.md                # 404 入口
```

## 4. Hexo 扩展点

```
scripts/                  # Hexo 扩展脚本（自动加载）
└── showreel.js           #   SHOWREEL 自定义 generator

scaffolds/                # hexo new 使用的模板
├── post.md
├── page.md
├── draft.md
└── showreel.md
```
