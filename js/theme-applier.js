/**
 * ThemeApplier - Aplica el tema desde un almacenamiento inyectado (SRP + DIP).
 * Delega la lógica de hero y secciones a módulos compartidos.
 */
import { applyHeroBackgroundToElement } from './theme/hero-style-applicator.js';
import { applySectionStylesToElement } from './theme/section-style-applicator.js';

const DEFAULT_STORAGE_KEY = 'imprenta-theme-config';

const COLOR_MAP = {
    primary: '--color-primary',
    secondary: '--color-secondary',
    accent: '--color-accent',
    background: '--color-background',
    backgroundLight: '--color-background-light',
    border: '--color-border'
};

export default class ThemeApplier {
    /**
     * @param {Object} [options]
     * @param {import('./services/storage.js').StorageAdapter} [options.storage] - Abstracción de almacenamiento
     * @param {string} [options.storageKey]
     */
    constructor(options = {}) {
        this.storage = options.storage || null;
        this.storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;
    }

    _getStored() {
        if (this.storage) {
            return this.storage.get(this.storageKey);
        }
        try {
            return localStorage.getItem(this.storageKey);
        } catch (e) {
            return null;
        }
    }

    apply() {
        try {
            const stored = this._getStored();
            if (!stored) return;

            const config = JSON.parse(stored);
            const root = document.documentElement;
            const colors = config.colors || {};

            Object.entries(COLOR_MAP).forEach(([key, cssVar]) => {
                if (colors[key]) root.style.setProperty(cssVar, colors[key]);
            });

            const heroSection = document.getElementById('hero');
            if (heroSection && config.hero) {
                const getPrimary = () => getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#2563eb';
                const getSecondary = () => getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim() || '#1e40af';
                applyHeroBackgroundToElement(heroSection, config.hero, getPrimary, getSecondary);
            }
        } catch (error) {
            console.error('Error aplicando tema:', error);
        }
    }

    applySectionStyles() {
        try {
            const stored = this._getStored();
            if (!stored) return;

            const config = JSON.parse(stored);
            const sections = config.sections || {};
            Object.entries(sections).forEach(([sectionId, styles]) => {
                const section = document.getElementById(sectionId);
                if (section) applySectionStylesToElement(section, styles);
            });
        } catch (error) {
            console.error('Error aplicando estilos de secciones:', error);
        }
    }
}
