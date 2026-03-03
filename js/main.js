/**
 * Main - Aplicación principal (SRP + DIP).
 * Coordina carga de configuración, contenido y renderers con dependencias inyectables.
 */
import ConfigLoader from './config-loader.js';
import ThemeApplier from './theme-applier.js';
import ContentManager from './dashboard/content-manager.js';
import HeaderRenderer from './renderers/header-renderer.js';
import HeroRenderer from './renderers/hero-renderer.js';
import PresentacionRenderer from './renderers/presentacion-renderer.js';
import ServiciosRenderer from './renderers/servicios-renderer.js';
import ContactoRenderer from './renderers/contacto-renderer.js';
import FooterRenderer from './renderers/footer-renderer.js';

/**
 * Crea dependencias por defecto para la App (DIP).
 * @param {{ configLoader?: ConfigLoader, themeApplier?: ThemeApplier, contentManager?: ContentManager, renderers?: Object }} [options]
 */
export function createAppDependencies(options = {}) {
    return {
        configLoader: options.configLoader || new ConfigLoader(),
        themeApplier: options.themeApplier || new ThemeApplier(),
        contentManager: options.contentManager || new ContentManager({}),
        renderers: options.renderers || {
            header: new HeaderRenderer(),
            hero: new HeroRenderer(),
            presentacion: new PresentacionRenderer(),
            servicios: new ServiciosRenderer(),
            contacto: new ContactoRenderer(),
            footer: new FooterRenderer()
        }
    };
}

class App {
    /**
     * @param {ReturnType<createAppDependencies>} [deps]
     */
    constructor(deps) {
        const d = deps || createAppDependencies();
        this.configLoader = d.configLoader;
        this.themeApplier = d.themeApplier;
        this.contentManager = d.contentManager;
        this.renderers = d.renderers;
    }

    async init() {
        try {
            this.themeApplier.apply();

            const config = await this.configLoader.load();
            const content = this.contentManager.loadContentFromStorage();
+            console.log('App.init loaded config:', config);
+            console.log('App.init loaded stored content:', content);
+            // merge overrides from stored content
             if (content) {
                 if (content.welcome) config.welcome = content.welcome;
                 if (content.empresa) {
                     config.empresa = { ...(config.empresa || {}), ...content.empresa };
                 }
                 if (content.presentacion) {
                     config.presentacion = { ...(config.presentacion || {}), ...content.presentacion };
                 }
                 if (content.servicios) {
                     config.servicios = content.servicios;
                 }
                 if (content.footer) {
                     config.footer = { ...(config.footer || {}), ...content.footer };
                 }
             }

            this.render(config);
        } catch (error) {
            console.error('Error inicializando aplicación:', error);
            this.showError('Error cargando la configuración. Por favor, verifica el archivo config.json');
        }
    }

    render(config) {
        this.renderers.header.render(config);
        this.renderers.hero.render(config);
        this.renderers.presentacion.render(config);
        this.renderers.servicios.render(config);
        this.renderers.contacto.render(config);
        this.renderers.footer.render(config);

        setTimeout(() => {
            this.themeApplier.applySectionStyles();
        }, 100);
    }

    showError(message) {
        const main = document.querySelector('main');
        if (main) main.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
