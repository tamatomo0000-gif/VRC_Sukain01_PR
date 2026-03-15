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
  audio.load();
  titleEl.textContent = track.title;
  updateActiveItem();
}

function play() {
  if (!audio) return;
  audio.play().catch(() => {
    // 自動再生制限などで再生できなかった場合は無視
  });
}

function updateActiveItem() {
  tracks.forEach((track) => {
    track.element.classList.toggle("active", track.index === currentIndex);
  });
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
  setupNavToggle();
  setupBackToTop();
});

window.addEventListener("load", hideLoadingScreen);
