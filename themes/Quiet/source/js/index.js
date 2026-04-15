/**
 * Quiet 主题主脚本
 * - 内容上移动画
 * - 导航栏滚动吸顶
 * - 移动端侧边栏开关
 * - 回到顶部按钮
 * - Fancybox 图片灯箱绑定
 */

(function () {
  'use strict';

  // === rAF 节流的滚动事件 ===
  let ticking = false;

  function onScroll() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const headerTopDom = document.getElementById('header-top');
    const goTopDom = document.getElementById('js-go_top');

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
    const toggleBtn = document.querySelector('.h-right-close > svg');
    const sidebar = document.getElementById('sidebar');
    const shelter = document.getElementById('shelter');

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
    const goTopDom = document.getElementById('js-go_top');
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

    const article = document.getElementById('article');
    if (!article) return;

    // 为文章中的图片包裹 Fancybox 链接
    const images = article.querySelectorAll('img');
    images.forEach(function (img) {
      if (img.parentElement.classList.contains('fancybox')) return;
      if (img.classList.contains('nofancybox')) return;

      const link = document.createElement('a');
      const src = img.getAttribute('data-src') || img.src;
      link.href = src;
      link.title = img.alt || '';
      link.setAttribute('data-src', img.src);
      link.classList.add('fancybox');
      link.setAttribute('data-fancybox', 'fancybox-gallery-img');

      img.parentNode.insertBefore(link, img);
      link.appendChild(img);
    });

    // 初始化 Fancybox
    Fancybox.bind('[data-fancybox="fancybox-gallery-img"]', {
      dragToClose: true,
      Toolbar: true,
      closeButton: 'top',
      Image: {
        zoom: true,
      },
      on: {
        initCarousel: function (fancybox) {
          const slide = fancybox.Carousel.slides[fancybox.Carousel.page];
          fancybox.$container.style.setProperty(
            '--bg-image',
            'url("' + slide.$thumb.src + '")'
          );
        },
        'Carousel.change': function (fancybox, carousel, to) {
          const slide = carousel.slides[to];
          fancybox.$container.style.setProperty(
            '--bg-image',
            'url("' + slide.$thumb.src + '")'
          );
        },
      },
    });
  }

  // === 初始化 ===
  document.addEventListener('DOMContentLoaded', function () {
    initSidebar();
    initGoTop();
    initFancybox();
  });
})();
