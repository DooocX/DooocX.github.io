/**
 * Quiet 主题主脚本
 * - 暗色模式切换
 * - 导航栏滚动吸顶
 * - 移动端侧边栏开关
 * - 回到顶部按钮
 * - Fancybox 图片灯箱绑定
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
    window.addEventListener('message', function (event) {
      if (event.origin !== 'https://giscus.app') return;
      if (event.data && event.data.giscus && event.data.giscus.discussion) {
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

  // === 初始化 ===
  document.addEventListener('DOMContentLoaded', function () {
    initDarkMode();
    initSidebar();
    initGoTop();
    initFancybox();
    initCodeCopy();
  });
})();
