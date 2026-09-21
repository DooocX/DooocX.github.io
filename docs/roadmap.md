# 待办与规划 (Roadmap)

> 记录未来计划推进的改进项。落地后应从本文档移除，并在 `CHANGELOG.md` 顶部追加对应版本条目。

---

## 优先级 P1（架构性改进）

### 1. Header 响应式重构

- **现状**：header 高度当前固定 `100px`（桌面/平板/移动同值），各页面对 fixed header 的避让 padding 存在零散硬编码（如 `showreel_post.less` 中的 `calc(50px + ...)` / `calc(70px + ...)`）
- **计划**：
  - 在 `_variables.less` 抽出 `@header-height-desktop / @header-height-tablet / @header-height-mobile` 变量
  - 三档响应式：桌面 100px / 平板 80px / 移动 56-64px
  - 统一收敛所有避让 padding 到变量
- **影响文件**：`_variables.less`、`themes/Quiet/source/css/widget/header.less`、以及所有含"避让 fixed header"的页面 less

### 2. 首页/分类页默认封面优化

- **现状**：文章详情页已支持 `page.cover` 优先（front-matter 有 cover 则用文章自己的）；但**首页卡片**（`home.ejs`）和**分类页 banner**（`categories.ejs`）在 `post.cover` 缺失时仍回退到第三方随机图片 API（`api.ixiaowai.cn`）
- **计划**：替换为本地图片池（`themes/Quiet/source/image/covers/`）或可控 CDN
- **风险**：第三方 API 不可控，可能间歇性挂掉或返回不合适的图片

---

## 优先级 P2（功能扩展）

### 3. 全站搜索功能

- 基于 `hexo-generator-searchdb` 插件 + 前端搜索框
- 需要在 header 或侧边栏加入搜索入口
- 需要新增独立的搜索结果页面（或前端弹层）

### 4. SHOWREEL 视频源扩展

- 当前仅支持 `bilibili` 与 `mp4` 两种源
- 计划支持 `youtube` / 自建 CDN（如腾讯云 COS）
- 扩展点：`_partial/showreel_player.ejs` 新增分支即可

---

## 优先级 P3（运维与工程化）

### 5. 旧文章图片链接迁移

- 旧文章仍使用 `https://cdn.jsdelivr.net/gh/DooocX/DocX_Images/...` 链接
- 计划：写批量替换脚本把旧链接迁移到七牛云 `cdn.docxaudioblog.top`
- 优先级低：jsDelivr 目前仍可访问，不迁移不影响功能

### 6. PicGo 图片上传优化

- 计划写 PicGo 插件实现"上传前自动 `path=YYYY/MM/` + 时间戳命名"
- 或改用自定义 rename 插件（`picgo-plugin-rename-file`）

### 7. 部署自动化

- 当前部署依赖本地 `hexo clean && hexo deploy`
- 可考虑 GitHub Actions：推送 `hexo` 分支后自动构建并部署到 `main`
- 收益：跨设备发文、避免本地 Node 版本差异
