(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function initNavigation() {
        var toggle = document.querySelector('[data-nav-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    function initHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = selectAll('[data-hero-slide]', hero);
        var dots = selectAll('[data-hero-dot]', hero);
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }
        function run() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(index + 1);
            }, 5200);
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                run();
            });
        });
        show(0);
        run();
    }

    function normalize(value) {
        return (value || '').toString().toLowerCase().trim();
    }

    function initQuickSearch() {
        var form = document.querySelector('[data-quick-search]');
        if (!form) {
            return;
        }
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input');
            var query = input ? input.value.trim() : '';
            var suffix = query ? '?q=' + encodeURIComponent(query) : '';
            window.location.href = './search.html' + suffix;
        });
    }

    function initListTools() {
        var grids = selectAll('[data-movie-list]');
        if (!grids.length) {
            return;
        }
        var input = document.querySelector('[data-search-input]');
        var year = document.querySelector('[data-year-filter]');
        var region = document.querySelector('[data-region-filter]');
        var type = document.querySelector('[data-type-filter]');
        var empty = document.querySelector('[data-empty-state]');
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q && input) {
            input.value = q;
        }
        function apply() {
            var words = normalize(input && input.value);
            var y = normalize(year && year.value);
            var r = normalize(region && region.value);
            var t = normalize(type && type.value);
            var visible = 0;
            selectAll('[data-movie-card]').forEach(function (card) {
                var text = normalize(card.getAttribute('data-search'));
                var cardYear = normalize(card.getAttribute('data-year'));
                var cardRegion = normalize(card.getAttribute('data-region'));
                var cardType = normalize(card.getAttribute('data-type'));
                var ok = true;
                if (words && text.indexOf(words) === -1) {
                    ok = false;
                }
                if (y && cardYear !== y) {
                    ok = false;
                }
                if (r && cardRegion !== r) {
                    ok = false;
                }
                if (t && cardType !== t) {
                    ok = false;
                }
                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }
        [input, year, region, type].forEach(function (node) {
            if (node) {
                node.addEventListener('input', apply);
                node.addEventListener('change', apply);
            }
        });
        apply();
    }

    window.initMoviePlayer = function (source) {
        var video = document.getElementById('movie-player');
        var layer = document.getElementById('play-layer');
        if (!video || !source) {
            return;
        }
        var loaded = false;
        function load() {
            if (loaded) {
                return;
            }
            loaded = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls) {
                var hls = new Hls();
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }
        function start() {
            load();
            if (layer) {
                layer.classList.add('is-hidden');
            }
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {});
            }
        }
        if (layer) {
            layer.addEventListener('click', start);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
    };

    document.addEventListener('DOMContentLoaded', function () {
        initNavigation();
        initHero();
        initQuickSearch();
        initListTools();
    });
})();
