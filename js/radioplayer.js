(() => {
  const playlist = [
	{ name: "Radio Paradise", url: "https://stream.radioparadise.com/mp3-192" },
    { name: "Vividh Bharti", url: "https://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8" },
    { name: "AIR Leh 101.1 FM", url: "https://air.pc.cdn.bitgravity.com/air/live/pbaudio223/playlist.m3u8" },
    { name: "CMR Hindi Canada", url: "https://live.cmr24.net/CMR/Desi_Music-MQ/icecast.audio" },
    { name: "Gurbani Kirtan", url: "http://janus.shoutca.st:8195/stream" },
    { name: "Kishore Kumar Ji", url: "https://stream.zeno.fm/0ghtfp8ztm0uv" },
    { name: "Mohd. Rafi Radio", url: "https://stream.zeno.fm/2xx62x8ztm0uv" },
    { name: "Zeno FM", url: "https://stream.zeno.fm/dbstwo3dvhhtv" },
    { name: "AIR Jaipur", url: "https://air.pc.cdn.bitgravity.com/air/live/pbaudio192/playlist.m3u8" },
    { name: "Air FM Gold", url: "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8" },
    { name: "Air Malayalam", url: "https://air.pc.cdn.bitgravity.com/air/live/pbaudio230/playlist.m3u8" },
    { name: "Air Tamil", url: "https://air.pc.cdn.bitgravity.com/air/live/pbaudio025/playlist.m3u8" },
    { name: "Radio Hungama", url: "https://server.mixify.in:8010/radio.mp3?type=http&nocache=15412/;stream/1" },
    { name: "AIR Delhi", url: "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio006/hlspbaudio006_Auto.m3u8" },
    { name: "AIR Punjabi", url: "https://air.pc.cdn.bitgravity.com/air/live/pbaudio138/playlist.m3u8" },
    { name: "AIR Shimla H.P", url: "https://air.pc.cdn.bitgravity.com/air/live/pbaudio042/playlist.m3u8" },
    { name: "Radio City", url: "https://stream.zeno.fm/pxc55r5uyc9uv" },
    { name: "Akashwani DharamShala", url: "https://air.pc.cdn.bitgravity.com/air/live/pbaudio165/playlist.m3u8" },
    { name: "F.M. Rainbow", url: "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio004/hlspbaudio00464kbps.m3u8" },
    { name: "All India Radio", url: "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio002/hlspbaudio002_Auto.m3u8" },
    { name: "Radio Mirchi", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/NJS_HIN_ESTAAC.m3u8" },
    { name: "BBC world servie", url: "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service" },
    { name: "BBC Hindi Radio", url: "https://server.mixify.in:8010/radio.mp3" },
    { name: "Air FM Rainbow", url: "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio004/hlspbaudio00464kbps.m3u8" },
    { name: "Air Punjabi", url: "https://air.pc.cdn.bitgravity.com/air/live/pbaudio138/playlist.m3u8" },
    { name: "AIR Dehradun", url: "https://air.pc.cdn.bitgravity.com/air/live/pbaudio191/playlist.m3u8" }
  ];

  const audio = document.getElementById('audioPlayer');
  const stationSelect = document.getElementById('stationSelect');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const stationNameEl = document.getElementById('stationName');

  let hls = null;
  let currentIndex = 0;

  // Populate dropdown
  playlist.forEach((station, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = station.name;
    stationSelect.appendChild(option);
  });

  function isM3U8(url) {
    return url.toLowerCase().includes('.m3u8');
  }

  function loadAndPlay(index) {
    if (index < 0 || index >= playlist.length) return;
    currentIndex = index;
    const station = playlist[index];
    stationNameEl.textContent = `Station ${index + 1}: ${station.name}`;

    if (hls) {
      hls.destroy();
      hls = null;
    }

    if (isM3U8(station.url)) {
      if (window.Hls && Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(station.url);
        hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          audio.play().catch(() => {
            updatePlayPauseBtn(false); // Update the UI even if autoplay fails
          });
          updatePlayPauseBtn(true);
        });
      } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        audio.src = station.url;
        audio.addEventListener('loadedmetadata', () => {
          audio.play().catch(() => {
            updatePlayPauseBtn(false); // Update the UI even if autoplay fails
          });
          updatePlayPauseBtn(true);
        }, { once: true });
      } else {
        alert('Your browser does not support HLS playback.');
      }
    } else {
      audio.src = station.url;
      audio.play().then(() => updatePlayPauseBtn(true))
        .catch(() => { // Handle the promise rejection
          updatePlayPauseBtn(false); // Update the UI even if autoplay fails
        });
    }
  }

  function updatePlayPauseBtn(isPlaying) {
    playPauseBtn.textContent = isPlaying ? 'Pause' : 'Play';
  }

  // Event: station changed
  stationSelect.addEventListener('change', e => {
    loadAndPlay(parseInt(e.target.value, 10));
  });

  // Event: play/pause button clicked
  playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => updatePlayPauseBtn(true));
    } else {
      audio.pause();
      updatePlayPauseBtn(false);
    }
  });

  // Update button on audio pause/end
  audio.addEventListener('pause', () => updatePlayPauseBtn(false));
  audio.addEventListener('ended', () => updatePlayPauseBtn(false));

  // Autoplay first station on load (may be blocked by browser)
  window.addEventListener('load', () => {
    stationSelect.value = 0;
    loadAndPlay(0);
  });
})();
