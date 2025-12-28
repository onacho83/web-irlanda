/**
 * ThemeApplier - Aplica el tema personalizado desde localStorage
 * Principio SOLID: Single Responsibility - Solo aplica temas
 */
class ThemeApplier {
    constructor() {
        this.storageKey = 'imprenta-theme-config';
    }

    /**
     * Aplica el tema guardado al documento
     */
    apply() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return;

            const config = JSON.parse(stored);
            const root = document.documentElement;
            const colors = config.colors || {};

            // Mapeo de nombres de configuración a variables CSS
            const colorMap = {
                primary: '--color-primary',
                secondary: '--color-secondary',
                accent: '--color-accent',
                text: '--color-text',
                textLight: '--color-text-light',
                background: '--color-background',
                backgroundLight: '--color-background-light',
                border: '--color-border'
            };

            // Aplicar cada color como variable CSS
            Object.entries(colorMap).forEach(([key, cssVar]) => {
                if (colors[key]) {
                    root.style.setProperty(cssVar, colors[key]);
                }
            });

            // Aplicar fondo del hero
            this.applyHeroBackground(config.hero);
        } catch (error) {
            console.error('Error aplicando tema:', error);
        }
    }

    /**
     * Aplica el fondo del hero según la configuración
     * @param {Object} heroConfig - Configuración del hero
     */
    applyHeroBackground(heroConfig) {
        if (!heroConfig) return;

        const heroSection = document.getElementById('hero');
        if (!heroSection) return;

        // Limpiar estilos previos
        heroSection.style.background = '';
        heroSection.style.backgroundImage = '';
        heroSection.style.backgroundColor = '';

        switch (heroConfig.type) {
            case 'solid':
                heroSection.style.backgroundColor = heroConfig.backgroundColor || '#2563eb';
                heroSection.style.backgroundImage = 'none';
                break;
            case 'image':
                if (heroConfig.backgroundImage) {
                    heroSection.style.backgroundImage = `url('${heroConfig.backgroundImage}')`;
                    heroSection.style.backgroundSize = 'cover';
                    heroSection.style.backgroundPosition = 'center';
                    heroSection.style.backgroundColor = '#2563eb'; // Fallback
                }
                break;
            case 'gradient':
            default:
                const primary = getComputedStyle(document.documentElement)
                    .getPropertyValue('--color-primary').trim() || '#2563eb';
                const secondary = getComputedStyle(document.documentElement)
                    .getPropertyValue('--color-secondary').trim() || '#1e40af';
                heroSection.style.background = `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;
                break;
        }
    }
}

export default ThemeApplier;

