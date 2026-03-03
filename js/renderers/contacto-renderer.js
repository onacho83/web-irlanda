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

        // Renderizar la central como tarjeta
        const centralHTML = this._renderCentralCard(empresa, telefonos);

        // Renderizar sucursales
        const sucursalesHTML = sucursales.length > 0
            ? `<div style="margin-top: 2rem;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                    ${sucursales.map(s => this._renderSucursalCard(s)).join('')}
                </div>
            </div>`
            : '';

        this.containerElement.innerHTML = centralHTML + sucursalesHTML;
    }

    /**
     * Renderiza una tarjeta para la empresa central
     * @param {Object} empresa
     * @param {Array} telefonos
     * @returns {string}
     */
    _renderCentralCard(empresa, telefonos) {
        const telefonosHTML = telefonos.length > 0
            ? telefonos.map(t => {
                const link = createWhatsAppLink(t.numero);
                const label = t.etiqueta && t.etiqueta.toLowerCase() !== 'principal' ? `${t.etiqueta}: ` : '';

                if (t.whatsapp) {
                    return `<p style="margin: 0.375rem 0; font-size: 0.9rem;"><strong>${label}</strong> <a href="${link}" target="_blank" rel="noopener" class="telefono-link whatsapp-link" title="Abrir WhatsApp"><i class="fab fa-whatsapp whatsapp-icon" aria-hidden="true"></i> ${t.numero}</a></p>`;
                }

                return `<p style="margin: 0.375rem 0; font-size: 0.9rem;"><strong>${label}</strong> <a href="tel:${t.numero}" title="Llamar"><i class="fas fa-phone" style="color: #666; margin-right: 0.25rem;"></i>${t.numero}</a></p>`;
            }).join('')
            : '';

        const emailHTML = empresa.email
            ? `<p style="margin: 0.375rem 0; font-size: 0.9rem;"><strong>✉️ Email:</strong> <a href="mailto:${empresa.email}">${empresa.email}</a></p>`
            : '';

        return `
            <div style="padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 0.75rem; background: #ffffff; margin-bottom: 2rem;">
                <h3 style="margin: 0 0 1rem 0; font-size: 1.375rem;">${empresa.nombre || 'Empresa Central'}</h3>

                ${empresa.direccion ? `
                <p style="margin: 0.375rem 0; font-size: 0.9rem;"><strong>📍 Dirección:</strong> ${empresa.direccion}</p>
                ` : ''}

                ${telefonosHTML}
                ${emailHTML}

                ${empresa.horario ? `
                <p style="margin: 0.375rem 0; font-size: 0.9rem;"><strong>🕐 Horario:</strong> ${empresa.horario}</p>
                ` : ''}
            </div>
        `;
    }

    /**
     * Renderiza una tarjeta para una sucursal
     * @param {Object} sucursal
     * @returns {string}
     */
    _renderSucursalCard(sucursal) {
        const telefonos = Array.isArray(sucursal.telefonos) ? sucursal.telefonos : [];
        const telefonoHTML = telefonos.length > 0
            ? telefonos.map(t => {
                if (t.whatsapp) {
                    return `<p style="margin: 0.375rem 0; font-size: 0.9rem;">
                        <a href="${createWhatsAppLink(t.numero)}" target="_blank" rel="noopener" class="telefono-link whatsapp-link">
                            <i class="fab fa-whatsapp whatsapp-icon"></i> ${t.numero}
                        </a>
                    </p>`;
                } else {
                    return `<p style="margin: 0.375rem 0; font-size: 0.9rem;">
                        <a href="tel:${t.numero}" title="Llamar">
                            <i class="fas fa-phone" style="color: #666; margin-right: 0.25rem;"></i>${t.numero}
                        </a>
                    </p>`;
                }
            }).join('')
            : (sucursal.telefono ? `<p style="margin: 0.375rem 0; font-size: 0.9rem;"><a href="tel:${sucursal.telefono}" title="Llamar"><i class="fas fa-phone" style="color: #666; margin-right: 0.25rem;"></i>${sucursal.telefono}</a></p>` : '');

        const horarioHTML = sucursal.horario
            ? `<p style="margin: 0.375rem 0; font-size: 0.9rem;">
                <strong>🕐</strong> ${sucursal.horario}
            </p>`
            : '';

        const emailHTML = sucursal.email
            ? `<p style="margin: 0.375rem 0; font-size: 0.9rem;">
                <a href="mailto:${sucursal.email}">${sucursal.email}</a>
            </p>`
            : '';

        return `
            <div style="padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 0.75rem; background: #ffffff;">
                ${sucursal.nombre ? `<h4 style="margin: 0 0 0.75rem 0; font-size: 1.125rem;">${sucursal.nombre}</h4>` : ''}
                
                ${sucursal.direccion ? `
                <p style="margin: 0.375rem 0; font-size: 0.9rem;">
                    <strong>📍</strong> ${sucursal.direccion}
                </p>
                ` : ''}

                ${telefonoHTML}
                ${horarioHTML}
                ${emailHTML}
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

