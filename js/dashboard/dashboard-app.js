/**
 * DashboardApp - Coordinador del dashboard (SRP + DIP).
 * Recibe dependencias inyectadas; delega UI de secciones y notificaciones.
 */
import { LocalStorageAdapter } from '../services/storage.js';
import ConfigStorage from './config-storage.js';
import ThemeManager from './theme-manager.js';
import BackgroundManager from './background-manager.js';
import SectionStyleManager from './section-style-manager.js';
import ContentManager from './content-manager.js';
import NotificationService from './notification-service.js';
import DashboardSectionControls from './dashboard-section-controls.js';
import { getAllSections } from './section-registry.js';

/**
 * Crea las dependencias por defecto (DIP: punto único de construcción).
 * @param {{ storage?: import('../services/storage.js').LocalStorageAdapter }} [options]
 * @returns {{ configStorage, themeManager, backgroundManager, sectionStyleManager, contentManager, notificationService, sectionControls }}
 */
export function createDashboardDependencies(options = {}) {
    const storage = options.storage || new LocalStorageAdapter('');
    const configStorage = new ConfigStorage({ storage });
    const themeManager = new ThemeManager(configStorage);
    const backgroundManager = new BackgroundManager(configStorage, themeManager);
    const sectionStyleManager = new SectionStyleManager(configStorage, themeManager);
    const contentManager = new ContentManager({ storage });
    const notificationService = new NotificationService();
    const sectionControls = new DashboardSectionControls({
        sectionStyleManager,
        notificationService
    });
    return {
        configStorage,
        themeManager,
        backgroundManager,
        sectionStyleManager,
        contentManager,
        notificationService,
        sectionControls
    };
}

class DashboardApp {
    /**
     * @param {ReturnType<createDashboardDependencies>} [deps] - Si no se pasan, se usan las por defecto
     */
    constructor(deps) {
        const d = deps || createDashboardDependencies();
        this.configStorage = d.configStorage;
        this.themeManager = d.themeManager;
        this.backgroundManager = d.backgroundManager;
        this.sectionStyleManager = d.sectionStyleManager;
        this.contentManager = d.contentManager;
        this.notificationService = d.notificationService;
        this.sectionControls = d.sectionControls;

        this.currentSection = getAllSections()[0]?.id || 'header';

        this.initializeControls();
        this.loadCurrentValues();
        this.loadContentValues();
    }

