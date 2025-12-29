/**
 * DashboardApp - Aplicación principal del dashboard
 * Principio SOLID: Single Responsibility - Coordina los componentes del dashboard
 */
import ConfigStorage from './config-storage.js';
import ThemeManager from './theme-manager.js';
import BackgroundManager from './background-manager.js';
import SectionStyleManager from './section-style-manager.js';
import ContentManager from './content-manager.js';

class DashboardApp {
    constructor() {
        this.configStorage = new ConfigStorage();
        this.themeManager = new ThemeManager(this.configStorage);
        this.backgroundManager = new BackgroundManager(this.configStorage, this.themeManager);
        this.sectionStyleManager = new SectionStyleManager(this.configStorage, this.themeManager);
        this.contentManager = new ContentManager(this.configStorage);
        
        this.currentSection = 'header';
        
        this.initializeControls();
        this.loadCurrentValues();
        this.loadContentValues();
    }

    /**
     * Inicializa los controles del dashboard
     */
    initializeControls() {
        // Color inputs (sin text y textLight - cada sección gestiona su propio color)
        const colorInputs = [
            'primary', 'secondary', 'accent',
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
                        this.sectionStyleManager.applySectionStyles();
                    }, 500);
                }
            });
        }

        // Section tabs
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentSection = btn.dataset.section;
                this.renderSectionControls(this.currentSection);
            });
        });

        // Save empresa button
        const saveEmpresaBtn = document.getElementById('save-empresa-btn');
        if (saveEmpresaBtn) {
            saveEmpresaBtn.addEventListener('click', () => {
                this.saveEmpresaData();
            });
        }

        // Save welcome button
        const saveWelcomeBtn = document.getElementById('save-welcome-btn');
        if (saveWelcomeBtn) {
            saveWelcomeBtn.addEventListener('click', () => {
                this.saveWelcomeMessage();
            });
        }

        // Initialize section controls
        this.renderSectionControls(this.currentSection);
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
     * Renderiza los controles de estilos para una sección específica
     * @param {string} sectionId - ID de la sección
     */
    renderSectionControls(sectionId) {
        const container = document.getElementById('section-styles-container');
        if (!container) return;

        const styles = this.sectionStyleManager.getSectionStyles(sectionId);
        const sectionNames = {
            header: 'Header',
            hero: 'Hero',
            servicios: 'Servicios',
            contacto: 'Contacto',
            footer: 'Footer'
        };

        // Obtener color por defecto según la sección
        const defaultTextColors = {
            header: '#1f2937',
            hero: '#ffffff',
            servicios: '#1f2937',
            contacto: '#1f2937',
            footer: '#ffffff'
        };

        container.innerHTML = `
            <h3 style="margin-bottom: 1rem;">Estilos de ${sectionNames[sectionId]}</h3>
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
                        <input type="color" id="section-text-${sectionId}" value="${styles.textColor || defaultTextColors[sectionId] || '#000000'}">
                        <input type="text" id="section-text-${sectionId}-text" value="${styles.textColor || defaultTextColors[sectionId] || '#000000'}" class="color-text-input">
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

        // Event listeners para los controles de la sección
        const bgInput = document.getElementById(`section-bg-${sectionId}`);
        const bgTextInput = document.getElementById(`section-bg-${sectionId}-text`);
        const textInput = document.getElementById(`section-text-${sectionId}`);
        const textTextInput = document.getElementById(`section-text-${sectionId}-text`);
        const imageInput = document.getElementById(`section-image-${sectionId}`);
        const clearBgBtn = document.getElementById(`clear-bg-${sectionId}`);
        const clearTextBtn = document.getElementById(`clear-text-${sectionId}`);
        const clearImageBtn = document.getElementById(`clear-image-${sectionId}`);

        if (bgInput && bgTextInput) {
            bgInput.addEventListener('input', (e) => {
                bgTextInput.value = e.target.value.toUpperCase();
                this.sectionStyleManager.updateSectionStyle(sectionId, 'backgroundColor', e.target.value);
                this.showNotification(`Fondo de ${sectionNames[sectionId]} actualizado`);
            });

            bgTextInput.addEventListener('input', (e) => {
                const colorValue = e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(colorValue)) {
                    bgInput.value = colorValue;
                    this.sectionStyleManager.updateSectionStyle(sectionId, 'backgroundColor', colorValue);
                }
            });
        }

        if (textInput && textTextInput) {
            textInput.addEventListener('input', (e) => {
                textTextInput.value = e.target.value.toUpperCase();
                this.sectionStyleManager.updateSectionStyle(sectionId, 'textColor', e.target.value);
                this.showNotification(`Texto de ${sectionNames[sectionId]} actualizado`);
            });

            textTextInput.addEventListener('input', (e) => {
                const colorValue = e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(colorValue)) {
                    textInput.value = colorValue;
                    this.sectionStyleManager.updateSectionStyle(sectionId, 'textColor', colorValue);
                }
            });
        }

        if (imageInput) {
            imageInput.addEventListener('input', (e) => {
                this.sectionStyleManager.updateSectionStyle(sectionId, 'backgroundImage', e.target.value);
                this.showNotification(`Imagen de fondo de ${sectionNames[sectionId]} actualizada`);
            });
        }

        if (clearBgBtn) {
            clearBgBtn.addEventListener('click', () => {
                this.sectionStyleManager.updateSectionStyle(sectionId, 'backgroundColor', null);
                bgInput.value = '#ffffff';
                bgTextInput.value = '#ffffff';
                this.showNotification(`Fondo de ${sectionNames[sectionId]} limpiado`);
            });
        }

        if (clearTextBtn) {
            clearTextBtn.addEventListener('click', () => {
                this.sectionStyleManager.updateSectionStyle(sectionId, 'textColor', null);
                const defaultColor = defaultTextColors[sectionId] || '#000000';
                textInput.value = defaultColor;
                textTextInput.value = defaultColor;
                this.showNotification(`Texto de ${sectionNames[sectionId]} limpiado`);
            });
        }

        if (clearImageBtn) {
            clearImageBtn.addEventListener('click', () => {
                this.sectionStyleManager.updateSectionStyle(sectionId, 'backgroundImage', null);
                imageInput.value = '';
                this.showNotification(`Imagen de fondo de ${sectionNames[sectionId]} limpiada`);
            });
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
     * Carga los valores de contenido (empresa, mensaje de bienvenida)
     */
    async loadContentValues() {
        try {
            // Cargar desde config.json primero
            const content = await this.contentManager.loadContent();
            
            // Guardar en localStorage para el dashboard
            this.contentManager.saveContentToStorage(content);

            // Cargar datos de empresa
            const empresa = content.empresa || {};
            const empresaNombre = document.getElementById('empresa-nombre');
            const empresaTelefono = document.getElementById('empresa-telefono');
            const empresaEmail = document.getElementById('empresa-email');
            const empresaDireccion = document.getElementById('empresa-direccion');
            const empresaHorario = document.getElementById('empresa-horario');
            
            if (empresaNombre) empresaNombre.value = empresa.nombre || '';
            if (empresaTelefono) empresaTelefono.value = empresa.telefono || '';
            if (empresaEmail) empresaEmail.value = empresa.email || '';
            if (empresaDireccion) empresaDireccion.value = empresa.direccion || '';
            if (empresaHorario) empresaHorario.value = empresa.horario || '';

            // Cargar mensaje de bienvenida
            const welcome = content.welcome || {};
            const welcomeTitulo = document.getElementById('welcome-titulo');
            const welcomeSubtitulo = document.getElementById('welcome-subtitulo');
            
            if (welcomeTitulo) welcomeTitulo.value = welcome.titulo || '';
            if (welcomeSubtitulo) welcomeSubtitulo.value = welcome.subtitulo || '';
        } catch (error) {
            console.error('Error cargando contenido:', error);
            // Intentar cargar desde localStorage
            const stored = this.contentManager.loadContentFromStorage();
            if (stored) {
                const empresa = stored.empresa || {};
                const empresaNombre = document.getElementById('empresa-nombre');
                const empresaTelefono = document.getElementById('empresa-telefono');
                const empresaEmail = document.getElementById('empresa-email');
                const empresaDireccion = document.getElementById('empresa-direccion');
                const empresaHorario = document.getElementById('empresa-horario');
                
                if (empresaNombre) empresaNombre.value = empresa.nombre || '';
                if (empresaTelefono) empresaTelefono.value = empresa.telefono || '';
                if (empresaEmail) empresaEmail.value = empresa.email || '';
                if (empresaDireccion) empresaDireccion.value = empresa.direccion || '';
                if (empresaHorario) empresaHorario.value = empresa.horario || '';

                const welcome = stored.welcome || {};
                const welcomeTitulo = document.getElementById('welcome-titulo');
                const welcomeSubtitulo = document.getElementById('welcome-subtitulo');
                
                if (welcomeTitulo) welcomeTitulo.value = welcome.titulo || '';
                if (welcomeSubtitulo) welcomeSubtitulo.value = welcome.subtitulo || '';
            }
        }
    }

    /**
     * Guarda los datos de la empresa
     */
    saveEmpresaData() {
        const empresaData = {
            nombre: document.getElementById('empresa-nombre').value,
            telefono: document.getElementById('empresa-telefono').value,
            email: document.getElementById('empresa-email').value,
            direccion: document.getElementById('empresa-direccion').value,
            horario: document.getElementById('empresa-horario').value
        };

        this.contentManager.updateEmpresaData(empresaData);
        this.showNotification('Datos de empresa guardados en localStorage. Para aplicar cambios permanentes, actualiza config.json manualmente', 'success');
    }

    /**
     * Guarda el mensaje de bienvenida
     */
    saveWelcomeMessage() {
        const titulo = document.getElementById('welcome-titulo').value;
        const subtitulo = document.getElementById('welcome-subtitulo').value;

        this.contentManager.updateWelcomeMessage(titulo, subtitulo);
        this.showNotification('Mensaje de bienvenida guardado', 'success');
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
