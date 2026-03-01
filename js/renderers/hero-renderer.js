/**
 * HeroRenderer - Renderiza título y subtítulo del hero (SRP).
 * Solo se encarga del hero; los datos vienen en config (welcome / empresa).
 */
import BaseRenderer from './base-renderer.js';

class HeroRenderer extends BaseRenderer {
    constructor() {
        super();
        this.heroTitleElement = document.getElementById('hero-title');
        this.heroSubtitleElement = document.getElementById('hero-subtitle');
    }

    /**
     * @param {Object} config - Debe incluir welcome: { titulo, subtitulo } y/o empresa: { nombre }
     */
    render(config) {
        if (this.heroTitleElement) {
            const welcome = config.welcome || {};
            const empresa = config.empresa || {};
            this.heroTitleElement.textContent = welcome.titulo || (empresa.nombre ? `Bienvenido a ${empresa.nombre}` : 'Bienvenido');
        }
        if (this.heroSubtitleElement) {
            const welcome = config.welcome || {};
            this.heroSubtitleElement.textContent = welcome.subtitulo || '';
        }
    }
}

export default HeroRenderer;
