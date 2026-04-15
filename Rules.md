# 编程规范 (Rules)

> 本文件是 DooocX 博客项目的编程规范基准文档，所有后续开发和修改必须遵守以下规则。

---

## 一、编码规范

### 1.1 缩进与格式

- **统一使用 2 个空格缩进**，禁止使用 Tab
- 文件末尾保留一个空行
- 行尾不允许有多余空格
- 字符编码统一使用 UTF-8
- 换行符统一使用 LF（`\n`）

### 1.2 文件命名

| 文件类型 | 命名规则 | 示例 |
|---------|---------|------|
| Less 文件 | 小写 + 下划线分隔，私有文件加 `_` 前缀 | `home.less`、`_variables.less` |
| EJS 模板 | 小写 + 下划线分隔 | `post_content.ejs`、`header_body.ejs` |
| JS 文件 | 小写 + 连字符分隔 | `index.js`、`fancybox-images.js` |
| Markdown | 大写或中文标题 | `Rules.md`、`PROJECT_STRUCTURE.md` |
| 配置文件 | 框架约定格式 | `_config.yml`、`.editorconfig` |

### 1.3 注释风格

**Less / CSS：**

```less
// === 章节标题 ===（用于分隔大区块）

// 单行注释（用于解释某个属性或规则）

/*
 * 多行注释
 * 用于文件头部说明或复杂逻辑解释
 */
```

**JavaScript：**

```js
// 单行注释

/**
 * 函数说明
 * @param {string} selector - DOM 选择器
 * @returns {Element|null}
 */
```

**EJS 模板：**

```ejs
<%# 模板注释：说明这段模板的用途 %>
```

### 1.4 JavaScript 规范

- 使用 ES6+ 语法（`const`/`let`、箭头函数、模板字符串等）
- 禁止使用 `var` 声明变量
- 禁止使用 `arguments.callee`
- 禁止使用 jQuery，所有 DOM 操作使用原生 API
- 事件监听使用 `addEventListener`，禁止 `on*` 属性赋值
- 高频事件（scroll、resize）必须添加节流（推荐 `requestAnimationFrame`）
- 字符串优先使用单引号 `'`，模板字符串使用反引号 `` ` ``

---

## 二、Git 工作流规范

### 2.1 分支策略

| 分支 | 用途 | 说明 |
|------|------|------|
| `hexo` | 源码分支（默认） | 存放 Hexo 源文件、主题、配置 |
| `main` | 部署分支 | 存放 `hexo generate` 编译后的静态文件，由 `hexo deploy` 自动推送 |

- 日常开发在 `hexo` 分支上进行
- 禁止直接修改 `main` 分支内容
- 部署流程：`hexo clean` → `hexo deploy`

### 2.2 提交信息格式

采用 **Conventional Commits** 规范：

```
<type>(<scope>): <subject>

[可选 body]
```

**type 类型：**

| type | 说明 |
|------|------|
| `feat` | 新功能（新文章、新页面、新组件） |
| `fix` | Bug 修复 |
| `style` | 样式调整（不影响功能的 CSS/Less 修改） |
| `refactor` | 重构（不改变功能的代码重组） |
| `perf` | 性能优化 |
| `docs` | 文档更新 |
| `chore` | 构建/配置/依赖相关 |
| `content` | 文章内容更新 |

**scope 范围（可选）：**

`theme`、`config`、`post`、`layout`、`css`、`js`

**示例：**

```
feat(post): 添加 Wwise SoundBank 管理笔记
fix(css): 修复移动端标签页布局溢出
refactor(js): 移除 jQuery 依赖，改用原生 DOM API
style(theme): 统一颜色变量引用
chore: 移除冗余依赖 hexo-theme-landscape
```

---

## 三、文件/目录组织规范

### 3.1 主题目录结构

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

### 3.2 组织原则

- **模板与样式一一对应**：每个 EJS 模板文件应有对应的 Less 样式文件
- **禁止在模板中内联 `<style>` 或业务 `<script>`**：所有样式归入 Less，所有脚本归入 JS
- **Less 入口文件 `index.less` 只做 `@import`**：不包含任何具体样式规则（`.content-move` 等应移至对应文件）
- **静态资源分类存放**：CSS、JS、图片分别在各自目录下

---

## 四、CSS/Less 编写规范

### 4.1 变量使用

- **所有颜色值必须使用变量**，禁止硬编码十六进制/RGB 值
- **间距、圆角、阴影等常用值使用变量**，保持设计一致性
- 变量定义集中在 `public/_variables.less` 中
- 变量命名格式：`@category-name`（如 `@color-primary`、`@spacing-md`）

### 4.2 选择器规范

- **最大嵌套深度：4 层**，超过则需重新组织选择器
- 避免使用标签选择器（`div`、`span`），优先使用 class
- class 命名使用 **连字符分隔**（如 `.post-card-title`、`.header-top`）
- 避免使用 `!important`，如必须使用需附注释说明原因

```less
// ✅ 正确：嵌套不超过 4 层
.post-card {
  .post-card-title {
    color: @color-text-primary;
    &:hover {
      color: @color-primary;
    }
  }
}

