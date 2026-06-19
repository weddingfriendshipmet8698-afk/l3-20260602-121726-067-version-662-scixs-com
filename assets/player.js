function runPlayer(streamUrl) {
  var box = document.querySelector('.player-box');
  var video = document.querySelector('.movie-video');
  var overlay = document.querySelector('.play-overlay');
  var hlsInstance = null;

  if (!box || !video || !overlay || !streamUrl) {
    return;
  }

  function bindStream() {
    if (video.getAttribute('data-ready') === '1') {
      return;
    }

    video.setAttribute('data-ready', '1');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
    }
  }

  function playVideo() {
    bindStream();
    overlay.classList.add('is-hidden');
    video.controls = true;
    var attempt = video.play();

    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {
        overlay.classList.remove('is-hidden');
      });
    }
  }

  overlay.addEventListener('click', playVideo);
  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    }
  });

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
