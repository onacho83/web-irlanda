/**
 * SectionStyleManager - Gestor de estilos por sección
 * Principio SOLID: Single Responsibility - Solo gestiona estilos de secciones
 */
class SectionStyleManager {
    constructor(configStorage, themeManager) {
        this.configStorage = configStorage;
        this.themeManager = themeManager;
        this.config = this.themeManager.getConfig();
    }

    /**
     * Aplica los estilos personalizados a todas las secciones
     */
    applySectionStyles() {
        this.config = this.themeManager.getConfig();
        const sections = this.config.sections || {};

        Object.entries(sections).forEach(([sectionId, styles]) => {
            this.applySectionStyle(sectionId, styles);
        });
    }

    /**
     * Aplica estilos a una sección específica
     * @param {string} sectionId - ID de la sección (header, hero, servicios, contacto, footer)
     * @param {Object} styles - Objeto con estilos (backgroundColor, textColor, etc.)
     */
    applySectionStyle(sectionId, styles) {
        const section = document.getElementById(sectionId) || document.querySelector(`#${sectionId}`);
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
    }

    /**
     * Actualiza los estilos de una sección
     * @param {string} sectionId - ID de la sección
     * @param {string} property - Propiedad a actualizar (backgroundColor, textColor, backgroundImage)
     * @param {string} value - Valor a asignar
     */
    updateSectionStyle(sectionId, property, value) {
        this.config = this.themeManager.getConfig();
        if (!this.config.sections) {
            this.config.sections = {};
        }
        if (!this.config.sections[sectionId]) {
            this.config.sections[sectionId] = {};
        }

        if (value === '' || value === null) {
            delete this.config.sections[sectionId][property];
        } else {
            this.config.sections[sectionId][property] = value;
        }

        this.saveConfig();
        this.applySectionStyle(sectionId, this.config.sections[sectionId]);
    }

    /**
     * Obtiene los estilos de una sección
     * @param {string} sectionId - ID de la sección
     * @returns {Object} Estilos de la sección
     */
    getSectionStyles(sectionId) {
        this.config = this.themeManager.getConfig();
        return this.config.sections?.[sectionId] || {};
    }

    /**
     * Guarda la configuración
     */
    saveConfig() {
        this.config = this.themeManager.getConfig();
        this.configStorage.save(this.config);
    }
}

export default SectionStyleManager;

