# 编码规范 — 通用编码风格

> 覆盖缩进、编码、文件命名、注释、JavaScript 语言规范。

---

## 1. 缩进与格式

- **统一使用 2 个空格缩进**，禁止使用 Tab
- 文件末尾保留一个空行
- 行尾不允许有多余空格
- 字符编码统一使用 **UTF-8**
- 换行符统一使用 **LF**（`\n`）
- 项目根目录的 `.editorconfig` 已强制上述规则，请保持编辑器启用 EditorConfig 插件

## 2. 文件命名

| 文件类型 | 命名规则 | 示例 |
|---------|---------|------|
| Less 文件 | 小写 + 下划线分隔，私有文件加 `_` 前缀 | `home.less`、`_variables.less` |
| EJS 模板 | 小写 + 下划线分隔 | `post_content.ejs`、`header_body.ejs` |
| JS 文件 | 小写 + 连字符分隔 | `index.js`、`fancybox-images.js` |
| Markdown | 大写标题或中文标题 | `Rules.md`、`【Wwise】101.md` |
| 配置文件 | 框架约定格式 | `_config.yml`、`.editorconfig` |

## 3. 注释风格

### Less / CSS

```less
// === 章节标题 ===（用于分隔大区块）

// 单行注释（用于解释某个属性或规则）

/*
 * 多行注释
 * 用于文件头部说明或复杂逻辑解释
 */
```

### JavaScript

```js
// 单行注释

/**
 * 函数说明
 * @param {string} selector - DOM 选择器
 * @returns {Element|null}
 */
```

### EJS 模板

```ejs
<%# 模板注释：说明这段模板的用途 %>
```

---

## 4. JavaScript 规范

- 使用 **ES6+** 语法（`const` / `let`、箭头函数、模板字符串、解构等）
- **禁止使用 `var`** 声明变量
- 禁止使用 `arguments.callee`
- **禁止使用 jQuery**，所有 DOM 操作使用原生 API
- 事件监听使用 `addEventListener`，**禁止 `on*` 属性赋值**
- **高频事件**（`scroll`、`resize`、`mousemove`）必须添加节流（推荐 `requestAnimationFrame`）
- 字符串优先使用**单引号** `'`，模板字符串使用反引号 `` ` ``

### 页面级私有脚本

页面私有的交互脚本（如 About 页 Modal）允许内联在对应 EJS 模板末尾，但**必须**：

1. 使用 IIFE 封装：`(function(){ ... })()`
2. 数据部分独立为 `<script type="application/json" id="xxx-data">` 数据岛
3. 顶部注释说明用途与作用范围
4. 不引入外部第三方依赖（如需依赖 npm 包则必须抽独立 JS 文件）

详见 `docs/conventions/ejs-guidelines.md`。
