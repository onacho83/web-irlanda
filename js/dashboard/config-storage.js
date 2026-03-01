/**
 * ConfigStorage - Gestor de almacenamiento de configuraciones (SRP + DIP).
 * Usa una abstracción de almacenamiento inyectada.
 */

const DEFAULT_THEME_KEY = 'imprenta-theme-config';

export default class ConfigStorage {
    /**
     * @param {Object} [options]
     * @param {{ get: (string) => string|null, set: (string, string) => void, remove: (string) => void }} [options.storage]
     * @param {string} [options.storageKey]
     */
    constructor(options = {}) {
        this.storage = options.storage || null;
        this.storageKey = options.storageKey ?? DEFAULT_THEME_KEY;
    }

    _get() {
        if (this.storage) return this.storage.get(this.storageKey);
        try {
            return localStorage.getItem(this.storageKey);
        } catch (e) {
            return null;
        }
    }

    _set(value) {
        if (this.storage) {
            this.storage.set(this.storageKey, value);
            return true;
        }
        try {
            localStorage.setItem(this.storageKey, value);
            return true;
        } catch (e) {
            console.error('Error guardando configuración:', e);
            return false;
        }
    }

    _remove() {
        if (this.storage) this.storage.remove(this.storageKey);
        else try { localStorage.removeItem(this.storageKey); } catch (e) {}
    }

    save(config) {
        try {
            return this._set(JSON.stringify(config));
        } catch (error) {
            console.error('Error guardando configuración:', error);
            return false;
        }
    }

    load() {
        try {
            const stored = this._get();
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error cargando configuración:', error);
            return null;
        }
    }

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

    reset() {
        this._remove();
        return this.getDefaults();
    }
}
