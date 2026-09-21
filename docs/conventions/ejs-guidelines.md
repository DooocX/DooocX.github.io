# 编码规范 — EJS 模板

## 1. 缩进与格式

- 使用 **2 空格缩进**，与 HTML 标签对齐
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

---

## 2. 输出标签选择（⚠️ 高危陷阱）

| 标签 | 是否转义 | 使用场景 |
|---|---|---|
| `<%= expr %>` | ✅ HTML 转义 | 纯文本内容（如 `<%= post.title %>`） |
| `<%- expr %>` | ❌ 不转义 | **含引号的 HTML 属性片段、HTML 字符串输出** |

### 转义陷阱示例（真实踩坑，v1.1.2）

```ejs
<%# ❌ 错误：class 属性被转义，浏览器解析后 className 变成带引号的字符串 %>
<h1 class="<%= hasSpecialStart ? '"has-fullwidth-start"' : '' %>">...</h1>
<%# 结果：<h1 class="&quot;has-fullwidth-start&quot;"> → CSS 选择器永远命中失败 %>

<%# ✅ 正确 %>
<h1 class="<%- hasSpecialStart ? 'has-fullwidth-start' : '' %>">...</h1>
```

**规则**：拼装含引号 / 含 HTML 结构的输出一律用 `<%- %>`；`<%= %>` 仅用于纯文本内容。

---

## 3. 逻辑与标记分离

复杂数据处理放在模板顶部的 `<% %>` 块中，然后在 HTML 中引用变量。

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

---

## 4. Partial 引用

- `partial()` 路径使用相对路径，与文件实际位置一致
- 传递参数时使用对象语法，参数名语义清晰

```ejs
<%- partial('_partial/header', { name: 'home' }) %>
<%- partial('_widget/header_body', {
  message: theme.headers.home.message,
  icon: theme.headers.home.icon
}) %>
```

---

## 5. 禁止项

- ❌ **禁止**在 EJS 模板中使用 `<style>` 标签（样式必须归入 Less 文件）
- ❌ **禁止**在 EJS 模板中使用业务逻辑的 `<script>` 标签（脚本归入 JS 文件）
- ❌ **禁止**使用内联 `style` 属性（如 `style="color: red"`）

---

## 6. 例外允许

### 6.1 第三方库初始化

第三方库的初始化代码（如 `hljs.highlightAll()`、Fancybox 初始化）可保留在模板中。

### 6.2 页面私有的 JSON 数据岛 + IIFE 交互脚本

**当且仅当**脚本仅服务于单一 EJS 模板、且强依赖模板同页数据（例如 About 页 `works` 数组驱动的 Modal 交互）时，允许作为 `<script>` 内联在模板末尾，但**必须**满足：

1. ✅ 使用 IIFE 封装：`(function(){ ... })()`，避免污染全局作用域
2. ✅ 数据部分独立为 `<script type="application/json" id="xxx-data">` 数据岛，与逻辑代码解耦
3. ✅ 顶部注释说明用途与作用范围限制
4. ✅ **不引入外部第三方依赖**（如需依赖 npm 包则必须抽独立 JS 文件到 `themes/Quiet/source/js/`）

**判断标准**：若该脚本可能被 2 个或以上模板复用，必须抽独立 JS 文件；否则内联更利于阅读与维护（避免加载分裂与耦合分散）。

**参考实现**：`themes/Quiet/layout/about.ejs` 末尾的 works Modal 交互脚本（v1.1.3 引入）。

---

## 7. Modal / 弹层类实践（重要）

若在模板中实现 Modal 或全屏遮罩：

- ✅ Modal DOM **必须挂到 `<body>` 末尾**，不要放在有背景色的父容器内（否则深色模式下会白底穿透）
- ✅ 打开 Modal 时锁滚动必须**补偿滚动条宽度**，否则页面会抖动、fixed header 会右缩
- ✅ 遮罩层与内容层拆分：遮罩仅负责点击关闭，内容层 `max-height: 85vh; overflow-y: auto`

详见 `docs/troubleshooting.md#modal--弹层类`。
