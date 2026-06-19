const MovieUI = (() => {
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function initMenu() {
    const button = qs('.menu-toggle');
    const menu = qs('.mobile-nav');
    if (!button || !menu) return;
    button.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
  }

  function initSlider() {
    const root = qs('[data-slider]');
    if (!root) return;
    const slides = qsa('.hero-slide', root);
    const dots = qsa('.hero-dot', root);
    let index = 0;
    let timer = null;

    const show = next => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    };

    const play = () => {
      clearInterval(timer);
      timer = setInterval(() => show(index + 1), 5000);
    };

    const prev = qs('.hero-arrow.prev', root);
    const next = qs('.hero-arrow.next', root);
    if (prev) prev.addEventListener('click', () => { show(index - 1); play(); });
    if (next) next.addEventListener('click', () => { show(index + 1); play(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); play(); }));
    play();
  }

  function initFilter() {
    const list = qs('.searchable-list');
    if (!list) return;
    const input = qs('[data-filter-input]');
    const region = qs('[data-filter-region]');
    const items = qsa('.movie-card', list);

    const run = () => {
      const word = (input && input.value ? input.value : '').trim().toLowerCase();
      const reg = region && region.value ? region.value : '';
      items.forEach(item => {
        const hay = [item.dataset.title, item.dataset.year, item.dataset.region, item.dataset.category, item.dataset.tags].join(' ').toLowerCase();
        const okWord = !word || hay.includes(word);
        const okReg = !reg || item.dataset.region === reg;
        item.style.display = okWord && okReg ? '' : 'none';
      });
    };

    if (input) input.addEventListener('input', run);
    if (region) region.addEventListener('change', run);
  }

  function initPlayer(videoId, source, buttonSelector) {
    const video = document.getElementById(videoId);
    const button = document.querySelector(buttonSelector);
    if (!video || !source) return;

    let hls = null;
    const ready = () => {
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        video.src = source;
      }
    };

    const start = () => {
      if (button) button.classList.add('is-hidden');
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };

    ready();
    if (button) button.addEventListener('click', start);
    video.addEventListener('click', () => {
      if (video.paused) start();
    });
    video.addEventListener('play', () => {
      if (button) button.classList.add('is-hidden');
    });
    video.addEventListener('pause', () => {
      if (button) button.classList.remove('is-hidden');
    });
    window.addEventListener('pagehide', () => {
      if (hls) hls.destroy();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initSlider();
    initFilter();
  });

  return { initPlayer };
})();
