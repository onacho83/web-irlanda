/**
 * FooterRenderer - Renderiza el footer de la página (SRP).
 */
import BaseRenderer from './base-renderer.js';
import { createWhatsAppLink } from '../utils/whatsapp-link.js';

class FooterRenderer extends BaseRenderer {
    constructor() {
        super();
        this.footerElement = document.getElementById('footer');
    }

    /**
     * Renderiza el footer con información de la empresa y redes sociales
     * @param {Object} config - Configuración completa de la aplicación
     */
    render(config) {
        if (!this.footerElement) {
            return;
        }

        const empresa = config.empresa || {};
        const redesSociales = config.redesSociales || {};
        const telefonos = this._getTelefonos(empresa);
        const sucursales = Array.isArray(empresa.sucursales) ? empresa.sucursales : [];

        const redesHTML = this.createRedesSocialesHTML(redesSociales);

        const telefonosHTML = telefonos.length > 0
            ? telefonos.map(t => {
                const link = createWhatsAppLink(t.numero);
                return `<p><a href="${link}" target="_blank" rel="noopener" class="footer-telefono-link whatsapp-link" title="Abrir WhatsApp"><i class="fab fa-whatsapp whatsapp-icon" aria-hidden="true"></i> ${t.etiqueta ? t.etiqueta + ': ' : ''}${t.numero}</a></p>`;
            }).join('')
            : '';

        const sucursalesHTML = sucursales.length > 0
            ? sucursales.map(s => `
                <div class="footer-sucursal" style="margin-top:0.5rem;">
                    <strong>${s.nombre || 'Sucursal'}</strong>
                    ${s.direccion ? `<p>${s.direccion}</p>` : ''}
                    ${s.telefono ? `<p><a href="${createWhatsAppLink(s.telefono)}" target="_blank" rel="noopener" class="footer-telefono-link whatsapp-link"><i class="fab fa-whatsapp whatsapp-icon"></i> ${s.telefono}</a></p>` : ''}
                    ${s.email ? `<p>${s.email}</p>` : ''}
                </div>
            `).join('')
            : '';

        this.footerElement.innerHTML = `
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>${empresa.nombre || 'Imprenta'}</h3>
                        <p>${empresa.direccion || ''}</p>
                    </div>
                    <div class="footer-section">
                        <h3>Contacto</h3>
                        ${telefonosHTML}
                        ${empresa.email ? `<p>${empresa.email}</p>` : ''}
                        ${sucursalesHTML}
                    </div>
                    ${redesHTML ? `
                    <div class="footer-section">
                        <h3>Síguenos</h3>
                        ${redesHTML}
                    </div>
                    ` : ''}
                </div>
                <div class="footer-bottom">
                    <p>&copy; ${new Date().getFullYear()} ${empresa.nombre || 'Imprenta'}. Todos los derechos reservados.</p>
                </div>
            </div>
        `;
    }

    /** @param {Object} empresa */
    _getTelefonos(empresa) {
        if (Array.isArray(empresa.telefonos)) return empresa.telefonos;
        if (empresa.telefono) return [{ numero: empresa.telefono, etiqueta: 'Principal' }];
        return [];
    }

    /**
     * Crea el HTML para los enlaces de redes sociales
     * Principio SOLID: Single Responsibility - Método con una única responsabilidad
     * @param {Object} redesSociales - Objeto con las URLs de las redes sociales
     * @returns {string} HTML de los enlaces de redes sociales
     */
    createRedesSocialesHTML(redesSociales) {
        const redes = [];
        
        if (redesSociales.facebook) {
            redes.push(`<a href="${redesSociales.facebook}" target="_blank" rel="noopener">Facebook</a>`);
        }
        if (redesSociales.instagram) {
            redes.push(`<a href="${redesSociales.instagram}" target="_blank" rel="noopener">Instagram</a>`);
        }

        return redes.length > 0 ? `<div class="redes-sociales">${redes.join(' ')}</div>` : '';
    }

}

export default FooterRenderer;

