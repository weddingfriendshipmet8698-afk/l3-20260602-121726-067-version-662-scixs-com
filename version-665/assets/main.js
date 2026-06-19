(function () {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const hero = document.querySelector('[data-carousel]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('.hero-dot'));
    const next = hero.querySelector('[data-next]');
    const prev = hero.querySelector('[data-prev]');
    let index = 0;
    let timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
        start();
      });
    });

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        start();
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    showSlide(0);
    start();
  }

  const input = document.querySelector('.search-input');
  const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
  const filters = Array.from(document.querySelectorAll('.filter-select'));
  const emptyState = document.querySelector('.empty-state');

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilters() {
    const term = normalize(input ? input.value : '');
    const selected = {};
    filters.forEach(function (filter) {
      selected[filter.dataset.filter] = filter.value;
    });

    let visible = 0;
    cards.forEach(function (card) {
      const searchText = normalize(card.dataset.search);
      const matchTerm = !term || searchText.indexOf(term) !== -1;
      const matchYear = !selected.year || card.dataset.year === selected.year;
      const matchType = !selected.type || card.dataset.type === selected.type;
      const matchCategory = !selected.category || card.dataset.category === selected.category;
      const show = matchTerm && matchYear && matchType && matchCategory;
      card.hidden = !show;
      if (show) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
  }

  if (input || filters.length) {
    if (input) {
      input.addEventListener('input', applyFilters);
    }
    filters.forEach(function (filter) {
      filter.addEventListener('change', applyFilters);
    });
    applyFilters();
  }
})();
