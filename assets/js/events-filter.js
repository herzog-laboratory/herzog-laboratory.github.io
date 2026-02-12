function initEventFilters() {
  const list = document.getElementById("eventsList");
  if (!list) return;

  // Avoid double-binding when hb:page:loaded fires
  if (list.dataset.filtersInit === "1") return;
  list.dataset.filtersInit = "1";

  const rows = [...document.querySelectorAll(".event-row")];
  const search = document.getElementById("eventSearch");
  const typeSel = document.getElementById("typeSelect");
  const roleSel = document.getElementById("roleSelect");
  const authorSel = document.getElementById("authorSelect");

function apply() {
  const q = (search?.value || "").trim().toLowerCase();
  const type = (typeSel?.value || "*").toLowerCase();
  const role = (roleSel?.value || "*").toLowerCase();
  const author = (authorSel?.value || "*").toLowerCase();

  rows.forEach((row) => {
    const rowType = (row.dataset.type || "").toLowerCase();
    const rowRole = (row.dataset.role || "").toLowerCase();
    const authors = (row.dataset.authors || "")
      .split(/\s+/)
      .filter(Boolean)
      .map((s) => s.toLowerCase());

    const hay = (row.dataset.hay || "").toLowerCase();

    const typeOk = (type === "*") || (rowType === type);
    const roleOk = (role === "*") || (rowRole === role);
    const authorOk = (author === "*") || authors.includes(author);
    const qOk = !q || hay.includes(q);

    row.style.display = (typeOk && roleOk && authorOk && qOk) ? "" : "none";
  });
}

  search?.addEventListener("input", apply);
  authorSel?.addEventListener("change", apply);
  typeSel?.addEventListener("change", apply);
  roleSel?.addEventListener("change", apply);


  apply();
}

document.addEventListener("DOMContentLoaded", initEventFilters);
document.addEventListener("hb:page:loaded", initEventFilters);