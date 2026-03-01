/**
 * DashboardSectionControls - UI de controles por sección (SRP).
 * Única responsabilidad: construir y enlazar los controles de estilos por sección.
 */
import { getSectionDisplayName, getDefaultTextColor } from './section-registry.js';

export default class DashboardSectionControls {
    /**
     * @param {Object} deps
     * @param {import('./section-style-manager.js').default} deps.sectionStyleManager
     * @param {import('./notification-service.js').NotificationService} deps.notificationService
     */
    constructor(deps) {
        this.sectionStyleManager = deps.sectionStyleManager;
        this.notificationService = deps.notificationService;
    }

    /**
     * Renderiza los controles para una sección y enlaza eventos.
     * @param {string} sectionId
     */
    render(sectionId) {
        const container = document.getElementById('section-styles-container');
        if (!container) return;

        const styles = this.sectionStyleManager.getSectionStyles(sectionId);
        const displayName = getSectionDisplayName(sectionId);
        const defaultTextColor = getDefaultTextColor(sectionId);

        container.innerHTML = `
            <h3 style="margin-bottom: 1rem;">Estilos de ${displayName}</h3>
            <div class="controls-grid">
                <div class="control-group">
                    <label for="section-bg-${sectionId}">Color de Fondo</label>
                    <div class="color-input-wrapper">
                        <input type="color" id="section-bg-${sectionId}" value="${styles.backgroundColor || '#ffffff'}">
                        <input type="text" id="section-bg-${sectionId}-text" value="${styles.backgroundColor || '#ffffff'}" class="color-text-input">
                        <button class="btn btn-small" id="clear-bg-${sectionId}">Limpiar</button>
                    </div>
                </div>
                <div class="control-group">
                    <label for="section-text-${sectionId}">Color de Texto (todos los textos de la sección)</label>
                    <div class="color-input-wrapper">
                        <input type="color" id="section-text-${sectionId}" value="${styles.textColor || defaultTextColor}">
                        <input type="text" id="section-text-${sectionId}-text" value="${styles.textColor || defaultTextColor}" class="color-text-input">
                        <button class="btn btn-small" id="clear-text-${sectionId}">Limpiar</button>
                    </div>
                    <small>Aplica el color a todos los textos dentro de esta sección</small>
                </div>
                <div class="control-group">
                    <label for="section-image-${sectionId}">Imagen de Fondo (URL)</label>
                    <input type="text" id="section-image-${sectionId}" class="text-input" value="${styles.backgroundImage || ''}" placeholder="https://ejemplo.com/imagen.jpg">
                    <button class="btn btn-small" id="clear-image-${sectionId}" style="margin-top: 0.5rem;">Limpiar Imagen</button>
                </div>
            </div>
        `;

        this._bindEvents(sectionId, displayName, defaultTextColor);
    }

    _bindEvents(sectionId, displayName, defaultTextColor) {
        const bgInput = document.getElementById(`section-bg-${sectionId}`);
        const bgTextInput = document.getElementById(`section-bg-${sectionId}-text`);
        const textInput = document.getElementById(`section-text-${sectionId}`);
        const textTextInput = document.getElementById(`section-text-${sectionId}-text`);
        const imageInput = document.getElementById(`section-image-${sectionId}`);
        const clearBgBtn = document.getElementById(`clear-bg-${sectionId}`);
        const clearTextBtn = document.getElementById(`clear-text-${sectionId}`);
        const clearImageBtn = document.getElementById(`clear-image-${sectionId}`);
        const sm = this.sectionStyleManager;
        const notif = this.notificationService;

        const hexTest = /^#[0-9A-F]{6}$/i;

        if (bgInput && bgTextInput) {
            bgInput.addEventListener('input', (e) => {
                bgTextInput.value = e.target.value.toUpperCase();
                sm.updateSectionStyle(sectionId, 'backgroundColor', e.target.value);
                notif.show(`Fondo de ${displayName} actualizado`);
            });
            bgTextInput.addEventListener('input', (e) => {
                const v = e.target.value;
                if (hexTest.test(v)) {
                    bgInput.value = v;
                    sm.updateSectionStyle(sectionId, 'backgroundColor', v);
                }
            });
        }
        if (textInput && textTextInput) {
            textInput.addEventListener('input', (e) => {
                textTextInput.value = e.target.value.toUpperCase();
                sm.updateSectionStyle(sectionId, 'textColor', e.target.value);
                notif.show(`Texto de ${displayName} actualizado`);
            });
            textTextInput.addEventListener('input', (e) => {
                const v = e.target.value;
                if (hexTest.test(v)) {
                    textInput.value = v;
                    sm.updateSectionStyle(sectionId, 'textColor', v);
                }
            });
        }
        if (imageInput) {
            imageInput.addEventListener('input', (e) => {
                sm.updateSectionStyle(sectionId, 'backgroundImage', e.target.value);
                notif.show(`Imagen de fondo de ${displayName} actualizada`);
            });
        }
        if (clearBgBtn && bgInput && bgTextInput) {
            clearBgBtn.addEventListener('click', () => {
                sm.updateSectionStyle(sectionId, 'backgroundColor', null);
                bgInput.value = '#ffffff';
                bgTextInput.value = '#ffffff';
                notif.show(`Fondo de ${displayName} limpiado`);
            });
        }
        if (clearTextBtn && textInput && textTextInput) {
            clearTextBtn.addEventListener('click', () => {
                sm.updateSectionStyle(sectionId, 'textColor', null);
                textInput.value = defaultTextColor;
                textTextInput.value = defaultTextColor;
                notif.show(`Texto de ${displayName} limpiado`);
            });
        }
        if (clearImageBtn && imageInput) {
            clearImageBtn.addEventListener('click', () => {
                sm.updateSectionStyle(sectionId, 'backgroundImage', null);
                imageInput.value = '';
                notif.show(`Imagen de fondo de ${displayName} limpiada`);
            });
        }
    }
}
