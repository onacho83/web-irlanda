/**
 * ContactoRenderer - Renderiza la sección de contacto (SRP).
 */
import BaseRenderer from './base-renderer.js';
import { createWhatsAppLink } from '../utils/whatsapp-link.js';

class ContactoRenderer extends BaseRenderer {
    constructor() {
        super();
        this.containerElement = document.getElementById('contacto-container');
    }

    /**
     * Renderiza la sección de contacto
     * @param {Object} config - Configuración completa de la aplicación
     */
    render(config) {
        if (!this.containerElement || !config.empresa) {
            return;
        }

        const empresa = config.empresa;
        const telefonos = this._getTelefonos(empresa);
        const sucursales = Array.isArray(empresa.sucursales) ? empresa.sucursales : [];

        const telefonosHTML = telefonos.length > 0
            ? telefonos.map(t => {
                const link = createWhatsAppLink(t.numero);
                const label = t.etiqueta ? `${t.etiqueta}: ` : '';
                return `<div class="contacto-item">
                    <strong>${label}Teléfono:</strong>
                    <a href="${link}" target="_blank" rel="noopener" class="telefono-link whatsapp-link" title="Abrir WhatsApp">
                        <i class="fab fa-whatsapp whatsapp-icon" aria-hidden="true"></i> ${t.numero}
                    </a>
                </div>`;
            }).join('')
            : '';

        const sucursalesHTML = sucursales.length > 0
            ? sucursales.map(s => `
                <div class="contacto-item sucursal-item" style="margin-top:1rem;padding:0.75rem;background:rgba(0,0,0,0.03);border-radius:0.5rem;">
                    <strong>${s.nombre || 'Sucursal'}</strong>
                    ${s.direccion ? `<p style="margin:0.25rem 0;">${s.direccion}</p>` : ''}
                    ${s.telefono ? `<p style="margin:0.25rem 0;"><a href="${createWhatsAppLink(s.telefono)}" target="_blank" rel="noopener" class="telefono-link whatsapp-link"><i class="fab fa-whatsapp whatsapp-icon"></i> ${s.telefono}</a></p>` : ''}
                    ${s.horario ? `<p style="margin:0.25rem 0;font-size:0.9em;">🕐 ${s.horario}</p>` : ''}
                    ${s.email ? `<p style="margin:0.25rem 0;"><a href="mailto:${s.email}">${s.email}</a></p>` : ''}
                </div>
            `).join('')
            : '';

        this.containerElement.innerHTML = `
            <div class="contacto-grid">
                ${telefonosHTML}
                <div class="contacto-item">
                    <strong>Email:</strong>
                    <a href="mailto:${empresa.email || ''}">${empresa.email || ''}</a>
                </div>
                <div class="contacto-item">
                    <strong>Dirección:</strong>
                    <p>${empresa.direccion || ''}</p>
                </div>
                <div class="contacto-item">
                    <strong>Horario:</strong>
                    <p>${empresa.horario || ''}</p>
                </div>
                ${sucursalesHTML ? `<div class="contacto-item" style="grid-column:1/-1;"><strong>Sucursales</strong>${sucursalesHTML}</div>` : ''}
            </div>
        `;
    }

    /** @param {Object} empresa */
    _getTelefonos(empresa) {
        if (Array.isArray(empresa.telefonos)) return empresa.telefonos;
        if (empresa.telefono) return [{ numero: empresa.telefono, etiqueta: 'Principal' }];
        return [];
    }

}

export default ContactoRenderer;

