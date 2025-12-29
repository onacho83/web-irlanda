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

        // Actualizar hero con mensaje de bienvenida personalizado o por defecto
        if (this.heroTitleElement) {
            // Intentar cargar mensaje personalizado desde localStorage
            try {
                const stored = localStorage.getItem('imprenta-content-config');
                if (stored) {
                    const content = JSON.parse(stored);
                    if (content.welcome && content.welcome.titulo) {
                        this.heroTitleElement.textContent = content.welcome.titulo;
                    } else if (config.empresa) {
                        this.heroTitleElement.textContent = `Bienvenido a ${config.empresa.nombre}`;
                    }
                } else if (config.empresa) {
                    this.heroTitleElement.textContent = `Bienvenido a ${config.empresa.nombre}`;
                }
            } catch (e) {
                if (config.empresa) {
                    this.heroTitleElement.textContent = `Bienvenido a ${config.empresa.nombre}`;
                }
            }
        }

        // Actualizar subtítulo
        if (this.heroSubtitleElement) {
            try {
                const stored = localStorage.getItem('imprenta-content-config');
                if (stored) {
                    const content = JSON.parse(stored);
                    if (content.welcome && content.welcome.subtitulo) {
                        this.heroSubtitleElement.textContent = content.welcome.subtitulo;
                    }
                }
            } catch (e) {
                // Usar valor por defecto si hay error
            }
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

