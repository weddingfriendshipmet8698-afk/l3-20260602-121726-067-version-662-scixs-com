function initMoviePlayer(streamUrl) {
  const video = document.getElementById('moviePlayer');
  const overlay = document.getElementById('playerOverlay');
  const button = document.getElementById('playButton');
  let loaded = false;
  let hls = null;

  if (!video || !streamUrl) {
    return;
  }

  function hideOverlay() {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  }

  function showOverlay() {
    if (overlay) {
      overlay.classList.remove('is-hidden');
    }
  }

  function loadStream() {
    if (loaded) {
      return;
    }
    loaded = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      return;
    }

    video.src = streamUrl;
  }

  function playVideo() {
    loadStream();
    hideOverlay();
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        showOverlay();
      });
    }
  }

  function toggleVideo() {
    if (video.paused) {
      playVideo();
    } else {
      video.pause();
    }
  }

  if (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      playVideo();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', function (event) {
      event.preventDefault();
      playVideo();
    });
  }

  video.addEventListener('click', toggleVideo);
  video.addEventListener('play', hideOverlay);
  video.addEventListener('pause', function () {
    if (video.currentTime === 0 || video.ended) {
      showOverlay();
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
}
