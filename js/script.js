/* =====================================================================
   Portafolio · Lia Maluenda
   Interactividad: tema claro/oscuro, menú móvil, sección activa,
   copiar email y validación del formulario de contacto.
   ===================================================================== */

/* ---------- 1. Tema (aplica el tema guardado o el del sistema) ---------- */
(function initTheme() {
  const root = document.documentElement;
  const STORAGE_KEY = "lm-theme";

  // Marca que JavaScript está activo (el CSS usa .js para el menú móvil)
  root.classList.add("js");

  function readStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null; // modo privado o almacenamiento bloqueado
    }
  }

  const stored = readStoredTheme();
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";
})();

/* ---------- 2. Resto de la interactividad (cuando el DOM está listo) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const STORAGE_KEY = "lm-theme";

  /* --- 2.1 Botón de tema --- */
  const themeToggle = document.getElementById("themeToggle");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    themeToggle.setAttribute("aria-pressed", String(isDark));
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", isDark ? "#160a0f" : "#7a1f3d");
    }
  }

  applyTheme(root.dataset.theme);

  themeToggle.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      /* sin almacenamiento: el cambio dura solo esta visita */
    }
  });

  // Si la persona no eligió tema, seguimos los cambios del sistema operativo
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    let stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      stored = null;
    }
    if (!stored) applyTheme(event.matches ? "dark" : "light");
  });

  /* --- 2.2 Menú móvil --- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLabel = navToggle.querySelector(".sr-only");

  function setMenu(open) {
    navMenu.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navLabel.textContent = open ? "Cerrar menú" : "Abrir menú";
  }

  navToggle.addEventListener("click", () => {
    setMenu(navToggle.getAttribute("aria-expanded") !== "true");
  });

  // Cerrar al elegir un enlace, al presionar Escape o al hacer clic fuera
  navMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
      setMenu(false);
      navToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".main-nav")) setMenu(false);
  });

  /* --- 2.3 Resaltar la sección visible en el menú --- */
  const navLinks = Array.from(navMenu.querySelectorAll('a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("is-active", isCurrent);
            if (isCurrent) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
  }

  /* --- 2.4 Copiar email --- */
  const copyBtn = document.getElementById("copyEmail");
  const emailEl = document.getElementById("contactEmail");

  copyBtn.addEventListener("click", async () => {
    const email = emailEl.textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      copyBtn.textContent = "Copiado";
    } catch (error) {
      // Alternativa: seleccionar el texto para copiarlo manualmente
      const range = document.createRange();
      range.selectNodeContents(emailEl);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copyBtn.textContent = "Seleccionado";
    }
    setTimeout(() => {
      copyBtn.textContent = "Copiar";
    }, 2000);
  });

  /* --- 2.5 Validación y envío del formulario de contacto --- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submitBtn = form.querySelector('button[type="submit"]');

  // Las respuestas se guardan en un Google Form (pestaña "Respuestas")
  const GOOGLE_FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSfDBu4BICMReHrS5rtsX1rZYMHLLXReDNDff1Gq-3L42YfSdQ/formResponse";
  const ENTRY = {
    nombre: "entry.89364267",
    email: "entry.1271876682",
    mensaje: "entry.1356733942",
  };
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const rules = {
    nombre: (value) => (value.length >= 2 ? "" : "Escribe tu nombre (mínimo 2 caracteres)."),
    email: (value) => {
      if (!value) return "Escribe tu email.";
      return EMAIL_PATTERN.test(value) ? "" : "Revisa el formato del email, por ejemplo nombre@dominio.com.";
    },
    mensaje: (value) => (value.length >= 10 ? "" : "Cuéntame un poco más (mínimo 10 caracteres)."),
  };

  function validateField(field) {
    const message = rules[field.name](field.value.trim());
    const errorEl = document.getElementById(`${field.id}-error`);
    errorEl.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (message) field.setAttribute("aria-describedby", errorEl.id);
    else field.removeAttribute("aria-describedby");
    return !message;
  }

  // Valida al salir de cada campo y corrige en vivo si ya tenía error
  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.className = "form-status";

    const fields = Object.keys(rules).map((name) => form.elements[name]);
    const results = fields.map(validateField);
    const firstInvalid = fields[results.indexOf(false)];

    if (firstInvalid) {
      status.textContent = "Revisa los campos marcados.";
      status.classList.add("is-error");
      firstInvalid.focus();
      return;
    }

    const datos = new URLSearchParams();
    datos.append(ENTRY.nombre, form.elements.nombre.value.trim());
    datos.append(ENTRY.email, form.elements.email.value.trim());
    datos.append(ENTRY.mensaje, form.elements.mensaje.value.trim());

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando…";

    try {
      // "no-cors": Google no permite leer su respuesta, pero sí recibe los datos
      await fetch(GOOGLE_FORM_URL, { method: "POST", mode: "no-cors", body: datos });
      status.textContent = "¡Gracias por escribirme! Te responderé pronto.";
      status.classList.add("is-success");
      form.reset();
      fields.forEach((field) => field.removeAttribute("aria-invalid"));
    } catch (error) {
      const destino = emailEl.textContent.trim();
      status.textContent = "No se pudo enviar el mensaje. Escríbeme directamente a " + destino + ".";
      status.classList.add("is-error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar mensaje";
    }
  });

  /* --- 2.6 Año actual en el pie --- */
  document.getElementById("year").textContent = new Date().getFullYear();

});