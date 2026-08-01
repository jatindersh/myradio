// Playlist array with stations
const playlist = [
    { name: "Gurbani Kirtan", url: "https://gurbanikirtan.radioca.st/start.mp3" },
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

// Player elements
const audio = document.getElementById("audioPlayer");
const stationName = document.getElementById("stationName");
const speaker = document.getElementById("speaker");

const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const volumeMuteBtn = document.getElementById("volumeMute");
const volumeUnmuteBtn = document.getElementById("volumeUnmute");
const volumeSlider = document.getElementById("volume_value");

let currentIndex = 0;
let hls = null;

// Utility to check if stream is m3u8
function isM3U8(url) {
  return url.toLowerCase().includes(".m3u8");
}

// MediaSession setup for lockscreen/notification controls
function setupMediaSession(station) {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: station.name,
      artist: 'Classic Jukebox',
      album: 'JKRadio'
    });

    navigator.mediaSession.setActionHandler('play', () => { if (audio) audio.play(); });
    navigator.mediaSession.setActionHandler('pause', () => { if (audio) audio.pause(); });
    navigator.mediaSession.setActionHandler('previoustrack', () => { loadStation(currentIndex - 1); });
    navigator.mediaSession.setActionHandler('nexttrack', () => { loadStation(currentIndex + 1); });
  }
}

// Load and play station by index using exact reference HLS logic
function loadStation(index) {
  if (index < 0) index = playlist.length - 1;
  if (index >= playlist.length) index = 0;
  currentIndex = index;

  const station = playlist[currentIndex];
  if (stationName) {
    stationName.textContent = `Station ${currentIndex + 1}: ${station.name}`;
  }

  setupMediaSession(station);

  // Destroy previous HLS instance if active
  if (hls) {
    hls.destroy();
    hls = null;
  }

  // --- EXACT HLS.JS LOGIC MATCHING YOUR REFERENCE ---
  if (isM3U8(station.url)) {
    if (window.Hls && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(station.url);
      hls.attachMedia(audio);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        audio.play().catch(() => {});
      });
    } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = station.url;
      audio.play().catch(() => {});
    }
  } else {
    audio.src = station.url;
    audio.play().catch(() => {});
  }
}

// Play button handler
if (playBtn) {
  playBtn.addEventListener("click", () => {
    if (audio) audio.play();
  });
}

// Pause button handler
if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    if (audio) audio.pause();
  });
}

// Previous button handler
if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    loadStation(currentIndex - 1);
  });
}

// Next button handler
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    loadStation(currentIndex + 1);
  });
}

// Volume slider handler with Native Android integration
if (volumeSlider) {
  volumeSlider.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    if (audio) audio.volume = val;

    // Send volume updates to Native Android WebView bridge
    if (typeof AndroidApp !== 'undefined' && typeof AndroidApp.setVolume === 'function') {
      AndroidApp.setVolume(val);
    }

    if (volumeMuteBtn && volumeUnmuteBtn) {
      if (audio.volume === 0) {
        audio.muted = true;
        volumeMuteBtn.style.display = "none";
        volumeUnmuteBtn.style.display = "inline-block";
      } else {
        audio.muted = false;
        volumeMuteBtn.style.display = "inline-block";
        volumeUnmuteBtn.style.display = "none";
      }
    }
  });
}

// Safe Mute button handling
if (volumeMuteBtn) {
  volumeMuteBtn.addEventListener("click", () => {
    if (audio) audio.muted = true;
    volumeMuteBtn.style.display = "none";
    if (volumeUnmuteBtn) volumeUnmuteBtn.style.display = "inline-block";
  });
}

// Safe Unmute button handling
if (volumeUnmuteBtn) {
  volumeUnmuteBtn.addEventListener("click", () => {
    if (audio) {
      audio.muted = false;
      if (audio.volume === 0) {
        audio.volume = 0.5;
        if (volumeSlider) volumeSlider.value = 0.5;
      }
    }
    volumeUnmuteBtn.style.display = "none";
    if (volumeMuteBtn) volumeMuteBtn.style.display = "inline-block";
  });
}

// Speaker animation toggle on play/pause
if (audio) {
  audio.addEventListener("play", () => {
    if (speaker) speaker.classList.add("playing");
    if (playBtn) playBtn.style.display = "none";
    if (pauseBtn) pauseBtn.style.display = "inline-block";
  });

  audio.addEventListener("pause", () => {
    if (speaker) speaker.classList.remove("playing");
    if (playBtn) playBtn.style.display = "inline-block";
    if (pauseBtn) pauseBtn.style.display = "none";
  });

  audio.addEventListener("ended", () => {
    if (speaker) speaker.classList.remove("playing");
    if (playBtn) playBtn.style.display = "inline-block";
    if (pauseBtn) pauseBtn.style.display = "none";
  });
}

// Visualizer Animation
const canvas = document.getElementById("visualizer");
const ctx = canvas ? canvas.getContext("2d") : null;

function drawVisualizer() {
  if (!canvas || !ctx) return;
  requestAnimationFrame(drawVisualizer);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!audio || audio.paused) return;

  const numBars = 40;
  const barWidth = (canvas.width / numBars);
  let x = 0;

  for (let i = 0; i < numBars; i++) {
    let randomHeight = Math.max(5, Math.random() * (canvas.height - 10));
    let hue = i * (360 / numBars);
    ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
    ctx.fillRect(x, canvas.height - randomHeight, barWidth - 2, randomHeight);
    x += barWidth;
  }
}

if (audio && canvas && ctx) {
  audio.addEventListener("play", () => {
    drawVisualizer();
  });
}

// Initialize player with first station
loadStation(currentIndex);