// ❌ 错误：嵌套过深
.home {
  .main {
    .post-block {
      .post-block-content {
        .post-block-content-info {
          h2 { ... }  // 6 层嵌套
        }
      }
    }
  }
}
```

### 4.3 Mixin 使用

- 通用 mixin 集中在 `public/_mixins.less` 中
- mixin 命名使用 **点号 + 连字符**（如 `.flex-center()`、`.respond-below()`）
- 带参数的 mixin 必须提供默认值
- 响应式样式统一使用断点 mixin，禁止硬编码 `@media` 数值

```less
// ✅ 正确
.respond-below(@breakpoint-md, {
  flex-direction: column;
});

// ❌ 错误
@media (max-width: 800px) {
  flex-direction: column;
}
```

### 4.4 样式文件结构

每个 Less 文件内部按以下顺序组织：

1. 布局属性（`display`、`position`、`flex`）
2. 盒模型（`width`、`height`、`margin`、`padding`）
3. 排版（`font-size`、`line-height`、`color`、`text-align`）
4. 视觉（`background`、`border`、`border-radius`、`box-shadow`）
5. 动画/过渡（`transition`、`animation`）
6. 其他

---

## 五、EJS 模板编写规范

### 5.1 缩进与格式

- 使用 2 空格缩进，与 HTML 标签对齐
- EJS 标签（`<% %>`）与 HTML 保持同级缩进
- 多行 EJS 逻辑使用清晰的开闭结构

```ejs
<%# ✅ 正确 %>
<div class="nav">
  <% for (const menu in theme.menus) { %>
    <% if (name === menu) { %>
      <li class="select">
        <a href="<%= theme.menus[menu] %>"><%= theme.menus_title[menu] %></a>
      </li>
    <% } else { %>
      <li>
        <a href="<%= theme.menus[menu] %>"><%= theme.menus_title[menu] %></a>
      </li>
    <% } %>
  <% } %>
</div>
```

### 5.2 逻辑与标记分离

- 复杂数据处理在模板顶部的 `<% %>` 块中完成，然后在 HTML 中引用变量
- 避免在 HTML 属性中嵌入复杂表达式

```ejs
<%# ✅ 正确：先计算，再渲染 %>
<%
const categoryName = post.categories.data[0]
  ? post.categories.data[0].name
  : theme.author || 'Quiet';
%>
<span class="post-tag"><%= categoryName %></span>

<%# ❌ 错误：属性中嵌入复杂三元表达式 %>
<span><%- post.categories.data[0] ? post.categories.data[0].name : theme.author ? theme.author : 'Quiet' %></span>
```

### 5.3 Partial 引用规范

- `partial()` 路径使用相对路径，与文件实际位置一致
- 传递参数时使用对象语法，参数名语义清晰

```ejs
<%- partial('_partial/header', { name: 'home' }) %>
<%- partial('_widget/header_body', { message: theme.headers.home.message, icon: theme.headers.home.icon }) %>
```

### 5.4 禁止项

- **禁止** 在 EJS 模板中使用 `<style>` 标签（样式归入 Less 文件）
- **禁止** 在 EJS 模板中使用业务逻辑的 `<script>` 标签（脚本归入 JS 文件）
- **禁止** 使用内联 `style` 属性（如 `style="color: red"`）
- 例外：第三方库初始化代码（如 `hljs.highlightAll()`）可保留在模板中

---

## 附录：工具配置

项目根目录下的 `.editorconfig` 文件确保所有编辑器遵循统一格式，详见该文件。

---

## 版权声明

本项目使用的 Quiet 主题基于 [hexo-theme-quiet](https://github.com/QiaoBug/hexo-theme-quiet)，原作者为 QiaoBug，采用 MIT 协议开源。本项目在原主题基础上进行了大幅修改和定制。
