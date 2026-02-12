(function () {
  function esc(s) {
    return (s || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function cleanTitle(s) {
    return (s || "").replace(/^\s*[{]+/, "").replace(/[}]+\s*$/, "").replace(/[{}]/g, "");
  }

  function normalizeDoi(doi) {
    return (doi || "")
      .trim()
      .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
      .replace(/^doi:\s*/i, "");
  }

  function entryUrl(t) {
    const doi = normalizeDoi(t?.doi);
    if (t?.url) return t.url;
    if (doi) return `https://doi.org/${doi}`;
    return "";
  }

  function getYear(e) {
    const y = e?.entryTags?.year;
    const n = y ? parseInt(String(y), 10) : 0;
    return Number.isFinite(n) ? n : 0;
  }

  function sortEntries(entries) {
    entries.sort((a, b) => getYear(b) - getYear(a));
  }

  // Reuse your formatting idea but keep embed lightweight
  function formatAuthorsShort(authorStr, max = 3) {
    const parts = (authorStr || "").split(/\s+and\s+/i).map(s => s.trim()).filter(Boolean);
    if (!parts.length) return "";
    const short = parts.slice(0, max).map(a => {
      // "Last, First" => "Last F"
      if (a.includes(",")) {
        const [last, givenRaw] = a.split(",", 2);
        const given = (givenRaw || "").trim();
        const initials = given
          .split(/[\s\-]+/).filter(Boolean)
          .map(w => w.replace(/[^A-Za-z]/g, "")).filter(Boolean)
          .map(w => w[0].toUpperCase()).join("");
        return `${last.trim()} ${initials}`.trim();
      }
      // fallback: "First Last"
      const toks = a.split(/\s+/).filter(Boolean);
      const last = toks.pop() || "";
      const given = toks.join(" ");
      const initials = given
        .split(/[\s\-]+/).filter(Boolean)
        .map(w => w.replace(/[^A-Za-z]/g, "")).filter(Boolean)
        .map(w => w[0].toUpperCase()).join("");
      return `${last} ${initials}`.trim();
    });

    const more = parts.length > max ? `, et al.` : "";
    return short.join(", ") + more;
  }

  async function ensureBibtexParser() {
    if (typeof bibtexParse !== "undefined") return;
    // If you already load bibtexParse on every page, you can delete this whole function.
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/bibtex-parse-js@0.0.24/bibtexParse.min.js";
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function renderCard(e) {
  const t = e.entryTags || {};
  const title = cleanTitle(t.title) || e.citationKey || "Untitled";
  const url = entryUrl(t);
  const venue = t.journal || t.booktitle || t.publisher || "";
  const year = getYear(e);
  const authors = formatAuthorsShort(t.author || "");

  // Thumbnail: use BibTeX field `preview = "/img/pubs/xyz.png"` if present
  const preview = t.preview || "";

  const previewInner = preview
    ? `<img class="pub-embed-thumb" src="${esc(preview)}" alt="" loading="lazy">`
    : `<div class="pub-embed-thumb pub-embed-thumb--ph" aria-hidden="true"></div>`;

  // Click thumb -> link to paper if URL exists, otherwise no-op button
  const thumb = url
    ? `<a class="pub-embed-thumbwrap" href="${esc(url)}" target="_blank" rel="noopener">${previewInner}</a>`
    : `<span class="pub-embed-thumbwrap">${previewInner}</span>`;

  return `
    <article class="pub-item">
      <div class="pub-left">
        ${thumb}
      </div>
      <div class="pub-right">
        <div class="pub-title">
          ${url
            ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(title)}</a>`
            : esc(title)}
        </div>
        <div class="pub-meta">
          ${authors ? `${esc(authors)} · ` : ""}${esc(venue)}${year ? `, ${year}` : ""}
        </div>
      </div>
    </article>
  `;
}

  async function main() {
    const nodes = document.querySelectorAll(".pub-embed");
    if (!nodes.length) return;

    await ensureBibtexParser();

    // Group by bib URL so we only fetch once
    const byBib = new Map();
    nodes.forEach(n => {
      const bib = (n.getAttribute("data-bib") || "/bib/references.bib").trim();
      if (!byBib.has(bib)) byBib.set(bib, []);
      byBib.get(bib).push(n);
    });

    for (const [bibUrl, bibNodes] of byBib.entries()) {
      let raw = "";
      try {
        const res = await fetch(bibUrl, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        raw = await res.text();
      } catch (e) {
        bibNodes.forEach(n => n.innerHTML = `<em>Could not load publications.</em>`);
        continue;
      }

      const entries = bibtexParse.toJSON(raw);
      sortEntries(entries);

      const byKey = new Map(entries.map(e => [e.citationKey, e]));

      for (const n of bibNodes) {
        const key = (n.getAttribute("data-key") || "").trim();
        const keys = (n.getAttribute("data-keys") || "")
          .split(",").map(s => s.trim()).filter(Boolean);
        const latest = parseInt(n.getAttribute("data-latest") || "0", 10);

        let chosen = [];

        if (key) {
          const e = byKey.get(key);
          if (e) chosen = [e];
        } else if (keys.length) {
          chosen = keys.map(k => byKey.get(k)).filter(Boolean);
        } else if (latest > 0) {
          chosen = entries.slice(0, latest);
        }

        if (!chosen.length) {
          n.innerHTML = `<em>Publication not found.</em>`;
        } else {
          n.innerHTML = chosen.map(renderCard).join("");
        }
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main, { once: true });
  } else {
    console.log("pubs-embed.js loaded ✅", document.querySelectorAll(".pub-embed").length);
    main();
  }
})();
