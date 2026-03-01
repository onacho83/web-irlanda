/**
 * SectionStyleManager - Gestor de estilos por sección (SRP).
 * Delega la aplicación visual al aplicador compartido.
 */
import { applySectionStylesToElement } from '../theme/section-style-applicator.js';

class SectionStyleManager {
    constructor(configStorage, themeManager) {
        this.configStorage = configStorage;
        this.themeManager = themeManager;
        this.config = this.themeManager.getConfig();
    }

    applySectionStyles() {
        this.config = this.themeManager.getConfig();
        const sections = this.config.sections || {};
        Object.entries(sections).forEach(([sectionId, styles]) => {
            this.applySectionStyle(sectionId, styles);
        });
    }

    /**
     * @param {string} sectionId
     * @param {Object} styles
     */
    applySectionStyle(sectionId, styles) {
        const section = document.getElementById(sectionId) || document.querySelector(`#${sectionId}`);
        if (section) applySectionStylesToElement(section, styles);
    }

    updateSectionStyle(sectionId, property, value) {
        this.config = this.themeManager.getConfig();
        if (!this.config.sections) this.config.sections = {};
        if (!this.config.sections[sectionId]) this.config.sections[sectionId] = {};
        if (value === '' || value === null) {
            delete this.config.sections[sectionId][property];
        } else {
            this.config.sections[sectionId][property] = value;
        }
        this.saveConfig();
        this.applySectionStyle(sectionId, this.config.sections[sectionId]);
    }

    getSectionStyles(sectionId) {
        this.config = this.themeManager.getConfig();
        return this.config.sections?.[sectionId] || {};
    }

    saveConfig() {
        this.config = this.themeManager.getConfig();
        this.configStorage.save(this.config);
    }
}

export default SectionStyleManager;
