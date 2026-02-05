document.addEventListener("DOMContentLoaded", () => {

  // 上へ戻るボタン
document.getElementById("back-to-top").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
  
  /* ==========================================================
     1. スケジュール表の折りたたみ
  ========================================================== */
  const scheduleSection = document.querySelector(".vrc-schedule");
  const scheduleTitle = scheduleSection.querySelector("h2");
  const scheduleTable = scheduleSection.querySelector(".schedule-table");

  scheduleTitle.style.cursor = "pointer";

  scheduleTitle.addEventListener("click", () => {
    scheduleTable.classList.toggle("hidden");
  });


  /* ==========================================================
     2. 写真カードのフェードイン（スクロールアニメ）
  ========================================================== */
  const fadeTargets = document.querySelectorAll(".hobby-card, .photo-card");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, {
    threshold: 0.2
  });

  fadeTargets.forEach(card => observer.observe(card));


  /* ==========================================================
     3. ページ上部へ戻るボタン
  ========================================================== */
  const topBtn = document.createElement("button");
  topBtn.textContent = "▲";
  topBtn.className = "back-to-top";
  document.body.appendChild(topBtn);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      topBtn.classList.add("show");
    } else {
      topBtn.classList.remove("show");
    }
  });

  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  /* ==========================================================
     4. ヘッダー縮小アニメーション
  ========================================================== */
  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("small");
    } else {
      header.classList.remove("small");
    }
  });

});

/* ==========================================================
   Loading Screen
========================================================== */
window.addEventListener("load", () => {
  const loading = document.getElementById("loading");
  loading.classList.add("hide");

  // 完全に消す（アニメ後）
  setTimeout(() => {
    loading.style.display = "none";
  }, 600);
});