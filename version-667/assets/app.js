(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
      menuButton.addEventListener('click', function () {
        mobileNav.classList.toggle('open');
      });
    }

    initHero();
    initSearch();
    initTagFilters();
    initPlayers();
  });

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    var index = 0;
    var timer;

    if (!slides.length) {
      return;
    }

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    start();
  }

  function initSearch() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));

    inputs.forEach(function (input) {
      var scope = input.closest('section') || document;
      var list = scope.querySelector('[data-card-list]') || document.querySelector('[data-card-list]');
      var cards = list ? Array.prototype.slice.call(list.querySelectorAll('[data-card]')) : [];

      input.addEventListener('input', function () {
        var query = input.value.trim().toLowerCase();

        cards.forEach(function (card) {
          var text = [
            card.getAttribute('data-title'),
            card.getAttribute('data-year'),
            card.getAttribute('data-region'),
            card.getAttribute('data-genre'),
            card.textContent
          ].join(' ').toLowerCase();

          card.classList.toggle('is-hidden', query && text.indexOf(query) === -1);
        });
      });
    });
  }

  function initTagFilters() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-tag]'));
    var list = document.querySelector('[data-card-list]');
    var cards = list ? Array.prototype.slice.call(list.querySelectorAll('[data-card]')) : [];

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var tag = button.getAttribute('data-filter-tag') || '';

        cards.forEach(function (card) {
          card.classList.toggle('is-hidden', card.textContent.indexOf(tag) === -1);
        });
      });
    });
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (player) {
      var video = player.querySelector('video');
      var button = player.querySelector('[data-play-button]');
      var source = player.getAttribute('data-src');
      var loaded = false;

      if (!video || !source) {
        return;
      }

      function load() {
        if (loaded) {
          return;
        }

        loaded = true;

        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });

          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
      }

      function play() {
        load();
        var result = video.play();

        if (result && typeof result.catch === 'function') {
          result.catch(function () {
            player.classList.remove('playing');
          });
        }
      }

      if (button) {
        button.addEventListener('click', function () {
          player.classList.add('playing');
          play();
        });
      }

      video.addEventListener('play', function () {
        player.classList.add('playing');
      });

      video.addEventListener('pause', function () {
        player.classList.remove('playing');
      });

      video.addEventListener('click', function () {
        if (video.paused) {
          player.classList.add('playing');
          play();
        }
      });
    });
  }
})();
