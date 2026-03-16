// games_vido.html 用の JavaScript
// - 共通の「上へ戻る」ボタン
// - ナビメニューの開閉
// - （必要あれば）動画再生関連の制御を追加できます

document.addEventListener("DOMContentLoaded", () => {

  /* 上へ戻るボタン */
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ナビ折りたたみ（PC/スマホ共通） */
  const toggleBtn = document.querySelector(".toggle-nav-btn");
  const nav = document.querySelector(".top-right-nav");
  const navItems = document.querySelector(".nav-items");

  if (toggleBtn && nav && navItems) {
    toggleBtn.addEventListener("click", () => {
      nav.classList.toggle("open");
      navItems.classList.toggle("closed");
    });

    // PC では常時開く
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

  /* 動画の折りたたみ */
  const arrows = document.querySelectorAll('.arrow');
  arrows.forEach(arrow => {
    arrow.addEventListener('click', () => {
      const item = arrow.closest('.video-item');
      const content = item.querySelector('.video-content');
      if (content) {
        // 他のコンテンツを閉じる
        document.querySelectorAll('.video-content.show').forEach(openContent => {
          if (openContent !== content) {
            openContent.classList.remove('show');
            const otherArrow = openContent.closest('.video-item').querySelector('.arrow');
            if (otherArrow) otherArrow.textContent = '⇩';
          }
        });
        content.classList.toggle('show');
        arrow.textContent = content.classList.contains('show') ? '⇧' : '⇩';
      }
    });
  });

  /* 動画のクリックで再生 */
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    video.addEventListener('click', (e) => {
      e.preventDefault(); // デフォルトのコントロール表示を防ぐ
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  });

});
window.addEventListener("load", () => {
  const loading = document.getElementById("loading");
  if (loading) {
    loading.classList.add("hide");
    setTimeout(() => loading.style.display = "none", 600);
  }
});

// 念のため、10秒後に強制的に隠す
setTimeout(() => {
  const loading = document.getElementById("loading");
  if (loading && !loading.classList.contains("hide")) {
    console.warn('Loading screen forced to hide after timeout');
    loading.classList.add("hide");
    setTimeout(() => {
      if (loading) loading.style.display = "none";
    }, 600);
  }
}, 10000);
