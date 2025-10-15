// ===============================
//  menu.js
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".menu-toggle");
  const sidebar = document.getElementById("mobile-menu");
  if (!btn || !sidebar) return;

  const closeBtn = sidebar.querySelector(".sidebar-close");
  const links = Array.from(sidebar.querySelectorAll("a"));
  const FOCUSABLE_SELECTORS =
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), select, textarea, input[type="text"], input[type="radio"], input[type="checkbox"]';

  let lastFocused = null;

  function getFocusable(container) {
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS)).filter(
      (el) => !el.hasAttribute("inert") && !el.ariaHidden
    );
  }

  function lockScroll() {
    // Evita el layout shift guardando el ancho del scroll
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = scrollBarWidth ? `${scrollBarWidth}px` : "";
  }

  function unlockScroll() {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }

  function openMenu() {
    lastFocused = document.activeElement;

    sidebar.classList.add("active");
    sidebar.setAttribute("aria-hidden", "false");
    sidebar.removeAttribute("inert");
    btn.setAttribute("aria-expanded", "true");

    lockScroll();

    // Foco inicial en primer link o close
    const focusables = getFocusable(sidebar);
    const toFocus = focusables[0] || closeBtn || sidebar;
    toFocus.focus();

    // Esc para cerrar
    document.addEventListener("keydown", onKeydown);
    // Click fuera del panel
    sidebar.addEventListener("click", onOverlayClick);
  }

  function closeMenu() {
    sidebar.classList.remove("active");
    sidebar.setAttribute("aria-hidden", "true");
    sidebar.setAttribute("inert", "");
    btn.setAttribute("aria-expanded", "false");

    unlockScroll();

    document.removeEventListener("keydown", onKeydown);
    sidebar.removeEventListener("click", onOverlayClick);

    // Restaurar foco al botón
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function toggleMenu() {
    const isOpen = sidebar.classList.contains("active");
    isOpen ? closeMenu() : openMenu();
  }

  function onOverlayClick(e) {
    // Si se clickea el backdrop (no el contenido interno), cerrar
    if (e.target === sidebar) {
      closeMenu();
    }
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
      return;
    }
    if (e.key === "Tab") {
      // Trap de foco dentro del sidebar
      const focusables = getFocusable(sidebar);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  // Listeners principales
  btn.addEventListener("click", toggleMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  // Cerrar al hacer click en un link del menú
  links.forEach((a) =>
    a.addEventListener("click", () => {
      // En móviles, cerrar al navegar
      closeMenu();
    })
  );

  // Si cambia el tamaño a desktop, aseguramos que esté cerrado
  const MQ = window.matchMedia("(min-width: 1025px)");
  function onMQChange(e) {
    if (e.matches) {
      closeMenu();
    }
  }
  MQ.addEventListener ? MQ.addEventListener("change", onMQChange) : MQ.addListener(onMQChange);

  // Hardening: si por algún motivo queda aria desincronizado al cargar
  sidebar.setAttribute("aria-hidden", sidebar.classList.contains("active") ? "false" : "true");
  if (!sidebar.classList.contains("active")) {
    sidebar.setAttribute("inert", "");
  } else {
    sidebar.removeAttribute("inert");
  }
  btn.setAttribute("aria-expanded", sidebar.classList.contains("active") ? "true" : "false");
});
