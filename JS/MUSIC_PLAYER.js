// ===============================
// 要素取得
// ===============================
const audio = document.getElementById("music-audio");
const source = document.getElementById("music-source");
const titleEl = document.getElementById("current-title");
const playlist = document.getElementById("playlist");
const prevBtn = document.getElementById("prev-track");
const nextBtn = document.getElementById("next-track");

const playPauseBtn = document.getElementById("play-pause-btn");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeBar = document.getElementById("volume-bar");
const muteBtn = document.getElementById("mute-btn");

let currentIndex = 0;
let tracks = [];


// ===============================
// プレイリスト初期化
// ===============================
function initPlaylist() {
  if (!playlist) return;

  const items = Array.from(playlist.querySelectorAll("li"));
  tracks = items.map((item, index) => ({
    index,
    title: item.dataset.title || item.textContent,
    src: item.dataset.src,
    element: item,
  }));

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const targetIndex = tracks.findIndex((t) => t.element === item);
      if (targetIndex !== -1) {
        setTrack(targetIndex);
        play();
      }
    });
  });

  if (tracks.length > 0) {
    setTrack(0);
  }
}


// ===============================
// 曲セット
// ===============================
function setTrack(index) {
  if (!audio || !source || !titleEl) return;
  if (index < 0 || index >= tracks.length) return;

  currentIndex = index;
  const track = tracks[currentIndex];

  source.src = track.src;
  audio.load();
  titleEl.textContent = track.title;

  updateActiveItem();
}


// ===============================
// 再生・停止
// ===============================
function play() {
  audio.play().catch(() => {});
}

function pause() {
  audio.pause();
}


// ===============================
// 再生中の曲をハイライト
// ===============================
function updateActiveItem() {
  tracks.forEach((track) => {
    track.element.classList.toggle("active", track.index === currentIndex);
  });
}


// ===============================
// 前へ・次へ
// ===============================
prevBtn.addEventListener("click", () => {
  const newIndex = (currentIndex - 1 + tracks.length) % tracks.length;
  setTrack(newIndex);
  play();
});

nextBtn.addEventListener("click", () => {
  const newIndex = (currentIndex + 1) % tracks.length;
  setTrack(newIndex);
  play();
});


// ===============================
// 再生/停止ボタン
// ===============================
playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    play();
  } else {
    pause();
  }
});

audio.addEventListener("play", () => {
  playPauseBtn.textContent = "⏸";
});

audio.addEventListener("pause", () => {
  playPauseBtn.textContent = "▶️";
});


// ===============================
// シークバー（再生バー）
// ===============================
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress;

  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

progressBar.addEventListener("input", () => {
  const seekTime = (progressBar.value / 100) * audio.duration;
  audio.currentTime = seekTime;
});

function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}


// ===============================
// 音量バー
// ===============================
volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value;
});

muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  muteBtn.textContent = audio.muted ? "🔇" : "🔊";
});


// ===============================
// 曲が変わったらバーをリセット
// ===============================
audio.addEventListener("loadedmetadata", () => {
  progressBar.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = formatTime(audio.duration);
});


// ===============================
// ナビゲーション開閉
// ===============================
function setupNavToggle() {
  const toggleBtn = document.querySelector(".toggle-nav-btn");
  const nav = document.querySelector(".top-right-nav");
  const navItems = document.querySelector(".nav-items");

  if (!toggleBtn || !nav || !navItems) return;

  toggleBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
    navItems.classList.toggle("closed");
  });

  const enforceDesktop = () => {
    if (window.innerWidth > 600) {
      nav.classList.add("open");
      navItems.classList.remove("closed");
    } else {
      nav.classList.remove("open");
      navItems.classList.add("closed");
    }
  };

  enforceDesktop();
  window.addEventListener("resize", enforceDesktop);
}


// ===============================
// トップへ戻る
// ===============================
function setupBackToTop() {
  const backToTop = document.getElementById("back-to-top");
  if (!backToTop) return;

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


// ===============================
// ローディング画面
// ===============================
function hideLoadingScreen() {
  const loading = document.getElementById("loading");
  if (!loading) return;

  loading.classList.add("hide");
  setTimeout(() => {
    loading.style.display = "none";
  }, 600);
}


// ===============================
// 初期化
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  initPlaylist();
  setupNavToggle();
  setupBackToTop();
});

window.addEventListener("load", hideLoadingScreen);