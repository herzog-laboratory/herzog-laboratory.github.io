(function () {
  function init() {
    const nav = document.querySelector(".hb-block-jump");
    if (!nav) return;

    const btnUp = nav.querySelector(".hb-jump-up");
    const btnDown = nav.querySelector(".hb-jump-down");
    if (!btnUp || !btnDown) return;

    // ✅ Your canonical block order (exact IDs)
    const ORDER = [
      "about",
      "epi-story",
      "research-areas",
      "publications",
      "stats",
      "team",
      "news",
      "events",
      "contact"
    ];

    // Build the block elements in that order (skip any missing on a given page)
    const blocks = ORDER
      .map((id) => document.getElementById(id))
      .filter((el) => !!el);

    if (blocks.length < 2) {
      nav.style.display = "none";
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function currentIndex() {
      const y = window.scrollY + window.innerHeight * 0.35;
      let idx = 0;
      for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].offsetTop <= y) idx = i;
      }
      return idx;
    }

    function updateButtons() {
      const i = currentIndex();
      btnUp.disabled = i <= 0;
      btnDown.disabled = i >= blocks.length - 1;
    }

    function jump(delta) {
      const i = currentIndex();
      const j = Math.max(0, Math.min(blocks.length - 1, i + delta));
      blocks[j].scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
      history.replaceState(null, "", `#${blocks[j].id}`);
      updateButtons();
    }

    btnUp.addEventListener("click", () => jump(-1));
    btnDown.addEventListener("click", () => jump(1));

    window.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);

    updateButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
