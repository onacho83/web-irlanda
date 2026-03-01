/**
 * BackgroundManager - Gestor de fondos del hero (SRP).
 * Usa el aplicador compartido para no duplicar lógica.
 */
import { applyHeroBackgroundToElement } from '../theme/hero-style-applicator.js';

class BackgroundManager {
    constructor(configStorage, themeManager) {
        this.configStorage = configStorage;
        this.themeManager = themeManager;
        this.config = this.themeManager.getConfig();
    }

    applyHeroBackground() {
        this.config = this.themeManager.getConfig();
        const heroConfig = this.config.hero || {};
        const heroSection = document.querySelector('#hero');

        if (!heroSection) {
            this.applyToPreview();
            return;
        }
        const getPrimary = () => this.themeManager.getColor('primary') || '#2563eb';
        const getSecondary = () => this.themeManager.getColor('secondary') || '#1e40af';
        applyHeroBackgroundToElement(heroSection, heroConfig, getPrimary, getSecondary);
    }

    applyToPreview() {
        this.config = this.themeManager.getConfig();
        const iframe = document.getElementById('preview-frame');
        if (!iframe || !iframe.contentWindow) return;
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const heroSection = iframeDoc.querySelector('#hero');
            if (heroSection) {
                const getPrimary = () => this.themeManager.getColor('primary') || '#2563eb';
                const getSecondary = () => this.themeManager.getColor('secondary') || '#1e40af';
                applyHeroBackgroundToElement(heroSection, this.config.hero || {}, getPrimary, getSecondary);
            }
        } catch (e) {
            console.warn('No se pudo acceder al iframe (CORS):', e);
        }
    }

    updateBackgroundType(type) {
        this.config = this.themeManager.getConfig();
        if (!this.config.hero) this.config.hero = {};
        this.config.hero.type = type;
        this.saveConfig();
        this.applyHeroBackground();
    }

    updateBackgroundColor(color) {
        this.config = this.themeManager.getConfig();
        if (!this.config.hero) this.config.hero = {};
        this.config.hero.backgroundColor = color;
        this.saveConfig();
        this.applyHeroBackground();
    }

    updateBackgroundImage(imageUrl) {
        this.config = this.themeManager.getConfig();
        if (!this.config.hero) this.config.hero = {};
        this.config.hero.backgroundImage = imageUrl;
        this.saveConfig();
        this.applyHeroBackground();
    }

    saveConfig() {
        this.config = this.themeManager.getConfig();
        this.configStorage.save(this.config);
    }
}

export default BackgroundManager;
