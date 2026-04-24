'use strict';

/**
 * SHOWREEL Generator
 * ------------------------------------------------------------
 * 读取 source/_showreel/*.md，生成：
 *   - /showreel/                  列表页（layout: showreel）
 *   - /showreel/<slug>/           每个作品的详情页（layout: showreel_post）
 *
 * 同时拦截 `hexo new showreel "xxx"` 命令，将文件生成到
 * source/_showreel/ 目录（而非默认的 source/_posts/）。
 *
 * 设计要点：
 *   - 下划线目录前缀 `_showreel` 让 Hexo 默认忽略这些 md 文件，
 *     由本脚本独立 generator 手动扫描渲染，避免污染 site.posts。
 *   - 视频源通过 front-matter 的 video.type 字段抽象，
 *     模板层按类型分支渲染（bilibili / mp4）。
 *   - 空目录或无作品时跳过页面生成，不阻塞整站构建。
 *   - 按日期倒序排列，同时为每个作品计算 prev / next，
 *     供详情页底部"上一部 / 下一部作品"导航使用。
 */

const fs = require('fs');
const path = require('path');
const yfm = require('hexo-front-matter');

const SHOWREEL_DIR = '_showreel';     // 相对 hexo.source_dir
const ROUTE_BASE = 'showreel';        // URL 前缀与输出目录名
const PAGE_TITLE = 'SHOWREEL';

// ─────────────────────────────────────────────────────────────
// 工具函数
// ─────────────────────────────────────────────────────────────

/**
 * 按 key 列表从对象中挑选子集（用于 prev/next 导航数据精简）。
 */
function pick(obj, keys) {
  const out = {};
  for (const k of keys) out[k] = obj[k];
  return out;
}

/**
 * 视频配置兜底：缺省 type 时按 bilibili 处理，page 默认 1。
 */
function normalizeVideo(video) {
  const v = video && typeof video === 'object' ? { ...video } : {};
  if (!v.type) v.type = 'bilibili';
  if (v.type === 'bilibili' && v.page == null) v.page = 1;
  return v;
}

/**
 * 解析单个 md 文件 → 作品对象（含渲染后的 HTML 正文）。
 */
async function parseShowreelFile(hexo, filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  // 兼容性归一化：
  //   1) 去除 UTF-8 BOM（部分 Windows 编辑器保存 md 时会带，会让首行 `---` 失配）
  //   2) CRLF → LF（hexo-front-matter 的解析正则强依赖 \n，CRLF 会导致 front-matter 被
  //      当成正文，从而 title/video 等字段全部丢失）
  const normalized = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const parsed = yfm.parse(normalized);
  // parsed 形如 { _content, title, date, cover, video, ... }
  const { _content = '', ...meta } = parsed;

  // 渲染 Markdown 正文为 HTML（复用 Hexo 的渲染管线）
  let content = '';
  try {
    content = await hexo.render.render({ text: _content, engine: 'markdown' });
  } catch (err) {
    hexo.log.warn(`[showreel] Markdown 渲染失败：${filePath} - ${err.message}`);
    content = _content; // 失败时降级输出原文
  }

  const slug = path.basename(filePath, '.md');
  const defaultCover =
    (hexo.theme && hexo.theme.config && hexo.theme.config.default_cover) ||
    hexo.config.default_cover ||
    '';

  return {
    slug,
    title: meta.title != null ? String(meta.title) : slug,
    date: meta.date ? new Date(meta.date) : new Date(0),
    cover: meta.cover || defaultCover,
    duration: meta.duration || '',
    description: meta.description || '',
    tools: Array.isArray(meta.tools) ? meta.tools : [],
    video: normalizeVideo(meta.video),
    path: `${ROUTE_BASE}/${slug}/`,
    content
  };
}

/**
 * 扫描 source/_showreel/ 目录，返回按日期倒序、附带 prev/next 的作品数组。
 * 目录不存在或无有效文件时返回空数组。
 */
async function loadShowreelItems(hexo) {
  const dir = path.join(hexo.source_dir, SHOWREEL_DIR);

  if (!fs.existsSync(dir)) {
    hexo.log.info('[showreel] source/_showreel/ 目录不存在，跳过 SHOWREEL 生成');
    return [];
  }

  const files = fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.md') && !f.startsWith('.') && !f.startsWith('_'));

  if (files.length === 0) {
    hexo.log.info('[showreel] source/_showreel/ 目录为空，跳过 SHOWREEL 生成');
    return [];
  }

  const items = [];
  for (const file of files) {
    try {
      const item = await parseShowreelFile(hexo, path.join(dir, file));
      items.push(item);
    } catch (err) {
      hexo.log.warn(`[showreel] 解析失败，已跳过：${file} - ${err.message}`);
    }
  }

  // 按日期倒序（最新的排最前）
  items.sort((a, b) => b.date - a.date);

  // 计算邻接关系
  // prev = 更新的一部（数组中位置更前）
  // next = 更早的一部（数组中位置更后）
  const navKeys = ['title', 'path', 'cover'];
  items.forEach((item, i) => {
    item.prev = i > 0 ? pick(items[i - 1], navKeys) : null;
    item.next = i < items.length - 1 ? pick(items[i + 1], navKeys) : null;
  });

  hexo.log.info(`[showreel] 已加载 ${items.length} 部作品`);
  return items;
}

// ─────────────────────────────────────────────────────────────
// Generator：列表页
// ─────────────────────────────────────────────────────────────

hexo.extend.generator.register('showreel_list', async function (locals) {
  const items = await loadShowreelItems(hexo);
  if (items.length === 0) return []; // 空目录策略 B：跳过生成

  return {
    path: `${ROUTE_BASE}/index.html`,
    layout: ['showreel'], // 对应 themes/Quiet/layout/showreel.ejs
    data: {
      __showreel_list: true,
      title: PAGE_TITLE,
      page_type: 'showreel',
      items
    }
  };
});

// ─────────────────────────────────────────────────────────────
// Generator：详情页
// ─────────────────────────────────────────────────────────────

hexo.extend.generator.register('showreel_post', async function (locals) {
  const items = await loadShowreelItems(hexo);
  if (items.length === 0) return [];

  return items.map(item => ({
    path: `${item.path}index.html`,
    layout: ['showreel_post'], // 对应 themes/Quiet/layout/showreel_post.ejs
    data: {
      __showreel_post: true,
      page_type: 'showreel_post',
      ...item
    }
  }));
});

// ─────────────────────────────────────────────────────────────
// Filter：拦截 hexo new showreel "xxx" 的输出路径
// ─────────────────────────────────────────────────────────────

hexo.extend.filter.register('new_post_path', function (data, replace) {
  // data: { path, content, layout, slug, ... }
  // 只处理 layout === 'showreel' 的情况，其他布局保持 Hexo 默认行为
  if (data && data.layout === 'showreel' && data.slug) {
    const target = path.join(
      hexo.source_dir,
      SHOWREEL_DIR,
      `${data.slug}.md`
    );
    return target;
  }
  // 返回 undefined，Hexo 会沿用原路径
});
