# Runbook — 发布一个新的 SHOWREEL 作品

## 步骤

1. **生成作品骨架**
   ```bash
   hexo new showreel "作品标题"
   ```
   会在 `source/_showreel/` 下生成 `.md` 文件，模板见 `scaffolds/showreel.md`。

2. **填写 front-matter**
   ```yaml
   ---
   title: 作品标题
   date: 2026-XX-XX
   cover: https://cdn.docxaudioblog.top/showreel/xxx-cover.png    # 16:9 封面
   duration: "2:35"                                                # 时长角标
   tools:                                                          # 工具标签
     - Wwise
     - Unity
   description: 一句话描述
   video:
     type: bilibili        # bilibili | mp4
     bvid: BVxxxxxxxx      # type=bilibili 时必填
     # src: /video/xxx.mp4  # type=mp4 时必填
   ---
   ```

3. **撰写创作说明**
   Markdown 正文部分描述创作思路、技术方案、工具使用等。

4. **本地预览**
   ```bash
   hexo clean
   hexo server
   ```
   - 列表页：http://localhost:4000/showreel/
   - 详情页：http://localhost:4000/showreel/<slug>/

5. **部署 + 提交**
   见 `docs/runbooks/deploy.md`。

## 视频源说明

| type | 必填字段 | 说明 |
|---|---|---|
| `bilibili` | `video.bvid` | B 站 iframe 嵌入，封面右下角自动带 Bilibili 角标 |
| `mp4` | `video.src` | 本地或 CDN 的 mp4 直链，`<video>` 播放 |

未来扩展 `youtube` / `cos` 等仅需在 `themes/Quiet/layout/_partial/showreel_player.ejs` 新增分支（见 `specs/showreel-feature-v1.1.0/spec.md`）。

## 背后逻辑（一般不动）

- 内容目录 `source/_showreel/` 是下划线前缀，Hexo 默认不渲染
- 自定义 generator `scripts/showreel.js` 扫描该目录、解析 front-matter、渲染 Markdown、生成列表页与详情页、计算邻接导航（上一部/下一部）
- 若要修改扫描逻辑或路由结构，必须先更新 `specs/showreel-feature-v1.1.0/spec.md`

## 注意事项

- Windows 下新建 md 后，generator 会自动归一化 CRLF/BOM，无需手动处理（见 `docs/troubleshooting.md#hexo-generator`）
- 详情页顶部已内置对 fixed header 的避让 padding，无需在作品内容中额外处理
