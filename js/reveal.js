// ===============================
//  reveal.js
//  Animaciones de entrada con IntersectionObserver
//  - Usa [data-reveal] y/o .reveal
//  - Respeta prefers-reduced-motion
//  - Evita jank y re-observa en cambios del DOM
// ===============================

(function () {
  const SELECTOR = '[data-reveal], .reveal';
  const VISIBLE_CLASS = 'visible';
  const BODY_CLASS = 'reveal-enabled';

  // Si el usuario prefiere menos animación: mostrar todo sin transiciones
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $$all(root = document) {
    return Array.from(root.querySelectorAll(SELECTOR));
  }

  function showAll(elements) {
    elements.forEach((el) => el.classList.add(VISIBLE_CLASS));
  }

  // Crea el observer con una configuración razonable
  function createObserver() {
    const opts = {
      root: null,
      // Empezá a revelar un poco antes de que el elemento entre a viewport
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15,
    };

    const io = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target;

          // Soporta delay opcional via atributo (ej: data-reveal-delay="160")
          const delay = el.getAttribute('data-reveal-delay');
          if (delay) {
            // No usamos setTimeout para no bloquear hover; dejamos que CSS maneje la transición con la var
            // Esta línea permite que el CSS tome la variable si querés usar --reveal-delay personalizada
            el.style.setProperty('--reveal-delay', `${parseInt(delay, 10)}ms`);
          }

          el.classList.add(VISIBLE_CLASS);
          observer.unobserve(el);
        }
      }
    }, opts);

    return io;
  }

  // Observa todos los elementos que aún no son visibles
  function observeAll(io) {
    $$all().forEach((el) => {
      if (!el.classList.contains(VISIBLE_CLASS)) {
        io.observe(el);
      }
    });
  }

  // API pública para refrescar (ej: después de inyectar contenido)
  const API = {
    refresh() {
      if (reduceMotion) {
        showAll($$all());
        return;
      }
      if (!API._io) API._io = createObserver();
      observeAll(API._io);
    },
  };

  // Inicialización
  function init() {
    document.body.classList.add(BODY_CLASS);

    const elements = $$all();

    if (reduceMotion) {
      showAll(elements);
      window.RevealAnimations = API;
      return;
    }

    API._io = createObserver();
    observeAll(API._io);

    // Re-observar en pageshow (bfcache)
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) API.refresh();
    });

    // Re-observar si cambian tamaños (con rAF para evitar spam)
    let resizeRAF = null;
    window.addEventListener('resize', () => {
      if (resizeRAF) cancelAnimationFrame(resizeRAF);
      resizeRAF = requestAnimationFrame(() => API.refresh());
    });

    // Re-observar en mutaciones importantes del DOM (bajo costo)
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList' && (m.addedNodes && m.addedNodes.length)) {
          // Si se agrega contenido que pueda tener data-reveal, re-scan
          API.refresh();
          break;
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // Exponer API global
  window.RevealAnimations = API;
})();
