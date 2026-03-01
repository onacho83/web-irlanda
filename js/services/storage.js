/**
 * Abstracción de almacenamiento clave-valor (DIP).
 * Permite sustituir localStorage por otra implementación (tests, otro backend).
 */

/**
 * @typedef {Object} StorageAdapter
 * @property {(key: string) => string | null} get
 * @property {(key: string, value: string) => void} set
 * @property {(key: string) => void} remove
 */

/**
 * Adaptador para localStorage (implementación concreta).
 */
export class LocalStorageAdapter {
    /**
     * @param {string} [prefix=''] - Prefijo opcional para las claves
     */
    constructor(prefix = '') {
        this.prefix = prefix;
    }

    /** @param {string} key */
    get(key) {
        try {
            return localStorage.getItem(this.prefix + key);
        } catch (e) {
            console.error('Storage get error:', e);
            return null;
        }
    }

    /**
     * @param {string} key
     * @param {string} value
     */
    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, value);
        } catch (e) {
            console.error('Storage set error:', e);
        }
    }

    /** @param {string} key */
    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
        } catch (e) {
            console.error('Storage remove error:', e);
        }
    }
}

/**
 * Crea una instancia por defecto (localStorage sin prefijo).
 * @returns {LocalStorageAdapter}
 */
export function createDefaultStorage() {
    return new LocalStorageAdapter('');
}
