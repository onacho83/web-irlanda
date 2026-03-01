/**
 * ContentManager - Gestor de contenido (SRP + DIP).
 * Acepta almacenamiento inyectado para contenido.
 */

const DEFAULT_CONTENT_KEY = 'imprenta-content-config';

export default class ContentManager {
    /**
     * @param {Object} [options]
     * @param {{ get: (string) => string|null, set: (string, string) => void }} [options.storage] - Almacenamiento para contenido
     * @param {string} [options.contentKey]
     * @param {string} [options.configPath='config.json']
     */
    constructor(options = {}) {
        this.storage = options.storage || null;
        this.contentKey = options.contentKey ?? DEFAULT_CONTENT_KEY;
        this.configPath = options.configPath ?? 'config.json';
    }

    _getStored() {
        if (this.storage) return this.storage.get(this.contentKey);
        try {
            return localStorage.getItem(this.contentKey);
        } catch (e) {
            return null;
        }
    }

    _setStored(value) {
        if (this.storage) {
            this.storage.set(this.contentKey, value);
            return true;
        }
        try {
            localStorage.setItem(this.contentKey, value);
            return true;
        } catch (e) {
            console.error('Error guardando contenido:', e);
            return false;
        }
    }

    async loadContent() {
        try {
            const response = await fetch(this.configPath);
            if (!response.ok) throw new Error(`Error al cargar contenido: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error cargando contenido:', error);
            throw error;
        }
    }

    saveContentToStorage(content) {
        try {
            return this._setStored(JSON.stringify(content));
        } catch (error) {
            console.error('Error guardando contenido:', error);
            return false;
        }
    }

    loadContentFromStorage() {
        try {
            const stored = this._getStored();
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error cargando contenido:', error);
            return null;
        }
    }

    updateEmpresaData(empresaData) {
        const content = this.loadContentFromStorage() || {};
        if (!content.empresa) content.empresa = {};
        Object.assign(content.empresa, empresaData);
        this.saveContentToStorage(content);
        return content;
    }

    updateWelcomeMessage(titulo, subtitulo) {
        const content = this.loadContentFromStorage() || {};
        if (!content.welcome) content.welcome = {};
        content.welcome.titulo = titulo;
        content.welcome.subtitulo = subtitulo;
        this.saveContentToStorage(content);
        return content;
    }

    getEmpresaData() {
        const content = this.loadContentFromStorage();
        return content?.empresa || {};
    }

    /** @returns {{ numero: string, etiqueta?: string }[]} */
    getTelefonos() {
        const content = this.loadContentFromStorage();
        const empresa = content?.empresa || {};
        if (Array.isArray(empresa.telefonos)) return empresa.telefonos;
        if (empresa.telefono) return [{ numero: empresa.telefono, etiqueta: 'Principal' }];
        return [];
    }

    /** @param {{ numero: string, etiqueta?: string }[]} telefonos */
    updateTelefonos(telefonos) {
        const content = this.loadContentFromStorage() || {};
        if (!content.empresa) content.empresa = {};
        content.empresa.telefonos = telefonos;
        if (telefonos.length > 0 && !content.empresa.telefono) {
            content.empresa.telefono = telefonos[0].numero;
        }
        this.saveContentToStorage(content);
        return content;
    }

    /** @returns {{ nombre: string, direccion: string, telefono?: string, telefonos?: { numero: string, etiqueta?: string }[], horario?: string, email?: string }[]} */
    getSucursales() {
        const content = this.loadContentFromStorage();
        const empresa = content?.empresa || {};
        return Array.isArray(empresa.sucursales) ? empresa.sucursales : [];
    }

    /** @param {{ nombre: string, direccion: string, telefono?: string, telefonos?: { numero: string, etiqueta?: string }[], horario?: string, email?: string }[]} sucursales */
    updateSucursales(sucursales) {
        const content = this.loadContentFromStorage() || {};
        if (!content.empresa) content.empresa = {};
        content.empresa.sucursales = sucursales;
        this.saveContentToStorage(content);
        return content;
    }

    getWelcomeMessage() {
        const content = this.loadContentFromStorage();
        return content?.welcome || { titulo: '', subtitulo: '' };
    }

    exportContent() {
        const content = this.loadContentFromStorage();
        return JSON.stringify(content, null, 2);
    }
}
