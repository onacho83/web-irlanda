/**
 * ConfigStorage - Gestor de almacenamiento de configuraciones
 * Principio SOLID: Single Responsibility - Solo se encarga del almacenamiento
 * Principio SOLID: Dependency Inversion - Proporciona una interfaz para el almacenamiento
 */
class ConfigStorage {
    constructor() {
        this.storageKey = 'imprenta-theme-config';
    }

    /**
     * Guarda la configuración en localStorage
     * @param {Object} config - Configuración a guardar
     */
    save(config) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(config));
            return true;
        } catch (error) {
            console.error('Error guardando configuración:', error);
            return false;
        }
    }

    /**
     * Carga la configuración desde localStorage
     * @returns {Object|null} Configuración cargada o null si no existe
     */
    load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error cargando configuración:', error);
            return null;
        }
    }

    /**
     * Obtiene los valores por defecto
     * @returns {Object} Configuración por defecto
     */
    getDefaults() {
        return {
            colors: {
                primary: '#2563eb',
                secondary: '#1e40af',
                accent: '#f59e0b',
                background: '#ffffff',
                backgroundLight: '#f9fafb',
                border: '#e5e7eb'
            },
            hero: {
                type: 'gradient',
                backgroundColor: '#2563eb',
                backgroundImage: ''
            },
            sections: {
                header: {},
                hero: {},
                servicios: {},
                contacto: {},
                footer: {}
            }
        };
    }

    /**
     * Restablece la configuración a los valores por defecto
     */
    reset() {
        localStorage.removeItem(this.storageKey);
        return this.getDefaults();
    }
}

export default ConfigStorage;

