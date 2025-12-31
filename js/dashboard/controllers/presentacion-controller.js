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
        // content: may be from config.json or storage
        const presentacion = content.presentacion || {};
        const presentacionTitulo = document.getElementById('presentacion-titulo');
        const presentacionTexto = document.getElementById('presentacion-texto');
        const presentacionLead = document.getElementById('presentacion-lead');
        const presentacionImagen = document.getElementById('presentacion-imagen');
        const presentacionCtaText = document.getElementById('presentacion-cta-text');
        const presentacionCtaLink = document.getElementById('presentacion-cta-link');

        if (presentacionTitulo) presentacionTitulo.value = presentacion.titulo || '';
        if (presentacionTexto) presentacionTexto.value = presentacion.texto || '';
        if (presentacionLead) presentacionLead.value = presentacion.lead || '';
        if (presentacionImagen) presentacionImagen.value = presentacion.imagen || '';
        if (presentacionCtaText) presentacionCtaText.value = presentacion.ctaText || '';
        if (presentacionCtaLink) presentacionCtaLink.value = presentacion.ctaLink || '';
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
