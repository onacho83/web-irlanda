/**
 * HeaderRenderer - Renderiza el header de la página (SRP).
 */
import BaseRenderer from './base-renderer.js';

class HeaderRenderer extends BaseRenderer {
    constructor() {
        super();
        this.headerElement = document.getElementById('header');
    }

    /**
     * Renderiza el header con la información de la empresa
     * @param {Object} config - Configuración completa de la aplicación
     */
    render(config) {
        if (!this.headerElement || !config.empresa) {
            return;
        }

        const empresa = config.empresa;
        
        this.headerElement.innerHTML = `
            <div class="container">
                <div class="header-content">
                    <h1 class="logo">${empresa.nombre}</h1>
                    <nav class="header-nav">
                        <a href="#servicios">Servicios</a>
                        <a href="#contacto">Contacto</a>
                    </nav>
                </div>
            </div>
        `;
    }
}

export default HeaderRenderer;

