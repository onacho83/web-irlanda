/**
 * ServiciosRenderer - Renderiza la sección de servicios
 * Principio SOLID: Single Responsibility - Solo se encarga de renderizar los servicios
 */
class ServiciosRenderer {
    constructor() {
        this.containerElement = document.getElementById('servicios-container');
        this.heroTitleElement = document.getElementById('hero-title');
        this.heroSubtitleElement = document.getElementById('hero-subtitle');
    }

    /**
     * Renderiza la sección de servicios
     * @param {Object} config - Configuración completa de la aplicación
     */
    render(config) {
        if (!config.servicios || !Array.isArray(config.servicios)) {
            return;
        }

        // Actualizar hero con nombre de la empresa
        if (this.heroTitleElement && config.empresa) {
            this.heroTitleElement.textContent = `Bienvenido a ${config.empresa.nombre}`;
        }

        // Renderizar servicios
        if (this.containerElement) {
            this.containerElement.innerHTML = config.servicios
                .map(servicio => this.createServicioCard(servicio))
                .join('');
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

