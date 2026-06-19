(function () {
  var mobileButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (mobileButton && mobileNav) {
    mobileButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }
    var next = root.querySelector('[data-hero-next]');
    var prev = root.querySelector('[data-hero-prev]');
    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
      });
    }
    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });
    if (slides.length > 1) {
      window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }
  }

  function initCards() {
    var input = document.querySelector('[data-card-search]');
    var yearSelect = document.querySelector('[data-year-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    if (!cards.length) {
      return;
    }
    if (input && input.getAttribute('data-url-query')) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get(input.getAttribute('data-url-query'));
      if (q) {
        input.value = q;
      }
    }
    function matchYear(card, value) {
      if (!value) {
        return true;
      }
      var year = Number(card.getAttribute('data-year')) || 0;
      if (value === 'old') {
        return year < 2022;
      }
      return String(year) === value;
    }
    function filter() {
      var term = input ? input.value.trim().toLowerCase() : '';
      var yearValue = yearSelect ? yearSelect.value : '';
      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-year') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-tags') || '',
          card.textContent || ''
        ].join(' ').toLowerCase();
        var visible = (!term || text.indexOf(term) !== -1) && matchYear(card, yearValue);
        card.hidden = !visible;
      });
    }
    if (input) {
      input.addEventListener('input', filter);
    }
    if (yearSelect) {
      yearSelect.addEventListener('change', filter);
    }
    filter();
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    players.forEach(function (player) {
      var video = player.querySelector('video');
      var cover = player.querySelector('.player-cover');
      if (!video) {
        return;
      }
      var source = video.getAttribute('data-src');
      var loaded = false;
      function loadSource() {
        if (loaded || !source) {
          return;
        }
        loaded = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(source);
          hls.attachMedia(video);
          player._hls = hls;
        } else {
          video.src = source;
        }
      }
      function start() {
        loadSource();
        player.classList.add('is-playing');
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {
            player.classList.remove('is-playing');
          });
        }
      }
      if (cover) {
        cover.addEventListener('click', start);
      }
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        } else {
          video.pause();
        }
      });
      video.addEventListener('play', function () {
        player.classList.add('is-playing');
      });
    });
  }

  initHero();
  initCards();
  initPlayers();
})();
