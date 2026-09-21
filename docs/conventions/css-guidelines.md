# 编码规范 — CSS / Less

## 1. 变量使用（强制）

- ✅ **所有颜色值必须使用变量**，禁止硬编码十六进制 / RGB 值
- ✅ **间距、圆角、阴影等常用值使用变量**，保持设计一致性
- 变量定义集中在 `themes/Quiet/source/css/public/_variables.less`
- 变量命名格式：`@category-name`（如 `@color-primary`、`@spacing-md`、`@breakpoint-md`）

```less
// ✅ 正确
.card {
  color: @color-text-primary;
  padding: @spacing-md;
  border-radius: @radius-sm;
}

// ❌ 错误：硬编码
.card {
  color: #333;
  padding: 16px;
  border-radius: 4px;
}
```

---

## 2. 选择器规范

- **最大嵌套深度：4 层**，超过需重新组织
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

---

## 3. Mixin 使用

- 通用 mixin 集中在 `themes/Quiet/source/css/public/_mixins.less`
- mixin 命名使用 **点号 + 连字符**（如 `.flex-center()`、`.respond-below()`）
- 带参数的 mixin **必须提供默认值**
- 响应式样式**统一使用断点 mixin**，禁止硬编码 `@media` 数值

```less
// ✅ 正确：使用断点 mixin
.respond-below(@breakpoint-md, {
  flex-direction: column;
});

// ❌ 错误：硬编码媒体查询
@media (max-width: 800px) {
  flex-direction: column;
}
```

---

## 4. 属性书写顺序

每个规则内部按以下顺序组织属性：

1. **布局**：`display`、`position`、`flex`、`grid`
2. **盒模型**：`width`、`height`、`margin`、`padding`
3. **排版**：`font-size`、`line-height`、`color`、`text-align`
4. **视觉**：`background`、`border`、`border-radius`、`box-shadow`
5. **动画/过渡**：`transition`、`animation`
6. **其他**：`cursor`、`user-select` 等

---

## 5. 暗色模式（联动检查）

新增 / 修改页面样式时，**必须同步检查**：

1. 是否需要在 `themes/Quiet/source/css/public/dark-mode.less` 补齐深色覆盖？
2. 或在页面 less（如 `about.less`）文件末尾追加 `[data-theme="dark"]` 覆盖段？

**深色模式覆盖遗漏是本项目最常见的踩坑**（见 `docs/troubleshooting.md#暗色模式`），改样式后请务必自查。

---

## 6. 文件组织

- **入口** `index.less`：只做 `@import`，不含任何具体样式规则
- **页面级** `pages/<page>.less`：与 `layout/<page>.ejs` 一一对应
- **组件级** `widget/<component>.less`：跨页面复用组件的样式
- **基础层** `public/*.less`：变量、mixin、全局样式、暗色模式覆盖
- 详见 `docs/conventions/directory-structure.md`

---

## 7. 常见踩坑速查

- 移动端菜单被裁切 → 清 `<ul>` 默认 `padding-left: 40px`
- 深色模式看不清文字 → 补齐 `dark-mode` 覆盖段
- 时间线圆点未穿过竖轴 → 圆点半径需与竖轴宽度对齐

详见 `docs/troubleshooting.md`。
