/**
 * BackgroundManager - Gestor de fondos del hero
 * Principio SOLID: Single Responsibility - Solo gestiona fondos
 */
class BackgroundManager {
    constructor(configStorage, themeManager) {
        this.configStorage = configStorage;
        this.themeManager = themeManager;
        this.config = this.themeManager.getConfig();
    }

    /**
     * Aplica el fondo del hero según la configuración
     */
    applyHeroBackground() {
        // Recargar configuración actualizada
        this.config = this.themeManager.getConfig();
        const heroConfig = this.config.hero || {};
        const heroSection = document.querySelector('#hero');
        
        if (!heroSection) {
            // Si no estamos en index.html, aplicar a iframe de preview
            this.applyToPreview();
            return;
        }

        this.updateHeroSection(heroSection, heroConfig);
    }

    /**
     * Actualiza la sección hero con el fondo apropiado
     * @param {HTMLElement} heroElement - Elemento del hero
     * @param {Object} heroConfig - Configuración del hero
     */
    updateHeroSection(heroElement, heroConfig) {
        // Limpiar estilos previos
        heroElement.style.background = '';
        heroElement.style.backgroundImage = '';
        heroElement.style.backgroundColor = '';

        switch (heroConfig.type) {
            case 'solid':
                heroElement.style.backgroundColor = heroConfig.backgroundColor || '#2563eb';
                heroElement.style.backgroundImage = 'none';
                break;
            case 'image':
                if (heroConfig.backgroundImage) {
                    heroElement.style.backgroundImage = `url('${heroConfig.backgroundImage}')`;
                    heroElement.style.backgroundSize = 'cover';
                    heroElement.style.backgroundPosition = 'center';
                    heroElement.style.backgroundColor = '#2563eb'; // Fallback
                }
                break;
            case 'gradient':
            default: {
                const primary = this.themeManager.getColor('primary') || '#2563eb';
                const secondary = this.themeManager.getColor('secondary') || '#1e40af';
                heroElement.style.background = `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;
                break;
            }
        }
    }

    /**
     * Aplica el fondo al iframe de preview
     */
    applyToPreview() {
        // Recargar configuración actualizada
        this.config = this.themeManager.getConfig();
        const iframe = document.getElementById('preview-frame');
        if (iframe && iframe.contentWindow) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const heroSection = iframeDoc.querySelector('#hero');
                if (heroSection) {
                    const heroConfig = this.config.hero || {};
                    this.updateHeroSection(heroSection, heroConfig);
                }
            } catch (e) {
                console.warn('No se pudo acceder al iframe (CORS):', e);
            }
        }
    }

    /**
     * Actualiza el tipo de fondo del hero
     * @param {string} type - Tipo de fondo: 'gradient', 'solid', 'image'
     */
    updateBackgroundType(type) {
        this.config = this.themeManager.getConfig();
        if (!this.config.hero) {
            this.config.hero = {};
        }
        this.config.hero.type = type;
        this.saveConfig();
        this.applyHeroBackground();
    }

    /**
     * Actualiza el color de fondo sólido del hero
     * @param {string} color - Color hexadecimal
     */
    updateBackgroundColor(color) {
        this.config = this.themeManager.getConfig();
        if (!this.config.hero) {
            this.config.hero = {};
        }
        this.config.hero.backgroundColor = color;
        this.saveConfig();
        this.applyHeroBackground();
    }

    /**
     * Actualiza la imagen de fondo del hero
     * @param {string} imageUrl - URL de la imagen
     */
    updateBackgroundImage(imageUrl) {
        this.config = this.themeManager.getConfig();
        if (!this.config.hero) {
            this.config.hero = {};
        }
        this.config.hero.backgroundImage = imageUrl;
        this.saveConfig();
        this.applyHeroBackground();
    }

    /**
     * Guarda la configuración
     */
    saveConfig() {
        // Sincronizar con themeManager antes de guardar
        this.config = this.themeManager.getConfig();
        this.configStorage.save(this.config);
    }
}

export default BackgroundManager;

