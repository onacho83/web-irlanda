/**
 * ConfigStorage - Gestor de almacenamiento de configuraciones
 * Principio SOLID: Single Responsibility - Solo se encarga del almacenamiento
 * Principio SOLID: Dependency Inversion - Proporciona una interfaz para el almacenamiento
 */
import StorageService from '../services/storage-service.js';

class ConfigStorage {
    constructor(storageService = null) {
        this.storageKey = 'imprenta-theme-config';
        this.storage = storageService || new StorageService();
    }

    /**
     * Guarda la configuración usando StorageService
     * @param {Object} config - Configuración a guardar
     */
    save(config) {
        try {
            return this.storage.set(this.storageKey, config);
        } catch (error) {
            console.error('Error guardando configuración:', error);
            return false;
        }
    }

    /**
     * Carga la configuración usando StorageService
     * @returns {Object|null} Configuración cargada o null si no existe
     */
    load() {
        try {
            return this.storage.get(this.storageKey);
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
        try {
            this.storage.remove(this.storageKey);
        } catch (e) {
            // ignore
        }
        return this.getDefaults();
    }
}

export default ConfigStorage;

