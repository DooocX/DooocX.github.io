# Runbook — 发布一篇新博客文章

## 步骤

1. **生成文章骨架**
   ```bash
   hexo new post "文章标题"
   ```
   会在 `source/_posts/` 下生成一个 `.md` 文件，front-matter 模板见 `scaffolds/post.md`。

2. **填写 front-matter**
   - `title`：文章标题
   - `date`：发布日期（默认自动填入）
   - `categories`：分类（单选，推荐取自 `Wwise / 音效设计 / 工具 / Markdown` 等）
   - `tags`：标签（多个）
   - `cover`（可选）：文章封面图 URL，缺省时首页卡片使用第三方随机图（见 `docs/roadmap.md`）

3. **撰写正文**
   - 图片上传：见 `docs/runbooks/image-hosting.md`（PicGo → 七牛云 CDN）
   - 引用格式：`![描述](https://cdn.docxaudioblog.top/<path>/<file>.png)`
   - 代码块指定语言即可自动高亮（highlight.js Atom One Dark）

4. **本地预览**
   ```bash
   hexo clean
   hexo server
   ```
   打开 http://localhost:4000 检查排版、封面、图片是否正常。

5. **部署**
   见 `docs/runbooks/deploy.md`。

6. **提交**
   ```bash
   git add source/_posts/<文章>.md
   git commit -m "content: 添加《文章标题》"
   git push origin hexo
   ```

## 注意事项

- 文章文件名可以是中文（现有文章即为中文命名），Hexo 会自动生成 URL slug
- 图片链接必须带 `https://` 协议头，否则会被 Markdown 当相对路径导致图裂
- 中文全角开括号（`【『「《〈（［｛`）开头的标题会自动加 `text-indent: -0.5em` 视觉修正（见 v1.1.2）
