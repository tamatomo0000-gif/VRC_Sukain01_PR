// 音楽プレーヤー用のシンプルなプレイリスト制御
// - 曲リストをクリックすると再生を開始
// - 「前へ」「次へ」で曲を切り替え
// - ナビゲーション開閉とローディング画面を制御

const audio = document.getElementById("music-audio");
const source = document.getElementById("music-source");
const titleEl = document.getElementById("current-title");
const playlist = document.getElementById("playlist");
const prevBtn = document.getElementById("prev-track");
const nextBtn = document.getElementById("next-track");

// カスタムコントロール要素
const playPauseBtn = document.getElementById("play-pause-btn");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const muteBtn = document.getElementById("mute-btn");
const volumeBar = document.getElementById("volume-bar");

function getAudioMimeType(src) {
  if (!src) return "";
  const ext = src
    .split("?")[0]
    .split("#")[0]
    .split(".")
    .pop()
    .toLowerCase();

  switch (ext) {
    case "mp3":
      return "audio/mpeg";
    case "m4a":
      // Apple AAC in MP4 container
      return "audio/mp4";
    case "aac":
      return "audio/aac";
    case "ogg":
    case "oga":
      return "audio/ogg";
    case "wav":
      return "audio/wav";
    default:
      return "";
  }
}

let currentIndex = 0;
let tracks = [];

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

  // 初期状態で1曲目をセット
  if (tracks.length > 0) {
    setTrack(0);
  }
}

function setTrack(index) {
  if (!audio || !source || !titleEl) return;
  if (index < 0 || index >= tracks.length) return;

  currentIndex = index;
  const track = tracks[currentIndex];
  source.src = track.src;
  const mime = getAudioMimeType(track.src);
  if (mime) {
    source.type = mime;
  } else {
    // If we don't know the mime type, remove any previously set type so the browser can try to infer it.
    source.removeAttribute("type");
  }

  audio.load();
  titleEl.textContent = track.title;
  updateActiveItem();
  // 進捗バーと時間をリセット
  progressBar.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";
}

function play() {
  if (!audio) return;
  audio.play().catch(() => {
    // 自動再生制限などで再生できなかった場合は無視
  });
  if (playPauseBtn) playPauseBtn.textContent = "⏸️";
}

function setupCustomControls() {
  if (!audio || !playPauseBtn || !progressBar || !volumeBar) return;

  // 再生/一時停止ボタン
  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      play();
      playPauseBtn.textContent = "⏸️";
    } else {
      audio.pause();
      playPauseBtn.textContent = "▶️";
    }
  });

  // 進捗バー更新
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progress;
      currentTimeEl.textContent = formatTime(audio.currentTime);
      durationEl.textContent = formatTime(audio.duration);
    }
  });

  // 進捗バー操作
  progressBar.addEventListener("input", () => {
    if (audio.duration) {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
  });

  // 音量バー
  volumeBar.addEventListener("input", () => {
    audio.volume = volumeBar.value;
    updateMuteBtn();
  });

  // ミュートボタン
  muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    updateMuteBtn();
  });

  // 曲終了時に次の曲へ
  audio.addEventListener("ended", () => {
    nextTrack();
  });

  // 初期音量設定
  audio.volume = 1;
  updateMuteBtn();
}

function updateMuteBtn() {
  if (audio.muted || audio.volume === 0) {
    muteBtn.textContent = "🔇";
  } else {
    muteBtn.textContent = "🔊";
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function nextTrack() {
  setTrack((currentIndex + 1) % tracks.length);
  play();
  playPauseBtn.textContent = "⏸️";
}

function prevTrack() {
  setTrack((currentIndex - 1 + tracks.length) % tracks.length);
  play();
  playPauseBtn.textContent = "⏸️";
}

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

function setupBackToTop() {
  const backToTop = document.getElementById("back-to-top");
  if (!backToTop) return;

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function hideLoadingScreen() {
  const loading = document.getElementById("loading");
  if (!loading) return;

  loading.classList.add("hide");
  setTimeout(() => {
    loading.style.display = "none";
  }, 600);
}

window.addEventListener("DOMContentLoaded", () => {
  initPlaylist();
  setupCustomControls();
  setupNavToggle();
  setupBackToTop();
});

window.addEventListener("load", hideLoadingScreen);
