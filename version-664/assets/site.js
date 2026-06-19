(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  function startHero() {
    if (timer || slides.length < 2) {
      return;
    }
    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5000);
  }

  function resetHero() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
    startHero();
  }

  document.querySelectorAll('[data-hero-next]').forEach(function (button) {
    button.addEventListener('click', function () {
      showSlide(current + 1);
      resetHero();
    });
  });

  document.querySelectorAll('[data-hero-prev]').forEach(function (button) {
    button.addEventListener('click', function () {
      showSlide(current - 1);
      resetHero();
    });
  });

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
      resetHero();
    });
  });

  showSlide(0);
  startHero();

  function normalize(value) {
    return (value || '').toString().toLowerCase().trim();
  }

  function applyFilters(scope) {
    var input = scope.querySelector('[data-search-input]');
    var select = scope.querySelector('[data-filter-select]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
    var empty = scope.querySelector('[data-empty-state]');
    var query = input ? normalize(input.value) : '';
    var filter = select ? normalize(select.value) : '';
    var visibleCount = 0;

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute('data-search'));
      var type = normalize(card.getAttribute('data-type'));
      var year = normalize(card.getAttribute('data-year'));
      var genre = normalize(card.getAttribute('data-genre'));
      var matchesText = !query || text.indexOf(query) !== -1;
      var matchesFilter = !filter || type.indexOf(filter) !== -1 || year.indexOf(filter) !== -1 || genre.indexOf(filter) !== -1;
      var show = matchesText && matchesFilter;
      card.style.display = show ? '' : 'none';
      if (show) {
        visibleCount += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('is-visible', visibleCount === 0);
    }
  }

  document.querySelectorAll('[data-search-scope]').forEach(function (scope) {
    var input = scope.querySelector('[data-search-input]');
    var select = scope.querySelector('[data-filter-select]');
    if (input) {
      input.addEventListener('input', function () {
        applyFilters(scope);
      });
    }
    if (select) {
      select.addEventListener('change', function () {
        applyFilters(scope);
      });
    }
    applyFilters(scope);
  });

  document.querySelectorAll('[data-player]').forEach(function (box) {
    var video = box.querySelector('video');
    var cover = box.querySelector('[data-player-cover]');
    var stream = box.getAttribute('data-stream');
    var attached = false;
    var hls = null;

    function attach() {
      if (!video || !stream || attached) {
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          maxBufferLength: 30,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else {
        video.src = stream;
      }
      attached = true;
    }

    function play() {
      attach();
      if (cover) {
        cover.hidden = true;
      }
      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {
          if (cover) {
            cover.hidden = false;
          }
        });
      }
    }

    if (cover) {
      cover.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener('play', function () {
        if (cover) {
          cover.hidden = true;
        }
      });
      video.addEventListener('pause', function () {
        if (cover && video.currentTime === 0) {
          cover.hidden = false;
        }
      });
    }

    window.addEventListener('pagehide', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  });
})();
