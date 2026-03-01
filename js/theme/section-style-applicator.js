/**
 * Lógica única de aplicación de estilos por sección (SRP/OCP).
 * Usado por ThemeApplier y SectionStyleManager.
 */

const TEXT_SELECTOR = 'h1, h2, h3, h4, h5, h6, p, span, a, li, td, th, label, small, strong';
const SKIP_CLASSES = ['telefono-link', 'whatsapp-link', 'footer-telefono-link'];

function shouldSkipColor(el) {
    return SKIP_CLASSES.some(c => el.classList.contains(c) || el.closest(`.${c}`));
}

/**
 * Aplica estilos a un elemento de sección (fondo, texto, imagen de fondo).
 * @param {HTMLElement} section - Elemento DOM de la sección
 * @param {Object} styles - { backgroundColor?, textColor?, backgroundImage? }
 */
export function applySectionStylesToElement(section, styles) {
    if (!section) return;

    if (styles.backgroundColor) {
        section.style.backgroundColor = styles.backgroundColor;
    }

    if (styles.textColor) {
        section.style.color = styles.textColor;
        const textElements = section.querySelectorAll(TEXT_SELECTOR);
        textElements.forEach(el => {
            if (!shouldSkipColor(el)) el.style.color = styles.textColor;
        });
    } else {
        section.style.color = '';
        const textElements = section.querySelectorAll(TEXT_SELECTOR);
        textElements.forEach(el => {
            if (!shouldSkipColor(el)) el.style.color = '';
        });
    }

    if (styles.backgroundImage) {
        section.style.backgroundImage = `url('${styles.backgroundImage}')`;
        section.style.backgroundSize = 'cover';
        section.style.backgroundPosition = 'center';
    }
}
