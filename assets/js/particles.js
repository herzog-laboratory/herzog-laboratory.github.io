// assets/js/particles.js

function initParticlesForSection(section) {
  const canvas = section.querySelector(".hero-particles-canvas");
  if (!canvas) return;

  // Respect reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d", { alpha: true });

  let width = 0,
    height = 0,
    dpr = 1;

  let target = { x: 0, y: 0 };
  let points = [];
  let rafId = null;

  // ---- Tunables (match “Codrops feel”)
  const NEIGHBORS = 5;
  const GRID_DIV = 20; // smaller = more points (Codrops used ~20)
  const DRIFT_RADIUS = 50; // how far points wander from origin
  const DRIFT_MIN_MS = 1000; // how often a point picks a new destination
  const DRIFT_MAX_MS = 2000;

  // Dist thresholds (squared distances like Codrops demo)
  const D1 = 4000;
  const D2 = 20000;
  const D3 = 40000;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function computeNearest(pts, k = 5) {
    for (let i = 0; i < pts.length; i++) {
      const p1 = pts[i];
      const closest = [];

      for (let j = 0; j < pts.length; j++) {
        if (i === j) continue;
        const p2 = pts[j];
        const d = (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;

        if (closest.length < k) {
          closest.push({ p: p2, d });
          closest.sort((a, b) => a.d - b.d);
        } else if (d < closest[k - 1].d) {
          closest[k - 1] = { p: p2, d };
          closest.sort((a, b) => a.d - b.d);
        }
      }

      p1.closest = closest.map((c) => c.p);
    }
  }

  function getCssRgb(varName){
  const val = getComputedStyle(document.documentElement)
              .getPropertyValue(varName)
              .trim();

  // converts "111 99 181" → [111,99,181]
  return val.split(" ").map(Number);
}

const PALETTE = [
  getCssRgb("--hb-primary-500-rgb"),
  getCssRgb("--hb-secondary-500-rgb"),
  getCssRgb("--hb-tertiary-500-rgb"),
];



  function buildPoints(w, h) {
  const pts = [];
  const stepX = w / GRID_DIV;
  const stepY = h / GRID_DIV;

  for (let x = 0; x < w; x += stepX) {
    for (let y = 0; y < h; y += stepY) {
      const px = x + Math.random() * stepX;
      const py = y + Math.random() * stepY;

      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];

      const p = {
        x: px,
        y: py,
        originX: px,
        originY: py,

        // drift targets
        tx: px,
        ty: py,
        // drift timing
        nextShiftAt: performance.now() + rand(DRIFT_MIN_MS, DRIFT_MAX_MS),

        // visual activity
        active: 0,

        // colour
        color,
      };

      pts.push(p);
    }
  }

  computeNearest(pts, NEIGHBORS);
  return pts;
}


  function resize() {
    const rect = section.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;

    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));

    // CSS size
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Bitmap size
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    // Draw in CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    target = { x: width / 2, y: height / 2 };
    points = buildPoints(width, height);
  }

  function onMouseMove(e) {
    const rect = section.getBoundingClientRect();
    target.x = e.clientX - rect.left;
    target.y = e.clientY - rect.top;
  }

  // “GSAP-like” easing toward a drifting target
  function updateDrift(now) {
    for (const p of points) {
      if (now >= p.nextShiftAt) {
        p.tx = p.originX + rand(-DRIFT_RADIUS, DRIFT_RADIUS);
        p.ty = p.originY + rand(-DRIFT_RADIUS, DRIFT_RADIUS);
        p.nextShiftAt = now + rand(DRIFT_MIN_MS, DRIFT_MAX_MS);
      }

      // Ease towards target (tweak 0.02–0.06 for speed)
      p.x += (p.tx - p.x) * 0.03;
      p.y += (p.ty - p.y) * 0.03;
    }
  }

function lerp(a,b,t){
  return a + (b-a)*t;
}

function gradientColor(x, width){
  const left = [99,102,241];   // indigo
  const right = [139,92,246];  // violet

  const t = x / width;

  return [
    Math.round(lerp(left[0], right[0], t)),
    Math.round(lerp(left[1], right[1], t)),
    Math.round(lerp(left[2], right[2], t)),
  ];
}


  function draw(now) {
    updateDrift(now);
    ctx.clearRect(0, 0, width, height);

    for (const p of points) {
      const dist2 = (target.x - p.x) ** 2 + (target.y - p.y) ** 2;

      let a = 0;
      let ca = 0;
      if (dist2 < D1) {
        a = 0.3;
        ca = 0.6;
      } else if (dist2 < D2) {
        a = 0.1;
        ca = 0.3;
      } else if (dist2 < D3) {
        a = 0.02;
        ca = 0.1;
      }

      if (a <= 0) continue;

      
      const col = gradientColor(p.x, width);
      
      // Lines
      ctx.strokeStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${a})`;
      for (const c of p.closest || []) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(c.x, c.y);
        ctx.stroke();
      }

      // Circle
      ctx.fillStyle   = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${ca})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2 + Math.random() * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = requestAnimationFrame(draw);
  }

  function start() {
    resize();
    // Layout settles after first paint; do a couple of extra resizes.
    requestAnimationFrame(resize);
    setTimeout(resize, 250);

    // Track section resizing (hero text wrapping etc.)
    if ("ResizeObserver" in window) {
      new ResizeObserver(() => resize()).observe(section);
    }

    if (!("ontouchstart" in window)) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }
    window.addEventListener("resize", resize, { passive: true });

    rafId = requestAnimationFrame(draw);
  }

  start();
}

function initAll() {
  document.querySelectorAll("section .hero-particles-canvas").forEach((canvas) => {
    const section = canvas.closest("section");
    if (section) initParticlesForSection(section);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  initAll();
}
