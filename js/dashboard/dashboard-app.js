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
        this.currentSucursalIndex = -1; // Para rastrear qué sucursal se está editando

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

        const editEmpresaBtn = document.getElementById('edit-empresa-btn');
        const saveEmpresaBtn = document.getElementById('save-empresa-btn');
        const cancelEmpresaBtn = document.getElementById('cancel-empresa-btn');
        
        if (editEmpresaBtn) {
            editEmpresaBtn.addEventListener('click', () => this._showEmpresaForm());
        }
        if (saveEmpresaBtn) {
            saveEmpresaBtn.addEventListener('click', () => this.saveEmpresaData());
        }
        if (cancelEmpresaBtn) {
            cancelEmpresaBtn.addEventListener('click', () => this._hideEmpresaForm());
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
        const addTelBtn = document.getElementById('add-sucursal-telefono-btn');
        const saveTelBtn = document.getElementById('save-sucursal-telefono-btn');
        const cancelTelBtn = document.getElementById('cancel-sucursal-telefono-btn');
        
        if (addBtn) addBtn.addEventListener('click', () => this._showSucursalForm(-1));
        if (saveBtn) saveBtn.addEventListener('click', () => this._saveSucursal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this._hideSucursalForm());
        if (addTelBtn) addTelBtn.addEventListener('click', () => this._showSucursalTelefonoForm(-1));
        if (saveTelBtn) saveTelBtn.addEventListener('click', () => this._saveSucursalTelefono());
        if (cancelTelBtn) cancelTelBtn.addEventListener('click', () => this._hideSucursalTelefonoForm());
    }

    _renderTelefonosList() {
        const list = document.getElementById('telefonos-list');
        if (!list) return;
        const telefonos = this.contentManager.getTelefonos();
        list.innerHTML = telefonos.map((t, i) => {
            const whatsappBadge = t.whatsapp ? '<span style="display:inline-block;background:#25d366;color:white;padding:0.25rem 0.5rem;border-radius:0.25rem;font-size:0.75rem;margin-left:0.5rem;">WhatsApp</span>' : '';
            return `
            <div class="telefono-item" style="display:flex;align-items:center;gap:0.5rem;padding:0.5rem;background:#f9fafb;border-radius:0.375rem;">
                <span><strong>${t.etiqueta || 'Teléfono'}:</strong> ${t.numero}${whatsappBadge}</span>
                <button type="button" class="btn btn-small" data-edit-telefono="${i}">Editar</button>
                <button type="button" class="btn btn-small btn-danger" data-delete-telefono="${i}">Eliminar</button>
            </div>
        `;
        }).join('') || '<p style="color:#6b7280;font-size:0.875rem;">No hay teléfonos. Agrega uno con el botón.</p>';
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
        const whatsappInput = document.getElementById('telefono-whatsapp');
        const indexInput = document.getElementById('telefono-index');
        if (!form || !numeroInput) return;
        if (indexInput) indexInput.value = String(index);
        if (index >= 0) {
            const t = this.contentManager.getTelefonos()[index];
            numeroInput.value = t?.numero || '';
            etiquetaInput.value = t?.etiqueta || '';
            if (whatsappInput) whatsappInput.checked = t?.whatsapp || false;
        } else {
            numeroInput.value = '';
            etiquetaInput.value = '';
            if (whatsappInput) whatsappInput.checked = false;
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
        const whatsapp = (document.getElementById('telefono-whatsapp') || {}).checked || false;
        const index = parseInt((document.getElementById('telefono-index') || {}).value, 10);
        if (!numero) {
            this.notificationService.show('El número es obligatorio', 'info');
            return;
        }
        const telefonos = [...this.contentManager.getTelefonos()];
        const item = { numero, etiqueta: etiqueta || undefined, whatsapp };
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
        list.innerHTML = sucursales.map((s, i) => {
            const telefonosHTML = (s.telefonos || []).map(t => 
                `<p style="margin:0.125rem 0 0;font-size:0.875rem;">📞 ${t.numero}${t.whatsapp ? ' <span style="color:#25d366;"><i class="fab fa-whatsapp"></i></span>' : ''}</p>`
            ).join('') || (s.telefono ? `<p style="margin:0.125rem 0 0;font-size:0.875rem;">📞 ${s.telefono}</p>` : '');
            
            return `
            <div class="sucursal-item" style="padding:0.75rem;background:#f9fafb;border-radius:0.5rem;border:1px solid #e5e7eb;">
                <strong>${s.nombre || 'Sucursal'}</strong>
                <p style="margin:0.25rem 0 0;font-size:0.875rem;color:#4b5563;">${s.direccion || ''}</p>
                ${telefonosHTML}
                <div style="margin-top:0.5rem;">
                    <button type="button" class="btn btn-small" data-edit-sucursal="${i}">Editar</button>
                    <button type="button" class="btn btn-small btn-danger" data-delete-sucursal="${i}">Eliminar</button>
                </div>
            </div>
        `;
        }).join('') || '<p style="color:#6b7280;font-size:0.875rem;">No hay sucursales. Agrega una con el botón.</p>';
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
        
        this.currentSucursalIndex = index;
        if (indexInput) indexInput.value = String(index);
        
        if (index >= 0) {
            const s = this.contentManager.getSucursales()[index];
            const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
            set('sucursal-nombre', s?.nombre);
            set('sucursal-direccion', s?.direccion);
            set('sucursal-horario', s?.horario);
            set('sucursal-email', s?.email);
            this._renderSucursalTelefonosList(s?.telefonos || []);
        } else {
            ['sucursal-nombre', 'sucursal-direccion', 'sucursal-horario', 'sucursal-email'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            this._renderSucursalTelefonosList([]);
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
        const horario = get('sucursal-horario');
        const email = get('sucursal-email');
        const index = parseInt((document.getElementById('sucursal-index') || {}).value, 10);
        
        if (!nombre || !direccion) {
            this.notificationService.show('Nombre y dirección son obligatorios', 'info');
            return;
        }
        
        const sucursales = [...this.contentManager.getSucursales()];
        const telefonosList = document.getElementById('sucursal-telefonos-list');
        const telefonos = [];
        
        // Recolectar teléfonos de los elementos guardados
        telefonosList?.querySelectorAll('[data-sucursal-telefono-index]').forEach(el => {
            const numero = el.dataset.numero;
            const whatsapp = el.dataset.whatsapp === 'true';
            if (numero) telefonos.push({ numero, whatsapp });
        });
        
        const item = {
            nombre,
            direccion,
            telefonos: telefonos.length > 0 ? telefonos : undefined,
            horario: horario || undefined,
            email: email || undefined
        };
        
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

    _renderSucursalTelefonosList(telefonos) {
        const list = document.getElementById('sucursal-telefonos-list');
        if (!list) return;
        
        list.innerHTML = (telefonos || []).map((t, i) => {
            const whatsappBadge = t.whatsapp ? '<span style="display:inline-block;background:#25d366;color:white;padding:0.25rem 0.5rem;border-radius:0.25rem;font-size:0.75rem;margin-left:0.5rem;">WhatsApp</span>' : '';
            return `
            <div data-sucursal-telefono-index="${i}" data-numero="${t.numero}" data-whatsapp="${t.whatsapp || false}" 
                 style="display:flex;align-items:center;gap:0.5rem;padding:0.5rem;background:#ffffff;border:1px solid #dee2e6;border-radius:0.375rem;">
                <span>${t.numero}${whatsappBadge}</span>
                <button type="button" class="btn btn-small" data-edit-sucursal-telefono="${i}" style="margin-left: auto;">Editar</button>
                <button type="button" class="btn btn-small btn-danger" data-delete-sucursal-telefono="${i}">Eliminar</button>
            </div>
            `;
        }).join('');
        
        list.querySelectorAll('[data-edit-sucursal-telefono]').forEach(btn => {
            btn.addEventListener('click', () => {
                const i = parseInt(btn.dataset.editSucursalTelefono, 10);
                const t = (telefonos || [])[i];
                if (t) this._showSucursalTelefonoForm(i, t);
            });
        });
        
        list.querySelectorAll('[data-delete-sucursal-telefono]').forEach(btn => {
            btn.addEventListener('click', () => {
                const i = parseInt(btn.dataset.deleteSucursalTelefono, 10);
                const newTelefonos = (telefonos || []).filter((_, idx) => idx !== i);
                this._renderSucursalTelefonosList(newTelefonos);
                // Actualizar el atributo data de los elementos para que se guarden correctamente
                this._updateSucursalTelefonosData(newTelefonos);
            });
        });
    }

    _updateSucursalTelefonosData(telefonos) {
        // Actualizar los atributos data de los elementos para guardarlos correctamente
        const list = document.getElementById('sucursal-telefonos-list');
        if (!list) return;
        list.querySelectorAll('[data-sucursal-telefono-index]').forEach((el, i) => {
            const t = telefonos[i];
            if (t) {
                el.dataset.numero = t.numero;
                el.dataset.whatsapp = t.whatsapp || false;
            }
        });
    }

    _showSucursalTelefonoForm(index = -1, telefono = null) {
        const form = document.getElementById('sucursal-telefono-form');
        const numeroInput = document.getElementById('sucursal-telefono-numero');
        const whatsappInput = document.getElementById('sucursal-telefono-whatsapp');
        const indexInput = document.getElementById('sucursal-telefono-index');
        const saveBtn = document.getElementById('save-sucursal-telefono-btn');
        
        if (!form || !numeroInput) return;
        
        if (indexInput) indexInput.value = String(index);
        
        if (index >= 0 && telefono) {
            numeroInput.value = telefono.numero || '';
            if (whatsappInput) whatsappInput.checked = telefono.whatsapp || false;
        } else {
            numeroInput.value = '';
            if (whatsappInput) whatsappInput.checked = false;
        }
        
        form.style.display = 'block';
    }

    _hideSucursalTelefonoForm() {
        const form = document.getElementById('sucursal-telefono-form');
        if (form) form.style.display = 'none';
    }

    _saveSucursalTelefono() {
        const numero = (document.getElementById('sucursal-telefono-numero') || {}).value?.trim();
        const whatsapp = (document.getElementById('sucursal-telefono-whatsapp') || {}).checked || false;
        const index = parseInt((document.getElementById('sucursal-telefono-index') || {}).value, 10);
        
        if (!numero) {
            this.notificationService.show('El número es obligatorio', 'info');
            return;
        }
        
        const list = document.getElementById('sucursal-telefonos-list');
        const existingTelefonos = [];
        
        // Recolectar teléfonos existentes
        list?.querySelectorAll('[data-sucursal-telefono-index]').forEach(el => {
            const n = el.dataset.numero;
            const w = el.dataset.whatsapp === 'true';
            if (n) existingTelefonos.push({ numero: n, whatsapp: w });
        });
        
        const item = { numero, whatsapp };
        
        if (index >= 0 && index < existingTelefonos.length) {
            existingTelefonos[index] = item;
        } else {
            existingTelefonos.push(item);
        }
        
        this._renderSucursalTelefonosList(existingTelefonos);
        this._hideSucursalTelefonoForm();
        this.notificationService.show('Teléfono guardado', 'success');
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
            // Primero intentar cargar desde localStorage (cambios persistentes del usuario)
            let content = this.contentManager.loadContentFromStorage();
            
            if (!content) {
                // Si no hay datos guardados, cargar desde config.json
                content = await this.contentManager.loadContent();
                // Guardar en localStorage para futuras cargas
                this.contentManager.saveContentToStorage(content);
            }
            
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
        set('empresa-telefono-input', empresa.telefono);
        set('welcome-titulo', welcome.titulo);
        set('welcome-subtitulo', welcome.subtitulo);
        this._updateEmpresaDisplay(empresa);
        this._renderTelefonosList();
        this._renderSucursalesList();
    }

    _updateEmpresaDisplay(empresa) {
        const displayNombre = document.getElementById('display-nombre');
        const displayDireccion = document.getElementById('display-direccion');
        const displayTelefono = document.getElementById('display-telefono');
        const displayEmail = document.getElementById('display-email');
        const displayHorario = document.getElementById('display-horario');
        
        if (displayNombre) displayNombre.textContent = empresa.nombre || 'Empresa';
        if (displayDireccion) displayDireccion.textContent = empresa.direccion || 'Sin dirección';
        if (displayTelefono) displayTelefono.textContent = empresa.telefono || 'Sin teléfono';
        if (displayEmail) displayEmail.textContent = empresa.email || 'Sin email';
        if (displayHorario) displayHorario.textContent = empresa.horario || 'Horario no especificado';
    }

    _showEmpresaForm() {
        const form = document.getElementById('empresa-form');
        const display = document.getElementById('empresa-display');
        if (form) form.style.display = 'block';
        if (display) display.style.display = 'none';
    }

    _hideEmpresaForm() {
        const form = document.getElementById('empresa-form');
        const display = document.getElementById('empresa-display');
        if (form) form.style.display = 'none';
        if (display) display.style.display = 'block';
    }

    saveEmpresaData() {
        const get = (id) => (document.getElementById(id) || {}).value;
        const nombre = get('empresa-nombre');
        const email = get('empresa-email');
        const direccion = get('empresa-direccion');
        const horario = get('empresa-horario');
        const telefono = get('empresa-telefono-input');

        const empresaData = {
            nombre: nombre || '',
            telefono: telefono || '',
            email: email || '',
            direccion: direccion || '',
            horario: horario || ''
        };

        this.contentManager.updateEmpresaData(empresaData);
        
        this._updateEmpresaDisplay(empresaData);
        this._hideEmpresaForm();
        
        this.notificationService.show('Datos de empresa guardados', 'success');
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
