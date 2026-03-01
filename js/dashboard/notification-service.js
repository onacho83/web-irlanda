/**
 * Servicio de notificaciones (SRP).
 * Única responsabilidad: mostrar mensajes al usuario.
 */

export class NotificationService {
    /**
     * @param {Object} options
     * @param {string} [options.containerId='notification']
     * @param {string} [options.textId='notification-text']
     * @param {number} [options.autoHideMs=3000]
     */
    constructor(options = {}) {
        this.containerId = options.containerId || 'notification';
        this.textId = options.textId || 'notification-text';
        this.autoHideMs = options.autoHideMs ?? 3000;
    }

    /**
     * @param {string} message
     * @param {string} [type='info']
     */
    show(message, type = 'info') {
        const container = document.getElementById(this.containerId);
        const textEl = document.getElementById(this.textId);
        if (!container || !textEl) return;

        textEl.textContent = message;
        container.className = `notification notification-${type} show`;
        if (this.autoHideMs > 0) {
            setTimeout(() => container.classList.remove('show'), this.autoHideMs);
        }
    }
}

export default NotificationService;
