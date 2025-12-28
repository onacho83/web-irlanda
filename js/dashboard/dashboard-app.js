/**
 * DashboardApp - Aplicación principal del dashboard
 * Principio SOLID: Single Responsibility - Coordina los componentes del dashboard
 */
import ConfigStorage from './config-storage.js';
import ThemeManager from './theme-manager.js';
import BackgroundManager from './background-manager.js';

class DashboardApp {
    constructor() {
        this.configStorage = new ConfigStorage();
        this.themeManager = new ThemeManager(this.configStorage);
        this.backgroundManager = new BackgroundManager(this.configStorage, this.themeManager);
        
        this.initializeControls();
        this.loadCurrentValues();
    }

    /**
     * Inicializa los controles del dashboard
     */
    initializeControls() {
        // Color inputs
        const colorInputs = [
            'primary', 'secondary', 'accent', 'text', 'textLight',
            'background', 'backgroundLight'
        ];

        colorInputs.forEach(colorName => {
            const colorInput = document.getElementById(`color-${colorName}`);
            const textInput = document.getElementById(`color-${colorName}-text`);

            if (colorInput && textInput) {
                // Sincronizar color picker con input de texto
                colorInput.addEventListener('input', (e) => {
                    textInput.value = e.target.value.toUpperCase();
                    this.updateColor(colorName, e.target.value);
                });

                // Sincronizar input de texto con color picker
                textInput.addEventListener('input', (e) => {
                    const colorValue = e.target.value;
                    if (/^#[0-9A-F]{6}$/i.test(colorValue)) {
                        colorInput.value = colorValue;
                        this.updateColor(colorName, colorValue);
                    }
                });
            }
        });

        // Hero background controls
        const backgroundTypeSelect = document.getElementById('background-type');
        if (backgroundTypeSelect) {
            backgroundTypeSelect.addEventListener('change', (e) => {
                this.updateBackgroundType(e.target.value);
                this.toggleBackgroundControls(e.target.value);
            });
        }

        const heroBackgroundColor = document.getElementById('hero-background-color');
        const heroBackgroundColorText = document.getElementById('hero-background-color-text');
        if (heroBackgroundColor && heroBackgroundColorText) {
            heroBackgroundColor.addEventListener('input', (e) => {
                heroBackgroundColorText.value = e.target.value.toUpperCase();
                this.backgroundManager.updateBackgroundColor(e.target.value);
            });

            heroBackgroundColorText.addEventListener('input', (e) => {
                const colorValue = e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(colorValue)) {
                    heroBackgroundColor.value = colorValue;
                    this.backgroundManager.updateBackgroundColor(colorValue);
                }
            });
        }

        const heroBackgroundImage = document.getElementById('hero-background-image');
        if (heroBackgroundImage) {
            heroBackgroundImage.addEventListener('input', (e) => {
                this.backgroundManager.updateBackgroundImage(e.target.value);
            });
        }

        // Reset button
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que quieres restablecer todos los valores por defecto?')) {
                    this.reset();
                }
            });
        }

        // Refresh preview button
        const refreshPreviewBtn = document.getElementById('refresh-preview-btn');
        if (refreshPreviewBtn) {
            refreshPreviewBtn.addEventListener('click', () => {
                const iframe = document.getElementById('preview-frame');
                if (iframe) {
                    iframe.src = iframe.src; // Recargar iframe
                    setTimeout(() => {
                        this.backgroundManager.applyToPreview();
                    }, 500);
                }
            });
        }
    }

    /**
     * Actualiza un color
     * @param {string} colorName - Nombre del color
     * @param {string} colorValue - Valor del color
     */
    updateColor(colorName, colorValue) {
        this.themeManager.updateColor(colorName, colorValue);
        this.showNotification(`Color ${colorName} actualizado`);
    }

    /**
     * Actualiza el tipo de fondo del hero
     * @param {string} type - Tipo de fondo
     */
    updateBackgroundType(type) {
        this.backgroundManager.updateBackgroundType(type);
        this.showNotification('Tipo de fondo actualizado');
    }

    /**
     * Muestra/oculta controles según el tipo de fondo
     * @param {string} type - Tipo de fondo seleccionado
     */
    toggleBackgroundControls(type) {
        const colorGroup = document.getElementById('hero-background-color-group');
        const imageGroup = document.getElementById('hero-background-image-group');

        if (type === 'solid') {
            colorGroup.style.display = 'block';
            imageGroup.style.display = 'none';
        } else if (type === 'image') {
            colorGroup.style.display = 'none';
            imageGroup.style.display = 'block';
        } else {
            colorGroup.style.display = 'none';
            imageGroup.style.display = 'none';
        }
    }

    /**
     * Carga los valores actuales en los controles
     */
    loadCurrentValues() {
        const config = this.themeManager.getConfig();
        const colors = config.colors || {};
        const hero = config.hero || {};

        // Cargar colores
        Object.entries(colors).forEach(([key, value]) => {
            const colorInput = document.getElementById(`color-${key}`);
            const textInput = document.getElementById(`color-${key}-text`);
            
            if (colorInput) colorInput.value = value;
            if (textInput) textInput.value = value.toUpperCase();
        });

        // Cargar configuración del hero
        const backgroundTypeSelect = document.getElementById('background-type');
        if (backgroundTypeSelect && hero.type) {
            backgroundTypeSelect.value = hero.type;
            this.toggleBackgroundControls(hero.type);
        }

        if (hero.backgroundColor) {
            const heroBgColor = document.getElementById('hero-background-color');
            const heroBgColorText = document.getElementById('hero-background-color-text');
            if (heroBgColor) heroBgColor.value = hero.backgroundColor;
            if (heroBgColorText) heroBgColorText.value = hero.backgroundColor.toUpperCase();
        }

        if (hero.backgroundImage) {
            const heroBgImage = document.getElementById('hero-background-image');
            if (heroBgImage) heroBgImage.value = hero.backgroundImage;
        }
    }

    /**
     * Restablece todos los valores por defecto
     */
    reset() {
        const defaults = this.themeManager.reset();
        this.backgroundManager.config = defaults;
        this.loadCurrentValues();
        this.showNotification('Valores restablecidos por defecto', 'success');
    }

    /**
     * Muestra una notificación
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de notificación
     */
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        
        if (notification && notificationText) {
            notificationText.textContent = message;
            notification.className = `notification notification-${type} show`;
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new DashboardApp();
});

