(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var panel = document.querySelector('[data-nav-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeIndex = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
    });
  }

  function startCarousel() {
    if (slides.length < 2) {
      return;
    }

    timer = window.setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5200);
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      if (timer) {
        window.clearInterval(timer);
      }

      showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      startCarousel();
    });
  });

  showSlide(0);
  startCarousel();

  var searchInput = document.querySelector('[data-search-input]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

  if (searchInput && cards.length) {
    searchInput.addEventListener('input', function () {
      var query = searchInput.value.trim().toLowerCase();

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.textContent
        ].join(' ').toLowerCase();

        card.classList.toggle('is-filtered-out', query && haystack.indexOf(query) === -1);
      });
    });
  }

  var video = document.querySelector('[data-player]');
  var playButton = document.querySelector('[data-play]');
  var hlsInstance = null;

  function attachAndPlay() {
    if (!video || !playButton) {
      return;
    }

    var source = playButton.getAttribute('data-video-src');

    if (!source) {
      return;
    }

    playButton.classList.add('is-hidden');

    if (window.Hls && window.Hls.isSupported()) {
      if (hlsInstance) {
        hlsInstance.destroy();
      }

      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          hlsInstance.destroy();
          hlsInstance = null;
          video.src = source;
          video.play().catch(function () {});
        }
      });
      return;
    }

    video.src = source;
    video.play().catch(function () {});
  }

  if (playButton) {
    playButton.addEventListener('click', attachAndPlay);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        attachAndPlay();
      }
    });
  }
})();
