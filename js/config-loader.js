/**
 * ConfigLoader - Carga la configuración desde config.json
 * Principio SOLID: Single Responsibility - Solo se encarga de cargar la configuración
 * Principio SOLID: Dependency Inversion - Inyecta la configuración en lugar de hardcodearla
 */
class ConfigLoader {
    constructor(configPath = 'config.json') {
        this.configPath = configPath;
        this.config = null;
    }

    /**
     * Carga la configuración desde el archivo JSON
     * @returns {Promise<Object>} La configuración cargada
     */
    async load() {
        try {
            const response = await fetch(this.configPath);
            if (!response.ok) {
                throw new Error(`Error al cargar configuración: ${response.status}`);
            }
            this.config = await response.json();
            return this.config;
        } catch (error) {
            console.error('Error cargando configuración:', error);
            throw error;
        }
    }

    /**
     * Obtiene la configuración actual (si ya fue cargada)
     * @returns {Object|null} La configuración o null si no ha sido cargada
     */
    getConfig() {
        return this.config;
    }
}

export default ConfigLoader;

