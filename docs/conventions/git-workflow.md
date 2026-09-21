# 编码规范 — Git 工作流

## 1. 分支策略

| 分支 | 用途 | 说明 |
|------|------|------|
| `hexo` | **源码分支**（默认） | 存放 Hexo 源文件、主题、配置、内容 |
| `main` | **部署分支** | 存放 `hexo generate` 编译后的静态文件，由 `hexo deploy` 自动推送 |

- ✅ 日常开发在 `hexo` 分支上进行
- ❌ **禁止直接修改 `main` 分支内容**（自动化产物，人工改动会被下次部署覆盖）
- 部署流程：`hexo clean` → `hexo deploy`（详见 `docs/runbooks/deploy.md`）

---

## 2. 提交信息格式（Conventional Commits）

```
<type>(<scope>): <subject>

[可选 body]
```

### type 类型

| type | 说明 |
|------|------|
| `feat` | 新功能（新文章、新页面、新组件） |
| `fix` | Bug 修复 |
| `style` | 样式调整（不影响功能的 CSS/Less 修改） |
| `refactor` | 重构（不改变功能的代码重组） |
| `perf` | 性能优化 |
| `docs` | 文档更新 |
| `chore` | 构建 / 配置 / 依赖相关 |
| `content` | 文章内容更新 |

### scope 范围（可选）

`theme`、`config`、`post`、`layout`、`css`、`js`、`showreel`、`about`

### 示例

```
feat(post): 添加 Wwise SoundBank 管理笔记
fix(css): 修复移动端标签页布局溢出
refactor(js): 移除 jQuery 依赖，改用原生 DOM API
style(theme): 统一颜色变量引用
chore: 移除冗余依赖 hexo-theme-landscape
docs: 新增 AGENTS.md 入口地图
```

---

## 3. 提交粒度建议

- **单一职责**：一次提交只做一件事，方便回溯
- **文档同步**：改动同时更新 `CHANGELOG.md`、`docs/troubleshooting.md`（若涉及踩坑）、`specs/`（若涉及规格化模块）
- **spec 优先**：大改动应先出 spec，spec 与代码分开提交更清晰

---

## 4. 与文档协作的约定

- **修 bug** → 修完在 `docs/troubleshooting.md` 追加"症状/根因/修复/规则"四段
- **发新版本** → 在 `CHANGELOG.md` 顶部追加一行版本条目（**只写一行**，细节链接到 spec / troubleshooting）
- **加新功能** → `specs/` 下建 spec，`PROJECT_STRUCTURE.md` 补上新文件的职责说明
