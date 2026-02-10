document.addEventListener("DOMContentLoaded", () => {

  /* 上へ戻るボタン */
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

    /* カードフェードイン */
  const fadeTargets = document.querySelectorAll(".hobby-card, .photo-card");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  }, { threshold: 0.2 });

  fadeTargets.forEach(card => observer.observe(card));

  /* ヘッダー縮小 */
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("small", window.scrollY > 50);
    });
  }

  /* ナビ折りたたみ（小→大） */
  const toggleBtn = document.querySelector(".toggle-nav-btn");
  const nav = document.querySelector(".top-right-nav");
  const navItems = document.querySelector(".nav-items");

  if (toggleBtn && nav && navItems) {
    toggleBtn.addEventListener("click", () => {
      nav.classList.toggle("open");
      navItems.classList.toggle("closed");
    });
  }

});

/* ローディング画面 */
window.addEventListener("load", () => {
  const loading = document.getElementById("loading");
  if (loading) {
    loading.classList.add("hide");
    setTimeout(() => loading.style.display = "none", 600);
  }
});