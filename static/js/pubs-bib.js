(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function esc(s) {
    return (s || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function cleanTitle(s) {
    if (!s) return "";
    // Remove BibTeX brace artifacts while keeping inner capitalization intent
    return s.replace(/^\s*[{]+/, "").replace(/[}]+\s*$/, "").replace(/[{}]/g, "");
  }

  function normalizeDoi(doi) {
    if (!doi) return "";
    return doi
      .trim()
      .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
      .replace(/^doi:\s*/i, "");
  }

  function getYear(e) {
    const y = e?.entryTags?.year;
    const n = y ? parseInt(String(y), 10) : 0;
    return Number.isFinite(n) ? n : 0;
  }

  function firstTag(e, keys) {
    const t = e.entryTags || {};
    for (const k of keys) if (t[k]) return t[k];
    return "";
  }

  function getTagCI(tags, name) {
    if (!tags) return "";
    const target = name.toLowerCase();
    for (const [k, v] of Object.entries(tags)) {
        if (k.toLowerCase() === target) return v;
    }
    return "";
}


  function entryUrl(t) {
    const doi = normalizeDoi(t.doi);
    if (t.url) return t.url;
    if (doi) return `https://doi.org/${doi}`;
    return "";
  }

  function bestPdfUrl(t) {
    return t.pdf || t.fulltext || t.eprint || t.preprint || "";
  }

  // ---------- Author formatting ----------
  // Input is BibTeX author string: "Last, First and Last2, First2"
  // Output: "Herzog C, Poganik JR, …"
  // Keeps '*' markers attached to last names (e.g., "Herzog*, Chiara")
  function formatNameToInitials(name) {
    // name can be "Last, First Middle" OR "First Middle Last"
    const raw = name.trim();
    if (!raw) return "";

    // preserve trailing * on last name, e.g. "Herzog*" or "Herzog*"
    let last = "";
    let given = "";

    if (raw.includes(",")) {
      const parts = raw.split(",");
      last = parts[0].trim();
      given = (parts.slice(1).join(",") || "").trim();
    } else {
      // fallback: last token is last name
      const toks = raw.split(/\s+/).filter(Boolean);
      last = toks.pop() || "";
      given = toks.join(" ");
    }

    // Extract initials from given names, keeping letters only
    const initials = (given || "")
      .split(/[\s\-]+/)
      .filter(Boolean)
      .map((w) => w.replace(/[^A-Za-z]/g, ""))
      .filter(Boolean)
      .map((w) => w[0].toUpperCase())
      .join("");

    return initials ? `${last} ${initials}` : `${last}`;
  }

  function parseAuthors(authorStr) {
    // Keep "and" separator
    // Handles "Last, First and Last, First"
    return (authorStr || "")
      .split(/\s+and\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);
  }

    function keyify(s) {
    return (s || "")
        .toLowerCase()
        // Remove BibTeX/LaTeX artifacts
        .replace(/[{}]/g, "")              // braces
        .replace(/~/g, " ")                // non-breaking space
        .replace(/\\[a-zA-Z]+/g, "")       // latex commands like \'
        .replace(/[^a-z\s]/g, " ")         // drop punctuation/digits
        .replace(/\s+/g, " ")
        .trim();
    }


  function stripAsterisksForMatch(s) {
    return s.replace(/\*/g, "");
  }

  function authorsHtml(authorStr, peopleMap, maxAuthors = 10) {
  const people = peopleMap || {};
  const authors = parseAuthors(authorStr);
  if (!authors.length) return "";

  function renderOne(aRaw) {
    const a = aRaw.trim();
    const pretty = formatNameToInitials(a);

    let last = "", given = "";
    if (a.includes(",")) {
      const parts = a.split(",");
      last = parts[0].trim();
      given = (parts.slice(1).join(",") || "").trim();
    } else {
      const toks = a.split(/\s+/).filter(Boolean);
      last = toks.pop() || "";
      given = toks.join(" ");
    }

    const lastClean = keyify(stripAsterisksForMatch(last));
    const givenClean = keyify(stripAsterisksForMatch(given));
    const givenFirst = (givenClean.split(" ")[0] || "");

    const keyFull = keyify(`${givenClean} ${lastClean}`);       // "chiara herzog"
    const keyFirst = keyify(`${givenFirst} ${lastClean}`);      // "chiara herzog"
    const keyRev = keyify(`${lastClean} ${givenFirst}`);        // "herzog chiara"

    // 🔎 DEBUG — remove after testing
    if (lastClean.includes("herzog")) {
    console.log("----- AUTHOR DEBUG -----");
    console.log("Raw author string:", aRaw);
    console.log("Parsed given:", given);
    console.log("Parsed last:", last);
    console.log("Normalized given:", givenClean);
    console.log("Normalized last:", lastClean);
    console.log("Candidate keys:", { keyFull, keyFirst, keyRev });
    console.log("People keys available:", Object.keys(people));
    console.log("Direct match exists?:", people[keyFull]);
    console.log("------------------------");
    }


    const href = people[keyFull] || people[keyFirst] || people[keyRev];

    if (href) return `<a class="pub-person" href="${esc(href)}"><span class="pub-author-highlight">${esc(pretty)}</span></a>`;
    return esc(pretty);
  }

  const fullHtml = authors.map(renderOne).join(", ");

  // ✅ This is the <10 case you want
  if (authors.length <= maxAuthors) {
    return `<span class="pub-authors pub-authors--plain">${fullHtml}</span>`;
  }

  // ≥10 case (your desired toggle behaviour)
  const shortHtml = authors.slice(0, maxAuthors).map(renderOne).join(", ");
  const moreCount = authors.length - maxAuthors;

  return `
    <span class="pub-authors pub-authors--short">
      ${shortHtml}<span class="pub-authors__fade"></span>
      <span class="pub-authors__more"> and ${moreCount} more</span>
    </span>
    <span class="pub-authors pub-authors--full" hidden>${fullHtml}</span>
    <button class="pub-authors__toggle" type="button" data-action="toggle-authors">show all</button>
  `;
}



  // ---------- Preview behaviour ----------
  function lightboxHtml() {
    return `
      <div class="pub-lightbox" hidden>
        <div class="pub-lightbox__backdrop" data-action="lb-close"></div>
        <div class="pub-lightbox__panel" role="dialog" aria-modal="true" aria-label="Preview">
          <button class="pub-lightbox__close" type="button" data-action="lb-close">×</button>
          <img class="pub-lightbox__img" alt="">
        </div>
      </div>
    `;
  }

  // ---------- Actions / Buttons with icons ----------
  // You can add fields in bib like:
  // pdf=..., code=..., dataset=..., poster=..., slides=..., video=...
  // If a field doesn't exist, button won't show.
    function button(label, href, icon) {
    return `
        <a class="pub-action"
        href="${esc(href)}"
        target="_blank"
        rel="noopener">
        ${icon}
        <span>${esc(label.toUpperCase())}</span>
        </a>
    `;
    }


  const ICONS = {
    pdf: `<i class="fa-regular fa-file-lines"></i>`,
    html: `<i class="fa-solid fa-link"></i>`,
    code: `<i class="fa-solid fa-code"></i>`,
    dataset: `<i class="fa-solid fa-database"></i>`,
    poster: `<i class="fa-regular fa-image"></i>`,
    slides: `<i class="fa-solid fa-chalkboard"></i>`,
    video: `<i class="fa-solid fa-video"></i>`,
    abstract: `<i class="fa-regular fa-file"></i>`,
    cite: `<i class="fa-solid fa-quote-left"></i>`
};


  function buildButtons(entry, bibtexTextForKey) {
    const t = entry.entryTags || {};

    const doi = normalizeDoi(t.doi);
    const url = entryUrl(t);
    const pdf = bestPdfUrl(t);
    const abs = t.abstract || "";

    const code = t.code || "";
    const dataset = t.dataset || "";
    const poster = t.poster || "";
    const slides = t.slides || "";
    const video = t.video || "";

    const buttons = [];

    if (abs) buttons.push(`<button class="pub-action" type="button" data-action="toggle-abs">${ICONS.abstract}<span>Abstract</span></button>`);
    if (pdf) buttons.push(button("PDF", pdf, ICONS.pdf));
    if (url) buttons.push(button(doi ? "DOI" : "HTML", url, ICONS.html));
    if (code) buttons.push(button("Code", code, ICONS.code));
    if (dataset) buttons.push(button("Dataset", dataset, ICONS.dataset));
    if (poster) buttons.push(button("Poster", poster, ICONS.poster));
    if (slides) buttons.push(button("Slides", slides, `<span class="pub-ic" aria-hidden="true">🎞️</span>`));
    if (video) buttons.push(button("Video", video, `<span class="pub-ic" aria-hidden="true">🎥</span>`));

    // Cite button copies BibTeX snippet
    if (bibtexTextForKey) {
      buttons.push(
        `<button class="pub-action" type="button" data-action="copy-bib" data-bibkey="${esc(entry.citationKey)}">
          ${ICONS.cite}<span>Copy citation</span>
        </button>`
      );
    }

    return buttons.join("");
  }

  // Build a citationKey -> BibTeX string map (simple extractor from whole file)
  function buildBibSnippetMap(bibRaw) {
    const map = new Map();
    // crude but effective: split at '@' boundaries
    const blocks = bibRaw.split(/\n@/).map((b, i) => (i === 0 ? b : "@" + b));
    for (const blk of blocks) {
      const m = blk.match(/^@\w+\s*{\s*([^,\s]+)\s*,/m);
      if (!m) continue;
      const key = m[1].trim();
      map.set(key, blk.trim());
    }
    return map;
  }

  // ---------- Sorting ----------
  // Reverse chronological by year, then by title.
  function sortEntries(entries) {
    entries.sort((a, b) => {
      const ya = getYear(a), yb = getYear(b);
      if (ya !== yb) return yb - ya; // desc
      const ta = cleanTitle(a.entryTags?.title || a.citationKey || "");
      const tb = cleanTitle(b.entryTags?.title || b.citationKey || "");
      return ta.localeCompare(tb);
    });
  }

  // ---------- Rendering ----------
  function buildItemHtml(entry, peopleMap, options) {
    const t = entry.entryTags || {};
    const title = cleanTitle(t.title) || entry.citationKey || "Untitled";
    const venue = firstTag(entry, ["journal", "booktitle", "publisher"]);
    const year = getYear(entry);
    const url = entryUrl(t);
    const abs = t.abstract || "";
    const preview = t.preview || ""; // /img/pubs/x.png
    const doi = normalizeDoi(t.doi);

    const authorStr = getTagCI(t, "author") || getTagCI(t, "editor") || "";
    const authors = authorsHtml(authorStr, peopleMap, 10);


    function metricsHtml(doi) {
    if (!doi) return "";
    return `
        <div class="pub-badges">
        <span class="altmetric-embed" data-badge-type="small_rectangle" data-doi="${esc(doi)}"></span>
        <span class="__dimensions_badge_embed__" data-doi="${esc(doi)}" data-style="small_rectangle"></span>
        </div>
    `;
    }


    // If preview-click is link, clicking thumb opens paper; otherwise lightbox
    const previewInner = preview
      ? `<img class="pub-thumb" src="${esc(preview)}" alt="" loading="lazy">`
      : `<div class="pub-thumb pub-thumb--ph" aria-hidden="true"></div>`;

    const thumb = options.previewClick === "link" && url
      ? `<a class="pub-thumbwrap" href="${esc(url)}" target="_blank" rel="noopener">${previewInner}</a>`
      : `<button class="pub-thumbwrap" type="button" data-action="preview" data-preview="${esc(preview)}">${previewInner}</button>`;

    const buttons = buildButtons(entry, options.bibMap?.get(entry.citationKey));

    return `
      <article class="pub-item" data-year="${year || ""}">
        <div class="pub-item__preview">
          ${thumb}
        </div>

        <div class="pub-item__main">
          <div class="pub-item__title">
            ${url
              ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(title)}</a>`
              : `${esc(title)}`}
          </div>

        <div class="pub-item__meta">
        ${authors ? `<span class="pub-item__authors">${authors}</span><br/>` : ""}
        <em class="pub-item__venue">${esc(venue)}</em>${year ? `, ${year}` : ""}
        </div>

          ${buttons ? `<div class="pub-item__actions">${buttons}</div>` : ""}

          ${abs ? `<div class="pub-abs" hidden>${esc(abs)}</div>` : ""}

          ${metricsHtml(doi)}

        </div>
      </article>
    `;
  }

  function render(entries, pubsEl, peopleMap, options) {
    sortEntries(entries);

    // Group by year
    const groups = new Map();
    for (const e of entries) {
      const y = getYear(e) || "Other";
      if (!groups.has(y)) groups.set(y, []);
      groups.get(y).push(e);
    }

    let html = "";
    for (const [year, items] of groups) {
      html += `
        <section class="pub-year" data-year="${year}">
          <div class="pub-year__header">
            <div class="pub-year__rule"></div>
            <div class="pub-year__year">${year}</div>
          </div>
          ${items.map((it) => buildItemHtml(it, peopleMap, options)).join("")}
        </section>
      `;
    }

    pubsEl.innerHTML = html;

    // Lightbox container (if enabled)
    if (options.previewClick === "lightbox") {
      pubsEl.insertAdjacentHTML("beforeend", lightboxHtml());
    }
  }

  // ---------- Filtering: search + year select ----------
  function setupFilters(entries, pubsEl) {
    const searchEl = document.getElementById("pub-search");
    const yearEl = document.getElementById("pub-year");
    if (!searchEl || !yearEl) return;

    // Populate year dropdown
    const years = Array.from(new Set(entries.map(getYear).filter(Boolean))).sort((a, b) => b - a);
    for (const y of years) {
      const opt = document.createElement("option");
      opt.value = String(y);
      opt.textContent = String(y);
      yearEl.appendChild(opt);
    }

    function apply() {
      const q = (searchEl.value || "").trim().toLowerCase();
      const y = (yearEl.value || "").trim();

      // Show/hide individual items
      const items = pubsEl.querySelectorAll(".pub-item");
      items.forEach((it) => {
        const itemYear = it.getAttribute("data-year") || "";
        const text = it.textContent.toLowerCase();
        const okQ = !q || text.includes(q);
        const okY = !y || itemYear === y;
        it.style.display = okQ && okY ? "" : "none";
      });

      // Hide year sections if they have zero visible items
      pubsEl.querySelectorAll(".pub-year").forEach((sec) => {
        const anyVisible = Array.from(sec.querySelectorAll(".pub-item")).some((it) => it.style.display !== "none");
        sec.style.display = anyVisible ? "" : "none";
      });
    }

    searchEl.addEventListener("input", apply);
    yearEl.addEventListener("change", apply);
  }

  // ---------- Interactions ----------
  function setupInteractions(pubsEl, options) {

    pubsEl.addEventListener("click", async (ev) => {
      // Abstract toggle
      const absBtn = ev.target.closest("button[data-action='toggle-abs']");
      if (absBtn) {
        const item = absBtn.closest(".pub-item");
        const abs = item?.querySelector(".pub-abs");
        if (abs) abs.toggleAttribute("hidden");
        return;
      }

      // Copy BibTeX
      const citeBtn = ev.target.closest("button[data-action='copy-bib']");
      if (citeBtn) {
        const key = citeBtn.getAttribute("data-bibkey");
        const bib = key ? options.bibMap?.get(key) : "";
        if (!bib) return;

        try {
          await navigator.clipboard.writeText(bib);
          citeBtn.classList.add("pub-action--ok");
          const old = citeBtn.querySelector("span")?.textContent;
          if (citeBtn.querySelector("span")) citeBtn.querySelector("span").textContent = "Copied!";
          setTimeout(() => {
            citeBtn.classList.remove("pub-action--ok");
            if (citeBtn.querySelector("span")) citeBtn.querySelector("span").textContent = old || "Cite";
          }, 1200);
        } catch {
          // fallback
          const ta = document.createElement("textarea");
          ta.value = bib;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        return;
      }

        const authBtn = ev.target.closest("button[data-action='toggle-authors']");
        if (authBtn) {
        const item = authBtn.closest(".pub-item");
        if (!item) return;

        const open = item.classList.toggle("is-authors-open");
        authBtn.textContent = open ? "show less" : "show all";

        // Also keep hidden attribute in sync (optional but clean)
        const shortEl = item.querySelector(".pub-authors--short");
        const fullEl = item.querySelector(".pub-authors--full");
        if (shortEl && fullEl) {
            if (open) {
            shortEl.setAttribute("hidden", "");
            fullEl.removeAttribute("hidden");
            } else {
            fullEl.setAttribute("hidden", "");
            shortEl.removeAttribute("hidden");
            }
        }
        return;
        }


      // Preview lightbox
      const prevBtn = ev.target.closest("button[data-action='preview']");
      if (prevBtn && options.previewClick === "lightbox") {
        const src = prevBtn.getAttribute("data-preview");
        if (!src) return;

        const lb = pubsEl.querySelector(".pub-lightbox");
        const img = lb?.querySelector(".pub-lightbox__img");
        if (!lb || !img) return;

        img.src = src;
        lb.removeAttribute("hidden");
        return;
      }

      // Close lightbox
      const close = ev.target.closest("[data-action='lb-close']");
      if (close) {
        const lb = pubsEl.querySelector(".pub-lightbox");
        const img = lb?.querySelector(".pub-lightbox__img");
        if (img) img.removeAttribute("src");
        if (lb) lb.setAttribute("hidden", "");
      }
    });

    // Escape closes lightbox
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const lb = pubsEl.querySelector(".pub-lightbox");
      if (!lb || lb.hasAttribute("hidden")) return;
      const img = lb.querySelector(".pub-lightbox__img");
      if (img) img.removeAttribute("src");
      lb.setAttribute("hidden", "");
    });
  }

  // ---------- Load people map ----------
  async function loadPeopleMap(url) {
    if (!url) return {};
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return {};
      const json = await res.json();
      // normalize keys once
      const out = {};
      for (const [k, v] of Object.entries(json)) {
        out[keyify(k)] = v;
      }
      return out;
    } catch {
      return {};
    }
  }

  ready(async () => {
    const statusEl = document.getElementById("pubs-status");
    const pubsEl = document.getElementById("pubs");
    if (!statusEl || !pubsEl) return;

    const status = (msg) => (statusEl.textContent = msg);

    try {
      status("Loading BibTeX…");

      const bibUrl = statusEl.dataset.bib || "/bib/references.bib";
      const peopleUrl = statusEl.dataset.people || "";
      const previewClick = statusEl.dataset.previewClick || "lightbox";

      const [bibRes, peopleMap] = await Promise.all([
        fetch(bibUrl, { cache: "no-store" }),
        loadPeopleMap(peopleUrl)
      ]);

      if (!bibRes.ok) throw new Error(`Could not fetch ${bibUrl} (HTTP ${bibRes.status})`);
      const bibRaw = await bibRes.text();

      if (typeof bibtexParse === "undefined") {
        throw new Error("bibtexParse is undefined (parser script not loaded).");
      }

      const entries = bibtexParse.toJSON(bibRaw);
      const bibMap = buildBibSnippetMap(bibRaw);

      status(`Parsed ${entries.length} entries. Rendering…`);

      const options = { previewClick, bibMap };
      render(entries, pubsEl, peopleMap, options);

      setupFilters(entries, pubsEl);
      setupInteractions(pubsEl, options);

                // Re-scan embeds after dynamic DOM render
            if (window._altmetric && typeof window._altmetric.embed_init === "function") {
            window._altmetric.embed_init();
            }

            // Dimensions badge init: try common globals
            if (window.__dimensions_badge_embed__ && typeof window.__dimensions_badge_embed__.init === "function") {
            window.__dimensions_badge_embed__.init();
            } else if (typeof window.DimensionsBadge !== "undefined" && typeof window.DimensionsBadge.init === "function") {
            window.DimensionsBadge.init();
            }


      statusEl.textContent = "";
    } catch (e) {
      status("❌ Error");
      pubsEl.innerHTML = `<pre style="color:#b00020; white-space:pre-wrap;">${esc(e.message)}</pre>`;
      console.error(e);
    }
  });
})();