    initializeControls() {
        const hexTest = /^#[0-9A-F]{6}$/i;
        const colorInputs = ['primary', 'secondary', 'accent', 'background', 'backgroundLight'];

        colorInputs.forEach(colorName => {
            const colorInput = document.getElementById(`color-${colorName}`);
            const textInput = document.getElementById(`color-${colorName}-text`);
            if (colorInput && textInput) {
                colorInput.addEventListener('input', (e) => {
                    textInput.value = e.target.value.toUpperCase();
                    this.themeManager.updateColor(colorName, e.target.value);
                    this.notificationService.show(`Color ${colorName} actualizado`);
                });
                textInput.addEventListener('input', (e) => {
                    const v = e.target.value;
                    if (hexTest.test(v)) {
                        colorInput.value = v;
                        this.themeManager.updateColor(colorName, v);
                    }
                });
            }
        });

        const backgroundTypeSelect = document.getElementById('background-type');
        if (backgroundTypeSelect) {
            backgroundTypeSelect.addEventListener('change', (e) => {
                this.backgroundManager.updateBackgroundType(e.target.value);
                this.toggleBackgroundControls(e.target.value);
                this.notificationService.show('Tipo de fondo actualizado');
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
                const v = e.target.value;
                if (hexTest.test(v)) {
                    heroBackgroundColor.value = v;
                    this.backgroundManager.updateBackgroundColor(v);
                }
            });
        }

        const heroBackgroundImage = document.getElementById('hero-background-image');
        if (heroBackgroundImage) {
            heroBackgroundImage.addEventListener('input', (e) => {
                this.backgroundManager.updateBackgroundImage(e.target.value);
            });
        }

        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que quieres restablecer todos los valores por defecto?')) {
                    this.themeManager.reset();
                    this.loadCurrentValues();
                    this.notificationService.show('Valores restablecidos por defecto', 'success');
                }
            });
        }

        const refreshPreviewBtn = document.getElementById('refresh-preview-btn');
        if (refreshPreviewBtn) {
            refreshPreviewBtn.addEventListener('click', () => {
                const iframe = document.getElementById('preview-frame');
                if (iframe) {
                    iframe.src = iframe.src;
                    setTimeout(() => {
                        this.backgroundManager.applyToPreview();
                        this.sectionStyleManager.applySectionStyles();
                    }, 500);
                }
            });
        }

        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentSection = btn.dataset.section;
                this.sectionControls.render(this.currentSection);
            });
        });

        const saveEmpresaBtn = document.getElementById('save-empresa-btn');
        if (saveEmpresaBtn) {
            saveEmpresaBtn.addEventListener('click', () => this.saveEmpresaData());
        }

        const saveWelcomeBtn = document.getElementById('save-welcome-btn');
        if (saveWelcomeBtn) {
            saveWelcomeBtn.addEventListener('click', () => this.saveWelcomeMessage());
        }

        this._initTelefonosControls();
        this._initSucursalesControls();

        this._renderTelefonosList();
        this._renderSucursalesList();

        this.sectionControls.render(this.currentSection);
    }

    _initTelefonosControls() {
        const addBtn = document.getElementById('add-telefono-btn');
        const saveBtn = document.getElementById('save-telefono-btn');
        const cancelBtn = document.getElementById('cancel-telefono-btn');
        const form = document.getElementById('telefono-form');
        if (addBtn) addBtn.addEventListener('click', () => this._showTelefonoForm(-1));
        if (saveBtn) saveBtn.addEventListener('click', () => this._saveTelefono());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this._hideTelefonoForm());
    }

    _initSucursalesControls() {
        const addBtn = document.getElementById('add-sucursal-btn');
        const saveBtn = document.getElementById('save-sucursal-btn');
        const cancelBtn = document.getElementById('cancel-sucursal-btn');
        if (addBtn) addBtn.addEventListener('click', () => this._showSucursalForm(-1));
        if (saveBtn) saveBtn.addEventListener('click', () => this._saveSucursal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this._hideSucursalForm());
    }

    _renderTelefonosList() {
        const list = document.getElementById('telefonos-list');
        if (!list) return;
        const telefonos = this.contentManager.getTelefonos();
        list.innerHTML = telefonos.map((t, i) => `
            <div class="telefono-item" style="display:flex;align-items:center;gap:0.5rem;padding:0.5rem;background:#f9fafb;border-radius:0.375rem;">
                <span><strong>${t.etiqueta || 'Teléfono'}:</strong> ${t.numero}</span>
                <button type="button" class="btn btn-small" data-edit-telefono="${i}">Editar</button>
                <button type="button" class="btn btn-small btn-danger" data-delete-telefono="${i}">Eliminar</button>
            </div>
        `).join('') || '<p style="color:#6b7280;font-size:0.875rem;">No hay teléfonos. Agrega uno con el botón.</p>';
        list.querySelectorAll('[data-edit-telefono]').forEach(btn => {
            btn.addEventListener('click', () => this._showTelefonoForm(parseInt(btn.dataset.editTelefono, 10)));
        });
        list.querySelectorAll('[data-delete-telefono]').forEach(btn => {
            btn.addEventListener('click', () => this._deleteTelefono(parseInt(btn.dataset.deleteTelefono, 10)));
        });
    }

    _showTelefonoForm(index) {
        const form = document.getElementById('telefono-form');
        const numeroInput = document.getElementById('telefono-numero');
        const etiquetaInput = document.getElementById('telefono-etiqueta');
        const indexInput = document.getElementById('telefono-index');
        if (!form || !numeroInput) return;
        if (indexInput) indexInput.value = String(index);
        if (index >= 0) {
            const t = this.contentManager.getTelefonos()[index];
            numeroInput.value = t?.numero || '';
            etiquetaInput.value = t?.etiqueta || '';
        } else {
            numeroInput.value = '';
            etiquetaInput.value = '';
        }
        form.style.display = 'block';
    }

    _hideTelefonoForm() {
        const form = document.getElementById('telefono-form');
        if (form) form.style.display = 'none';
    }

    _saveTelefono() {
        const numero = (document.getElementById('telefono-numero') || {}).value?.trim();
        const etiqueta = (document.getElementById('telefono-etiqueta') || {}).value?.trim();
        const index = parseInt((document.getElementById('telefono-index') || {}).value, 10);
        if (!numero) {
            this.notificationService.show('El número es obligatorio', 'info');
            return;
        }
        const telefonos = [...this.contentManager.getTelefonos()];
        const item = { numero, etiqueta: etiqueta || undefined };
        if (index >= 0 && index < telefonos.length) {
            telefonos[index] = item;
        } else {
            telefonos.push(item);
        }
        this.contentManager.updateTelefonos(telefonos);
        this._renderTelefonosList();
        this._hideTelefonoForm();
        this.notificationService.show('Teléfono guardado', 'success');
    }

    _deleteTelefono(index) {
        const telefonos = this.contentManager.getTelefonos().filter((_, i) => i !== index);
        this.contentManager.updateTelefonos(telefonos);
        this._renderTelefonosList();
        this.notificationService.show('Teléfono eliminado', 'success');
    }

    _renderSucursalesList() {
        const list = document.getElementById('sucursales-list');
        if (!list) return;
        const sucursales = this.contentManager.getSucursales();
        list.innerHTML = sucursales.map((s, i) => `
            <div class="sucursal-item" style="padding:0.75rem;background:#f9fafb;border-radius:0.5rem;border:1px solid #e5e7eb;">
                <strong>${s.nombre || 'Sucursal'}</strong>
                <p style="margin:0.25rem 0 0;font-size:0.875rem;color:#4b5563;">${s.direccion || ''}</p>
                ${s.telefono ? `<p style="margin:0.125rem 0 0;font-size:0.875rem;">📞 ${s.telefono}</p>` : ''}
                <div style="margin-top:0.5rem;">
                    <button type="button" class="btn btn-small" data-edit-sucursal="${i}">Editar</button>
                    <button type="button" class="btn btn-small btn-danger" data-delete-sucursal="${i}">Eliminar</button>
                </div>
            </div>
        `).join('') || '<p style="color:#6b7280;font-size:0.875rem;">No hay sucursales. Agrega una con el botón.</p>';
        list.querySelectorAll('[data-edit-sucursal]').forEach(btn => {
            btn.addEventListener('click', () => this._showSucursalForm(parseInt(btn.dataset.editSucursal, 10)));
        });
        list.querySelectorAll('[data-delete-sucursal]').forEach(btn => {
            btn.addEventListener('click', () => this._deleteSucursal(parseInt(btn.dataset.deleteSucursal, 10)));
        });
    }

    _showSucursalForm(index) {
        const form = document.getElementById('sucursal-form');
        const indexInput = document.getElementById('sucursal-index');
        if (!form) return;
        if (indexInput) indexInput.value = String(index);
        if (index >= 0) {
            const s = this.contentManager.getSucursales()[index];
            const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
            set('sucursal-nombre', s?.nombre);
            set('sucursal-direccion', s?.direccion);
            set('sucursal-telefono', s?.telefono);
            set('sucursal-horario', s?.horario);
            set('sucursal-email', s?.email);
        } else {
            ['sucursal-nombre', 'sucursal-direccion', 'sucursal-telefono', 'sucursal-horario', 'sucursal-email'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
        }
        form.style.display = 'block';
    }

    _hideSucursalForm() {
        const form = document.getElementById('sucursal-form');
        if (form) form.style.display = 'none';
    }

    _saveSucursal() {
        const get = (id) => (document.getElementById(id) || {}).value?.trim();
        const nombre = get('sucursal-nombre');
        const direccion = get('sucursal-direccion');
        const telefono = get('sucursal-telefono');
        const horario = get('sucursal-horario');
        const email = get('sucursal-email');
        const index = parseInt((document.getElementById('sucursal-index') || {}).value, 10);
        if (!nombre || !direccion) {
            this.notificationService.show('Nombre y dirección son obligatorios', 'info');
            return;
        }
        const sucursales = [...this.contentManager.getSucursales()];
        const item = { nombre, direccion, telefono: telefono || undefined, horario: horario || undefined, email: email || undefined };
        if (index >= 0 && index < sucursales.length) {
            sucursales[index] = item;
        } else {
            sucursales.push(item);
        }
        this.contentManager.updateSucursales(sucursales);
        this._renderSucursalesList();
        this._hideSucursalForm();
        this.notificationService.show('Sucursal guardada', 'success');
    }

    _deleteSucursal(index) {
        const sucursales = this.contentManager.getSucursales().filter((_, i) => i !== index);
        this.contentManager.updateSucursales(sucursales);
        this._renderSucursalesList();
        this.notificationService.show('Sucursal eliminada', 'success');
    }

    toggleBackgroundControls(type) {
        const colorGroup = document.getElementById('hero-background-color-group');
        const imageGroup = document.getElementById('hero-background-image-group');
        if (colorGroup) colorGroup.style.display = type === 'solid' ? 'block' : 'none';
        if (imageGroup) imageGroup.style.display = type === 'image' ? 'block' : 'none';
    }

    loadCurrentValues() {
        const config = this.themeManager.getConfig();
        const colors = config.colors || {};
        const hero = config.hero || {};

        Object.entries(colors).forEach(([key, value]) => {
            const colorInput = document.getElementById(`color-${key}`);
            const textInput = document.getElementById(`color-${key}-text`);
            if (colorInput) colorInput.value = value;
            if (textInput) textInput.value = (value || '').toUpperCase();
        });

        const backgroundTypeSelect = document.getElementById('background-type');
        if (backgroundTypeSelect && hero.type) {
            backgroundTypeSelect.value = hero.type;
            this.toggleBackgroundControls(hero.type);
        }

        const heroBgColor = document.getElementById('hero-background-color');
        const heroBgColorText = document.getElementById('hero-background-color-text');
        if (hero.backgroundColor && heroBgColor) heroBgColor.value = hero.backgroundColor;
        if (hero.backgroundColor && heroBgColorText) heroBgColorText.value = hero.backgroundColor.toUpperCase();

        const heroBgImage = document.getElementById('hero-background-image');
        if (hero.backgroundImage && heroBgImage) heroBgImage.value = hero.backgroundImage;
    }

    async loadContentValues() {
        try {
            const content = await this.contentManager.loadContent();
            this._migrateContentForTelefonos(content);
            this.contentManager.saveContentToStorage(content);
            this._fillContentForm(content);
        } catch (error) {
            console.error('Error cargando contenido:', error);
            const stored = this.contentManager.loadContentFromStorage();
            this._fillContentForm(stored || {});
        }
    }

    _migrateContentForTelefonos(content) {
        const empresa = content?.empresa || {};
        if (!Array.isArray(empresa.telefonos) && empresa.telefono) {
            if (!content.empresa) content.empresa = {};
            content.empresa.telefonos = [{ numero: empresa.telefono, etiqueta: 'Principal' }];
        }
    }

    _fillContentForm(content) {
        const empresa = content.empresa || {};
        const welcome = content.welcome || {};
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
        set('empresa-nombre', empresa.nombre);
        set('empresa-email', empresa.email);
        set('empresa-direccion', empresa.direccion);
        set('empresa-horario', empresa.horario);
        set('welcome-titulo', welcome.titulo);
        set('welcome-subtitulo', welcome.subtitulo);
        this._renderTelefonosList();
        this._renderSucursalesList();
    }

    saveEmpresaData() {
        const get = (id) => (document.getElementById(id) || {}).value;
        const telefonos = this.contentManager.getTelefonos();
        const primaryTelefono = telefonos.length > 0 ? telefonos[0].numero : '';
        this.contentManager.updateEmpresaData({
            nombre: get('empresa-nombre'),
            telefono: primaryTelefono,
            email: get('empresa-email'),
            direccion: get('empresa-direccion'),
            horario: get('empresa-horario')
        });
        this.notificationService.show('Datos de empresa guardados en localStorage. Para aplicar cambios permanentes, actualiza config.json manualmente', 'success');
    }

    saveWelcomeMessage() {
        const titulo = (document.getElementById('welcome-titulo') || {}).value;
        const subtitulo = (document.getElementById('welcome-subtitulo') || {}).value;
        this.contentManager.updateWelcomeMessage(titulo, subtitulo);
        this.notificationService.show('Mensaje de bienvenida guardado', 'success');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DashboardApp();
});
