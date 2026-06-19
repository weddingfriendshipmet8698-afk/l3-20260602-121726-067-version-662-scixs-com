(function () {
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  var hero = document.querySelector('.hero-stage');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prev = hero.querySelector('.hero-prev');
    var next = hero.querySelector('.hero-next');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, position) {
        slide.classList.toggle('active', position === current);
      });

      dots.forEach(function (dot, position) {
        dot.classList.toggle('active', position === current);
      });
    }

    function startTimer() {
      if (timer) {
        window.clearInterval(timer);
      }

      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-slide-target')) || 0);
        startTimer();
      });
    });

    startTimer();
  }

  var filterPanel = document.querySelector('.filter-panel');
  var grid = document.querySelector('[data-filter-grid]');
  var empty = document.querySelector('.empty-state');

  if (filterPanel && grid) {
    var controls = Array.prototype.slice.call(filterPanel.querySelectorAll('[data-filter]'));
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
    var query = new URLSearchParams(window.location.search);
    var querySearch = query.get('search') || '';
    var keyword = filterPanel.querySelector('[data-filter="keyword"]');

    if (keyword && querySearch) {
      keyword.value = querySearch;
    }

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilters() {
      var values = {};

      controls.forEach(function (control) {
        values[control.getAttribute('data-filter')] = normalize(control.value);
      });

      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-title'));
        var year = normalize(card.getAttribute('data-year'));
        var type = normalize(card.getAttribute('data-type'));
        var category = normalize(card.getAttribute('data-category'));
        var ok = true;

        if (values.keyword && text.indexOf(values.keyword) === -1) {
          ok = false;
        }

        if (values.year && year !== values.year) {
          ok = false;
        }

        if (values.type && type !== values.type) {
          ok = false;
        }

        if (values.category && category !== values.category) {
          ok = false;
        }

        card.style.display = ok ? '' : 'none';

        if (ok) {
          visible += 1;
        }
      });

      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    }

    controls.forEach(function (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    });

    applyFilters();
  }

  var indexSearch = document.querySelector('[data-home-search]');

  if (indexSearch) {
    indexSearch.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = indexSearch.querySelector('input');
      var value = input ? input.value.trim() : '';
      var target = './library.html';

      if (value) {
        target += '?search=' + encodeURIComponent(value);
      }

      window.location.href = target;
    });
  }
})();
