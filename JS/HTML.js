document.addEventListener("DOMContentLoaded", () => {

  /* 上へ戻るボタン（右上の小ボタン） */
  document.getElementById("back-to-top").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* スケジュール折りたたみ */
  const scheduleSection = document.querySelector(".vrc-schedule");
  const scheduleTitle = scheduleSection.querySelector("h2");
  const scheduleTable = scheduleSection.querySelector(".schedule-table");

  scheduleTitle.style.cursor = "pointer";
  scheduleTitle.addEventListener("click", () => {
    scheduleTable.classList.toggle("hidden");
  });

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
  window.addEventListener("scroll", () => {
    header.classList.toggle("small", window.scrollY > 50);
  });

});

/* ローディング画面 */
window.addEventListener("load", () => {
  const loading = document.getElementById("loading");
  loading.classList.add("hide");
  setTimeout(() => loading.style.display = "none", 600);
});