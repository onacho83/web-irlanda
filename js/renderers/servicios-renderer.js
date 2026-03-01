/**
 * ServiciosRenderer - Renderiza únicamente la sección de servicios (SRP).
 * Los datos vienen solo de config; no accede a localStorage.
 */
import BaseRenderer from './base-renderer.js';

class ServiciosRenderer extends BaseRenderer {
    constructor() {
        super();
        this.containerElement = document.getElementById('servicios-container');
    }

    /**
     * @param {Object} config - Debe incluir config.servicios (array)
     */
    render(config) {
        if (!this.containerElement || !config.servicios || !Array.isArray(config.servicios)) {
            return;
        }
        this.containerElement.innerHTML = config.servicios
            .map(servicio => this.createServicioCard(servicio))
            .join('');
    }

    /**
     * @param {Object} servicio
     * @returns {string}
     */
    createServicioCard(servicio) {
        return `
            <div class="servicio-card">
                <div class="servicio-icono">${servicio.icono || '📄'}</div>
                <h3>${servicio.titulo}</h3>
                <p>${servicio.descripcion}</p>
            </div>
        `;
    }
}

export default ServiciosRenderer;
