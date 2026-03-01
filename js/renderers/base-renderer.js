/**
 * Clase base para renderers (LSP).
 * Contrato: render(config) sin leer fuentes externas; todo viene en config.
 */

export default class BaseRenderer {
    /**
     * Renderiza el contenido según la configuración.
     * Las subclases deben implementar este método.
     * @param {Object} config - Configuración completa (empresa, servicios, welcome, etc.)
     */
    render(config) {
        throw new Error('Subclass must implement render(config)');
    }
}
