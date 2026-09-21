# Runbook — 部署上线

## 分支约定

| 分支 | 用途 |
|---|---|
| `hexo` | **源码分支**（默认工作分支），存放 Hexo 源文件、主题、配置、内容 |
| `main` | **部署分支**，存放 `hexo generate` 编译后的静态文件，由 `hexo deploy` 自动推送到 GitHub Pages |

⚠️ **禁止手动修改 `main` 分支**。它是自动化产物，人工改动会在下次部署被覆盖。

---

## 标准部署流程

```bash
# 1. 提交源码到 hexo 分支（先 push 源码作为备份）
git add .
git commit -m "<type>(<scope>): <subject>"
git push origin hexo

# 2. 清理旧产物
hexo clean

# 3. 本地预览确认（可选，但发大改动前强烈建议）
hexo server
# 打开 http://localhost:4000 检查无误后 Ctrl+C 停止

# 4. 一键部署（内部会执行 hexo generate + git push 到 main 分支）
hexo deploy
```

`hexo deploy` 完成后 GitHub Pages 通常在 1-2 分钟内生效，访问 https://docxaudioblog.top 或 https://dooocx.github.io 查看效果。

---

## 常见问题

### 部署后页面 404 / 样式丢失

- 检查 `_config.yml` 的 `url` 与 `root` 是否与实际域名一致
- 若使用自定义域名，检查 `source/CNAME` 是否存在且内容正确

### 图片显示不出来

- 检查图片链接是否带 `https://` 协议头
- 检查是否命中"混合内容拦截"（HTTPS 页面加载 HTTP 图片）
- 见 `docs/troubleshooting.md#图片与图床`

### hexo deploy 报错 / push 被拒

- 通常是 `main` 分支被本地或远端污染。可尝试：
  ```bash
  cd .deploy_git
  git remote -v         # 确认远端指向本仓库
  git status
  ```
- 极端情况下可删除 `.deploy_git` 目录让 hexo 重新初始化

---

## 未来规划

见 `docs/roadmap.md` — GitHub Actions 自动化部署（推送 `hexo` 分支后自动构建并推到 `main`）。
