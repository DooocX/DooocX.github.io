# Runbook — 图床使用指南（七牛云 CDN）

> 本项目图片托管方案确立于 2026-08-13。

## 方案总览

| 项 | 值 |
|---|---|
| 服务商 | **七牛云对象存储** |
| Bucket | `doxcxblogimage`（⚠️ 易拼错，注意是 dox**c**x 不是 docx） |
| 区域 | **华南 z2** |
| 空间性质 | 公开空间 |
| 加速域名 | `cdn.docxaudioblog.top`（子域名，根域名给 GitHub Pages 用） |
| 上传工具 | **PicGo**（本地截图 / 拖拽直传，链接自动复制到剪贴板） |

⚠️ **HTTPS 必开**：七牛控制台必须为 CDN 域名启用免费 HTTPS 证书。否则 GitHub Pages（HTTPS）博客加载 http 图片会被浏览器按混合内容策略拦截。

---

## PicGo 配置要点

1. 打开 PicGo → 图床设置 → **七牛图床**
2. 填写：
   - AccessKey / SecretKey：七牛「密钥管理」新建
   - Bucket：`doxcxblogimage`
   - 存储区域：`z2`（华南必须）
   - 访问网址：`https://cdn.docxaudioblog.top`（必须带 `https://` 协议头）
   - 存储路径：目前统一 `test/`（未来可优化为 `YYYY/MM/`）
3. 详细设置 → 勾选 **时间戳重命名**（避免文件名冲突）

---

## 文章中引用图片

Markdown 语法：

```markdown
![描述](https://cdn.docxaudioblog.top/<path>/<file>.png)
```

**必须带 `https://` 协议头**，否则 Markdown 会当相对路径导致图裂。

---

## 常见错误码速查

| 错误码 | 症状 | 修复 |
|---|---|---|
| 401 | 认证失败 | AK/SK 错 / Bucket 名错 / 区域错，重填 |
| 631 | `incorrect region` | 华南桶区域必须填 `z2` 或 upHost 填 `https://up-z2.qiniu.com` |
| —— | 图裂 | 链接缺 `https://` 协议头 |
| —— | 浏览器拦截 | CDN 域名未开 HTTPS |

详见 `docs/troubleshooting.md#图片与图床`。

---

## 图片删除

⚠️ **PicGo 相册的"删除"只删本地记录，不删云端文件！**

正确删除方式（按推荐顺序）：

1. **七牛控制台**「对象存储 → doxcxblogimage → 文件管理」勾选删除（推荐，支持批量 / 搜索 / 前缀筛选）
2. 命令行工具 `qshell`
3. Python `qiniu` SDK 脚本调用 `bucket.delete`

---

## 历史遗留

- **旧文章**仍使用 `https://cdn.jsdelivr.net/gh/DooocX/DocX_Images/...` 链接
- **不必立即迁移**：jsDelivr 目前可访问，不影响功能
- **可选**：写批量脚本统一替换（见 `docs/roadmap.md` P3.5）

---

## 未来优化方向

- 写 PicGo 插件实现"上传前自动 `path=YYYY/MM/` + 时间戳命名"一站式方案
- 或使用 `picgo-plugin-rename-file` 实现自定义命名规则
