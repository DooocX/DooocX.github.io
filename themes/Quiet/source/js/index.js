/**
 * Quiet 主题主脚本
 * - 暗色模式切换
 * - 导航栏滚动吸顶
 * - 移动端侧边栏开关
 * - 回到顶部按钮
 * - Fancybox 图片灯箱绑定
 * - TOC 滚动高亮 & 平滑跳转
 * - 代码块一键复制
 */

(function () {
  'use strict';

  // === 暗色模式 ===
  function initDarkMode() {
    var html = document.documentElement;

    function getTheme() {
      var saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function updateIcons(theme) {
      var toggles = document.querySelectorAll('#theme-toggle, #sidebar-theme-toggle');
      toggles.forEach(function (el) {
        var sun = el.querySelector('.icon-sun');
        var moon = el.querySelector('.icon-moon');
        if (sun && moon) {
          sun.style.display = theme === 'dark' ? 'none' : 'inline';
          moon.style.display = theme === 'dark' ? 'inline' : 'none';
        }
      });
    }

    function syncGiscus(theme) {
      var giscusTheme = theme === 'dark' ? 'dark' : 'light';
      var iframe = document.querySelector('iframe.giscus-frame');
      if (iframe) {
        iframe.contentWindow.postMessage(
          { giscus: { setConfig: { theme: giscusTheme } } },
          'https://giscus.app'
        );
      }
    }

    function setTheme(theme) {
      html.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      updateIcons(theme);
      syncGiscus(theme);
    }

    function toggleTheme() {
      var current = html.getAttribute('data-theme') || 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    }

    // 初始化图标状态
    updateIcons(getTheme());

    // 绑定切换按钮
    var toggleBtns = document.querySelectorAll('#theme-toggle, #sidebar-theme-toggle');
    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
      });
    });

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });

    // Giscus iframe 加载完成后同步主题
    // 放宽判定：任何来自 giscus 的 postMessage 都触发一次主题同步，
    // 确保 iframe 首次加载（首条 resize 事件）时就把当前 data-theme 推过去，
    // 解决"首次以暗色模式打开页面，评论区仍为白色"的问题。
    window.addEventListener('message', function (event) {
      if (event.origin !== 'https://giscus.app') return;
      if (event.data && event.data.giscus) {
        syncGiscus(html.getAttribute('data-theme') || 'light');
      }
    });
  }

  // === rAF 节流的滚动事件 ===
  var ticking = false;

  function onScroll() {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var headerTopDom = document.getElementById('header-top');
    var goTopDom = document.getElementById('js-go_top');

    // 导航栏滚动吸顶
    if (headerTopDom) {
      if (scrollTop > 100) {
        headerTopDom.classList.remove('header-move2');
        headerTopDom.classList.add('header-move1');
      } else {
        headerTopDom.classList.remove('header-move1');
        headerTopDom.classList.add('header-move2');
      }
    }

    // 回到顶部按钮显隐
    if (goTopDom) {
      if (scrollTop > 500) {
        goTopDom.classList.add('visible');
      } else {
        goTopDom.classList.remove('visible');
      }
    }


  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // === 移动端侧边栏 ===
  function initSidebar() {
    var toggleBtn = document.querySelector('.h-right-close > svg');
    var sidebar = document.getElementById('sidebar');
    var shelter = document.getElementById('shelter');

    if (!toggleBtn || !sidebar || !shelter) return;

    toggleBtn.addEventListener('click', function () {
      sidebar.classList.add('active');
      shelter.classList.add('active');
    });

    shelter.addEventListener('click', function () {
      sidebar.classList.remove('active');
      shelter.classList.remove('active');
    });
  }

  // === 回到顶部 ===
  function initGoTop() {
    var goTopDom = document.getElementById('js-go_top');
    if (!goTopDom) return;

    goTopDom.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // === Fancybox 图片灯箱绑定 ===
  function initFancybox() {
    if (typeof Fancybox === 'undefined') return;

    var article = document.getElementById('article');
    if (!article) return;

    var images = article.querySelectorAll('img');
    images.forEach(function (img) {
      if (img.parentElement.classList.contains('fancybox')) return;
      if (img.classList.contains('nofancybox')) return;

      var link = document.createElement('a');
      var src = img.getAttribute('data-src') || img.src;
      link.href = src;
      link.title = img.alt || '';
      link.setAttribute('data-src', img.src);
      link.classList.add('fancybox');
      link.setAttribute('data-fancybox', 'fancybox-gallery-img');

      img.parentNode.insertBefore(link, img);
      link.appendChild(img);
    });

    Fancybox.bind('[data-fancybox="fancybox-gallery-img"]', {
      dragToClose: true,
      Toolbar: true,
      closeButton: 'top',
      Image: {
        zoom: true,
      },
      on: {
        initCarousel: function (fancybox) {
          var slide = fancybox.Carousel.slides[fancybox.Carousel.page];
          fancybox.$container.style.setProperty(
            '--bg-image',
            'url("' + slide.$thumb.src + '")'
          );
        },
        'Carousel.change': function (fancybox, carousel, to) {
          var slide = carousel.slides[to];
          fancybox.$container.style.setProperty(
            '--bg-image',
            'url("' + slide.$thumb.src + '")'
          );
        },
      },
    });
  }

  // === TOC 滚动高亮 & 平滑跳转 ===
  function initToc() {
    var tocSidebar = document.getElementById('toc-sidebar');
    if (!tocSidebar) return;

    // --- 折叠/展开 ---
    var toggleBtn = document.getElementById('toc-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        tocSidebar.classList.toggle('collapsed');
        localStorage.setItem('tocCollapsed', tocSidebar.classList.contains('collapsed') ? '1' : '0');
      });

      // 折叠态下点击整个侧边栏也能展开
      tocSidebar.addEventListener('click', function (e) {
        if (tocSidebar.classList.contains('collapsed') && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
          tocSidebar.classList.remove('collapsed');
          localStorage.setItem('tocCollapsed', '0');
        }
      });
    }

    var tocLinks = tocSidebar.querySelectorAll('.toc-link');
    if (!tocLinks.length) return;

    // 平滑跳转
    tocLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = decodeURIComponent(this.getAttribute('href').slice(1));
        var target = document.getElementById(targetId);
        if (target) {
          var offset = target.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      });
    });

    // IntersectionObserver 滚动高亮
    var article = document.getElementById('article');
    if (!article) return;

    var headings = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (!headings.length) return;

    // 构建 id -> tocLink 映射
    var tocMap = {};
    tocLinks.forEach(function (link) {
      var href = decodeURIComponent(link.getAttribute('href').slice(1));
      tocMap[href] = link;
    });

    var currentActive = null;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          if (tocMap[id]) {
            if (currentActive) currentActive.classList.remove('active');
            tocMap[id].classList.add('active');
            currentActive = tocMap[id];

            // 自动滚动 TOC 侧边栏让高亮项可见
            var inner = tocSidebar.querySelector('.toc-sidebar-inner');
            if (inner) {
              var linkTop = tocMap[id].offsetTop - inner.offsetTop;
              var innerHeight = inner.clientHeight;
              if (linkTop < inner.scrollTop || linkTop > inner.scrollTop + innerHeight - 40) {
                inner.scrollTop = linkTop - innerHeight / 3;
              }
            }
          }
        }
      });
    }, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0
    });

    headings.forEach(function (heading) {
      if (heading.id && tocMap[heading.id]) {
        observer.observe(heading);
      }
    });
  }

  // === 通用 Toast 提示 ===
  var toastTimer = null;
  function showToast(message) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    if (toastTimer) clearTimeout(toastTimer);

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // 触发过渡
    requestAnimationFrame(function () {
      toast.classList.add('show');
    });

    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 2000);
  }

  // === 邮箱点击：唤起 mailto + 同时复制到剪贴板 ===
  function initMailto() {
    var links = document.querySelectorAll('a.contact-mailto');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        // 不阻止默认行为，mailto: 会正常唤起邮件客户端
        var email = link.getAttribute('data-email');
        if (!email) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(function () {
            showToast('邮箱已复制：' + email);
          }).catch(function () {
            fallbackCopyText(email, '邮箱已复制：' + email);
          });
        } else {
          fallbackCopyText(email, '邮箱已复制：' + email);
        }
      });
    });
  }

  function fallbackCopyText(text, toastMsg) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast(toastMsg);
    } catch (e) {
      // 静默处理
    }
    document.body.removeChild(textarea);
  }

  // === 代码块一键复制 ===
  function initCodeCopy() {
    var article = document.getElementById('article');
    if (!article) return;

    var pres = article.querySelectorAll('pre');
    pres.forEach(function (pre) {
      var code = pre.querySelector('code');
      if (!code) return;

      code.style.position = 'relative';

      var btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.textContent = '复制';
      btn.setAttribute('type', 'button');

      btn.addEventListener('click', function () {
        var codeText = code.cloneNode(true);
        var btnClone = codeText.querySelector('.code-copy-btn');
        if (btnClone) btnClone.remove();
        var text = codeText.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            showCopied(btn);
          }).catch(function () {
            fallbackCopy(text, btn);
          });
        } else {
          fallbackCopy(text, btn);
        }
      });

      code.appendChild(btn);
    });
  }

  function fallbackCopy(text, btn) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showCopied(btn);
    } catch (e) {
      // 复制失败静默处理
    }
    document.body.removeChild(textarea);
  }

  function showCopied(btn) {
    btn.textContent = '已复制';
    btn.classList.add('copied');
    setTimeout(function () {
      btn.textContent = '复制';
      btn.classList.remove('copied');
    }, 2000);
  }

  // === Categories Tab 切换 ===
  // 分类 / 标签 两个 Tab；支持 URL hash 直达（#categories / #tags）
  function initCategoriesTabs() {
    var navBtns = document.querySelectorAll('.cat-tab-nav-btn');
    var panels = document.querySelectorAll('.cat-tab-panel');
    if (navBtns.length === 0 || panels.length === 0) return;

    function activate(tabName, updateHash) {
      navBtns.forEach(function (btn) {
        var isActive = btn.dataset.tab === tabName;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      panels.forEach(function (p) {
        p.classList.toggle('active', p.dataset.panel === tabName);
      });
      if (updateHash && history && history.replaceState) {
        history.replaceState(null, '', '#' + tabName);
      }
    }

    // 初始化：URL hash 决定首屏 Tab，缺省为 categories
    var initialTab = (location.hash === '#tags') ? 'tags' : 'categories';
    activate(initialTab, false);

    // 绑定点击
    navBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activate(btn.dataset.tab, true);
      });
    });
  }

  // === Showreel 排序切换 ===
  function initShowreel() {
    var list = document.querySelector('.showreel-list');
    var sortBtns = document.querySelectorAll('.showreel-sort-btn');
    if (!list || sortBtns.length === 0) return;

    var cards = Array.prototype.slice.call(list.querySelectorAll('.showreel-card'));
    if (cards.length === 0) return;

    var STORAGE_KEY = 'showreelSortType';

    var input = document.getElementById('showreel-search-input');
    var clearBtn = document.querySelector('.showreel-search-clear');
    var meta = document.getElementById('showreel-search-meta');
    var empty = document.getElementById('showreel-search-empty');
    var toggleBtn = document.querySelector('.showreel-search-toggle');
    var panel = document.getElementById('showreel-search-panel');

    function getCardDate(card) {
      var ts = Number(card.getAttribute('data-date'));
      return Number.isFinite(ts) ? ts : 0;
    }

    // ─── 搜索：标题关键词即时筛选 ───
    function updateMeta(keyword, visibleCount) {
      if (!meta) return;
      meta.textContent = keyword ? '找到 ' + visibleCount + ' 个作品' : '';
    }

    function setClearBtnVisible(visible) {
      if (clearBtn) clearBtn.style.visibility = visible ? 'visible' : 'hidden';
    }

    function applyFilter() {
      if (!input) return;
      var keyword = (input.value || '').trim().toLowerCase();
      var visibleCount = 0;

      cards.forEach(function (card) {
        var titleNode = card.querySelector('.showreel-card-title');
        var titleText = titleNode ? (titleNode.textContent || '').toLowerCase() : '';
        var matched = !keyword || titleText.indexOf(keyword) > -1;
        card.style.display = matched ? '' : 'none';
        if (matched) visibleCount += 1;
      });

      if (empty) empty.hidden = visibleCount !== 0;
      setClearBtnVisible(!!keyword);
      updateMeta(keyword, visibleCount);
    }

    var timer = null;
    function debouncedApplyFilter() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(applyFilter, 180);
    }

    function setPanelOpen(open) {
      if (!panel || !toggleBtn) return;
      panel.hidden = !open;
      toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    if (toggleBtn && panel) {
      toggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (panel.hidden) {
          setPanelOpen(true);
          if (input) input.focus();
        } else {
          setPanelOpen(false);
        }
      });
      panel.addEventListener('click', function (e) {
        e.stopPropagation();
      });
      document.addEventListener('click', function () {
        if (!panel.hidden) setPanelOpen(false);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !panel.hidden) setPanelOpen(false);
      });
    }

    if (input) {
      input.addEventListener('input', debouncedApplyFilter);
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (!input || !input.value) return;
        input.value = '';
        applyFilter();
        input.focus();
      });
    }

    // ─── 排序：按卡片 data-date 重排 ───
    function applySort(sortType, save) {
      var sorted = cards.slice().sort(function (a, b) {
        var dateA = getCardDate(a);
        var dateB = getCardDate(b);
        if (sortType === 'date_asc') {
          return dateA - dateB;
        }
        return dateB - dateA;
      });

      var frag = document.createDocumentFragment();
      sorted.forEach(function (card) {
        frag.appendChild(card);
      });
      list.appendChild(frag);

      // 排序后保持当前搜索筛选
      applyFilter();

      sortBtns.forEach(function (btn) {
        var active = btn.dataset.sort === sortType;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      if (save) {
        localStorage.setItem(STORAGE_KEY, sortType);
      }
    }

    var savedSort = localStorage.getItem(STORAGE_KEY);
    var initialSort = savedSort === 'date_asc' ? 'date_asc' : 'date_desc';
    applySort(initialSort, false);

    sortBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sortType = btn.dataset.sort;
        if (!sortType) return;
        applySort(sortType, true);
      });
    });
  }

  // === Archive 搜索 + 排序（图标浮层筛选 + 时间线排序） ===
  function initArchive() {
    var input = document.getElementById('archive-search-input');
    var clearBtn = document.querySelector('.archive-search-clear');
    var meta = document.getElementById('archive-search-meta');
    var empty = document.getElementById('archive-search-empty');
    var toggleBtn = document.querySelector('.archive-search-toggle');
    var panel = document.getElementById('archive-search-panel');
    var grouping = document.querySelector('.archive .grouping');
    var sortBtns = document.querySelectorAll('.archive-sort-btn');

    if (!grouping) return;

    var STORAGE_KEY = 'archiveSortType';

    // 当前列表引用（排序后会重建，需要刷新）
    var yearBlocks = [];
    var allItems = [];

    function getYearBlocks() {
      var years = Array.prototype.slice.call(grouping.querySelectorAll('.grouping-year'));
      return years.map(function (yearEl) {
        var items = [];
        var node = yearEl.nextElementSibling;
        while (node && !node.classList.contains('grouping-year')) {
          if (node.classList.contains('grouping-item')) {
            items.push(node);
          }
          node = node.nextElementSibling;
        }
        return { yearEl: yearEl, items: items };
      });
    }

    function refreshRefs() {
      yearBlocks = getYearBlocks();
      allItems = [];
      yearBlocks.forEach(function (block) {
        allItems = allItems.concat(block.items);
      });
    }

    // ─── 排序：按所有文章 data-date 重排，并重建年份分组 ───
    function applySort(sortType, save) {
      var sortedItems = allItems.slice().sort(function (a, b) {
        var dateA = Number(a.getAttribute('data-date')) || 0;
        var dateB = Number(b.getAttribute('data-date')) || 0;
        return sortType === 'date_asc' ? dateA - dateB : dateB - dateA;
      });

      // 按年份聚合（年份顺序随排序方向变化）
      var groups = {};
      sortedItems.forEach(function (item) {
        var year = item.getAttribute('data-year');
        if (!groups[year]) groups[year] = [];
        groups[year].push(item);
      });

      var yearKeys = Object.keys(groups);
      yearKeys.sort(function (a, b) {
        return sortType === 'date_asc' ? Number(a) - Number(b) : Number(b) - Number(a);
      });

      // 重建 .grouping 内部 DOM
      grouping.innerHTML = '';
      yearKeys.forEach(function (year) {
        var p = document.createElement('p');
        p.className = 'grouping-year';
        p.setAttribute('data-year', year);
        p.textContent = year;
        grouping.appendChild(p);
        groups[year].forEach(function (item) {
          grouping.appendChild(item);
        });
      });

      refreshRefs();
      applyFilter();

      sortBtns.forEach(function (btn) {
        var active = btn.dataset.sort === sortType;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      if (save) {
        localStorage.setItem(STORAGE_KEY, sortType);
      }
    }

    // ─── 筛选：标题关键词 ───
    var timer = null;

    function updateMeta(keyword, visibleCount) {
      if (!meta) return;
      meta.textContent = keyword ? '找到 ' + visibleCount + ' 篇文章' : '';
    }

    function setClearBtnVisible(visible) {
      if (clearBtn) clearBtn.style.visibility = visible ? 'visible' : 'hidden';
    }

    function applyFilter() {
      if (!input) return;
      var keyword = (input.value || '').trim().toLowerCase();
      var visibleCount = 0;

      allItems.forEach(function (item) {
        var titleNode = item.querySelector('span');
        var titleText = titleNode ? (titleNode.textContent || '').toLowerCase() : '';
        var matched = !keyword || titleText.indexOf(keyword) > -1;
        item.style.display = matched ? '' : 'none';
        if (matched) visibleCount += 1;
      });

      yearBlocks.forEach(function (block) {
        var hasVisible = block.items.some(function (item) {
          return item.style.display !== 'none';
        });
        block.yearEl.style.display = hasVisible ? '' : 'none';
      });

      if (empty) {
        empty.hidden = !(keyword && visibleCount === 0);
      }

      setClearBtnVisible(!!keyword);
      updateMeta(keyword, visibleCount);
    }

    function debouncedApplyFilter() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(applyFilter, 180);
    }

    // ─── 搜索浮层展开/收起 ───
    function setPanelOpen(open) {
      if (!panel || !toggleBtn) return;
      panel.hidden = !open;
      toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && input) input.focus();
    }

    if (toggleBtn && panel) {
      toggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        setPanelOpen(panel.hidden);
      });
      panel.addEventListener('click', function (e) {
        e.stopPropagation();
      });
      document.addEventListener('click', function () {
        if (!panel.hidden) setPanelOpen(false);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !panel.hidden) setPanelOpen(false);
      });
    }

    if (input) {
      input.addEventListener('input', debouncedApplyFilter);
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (!input || !input.value) return;
        input.value = '';
        applyFilter();
        input.focus();
      });
    }

    // ─── 排序按钮 ───
    if (sortBtns.length) {
      var savedSort = localStorage.getItem(STORAGE_KEY);
      var initialSort = savedSort === 'date_asc' ? 'date_asc' : 'date_desc';

      sortBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var sortType = btn.dataset.sort;
          if (sortType) applySort(sortType, true);
        });
      });

      // 先填充引用，再执行排序（避免 applySort 用空 allItems 清空 DOM）
      refreshRefs();
      // 初始化排序（重建 DOM 后应用默认筛选）
      applySort(initialSort, false);
    } else {
      refreshRefs();
      applyFilter();
    }
  }

  // === 初始化 ===
  document.addEventListener('DOMContentLoaded', function () {
    initDarkMode();
    initSidebar();
    initGoTop();
    initFancybox();
    initToc();
    initCodeCopy();
    initMailto();
    initCategoriesTabs();
    initShowreel();
    initArchive();
  });
})();
