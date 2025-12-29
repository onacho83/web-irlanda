/**
 * ThemeManager - Gestor de temas y colores
 * Principio SOLID: Single Responsibility - Solo gestiona temas
 * Principio SOLID: Open/Closed - Fácil de extender con nuevos colores
 */
class ThemeManager {
    constructor(configStorage) {
        this.configStorage = configStorage;
        this.config = this.loadConfig();
    }

    /**
     * Carga la configuración desde el almacenamiento
     * @returns {Object} Configuración de colores
     */
    loadConfig() {
        const stored = this.configStorage.load();
        const defaults = this.configStorage.getDefaults();
        return stored ? { ...defaults, ...stored } : defaults;
    }

    /**
     * Aplica los colores al documento usando variables CSS
     * Principio SOLID: Single Responsibility - Solo aplica colores
     */
    applyTheme() {
        const root = document.documentElement;
        const colors = this.config.colors || {};

        // Mapeo de nombres de configuración a variables CSS
        // Nota: text y textLight se eliminaron - cada sección gestiona su propio color
        const colorMap = {
            primary: '--color-primary',
            secondary: '--color-secondary',
            accent: '--color-accent',
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

        // Guardar configuración
        this.configStorage.save(this.config);
    }

    /**
     * Actualiza un color específico
     * @param {string} colorName - Nombre del color
     * @param {string} colorValue - Valor hexadecimal del color
     */
    updateColor(colorName, colorValue) {
        if (!this.config.colors) {
            this.config.colors = {};
        }
        this.config.colors[colorName] = colorValue;
        this.applyTheme();
    }

    /**
     * Obtiene el valor de un color
     * @param {string} colorName - Nombre del color
     * @returns {string} Valor del color
     */
    getColor(colorName) {
        return this.config.colors?.[colorName] || '';
    }

    /**
     * Obtiene toda la configuración de colores
     * @returns {Object} Configuración de colores
     */
    getConfig() {
        return this.config;
    }

    /**
     * Restablece los colores a los valores por defecto
     */
    reset() {
        const defaults = this.configStorage.getDefaults();
        this.config = defaults;
        this.applyTheme();
        return defaults;
    }
}

export default ThemeManager;

