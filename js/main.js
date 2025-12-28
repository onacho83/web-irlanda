/**
 * Main - Aplicación principal
 * Principio SOLID: Single Responsibility - Coordina la inicialización de la aplicación
 */
import ConfigLoader from './config-loader.js';
import HeaderRenderer from './renderers/header-renderer.js';
import ServiciosRenderer from './renderers/servicios-renderer.js';
import ContactoRenderer from './renderers/contacto-renderer.js';
import FooterRenderer from './renderers/footer-renderer.js';

class App {
    constructor() {
        this.configLoader = new ConfigLoader();
        this.initializeRenderers();
    }

    /**
     * Inicializa los renderizadores (Principio SOLID: Single Responsibility)
     */
    initializeRenderers() {
        this.headerRenderer = new HeaderRenderer();
        this.serviciosRenderer = new ServiciosRenderer();
        this.contactoRenderer = new ContactoRenderer();
        this.footerRenderer = new FooterRenderer();
    }

    /**
     * Inicializa la aplicación cargando la configuración y renderizando los componentes
     */
    async init() {
        try {
            const config = await this.configLoader.load();
            this.render(config);
        } catch (error) {
            console.error('Error inicializando aplicación:', error);
            this.showError('Error cargando la configuración. Por favor, verifica el archivo config.json');
        }
    }

    /**
     * Renderiza todos los componentes con la configuración cargada
     * Principio SOLID: Open/Closed - Fácil de extender agregando nuevos renderizadores
     */
    render(config) {
        this.headerRenderer.render(config);
        this.serviciosRenderer.render(config);
        this.contactoRenderer.render(config);
        this.footerRenderer.render(config);
    }

    /**
     * Muestra un mensaje de error al usuario
     */
    showError(message) {
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});

