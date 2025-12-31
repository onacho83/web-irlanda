/**
 * PresentacionController - Extrae la lógica de la sección Presentación del DashboardApp
 */
class PresentacionController {
    constructor(contentManager, notifier = null, previewRefresher = null) {
        this.contentManager = contentManager;
        this.notifier = notifier || function() {};
        this.refreshPreview = previewRefresher || function() {};
    }

    loadValues(content) {
        const presentacion = content.presentacion || {};
        this._setInputValue('presentacion-titulo', presentacion.titulo);
        this._setInputValue('presentacion-texto', presentacion.texto);
        this._setInputValue('presentacion-lead', presentacion.lead);
        this._setInputValue('presentacion-imagen', presentacion.imagen);
        this._setInputValue('presentacion-cta-text', presentacion.ctaText);
        this._setInputValue('presentacion-cta-link', presentacion.ctaLink);
    }

    /**
     * Helper para asignar valor a un input si existe
     * @param {string} id
     * @param {string} value
     */
    _setInputValue(id, value) {
        const el = document.getElementById(id);
        if (!el) return;
        el.value = value || '';
    }

    save() {
        const titulo = document.getElementById('presentacion-titulo').value;
        const texto = document.getElementById('presentacion-texto').value;
        const lead = document.getElementById('presentacion-lead').value;
        const imagen = document.getElementById('presentacion-imagen').value;
        const ctaText = document.getElementById('presentacion-cta-text').value;
        const ctaLink = document.getElementById('presentacion-cta-link').value;

        this.contentManager.updatePresentacion({ titulo, texto, lead, imagen, ctaText, ctaLink });
        this.notifier('Presentación guardada', 'success');
        this.refreshPreview();
    }
}

export default PresentacionController;
