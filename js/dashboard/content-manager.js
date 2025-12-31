/**
 * ContentManager - Gestor de contenido (datos de empresa, mensaje de bienvenida)
 * Principio SOLID: Single Responsibility - Solo gestiona contenido
 */
import StorageService from '../services/storage-service.js';

class ContentManager {
    constructor(configStorage, storageService = null) {
        this.configStorage = configStorage;
        this.configPath = 'config.json';
        this.storage = storageService || new StorageService();
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
            return this.storage.set('imprenta-content-config', content);
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
            return this.storage.get('imprenta-content-config');
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
     * Actualiza los datos de la sección presentación
     * @param {Object} presentacionData - { titulo, texto, lead, imagen, ctaText, ctaLink }
     */
    updatePresentacion(presentacionData) {
        const content = this.loadContentFromStorage() || {};
        if (!content.presentacion) content.presentacion = {};
        Object.assign(content.presentacion, presentacionData);
        this.saveContentToStorage(content);
        return content;
    }

    /**
     * Obtiene los datos de la sección presentación
     * @returns {Object} presentacion data
     */
    getPresentacionData() {
        const content = this.loadContentFromStorage();
        return content?.presentacion || { titulo: '', texto: '', lead: '', imagen: '', ctaText: '', ctaLink: '' };
    }

    /**
     * Obtiene la lista de servicios
     * @returns {Array} servicios
     */
    getServicios() {
        const content = this.loadContentFromStorage();
        return content?.servicios || [];
    }

    /**
     * Añade un nuevo servicio
     * @param {Object} servicio
     */
    addServicio(servicio) {
        const content = this.loadContentFromStorage() || {};
        if (!content.servicios) content.servicios = [];
        content.servicios.push(servicio);
        this.saveContentToStorage(content);
        return content;
    }

    /**
     * Actualiza un servicio por índice
     * @param {number} index
     * @param {Object} servicio
     */
    updateServicio(index, servicio) {
        const content = this.loadContentFromStorage() || {};
        if (!content.servicios) content.servicios = [];
        if (typeof index === 'number' && content.servicios[index]) {
            content.servicios[index] = servicio;
            this.saveContentToStorage(content);
        }
        return content;
    }

    /**
     * Elimina un servicio por índice
     * @param {number} index
     */
    deleteServicio(index) {
        const content = this.loadContentFromStorage() || {};
        if (!content.servicios) content.servicios = [];
        if (typeof index === 'number' && content.servicios[index]) {
            content.servicios.splice(index, 1);
            this.saveContentToStorage(content);
        }
        return content;
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

