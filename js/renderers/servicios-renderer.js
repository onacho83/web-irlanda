/**
 * ServiciosRenderer - Renderiza la sección de servicios
 * Principio SOLID: Single Responsibility - Solo se encarga de renderizar los servicios
 */
import BaseRenderer from './base-renderer.js';

class ServiciosRenderer extends BaseRenderer {
    constructor() {
        super('servicios-container');
        this.heroTitleElement = document.getElementById('hero-title');
        this.heroSubtitleElement = document.getElementById('hero-subtitle');
    }

    /**
     * Renderiza la sección de servicios
     * @param {Object} config - Configuración completa de la aplicación
     */
    render(config) {
        // Usar únicamente la configuración pasada (no acceder a localStorage desde el renderer)
        const servicios = config.servicios || [];
        // Actualizar hero con mensaje de bienvenida personalizado o por defecto
        if (this.heroTitleElement) {
            const welcome = config.welcome || {};
            if (welcome.titulo) {
                this.heroTitleElement.textContent = welcome.titulo;
            } else if (config.empresa) {
                this.heroTitleElement.textContent = `Bienvenido a ${config.empresa.nombre}`;
            }
        }

        // Actualizar subtítulo
        if (this.heroSubtitleElement) {
            const welcome = config.welcome || {};
            if (welcome.subtitulo) {
                this.heroSubtitleElement.textContent = welcome.subtitulo;
            }
        }

        // Renderizar servicios
        if (this.root) {
            this.setHTML(servicios.map(servicio => this.createServicioCard(servicio)).join(''));
        }
    }

    /**
     * Crea el HTML para una tarjeta de servicio
     * Principio SOLID: Single Responsibility - Método con una única responsabilidad
     * @param {Object} servicio - Datos del servicio
     * @returns {string} HTML de la tarjeta
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

