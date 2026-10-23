const body = document.body;
const filterButtons = [...document.querySelectorAll(".filter-btn")];
const cards = [...document.querySelectorAll(".resource-card")];
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const toast = document.getElementById("toast");
let activeFilter = "todos";
let toastTimer;

document.getElementById("year").textContent = new Date().getFullYear();

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function updateResources() {
  const term = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  let visible = 0;
  cards.forEach(card => {
    const matchesCategory = activeFilter === "todos" || card.dataset.category === activeFilter;
    const matchesSearch = !term || (card.dataset.search + " " + card.innerText).toLocaleLowerCase("pt-BR").includes(term);
    const show = matchesCategory && matchesSearch;
    card.hidden = !show;
    if (show) visible++;
  });
  resultCount.textContent = `${visible} ${visible === 1 ? "recurso encontrado" : "recursos encontrados"}`;
  emptyState.hidden = visible !== 0;
  document.querySelector(".results-heading h2").textContent = activeFilter === "todos" ? "Todos os recursos" : `Recursos: ${filterButtons.find(b => b.dataset.filter === activeFilter).textContent.replace(/^[^A-Za-zÀ-ÿ]+/, "")}`;
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    updateResources();
  });
});
searchInput.addEventListener("input", updateResources);

document.querySelectorAll("[data-font]").forEach(button => {
  button.addEventListener("click", () => {
    body.style.setProperty("--font-scale", button.dataset.font);
    showToast(button.dataset.font === "1" ? "Tamanho de texto normal." : "Tamanho do texto ajustado.");
  });
});
document.getElementById("contrastBtn").addEventListener("click", () => {
  body.classList.toggle("high-contrast");
  showToast(body.classList.contains("high-contrast") ? "Alto contraste ativado." : "Alto contraste desativado.");
});
document.getElementById("darkBtn").addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  showToast(body.classList.contains("dark-mode") ? "Modo escuro ativado." : "Modo escuro desativado.");
});
document.getElementById("focusBtn").addEventListener("click", () => {
  body.classList.toggle("focus-mode");
  showToast(body.classList.contains("focus-mode") ? "Destaque de foco ativado." : "Destaque de foco desativado.");
});
document.getElementById("dyslexiaBtn").addEventListener("click", () => {
  body.classList.toggle("dyslexia-mode");
  showToast(body.classList.contains("dyslexia-mode") ? "Fonte e espaçamento de leitura ajustados." : "Visual de leitura normal restaurado.");
});
document.getElementById("readBtn").addEventListener("click", () => {
  if (!("speechSynthesis" in window)) {
    showToast("Seu navegador não oferece leitura em voz alta.");
    return;
  }
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    showToast("Leitura interrompida.");
    return;
  }
  const text = document.querySelector("main").innerText;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  utterance.rate = 0.95;
  utterance.onend = () => showToast("Leitura concluída.");
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  showToast("Lendo o conteúdo da página...");
});
document.getElementById("resetBtn").addEventListener("click", () => {
  body.classList.remove("high-contrast", "dark-mode", "focus-mode", "dyslexia-mode");
  body.style.removeProperty("--font-scale");
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  showToast("Configurações de acessibilidade restauradas.");
});

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "✕" : "☰";
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

// Fecha o menu responsivo se a tela voltar ao tamanho de desktop.
window.addEventListener("resize", () => {
  if (window.innerWidth > 800) {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  }
});
