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

  // ---------- Author matching ----------
  // Normalize a name for comparison: lowercase, strip LaTeX/braces/punctuation.
  function keyify(s) {
    return (s || "")
      .toLowerCase()
      .replace(/[{}]/g, "")
      .replace(/~/g, " ")
      .replace(/\\[a-zA-Z]+/g, "")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Split "Last, First" or "First Last" into normalized { last, first }.
  function splitName(raw) {
    const a = (raw || "").trim();
    let last = "", given = "";
    if (a.includes(",")) {
      const parts = a.split(",");
      last = parts[0];
      given = parts.slice(1).join(",");
    } else {
      const toks = a.split(/\s+/).filter(Boolean);
      last = toks.pop() || "";
      given = toks.join(" ");
    }
    const lastClean = keyify(last);
    const givenClean = keyify(given);
    return { last: lastClean, first: (givenClean.split(" ")[0] || "") };
  }

  // Candidate people.json keys for a bib author, e.g. "chiara herzog" / "herzog chiara".
  function peopleKeys(raw) {
    const { last, first } = splitName(raw);
    return [`${first} ${last}`.trim(), `${last} ${first}`.trim(), last];
  }

  function parseAuthors(authorStr) {
    return (authorStr || "")
      .split(/\s+and\s+/i)
      .map(s => s.trim())
      .filter(Boolean);
  }

  // An entry matches when any of its authors either maps to this author page in
  // people.json, or matches one of the given name spellings (surname + first initial).
  function entryHasAuthor(entry, authorUrl, names, people) {
    const authors = parseAuthors(entry?.entryTags?.author);
    if (!authors.length) return false;

    return authors.some(a => {
      if (authorUrl && people) {
        for (const k of peopleKeys(a)) {
          const href = people[k];
          if (href && normalizeUrl(href) === normalizeUrl(authorUrl)) return true;
        }
      }
      const bib = splitName(a);
      if (!bib.last) return false;
      return names.some(n => {
        if (n.last !== bib.last) return false;
        if (!n.first || !bib.first) return true;
        return n.first[0] === bib.first[0];
      });
    });
  }

  function normalizeUrl(u) {
    return (u || "").trim().replace(/\/+$/, "").toLowerCase();
  }

  const peopleCache = new Map();
  async function loadPeopleMap(url) {
    if (!url) return null;
    if (peopleCache.has(url)) return peopleCache.get(url);
    const p = fetch(url)
      .then(r => (r.ok ? r.json() : null))
      .then(raw => {
        if (!raw) return null;
        // Re-key so lookups are insensitive to spacing/punctuation/case.
        const map = {};
        for (const [k, v] of Object.entries(raw)) map[keyify(k)] = v;
        return map;
      })
      .catch(() => null);
    peopleCache.set(url, p);
    return p;
  }

  // ---------- Shared renderer / third-party loaders ----------
  function loadScript(src, attrs) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement("script");
      s.src = src;
      Object.assign(s, attrs || {});
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // pubs-bib.js owns the full item layout (linked authors, action buttons,
  // abstract, DOI + metric badges). Load it so embeds render the same markup.
  async function ensureRenderer() {
    if (window.PubsBib) return window.PubsBib;
    try {
      await loadScript("/js/pubs-bib.js");
    } catch {
      return null;
    }
    return window.PubsBib || null;
  }

  // Altmetric / Dimensions badges, only pulled in when something has a DOI.
  let badgesRequested = false;
  function ensureBadgeScripts() {
    if (badgesRequested) return;
    badgesRequested = true;
    loadScript("https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js", { async: true }).catch(() => {});
    loadScript("https://badge.dimensions.ai/badge.js", { async: true }).catch(() => {});
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
      const PubsBib = await ensureRenderer();
      if (PubsBib) {
        PubsBib.sortEntries(entries);
      } else {
        sortEntries(entries);
      }

      // Citation key -> raw BibTeX, so the "Copy citation" button works here too.
      const bibMap = PubsBib ? PubsBib.buildBibSnippetMap(raw) : null;
      const byKey = new Map(entries.map(e => [e.citationKey, e]));

      for (const n of bibNodes) {
        const key = (n.getAttribute("data-key") || "").trim();
        const keys = (n.getAttribute("data-keys") || "")
          .split(",").map(s => s.trim()).filter(Boolean);
        const latest = parseInt(n.getAttribute("data-latest") || "0", 10);
        const authorUrl = (n.getAttribute("data-author-url") || "").trim();
        // `;`-separated so "Last, First" spellings survive.
        const authorNames = (n.getAttribute("data-author-names") || "")
          .split(";").map(s => s.trim()).filter(Boolean).map(splitName);

        let chosen = [];

        if (key) {
          const e = byKey.get(key);
          if (e) chosen = [e];
        } else if (keys.length) {
          chosen = keys.map(k => byKey.get(k)).filter(Boolean);
        } else if (authorUrl || authorNames.length) {
          // Only this person's publications, newest first.
          const people = await loadPeopleMap(n.getAttribute("data-people"));
          chosen = entries.filter(e => entryHasAuthor(e, authorUrl, authorNames, people));
          if (latest > 0) chosen = chosen.slice(0, latest);
        } else if (latest > 0) {
          chosen = entries.slice(0, latest);
        }

        if (!chosen.length) {
          // Nothing to show: drop the whole section rather than leave an empty
          // heading (the person may simply not have published with the lab yet).
          const section = n.closest && n.closest("[data-pubs-section]");
          if (section) {
            section.hidden = true;
            section.style.display = "none";
          } else {
            n.innerHTML = `<em>Publication not found.</em>`;
          }
        } else if (PubsBib) {
          // Same layout as the full publications page.
          const people = await loadPeopleMap(n.getAttribute("data-people") || "/bib/people.json");
          const options = { previewClick: "lightbox", bibMap };
          n.innerHTML = chosen
            .map(e => PubsBib.buildItemHtml(e, people || {}, options))
            .join("") + PubsBib.lightboxHtml();
          PubsBib.setupInteractions(n, options);
          if (chosen.some(e => e?.entryTags?.doi)) {
            ensureBadgeScripts();
            // The badge scripts scan on load; re-scan once they are in.
            setTimeout(() => PubsBib.initBadges(), 1200);
          }
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
