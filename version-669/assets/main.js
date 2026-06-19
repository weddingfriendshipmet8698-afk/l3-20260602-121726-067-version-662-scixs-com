(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector(".nav-toggle");
        var mobileNav = document.querySelector(".mobile-nav");
        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                var open = mobileNav.classList.toggle("is-open");
                toggle.setAttribute("aria-expanded", open ? "true" : "false");
            });
        }

        document.querySelectorAll(".site-search-form").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                var input = form.querySelector("input[name='q']");
                if (!input) {
                    return;
                }
                var value = input.value.trim();
                if (value) {
                    event.preventDefault();
                    window.location.href = "./search.html?q=" + encodeURIComponent(value);
                }
            });
        });

        var slider = document.querySelector("[data-hero-slider]");
        if (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
            var buttons = Array.prototype.slice.call(slider.querySelectorAll("[data-slide-button]"));
            var index = 0;
            var timer = null;

            function activate(nextIndex) {
                if (!slides.length) {
                    return;
                }
                index = (nextIndex + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("is-active", i === index);
                });
                buttons.forEach(function (button, i) {
                    button.classList.toggle("is-active", i === index);
                });
            }

            function start() {
                stop();
                timer = window.setInterval(function () {
                    activate(index + 1);
                }, 5200);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            buttons.forEach(function (button) {
                button.addEventListener("click", function () {
                    activate(Number(button.getAttribute("data-slide-button") || 0));
                    start();
                });
            });

            slider.addEventListener("mouseenter", stop);
            slider.addEventListener("mouseleave", start);
            activate(0);
            start();
        }

        var searchParams = new URLSearchParams(window.location.search);
        var initialQuery = searchParams.get("q") || "";
        var filterInput = document.querySelector(".filter-input");
        if (filterInput && initialQuery) {
            filterInput.value = initialQuery;
        }

        var grids = document.querySelectorAll(".searchable-grid");
        if (grids.length) {
            var controls = document.querySelectorAll(".filter-input, .filter-select, .filter-region");
            var empty = document.querySelector(".empty-result");

            function normalize(value) {
                return String(value || "").trim().toLowerCase();
            }

            function applyFilters() {
                var keyword = normalize(document.querySelector(".filter-input") && document.querySelector(".filter-input").value);
                var typeValue = normalize(document.querySelector(".filter-select") && document.querySelector(".filter-select").value);
                var regionValue = normalize(document.querySelector(".filter-region") && document.querySelector(".filter-region").value);
                var visible = 0;
                document.querySelectorAll(".searchable-grid .movie-card").forEach(function (card) {
                    var searchText = normalize(card.getAttribute("data-search"));
                    var typeText = normalize(card.getAttribute("data-type"));
                    var regionText = normalize(card.getAttribute("data-region"));
                    var matched = true;
                    if (keyword && searchText.indexOf(keyword) === -1) {
                        matched = false;
                    }
                    if (typeValue && typeText.indexOf(typeValue) === -1) {
                        matched = false;
                    }
                    if (regionValue && regionText.indexOf(regionValue) === -1) {
                        matched = false;
                    }
                    card.classList.toggle("is-filter-hidden", !matched);
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.hidden = visible !== 0;
                }
            }

            controls.forEach(function (control) {
                control.addEventListener("input", applyFilters);
                control.addEventListener("change", applyFilters);
            });
            applyFilters();
        }
    });
})();
