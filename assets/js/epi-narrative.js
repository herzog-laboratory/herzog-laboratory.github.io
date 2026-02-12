(() => {
  const root = document.querySelector("#epi-narrative");
  if (!root) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const steps = Array.from(root.querySelectorAll(".step"));
  
  // Click a highlighted word to jump to its step
root.querySelectorAll(".word[data-step]").forEach((word) => {
  // Optional: accessibility
  word.setAttribute("role", "button");
  word.setAttribute("tabindex", "0");

  function go() {
    const key = word.dataset.step;
    const target = root.querySelector(`.step[data-step="${key}"]`);
    if (!target) return;

    // Scroll so the target step lands near the center activation band
    const top = window.scrollY + target.getBoundingClientRect().top;
    const y = top - window.innerHeight * 0.5 + target.offsetHeight * 0.5;

    window.scrollTo({ top: y, behavior: "smooth" });
  }

  word.addEventListener("click", go);
  word.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go();
    }
  });
});


  const stepIndex = new Map(steps.map((el, i) => [el, i]));

  let lastActiveIdx = 0;
  let lastScrollY = window.scrollY;

  function setActiveByKey(key) {
    const phase2 = (key === "section2" || key === "measure" || key === "modify" || key === "end");
    root.classList.toggle("is-phase-2", phase2);

    root.querySelectorAll(".word").forEach(el => {
      el.classList.toggle("is-active", el.dataset.step === key);
    });

    root.querySelectorAll(".detail").forEach(el => {
      el.classList.toggle("is-active", el.dataset.step === key);
    });

    const mediaKey =
      (key === "section2") ? "future" :
      (key === "end") ? "modify" :
      key;

    root.querySelectorAll(".media").forEach(el => {
      el.classList.toggle("is-active", el.dataset.step === mediaKey);
    });

    const arrow = document.getElementById("scrollArrow");
    if (arrow) {
      const show = (key === "end");
      arrow.classList.toggle("opacity-0", !show);
      arrow.classList.toggle("pointer-events-none", !show);
      arrow.classList.toggle("opacity-100", show);
      arrow.classList.toggle("pointer-events-auto", show);
    }
  }

  setActiveByKey(steps[0]?.dataset.step || "blank");
  lastActiveIdx = 0;

  if (prefersReduced) return;

  const io = new IntersectionObserver(
    (entries) => {
      const scrollingDown = window.scrollY >= lastScrollY;
      lastScrollY = window.scrollY;

      const visible = entries.filter(e => e.isIntersecting);
      if (!visible.length) return;

      const centerY = window.innerHeight * 0.5;
      const candidate = visible
        .slice()
        .sort((a, b) => {
          const da = Math.abs((a.boundingClientRect.top + a.boundingClientRect.height / 2) - centerY);
          const db = Math.abs((b.boundingClientRect.top + b.boundingClientRect.height / 2) - centerY);
          return da - db;
        })[0];

      const candIdx = stepIndex.get(candidate.target);
      if (candIdx == null) return;

      const nextIdx = scrollingDown
        ? Math.max(lastActiveIdx, candIdx)
        : Math.min(lastActiveIdx, candIdx);

      if (nextIdx === lastActiveIdx) return;

      lastActiveIdx = nextIdx;
      setActiveByKey(steps[nextIdx].dataset.step);
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
  );

  steps.forEach(s => io.observe(s));
})();
