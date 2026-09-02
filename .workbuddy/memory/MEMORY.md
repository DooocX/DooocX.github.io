# 项目长期记忆 (MEMORY.md)

## 图片托管方案（2026-08-13 确立）
- 博客图片改用**七牛云 CDN**，不再依赖 jsDelivr（jsDelivr 国内间歇性不稳、无备案）。
- 加速域名：`cdn.docxaudioblog.top`（子域名，根域名 docxaudioblog.top 已给 GitHub Pages 用，勿冲突）
- 七牛 Bucket：`doxcxblogimage`，**公开空间**，区域 **华南 z2**
- 上传工具：**PicGo**（图床设置→七牛），本地截图/拖拽直传，链接自动复制
- 文章引用格式：`https://cdn.docxaudioblog.top/<路径>/<文件名>.png`

### 接入踩坑（重要）
- 401：AK/SK 错 / Bucket 名错 / 区域错 → 在七牛「密钥管理」新建一对密钥重填
- 631：`incorrect region` → 华南桶必须填区域 `z2` 或 upHost=`https://up-z2.qiniu.com`
- 链接必须带 `https://` 协议头，否则 Markdown 当相对路径导致图裂
- CDN 域名务必开 **HTTPS**（免费证书），否则 GitHub Pages(HTTPS) 博客会按混合内容策略拦截 http 图片
- 根域名已 CNAME 到 GitHub Pages，七牛只能用 `cdn.` 子域名，避免 CNAME 冲突

## 旧文章图片
- 旧文章仍用 `https://cdn.jsdelivr.net/gh/DooocX/DocX_Images/...`，可不动；想统一时写批量替换脚本
