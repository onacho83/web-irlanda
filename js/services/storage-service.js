/**
 * StorageService - Abstracción sobre localStorage para facilitar pruebas y DI
 * Principio SOLID: Dependency Inversion + Single Responsibility
 */
class StorageService {
    constructor(storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
        this.storage = storage;
    }

    /**
     * Guarda un valor serializando a JSON
     * @param {string} key
     * @param {any} value
     */
    set(key, value) {
        if (!this.storage) return false;
        try {
            this.storage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('StorageService.set error:', error);
            return false;
        }
    }

    /**
     * Recupera un valor y lo parsea desde JSON
     * @param {string} key
     */
    get(key) {
        if (!this.storage) return null;
        try {
            const raw = this.storage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            console.error('StorageService.get error:', error);
            return null;
        }
    }

    /**
     * Elimina una clave del storage
     * @param {string} key
     */
    remove(key) {
        if (!this.storage) return false;
        try {
            this.storage.removeItem(key);
            return true;
        } catch (error) {
            console.error('StorageService.remove error:', error);
            return false;
        }
    }
}

export default StorageService;
