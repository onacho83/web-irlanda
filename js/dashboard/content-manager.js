/**
 * ContentManager - Gestor de contenido (datos de empresa, mensaje de bienvenida)
 * Principio SOLID: Single Responsibility - Solo gestiona contenido
 */
class ContentManager {
    constructor(configStorage) {
        this.configStorage = configStorage;
        this.configPath = 'config.json';
    }

    /**
     * Carga el contenido desde config.json
     * @returns {Promise<Object>} Contenido cargado
     */
    async loadContent() {
        try {
            const response = await fetch(this.configPath);
            if (!response.ok) {
                throw new Error(`Error al cargar contenido: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error cargando contenido:', error);
            throw error;
        }
    }

    /**
     * Guarda el contenido en localStorage (para uso en dashboard)
     * @param {Object} content - Contenido a guardar
     */
    saveContentToStorage(content) {
        try {
            localStorage.setItem('imprenta-content-config', JSON.stringify(content));
            return true;
        } catch (error) {
            console.error('Error guardando contenido:', error);
            return false;
        }
    }

    /**
     * Carga el contenido desde localStorage
     * @returns {Object|null} Contenido cargado
     */
    loadContentFromStorage() {
        try {
            const stored = localStorage.getItem('imprenta-content-config');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error cargando contenido:', error);
            return null;
        }
    }

    /**
     * Actualiza los datos de la empresa
     * @param {Object} empresaData - Datos de la empresa
     */
    updateEmpresaData(empresaData) {
        const content = this.loadContentFromStorage() || {};
        if (!content.empresa) {
            content.empresa = {};
        }
        Object.assign(content.empresa, empresaData);
        this.saveContentToStorage(content);
        return content;
    }

    /**
     * Actualiza el mensaje de bienvenida
     * @param {string} titulo - Título del mensaje
     * @param {string} subtitulo - Subtítulo del mensaje
     */
    updateWelcomeMessage(titulo, subtitulo) {
        const content = this.loadContentFromStorage() || {};
        if (!content.welcome) {
            content.welcome = {};
        }
        content.welcome.titulo = titulo;
        content.welcome.subtitulo = subtitulo;
        this.saveContentToStorage(content);
        return content;
    }

    /**
     * Obtiene los datos de la empresa
     * @returns {Object} Datos de la empresa
     */
    getEmpresaData() {
        const content = this.loadContentFromStorage();
        return content?.empresa || {};
    }

    /**
     * Obtiene el mensaje de bienvenida
     * @returns {Object} Mensaje de bienvenida
     */
    getWelcomeMessage() {
        const content = this.loadContentFromStorage();
        return content?.welcome || { titulo: '', subtitulo: '' };
    }

    /**
     * Exporta el contenido como JSON para descargar
     * @returns {string} JSON stringificado
     */
    exportContent() {
        const content = this.loadContentFromStorage();
        return JSON.stringify(content, null, 2);
    }
}

export default ContentManager;

