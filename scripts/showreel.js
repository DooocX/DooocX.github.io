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
 *   - B 站作品 front-matter 未显式填写 cover 时，构建期调用 B 站
 *     API 自动拉取视频封面（带本地缓存 .showreel-cache.json，
 *     后续构建直接命中缓存，避免重复请求和频控风险）。
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const yfm = require('hexo-front-matter');

const SHOWREEL_DIR = '_showreel';     // 相对 hexo.source_dir
const ROUTE_BASE = 'showreel';        // URL 前缀与输出目录名
const PAGE_TITLE = 'SHOWREEL';
const CACHE_FILE = '.showreel-cache.json';  // 位于 hexo base_dir（项目根）
const BILI_API_TIMEOUT_MS = 8000;

// ─────────────────────────────────────────────────────────────
// 模块级缓存（构建期单例，避免多 generator 重复 I/O）
// ─────────────────────────────────────────────────────────────

let _coverCache = null;       // { "BV1xxx": "https://i1.hdslb.com/..." }
let _cacheDirty = false;      // 是否有新条目需要写回文件
let _cacheFilePath = null;    // 缓存文件绝对路径（首次 load 时确定）

function loadCoverCache(hexo) {
  if (_coverCache !== null) return _coverCache;
  _cacheFilePath = path.join(hexo.base_dir, CACHE_FILE);
  try {
    if (fs.existsSync(_cacheFilePath)) {
      const raw = fs.readFileSync(_cacheFilePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        _coverCache = parsed;
        return _coverCache;
      }
    }
  } catch (e) {
    hexo.log.warn(`[showreel] 封面缓存文件解析失败，将以空缓存开始：${e.message}`);
  }
  _coverCache = {};
  return _coverCache;
}

function persistCoverCache(hexo) {
  if (!_cacheDirty || !_cacheFilePath) return;
  try {
    fs.writeFileSync(
      _cacheFilePath,
      JSON.stringify(_coverCache, null, 2) + '\n',
      'utf8'
    );
    _cacheDirty = false;
    hexo.log.info(`[showreel] 封面缓存已更新：${CACHE_FILE}`);
  } catch (e) {
    hexo.log.warn(`[showreel] 封面缓存写入失败：${e.message}`);
  }
}

// ─────────────────────────────────────────────────────────────
// B 站封面抓取
// ─────────────────────────────────────────────────────────────

/**
 * 调用 B 站 web-interface/view API 拉取视频封面 URL。
 * - 强制 HTTPS（B 站返回 http://i1.hdslb.com/... 会触发混合内容警告）
 * - 任何失败都 resolve(null)，绝不抛错，保证构建不中断
 */
function fetchBilibiliCover(bvid) {
  return new Promise((resolve) => {
    const url = `https://api.bilibili.com/x/web-interface/view?bvid=${encodeURIComponent(bvid)}`;
    const req = https.get(
      url,
      {
        timeout: BILI_API_TIMEOUT_MS,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; DocX-Showreel-Builder/1.0)',
          'Accept': 'application/json'
        }
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            if (json && json.code === 0 && json.data && json.data.pic) {
              resolve(String(json.data.pic).replace(/^http:\/\//i, 'https://'));
            } else {
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        });
      }
    );
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

/**
 * 读缓存；未命中则调 API；成功则写回缓存（标脏，延迟持久化）。
 * 永远返回字符串或 null（null 表示拿不到，上游用 theme.default_cover 兜底）。
 */
async function getBilibiliCoverCached(bvid, hexo) {
  const cache = loadCoverCache(hexo);
  if (cache[bvid]) {
    hexo.log.info(`[showreel] 使用缓存封面：${bvid}`);
    return cache[bvid];
  }
  const url = await fetchBilibiliCover(bvid);
  if (url) {
    cache[bvid] = url;
    _cacheDirty = true;
    hexo.log.info(`[showreel] 拉取 B 站封面：${bvid} → ${url}`);
    return url;
  }
  hexo.log.warn(`[showreel] B 站封面获取失败：${bvid}，回退默认封面`);
  return null;
}

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
 * 封面兜底优先级：
 *   1) front-matter 显式写的 cover
 *   2) video.type === 'bilibili' 且有 bvid → B 站封面 API（带缓存）
 *   3) theme.default_cover
 *   4) 空字符串
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
  const video = normalizeVideo(meta.video);
  const defaultCover =
    (hexo.theme && hexo.theme.config && hexo.theme.config.default_cover) ||
    hexo.config.default_cover ||
    '';

  // 封面兜底链路
  let cover = meta.cover;
  if (!cover && video.type === 'bilibili' && video.bvid) {
    const biliCover = await getBilibiliCoverCached(video.bvid, hexo);
    if (biliCover) cover = biliCover;
  }
  if (!cover) cover = defaultCover;

  return {
    slug,
    title: meta.title != null ? String(meta.title) : slug,
    date: meta.date ? new Date(meta.date) : new Date(0),
    cover,
    duration: meta.duration || '',
    description: meta.description || '',
    tools: Array.isArray(meta.tools) ? meta.tools : [],
    video,
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

  // 若有新抓取的封面，持久化缓存供下次构建使用
  persistCoverCache(hexo);

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
