/**
 * PresentacionRenderer - Renderiza la sección de presentación
 * Principio SOLID: Single Responsibility - Solo se encarga de renderizar la sección Presentación
 */
import BaseRenderer from './base-renderer.js';

class PresentacionRenderer extends BaseRenderer {
    constructor() {
        super('presentacion');
    }

    /**
     * Renderiza la sección usando la config y/o overrides de localStorage
     * @param {Object} config - Configuración completa
     */
    render(config = {}) {
        if (!this.section) return;

        // Usar únicamente la configuración pasada (no acceder a localStorage desde el renderer)
        const presentacion = (config && config.presentacion) ? config.presentacion : {};
        // Elementos dentro de la sección
        const titleEl = this.root ? this.root.querySelector('#presentacion-titulo') : null;
        const textEl = this.root ? this.root.querySelector('#presentacion-texto') : null;
        const leadEl = this.root ? this.root.querySelector('#presentacion-lead') : null;
        const imgEl = this.root ? this.root.querySelector('#presentacion-imagen') : null;
        const ctaEl = this.root ? this.root.querySelector('#presentacion-cta') : null;

        if (titleEl && presentacion.titulo !== undefined) titleEl.textContent = presentacion.titulo || 'Quiénes somos';
        if (textEl && presentacion.texto !== undefined) textEl.innerHTML = presentacion.texto || '';
        if (leadEl && presentacion.lead !== undefined) leadEl.textContent = presentacion.lead || '';

        if (imgEl) {
            if (presentacion.imagen) {
                imgEl.src = presentacion.imagen;
                imgEl.style.display = '';
            } else {
                // Mantener imagen por defecto si no hay ninguna
                if (!imgEl.src) imgEl.style.display = 'none';
            }
        }

        if (ctaEl) {
            ctaEl.textContent = presentacion.ctaText || ctaEl.textContent || 'Contacto';
            if (presentacion.ctaLink) {
                ctaEl.href = presentacion.ctaLink;
            }
        }
    }
}

export default PresentacionRenderer;
