// /js/theme.js
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");

  if (!toggle) return; // si falta el botón, salir silenciosamente

  // Dibuja el icono sin depender de <i>, usando el bundle de Lucide
  function renderIcon(name) {
    const fallback = name === "sun" ? "☀️" : "🌙";
    try {
      if (window.lucide && window.lucide.icons && window.lucide.icons[name]) {
        toggle.innerHTML = window.lucide.icons[name].toSvg({ width: 22, height: 22 });
      } else {
        toggle.textContent = fallback;
      }
    } catch {
      toggle.textContent = fallback;
    }
  }

  function getInitialTheme() {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {}
    const fromAttr = root.getAttribute("data-theme");
    if (fromAttr === "light" || fromAttr === "dark") return fromAttr;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function applyTheme(theme) {
    const safe = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", safe);
    try {
      localStorage.setItem("theme", safe);
    } catch {}
    // aria-pressed = true cuando está en modo claro
    toggle.setAttribute("aria-pressed", safe === "light" ? "true" : "false");
    // icono: sol para dark (para indicar que podés ir a light), luna para light
    renderIcon(safe === "dark" ? "sun" : "moon");
  }

  // Estado inicial
  applyTheme(getInitialTheme());

  // Toggle
  toggle.addEventListener("click", () => {
    const cur = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = cur === "light" ? "dark" : "light";
    applyTheme(next);
  });
});
