// ===============================
//  lang.js — i18n con soporte de texto, HTML y atributos
//  - EN fallback
//  - localStorage ("lang")
//  - <html lang> + #lang-switcher
//  - data-i18n (textContent)
//  - data-i18n-html (innerHTML)
//  - data-i18n-attr (atributos: title, aria-label, placeholder, etc.)
//      * Formato 1 (lista + claves por-atributo):
//          data-i18n-attr="title,aria-label"
//          data-i18n-attr-title="hero.download"
//          data-i18n-attr-aria-label="nav.home"
//      * Formato 2 (mapeo inline):
//          data-i18n-attr="title: hero.download, aria-label: nav.home"
//      * Si falta una clave por atributo -> usa data-i18n (texto) como fallback
// ===============================

(function () {
  const STORAGE_KEY = "lang";
  const DEFAULT_LANG = "en";
  const SUPPORTED = ["en", "es", "pt"];

  // -------------------------------
  // Diccionario
  // -------------------------------
const dict = {
  en: {
    // nav
    "nav.home": "Home",
    "nav.works": "Works",
    "nav.projects": "Projects",
    "nav.skills": "Skills",
    "nav.goals": "Next",
    "nav.hobbies": "Hobbies",

    // hero
    "hero.subtitle": "Frontend Developer",
    "hero.download": "Download CV",

    // works
    "works.item1": "Professional and adaptable web design.",
    "works.item2": "Interface development focused on UX/UI.",
    "works.item3": "Creative projects with modern technologies.",

    // projects
    "projects.item1": "Experimental React-based project.",
    "projects.item2": "API and microservice integration.",
    "projects.item3": "Adaptive and mobile-optimized design.",

    // skills
    "skills.title": "My Skills",
    "skills.html": "Semantic HTML5",
    "skills.css": "CSS3 / Flexbox / Grid",
    "skills.responsive": "Responsive Design",
    "skills.js": "JavaScript (ES6+)",
    "skills.dom": "DOM Manipulation",
    "skills.rest": "Fetch / REST APIs",
    "skills.json": "JSON",
    "skills.a11y": "Accessibility (A11y / WCAG)",
    "skills.seo": "Technical SEO (basics)",
    "skills.react": "React.js (Hooks, Context)",
    "skills.next": "Next.js (SSR / SSG)",
    "skills.tailwind": "Tailwind CSS",
    "skills.design": "Figma / XD / Photoshop",
    "skills.git": "Git / GitHub",
    "skills.tools": "Tooling (Vite, ESLint, etc.)",
    "skills.pm": "Jira / Notion / Trello",

    // goals
    "goals.title": "Next Goals",
    "goals.docker": "Docker",
    "goals.cicd": "CI/CD (GitHub Actions / Vercel / Netlify)",
    "goals.testing": "Testing (Jest / RTL / Cypress / Playwright)",
    "goals.micro": "Microfrontends",
    "goals.english": "Intermediate / advanced English",
    "goals.motion": "Motion Design",
    "goals.ts": "TypeScript",

    // hobbies
    "hobbies.title": "My Hobbies",
    "hobbies.code": "Personal coding projects",
    "hobbies.design": "Digital design",
    "hobbies.video": "Video editing",
    "hobbies.photo": "Photography & editing",
    "hobbies.dj": "DJ (Virtual DJ)",
    "hobbies.art": "Digital art",
    "hobbies.cook": "Creative cooking",
    "hobbies.bake": "Baking",
    "hobbies.gym": "Gym",
    "hobbies.travel": "Travel & new cultures",
    "hobbies.gaming": "Gaming",
    "hobbies.cinema": "Movies/series/visual analysis",
    "hobbies.learn": "Continuous learning",
    "hobbies.detective": "Solving criminal cases",
  },

  es: {
    // nav
    "nav.home": "Inicio",
    "nav.works": "Trabajos",
    "nav.projects": "Proyectos",
    "nav.skills": "Habilidades",
    "nav.goals": "Próximamente",
    "nav.hobbies": "Hobbies",

    // hero
    "hero.subtitle": "Frontend Developer",
    "hero.download": "Descargar CV",

    // works
    "works.item1": "Diseño web profesional y adaptable.",
    "works.item2": "Desarrollo de interfaces con foco en UX/UI.",
    "works.item3": "Proyectos creativos con tecnologías modernas.",

    // projects
    "projects.item1": "Proyecto experimental con React.",
    "projects.item2": "Integración de APIs y microservicios.",
    "projects.item3": "Diseño adaptable y optimizado para móviles.",

    // skills
    "skills.title": "Mis Habilidades",
    "skills.html": "HTML5 semántico",
    "skills.css": "CSS3 / Flexbox / Grid",
    "skills.responsive": "Responsive Design",
    "skills.js": "JavaScript (ES6+)",
    "skills.dom": "Manipulación del DOM",
    "skills.rest": "Fetch / APIs REST",
    "skills.json": "JSON",
    "skills.a11y": "Accesibilidad (A11y / WCAG)",
    "skills.seo": "SEO técnico (básico)",
    "skills.react": "React.js (Hooks, Context)",
    "skills.next": "Next.js (SSR / SSG)",
    "skills.tailwind": "Tailwind CSS",
    "skills.design": "Figma / XD / Photoshop",
    "skills.git": "Git / GitHub",
    "skills.tools": "Tooling (Vite, ESLint, etc.)",
    "skills.pm": "Jira / Notion / Trello",

    // goals
    "goals.title": "Próximos Objetivos",
    "goals.docker": "Docker",
    "goals.cicd": "CI/CD (GitHub Actions / Vercel / Netlify)",
    "goals.testing": "Testing (Jest / RTL / Cypress / Playwright)",
    "goals.micro": "Microfrontends",
    "goals.english": "Inglés intermedio / avanzado",
    "goals.motion": "Motion Design",
    "goals.ts": "TypeScript",

    // hobbies
    "hobbies.title": "Mis Hobbies",
    "hobbies.code": "Programar proyectos personales",
    "hobbies.design": "Diseño digital",
    "hobbies.video": "Edición de video",
    "hobbies.photo": "Fotografía y edición",
    "hobbies.dj": "DJ (Virtual DJ)",
    "hobbies.art": "Arte digital",
    "hobbies.cook": "Cocina creativa",
    "hobbies.bake": "Repostería",
    "hobbies.gym": "GYM",
    "hobbies.travel": "Viajar y descubrir culturas",
    "hobbies.gaming": "Gaming",
    "hobbies.cinema": "Cine / series / análisis visual",
    "hobbies.learn": "Aprendizaje continuo",
    "hobbies.detective": "Resolver casos criminales",
  },

  pt: {
    // nav
    "nav.home": "Início",
    "nav.works": "Trabalhos",
    "nav.projects": "Projetos",
    "nav.skills": "Habilidades",
    "nav.goals": "Próximos",
    "nav.hobbies": "Hobbies",

    // hero
    "hero.subtitle": "Desenvolvedor Frontend",
    "hero.download": "Baixar CV",

    // works
    "works.item1": "Design web profissional e adaptável.",
    "works.item2": "Desenvolvimento de interfaces focado em UX/UI.",
    "works.item3": "Projetos criativos com tecnologias modernas.",

    // projects
    "projects.item1": "Projeto experimental com React.",
    "projects.item2": "Integração de APIs e microsserviços.",
    "projects.item3": "Design adaptativo e otimizado para mobile.",

    // skills
    "skills.title": "Minhas Habilidades",
    "skills.html": "HTML5 semântico",
    "skills.css": "CSS3 / Flexbox / Grid",
    "skills.responsive": "Design Responsivo",
    "skills.js": "JavaScript (ES6+)",
    "skills.dom": "Manipulação do DOM",
    "skills.rest": "Fetch / APIs REST",
    "skills.json": "JSON",
    "skills.a11y": "Acessibilidade (A11y / WCAG)",
    "skills.seo": "SEO técnico (básico)",
    "skills.react": "React.js (Hooks, Context)",
    "skills.next": "Next.js (SSR / SSG)",
    "skills.tailwind": "Tailwind CSS",
    "skills.design": "Figma / XD / Photoshop",
    "skills.git": "Git / GitHub",
    "skills.tools": "Tooling (Vite, ESLint, etc.)",
    "skills.pm": "Jira / Notion / Trello",

    // goals
    "goals.title": "Próximas Metas",
    "goals.docker": "Docker",
    "goals.cicd": "CI/CD (GitHub Actions / Vercel / Netlify)",
    "goals.testing": "Testes (Jest / RTL / Cypress / Playwright)",
    "goals.micro": "Microfrontends",
    "goals.english": "Inglês intermediário / avançado",
    "goals.motion": "Motion Design",
    "goals.ts": "TypeScript",


    // hobbies
    "hobbies.title": "Meus Hobbies",
    "hobbies.code": "Projetos pessoais de código",
    "hobbies.design": "Design digital",
    "hobbies.video": "Edição de vídeo",
    "hobbies.photo": "Fotografia e edição",
    "hobbies.dj": "DJ (Virtual DJ)",
    "hobbies.art": "Arte digital",
    "hobbies.cook": "Culinária criativa",
    "hobbies.bake": "Confeitaria",
    "hobbies.gym": "Academia",
    "hobbies.travel": "Viajar e novas culturas",
    "hobbies.gaming": "Games",
    "hobbies.cinema": "Cinema/séries/análise visual",
    "hobbies.learn": "Aprendizado contínuo",
    "hobbies.detective": "Resolver casos criminais",
  },
};


  // -------------------------------
  // Helpers
  // -------------------------------
  function normalizeLang(code) {
    if (!code) return DEFAULT_LANG;
    const short = code.toLowerCase().slice(0, 2);
    return SUPPORTED.includes(short) ? short : DEFAULT_LANG;
  }

  function t(lang, key) {
    const base = dict[DEFAULT_LANG] || {};
    const pack = dict[lang] || base;
    return (pack && pack[key]) || base[key] || "";
  }

  // Parseador flexible para data-i18n-attr
  // Soporta:
  //  - "title,aria-label,placeholder"
  //  - "title: hero.download, aria-label: nav.home"
  function parseAttrSpec(spec) {
    if (!spec) return [];
    if (spec.includes(":")) {
      // Mapeo inline
      return spec.split(",").map((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        return { attr, key };
      }).filter(x => x.attr);
    }
    // Lista simple
    return spec.split(",").map((a) => ({ attr: a.trim() })).filter(x => x.attr);
  }

  // Aplica traducciones a un nodo concreto
  function applyToNode(lang, el) {
    // 1) Texto plano
    const key = el.getAttribute("data-i18n");
    if (key) {
      el.textContent = t(lang, key);
    }

    // 2) HTML (cuando necesites tags internas)
    const htmlKey = el.getAttribute("data-i18n-html");
    if (htmlKey) {
      el.innerHTML = t(lang, htmlKey);
    }

    // 3) Atributos
    const attrSpec = el.getAttribute("data-i18n-attr");
    if (attrSpec) {
      const pairs = parseAttrSpec(attrSpec);
      if (pairs.length) {
        pairs.forEach(({ attr, key }) => {
          // si no viene mapeo inline, buscá clave en data-i18n-attr-<attr> o cae a data-i18n
          const explicitKey =
            key ||
            el.getAttribute(`data-i18n-attr-${attr}`) ||
            el.getAttribute("data-i18n");

        const value = explicitKey ? t(lang, explicitKey) : "";
          if (value) el.setAttribute(attr, value);
        });
      }
    }
  }

  // Aplica a todos los nodos marcados
  function apply(langCode) {
    const lang = normalizeLang(langCode);
    const all = document.querySelectorAll("[data-i18n], [data-i18n-html], [data-i18n-attr]");
    all.forEach((el) => applyToNode(lang, el));
  }

  // Set global
  function setLang(code, opts = { persist: true }) {
    const lang = normalizeLang(code);

    // Traducciones
    apply(lang);

    // <html lang="">
    document.documentElement.setAttribute("lang", lang);

    // <select>
    const select = document.getElementById("lang-switcher");
    if (select && select.value !== lang) {
      select.value = lang;
    }

    // Persistencia
    if (opts.persist) localStorage.setItem(STORAGE_KEY, lang);
  }

  // Init
  function initLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const htmlLang = document.documentElement.getAttribute("lang");
    const navLang = (navigator.language || "").toLowerCase();
    const initial = normalizeLang(saved || htmlLang || navLang || DEFAULT_LANG);
    setLang(initial, { persist: !saved }); // si ya estaba en storage, no reescribas
  }

  function bindUI() {
    const select = document.getElementById("lang-switcher");
    if (select) {
      select.addEventListener("change", (e) => {
        setLang(e.target.value, { persist: true });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initLang();
      bindUI();
    });
  } else {
    initLang();
    bindUI();
  }

  // API pública
  window.$i18n = {
    set: (lang) => setLang(lang, { persist: true }),
    get: () =>
      localStorage.getItem(STORAGE_KEY) ||
      document.documentElement.getAttribute("lang") ||
      DEFAULT_LANG,
    apply: () => apply(window.$i18n.get()),
  };
})();
