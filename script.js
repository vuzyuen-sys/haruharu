
(() => {
  "use strict";

  const chapters = [
    ...document.querySelectorAll(".chapter")
  ];

  const dots = [
    ...document.querySelectorAll(".chapter-dot")
  ];

  const count = document.getElementById("chapter-count");
  const music = document.getElementById("background-music");
  const soundToggle = document.getElementById("sound-toggle");
  const soundLabel = document.getElementById("sound-label");
  const homeLink = document.getElementById("home-link");

  let current = 1;

  // Chuyển đến một chương cụ thể
  function showChapter(number, updateHash = true) {
    const target = Math.min(4, Math.max(1, Number(number) || 1));

    current = target;

    chapters.forEach((chapter) => {
      const active =
        Number(chapter.dataset.chapter) === target;

      chapter.classList.toggle("is-active", active);
      chapter.setAttribute("aria-hidden", String(!active));
    });

    dots.forEach((dot) => {
      const active = Number(dot.dataset.go) === target;

      dot.classList.toggle("is-current", active);

      if (active) {
        dot.setAttribute("aria-current", "step");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    count.textContent =
      `${String(target).padStart(2, "0")} / 04`;

    // Cho phép mở trực tiếp một chương qua URL
    if (updateHash) {
      history.replaceState(null, "", `#chapter-${target}`);
    }

    // Đưa người đọc về đầu chương mới
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ? "auto" : "smooth"
    });
  }

  // Các nút đi tiếp
  document.querySelectorAll("[data-next]").forEach((button) => {
    button.addEventListener("click", () => {
      showChapter(button.dataset.next);
    });
  });

  // Các chấm điều hướng bên phải
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showChapter(dot.dataset.go);
    });
  });

  // Nút quay về đầu thư
  document.getElementById("restart").addEventListener("click", () => {
    showChapter(1);
  });

  homeLink.addEventListener("click", (event) => {
    event.preventDefault();
    showChapter(1);
  });

  // Bật / tắt nhạc sau khi người dùng chủ động nhấn
  soundToggle.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();

        soundToggle.setAttribute("aria-pressed", "true");
        soundToggle.setAttribute("aria-label", "Tắt nhạc nền");
        soundLabel.textContent = "Tắt nhạc";
      } catch (error) {
        soundToggle.setAttribute("aria-pressed", "false");
        soundLabel.textContent = "Kiểm tra file nhạc";

        console.error(
          "Không phát được nhạc. Hãy kiểm tra đường dẫn MP3.",
          error
        );
      }
    } else {
      music.pause();

      soundToggle.setAttribute("aria-pressed", "false");
      soundToggle.setAttribute("aria-label", "Bật nhạc nền");
      soundLabel.textContent = "Bật nhạc";
    }
  });

  // Điều hướng bằng bàn phím
  document.addEventListener("keydown", (event) => {
    const tag = event.target.tagName;

    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      tag === "INPUT" ||
      tag === "TEXTAREA"
    ) {
      return;
    }

    if (event.key === "ArrowRight" && current < 4) {
      showChapter(current + 1);
    }

    if (event.key === "ArrowLeft" && current > 1) {
      showChapter(current - 1);
    }
  });

  // Nếu truy cập trực tiếp URL có #chapter-N
  const initial = location.hash.match(/^#chapter-([1-4])$/);

  showChapter(
    initial ? Number(initial[1]) : 1,
    false
  );
})();
