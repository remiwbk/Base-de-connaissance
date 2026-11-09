// Liste + visionneur PDF + équipe
const listEl   = document.getElementById("pdf-list");
const emptyEl  = document.getElementById("empty");
const searchEl = document.getElementById("search");
const bodyEl   = document.getElementById("viewer-body");
const titleEl  = document.getElementById("viewer-title");
const btnOpen  = document.getElementById("btn-open");
const btnDl    = document.getElementById("btn-download");
const btnFull  = document.getElementById("btn-full");
const viewerEl = document.querySelector(".viewer");

function renderList(filter = "") {
  const q = filter.trim().toLowerCase();
  const items = PDFS.filter(p =>
    (p.titre + " " + (p.auteur || "")).toLowerCase().includes(q)
  );

  listEl.innerHTML = "";
  emptyEl.hidden = items.length > 0;

  items.forEach(p => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.innerHTML = `<span></span><small></small>`;
    btn.children[0].textContent = "📄 " + p.titre;
    btn.children[1].textContent = [p.auteur, p.date].filter(Boolean).join(" · ");
    btn.addEventListener("click", () => openPdf(p, btn));
    li.appendChild(btn);
    listEl.appendChild(li);
  });
}

function openPdf(p, btn) {
  document.querySelectorAll("#pdf-list button").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  titleEl.textContent = p.titre;
  bodyEl.innerHTML = "";

  const frame = document.createElement("iframe");
  frame.src = encodeURI(p.fichier) + "#view=FitH";
  frame.title = p.titre;
  bodyEl.appendChild(frame);

  btnOpen.href = btnDl.href = encodeURI(p.fichier);
  btnOpen.hidden = btnDl.hidden = btnFull.hidden = false;

  history.replaceState(null, "", "#documents");
}

btnFull.addEventListener("click", () => {
  if (viewerEl.requestFullscreen) viewerEl.requestFullscreen();
});

searchEl.addEventListener("input", e => renderList(e.target.value));

// Équipe
const teamEl = document.getElementById("team");
EQUIPE.forEach(m => {
  const d = document.createElement("div");
  d.className = "member";
  d.innerHTML = `<div class="avatar"></div><h3></h3><p></p><a target="_blank" rel="noopener"></a>`;
  d.querySelector(".avatar").textContent = m.nom.charAt(0).toUpperCase();
  d.querySelector("h3").textContent = m.nom;
  d.querySelector("p").textContent = m.role;
  const a = d.querySelector("a");
  a.href = "https://github.com/" + m.github;
  a.textContent = "@" + m.github;
  teamEl.appendChild(d);
});

renderList();
if (PDFS.length) openPdf(PDFS[0], listEl.querySelector("button"));
