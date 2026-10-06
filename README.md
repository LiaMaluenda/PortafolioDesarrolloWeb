# SmartBudget - Landing Page

Landing page **SmartBudget**, correspondiente al tercer módulo del bootcamp. Presenta una aplicación financiera para conectar cuentas, ordenar gastos y gestionar presupuestos. El proyecto traduce a código frontend un prototipo de alta fidelidad hecho en Figma, con el fin de evidenciar el uso de SASS (SCSS) y la metodología BEM.

---

## 🔗 Enlaces del Proyecto

* **Demo:** [liamaluenda.github.io/smartbudget](https://liamaluenda.github.io/smartbudget/)
* **Repositorio GitHub:** [LiaMaluenda/smartbudget](https://github.com/LiaMaluenda/smartbudget)
* **Prototipo UI/UX:** [Diseño en Figma](https://www.figma.com/make/uYG1DdwcnHWY8ED54jqODP/SmartBudget-landing-page-prototype?code-node-id=0-9&p=f&t=GEe2DFuU2p2JcR6l-0&fullscreen=1)

---

## 🛠️ Tecnologías Utilizadas

* **Estructura:** HTML5 semántico.
* **Estilos:** SASS (SCSS) compilado a CSS3.
* **Interactividad:** JavaScript.
* **Framework CSS:** Bootstrap 5 desde CDN (grilla y clases utilitarias), combinado con estilos propios escritos en SASS.

---

## 📐 Metodologías y Arquitectura

El proyecto separa la estructura (HTML), los estilos (SASS) y la lógica de interacción (JavaScript) en archivos distintos.

### SASS / CSS
Se utilizó la **metodología BEM** (Block, Element, Modifier) junto con el patrón de **arquitectura 7-1** de SASS para organizar los estilos.

* **`abstracts/`**: variables de diseño propias (paleta de colores y tipografía *Roboto Serif*).
* **`base/`**: estilos generales de la página.
* **`components/`**: botones y tarjetas reutilizables (`.feature-card`, `.dashboard-card`, `.testimonial-card`).
* **`layout/`**: elementos estructurales (`_header.scss`, `_navbar.scss`, `_footer.scss`).
* **`pages/`**: estilos específicos de la vista principal (`_home.scss`).
* **`themes/`** y **`vendors/`**: carpetas reservadas de la estructura 7-1, aún sin estilos (Bootstrap se carga desde CDN).

Todo se importa en `sass/main.scss`, que se compila a `css/style.css`.

### JavaScript
La lógica de interacción está en `js/script.js`:

* Scroll suave para los enlaces de navegación internos.
* Cambio de fondo y sombra de la barra de navegación al hacer *scroll*.
* Validación del gráfico de barras del dashboard: revisa que cada barra tenga altura y avisa en la consola si falta alguna.

---

## ⚙️ Instalación y Ejecución Local

1. Clona este repositorio:
   ```bash
   git clone https://github.com/LiaMaluenda/smartbudget.git
   cd smartbudget
   ```
2. Si modificas los estilos, compila SASS a CSS. Con la extensión **Live Sass Compiler** de VS Code, o con la terminal:
   ```bash
   npm install -g sass
   sass sass/main.scss css/style.css
   ```
3. Abre `index.html` en el navegador o con la extensión **Live Server** de VS Code.

---

## 👩‍💻 Autora

**Lia Maluenda** · [GitHub](https://github.com/LiaMaluenda) · [Portafolio](https://liamaluenda.github.io/PortafolioDesarrolloWeb/)
