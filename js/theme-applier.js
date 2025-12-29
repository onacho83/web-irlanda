/**
 * ThemeApplier - Aplica el tema personalizado desde localStorage
 * Principio SOLID: Single Responsibility - Solo aplica temas
 */
class ThemeApplier {
    constructor() {
        this.storageKey = 'imprenta-theme-config';
    }

    /**
     * Aplica el tema guardado al documento
     */
    apply() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return;

            const config = JSON.parse(stored);
            const root = document.documentElement;
            const colors = config.colors || {};

            // Mapeo de nombres de configuración a variables CSS
            // Nota: text y textLight se eliminaron - cada sección gestiona su propio color
            const colorMap = {
                primary: '--color-primary',
                secondary: '--color-secondary',
                accent: '--color-accent',
                background: '--color-background',
                backgroundLight: '--color-background-light',
                border: '--color-border'
            };

            // Aplicar cada color como variable CSS
            Object.entries(colorMap).forEach(([key, cssVar]) => {
                if (colors[key]) {
                    root.style.setProperty(cssVar, colors[key]);
                }
            });

            // Aplicar fondo del hero
            this.applyHeroBackground(config.hero);

            // No aplicar estilos de secciones aquí - se aplicarán después del renderizado
        } catch (error) {
            console.error('Error aplicando tema:', error);
        }
    }

    /**
     * Aplica los estilos de secciones (llamado después del renderizado)
     */
    applySectionStyles() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return;

            const config = JSON.parse(stored);
            this.applySectionStylesFromConfig(config.sections);
        } catch (error) {
            console.error('Error aplicando estilos de secciones:', error);
        }
    }

    /**
     * Aplica estilos de secciones desde un objeto de configuración
     * @param {Object} sections - Configuración de estilos por sección
     */
    applySectionStylesFromConfig(sections) {
        if (!sections) return;

        Object.entries(sections).forEach(([sectionId, styles]) => {
            const section = document.getElementById(sectionId);
            if (!section) return;

            if (styles.backgroundColor) {
                section.style.backgroundColor = styles.backgroundColor;
            }

            if (styles.textColor) {
                // Aplicar color de texto a la sección y a todos sus elementos hijos
                section.style.color = styles.textColor;
                
                // Aplicar a elementos específicos dentro de la sección
                const textElements = section.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, li, td, th, label, small, strong');
                textElements.forEach(el => {
                    // No sobrescribir colores específicos como enlaces de WhatsApp
                    if (!el.classList.contains('telefono-link') && 
                        !el.classList.contains('whatsapp-link') && 
                        !el.classList.contains('footer-telefono-link') &&
                        !el.closest('.telefono-link') &&
                        !el.closest('.whatsapp-link') &&
                        !el.closest('.footer-telefono-link')) {
                        el.style.color = styles.textColor;
                    }
                });
            } else {
                // Si no hay color personalizado, limpiar estilos inline
                section.style.color = '';
                const textElements = section.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, li, td, th, label, small, strong');
                textElements.forEach(el => {
                    if (!el.classList.contains('telefono-link') && 
                        !el.classList.contains('whatsapp-link') && 
                        !el.classList.contains('footer-telefono-link') &&
                        !el.closest('.telefono-link') &&
                        !el.closest('.whatsapp-link') &&
                        !el.closest('.footer-telefono-link')) {
                        el.style.color = '';
                    }
                });
            }

            if (styles.backgroundImage) {
                section.style.backgroundImage = `url('${styles.backgroundImage}')`;
                section.style.backgroundSize = 'cover';
                section.style.backgroundPosition = 'center';
            }
        });
    }


    /**
     * Aplica el fondo del hero según la configuración
     * @param {Object} heroConfig - Configuración del hero
     */
    applyHeroBackground(heroConfig) {
        if (!heroConfig) return;

        const heroSection = document.getElementById('hero');
        if (!heroSection) return;

        // Limpiar estilos previos
        heroSection.style.background = '';
        heroSection.style.backgroundImage = '';
        heroSection.style.backgroundColor = '';

        switch (heroConfig.type) {
            case 'solid':
                heroSection.style.backgroundColor = heroConfig.backgroundColor || '#2563eb';
                heroSection.style.backgroundImage = 'none';
                break;
            case 'image':
                if (heroConfig.backgroundImage) {
                    heroSection.style.backgroundImage = `url('${heroConfig.backgroundImage}')`;
                    heroSection.style.backgroundSize = 'cover';
                    heroSection.style.backgroundPosition = 'center';
                    heroSection.style.backgroundColor = '#2563eb'; // Fallback
                }
                break;
            case 'gradient':
            default:
                const primary = getComputedStyle(document.documentElement)
                    .getPropertyValue('--color-primary').trim() || '#2563eb';
                const secondary = getComputedStyle(document.documentElement)
                    .getPropertyValue('--color-secondary').trim() || '#1e40af';
                heroSection.style.background = `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;
                break;
        }
    }
}

export default ThemeApplier;

