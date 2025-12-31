/**
 * FooterRenderer - Renderiza el footer de la página
 * Principio SOLID: Single Responsibility - Solo se encarga de renderizar el footer
 */
class FooterRenderer {
    constructor() {
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
        const whatsappLink = empresa.telefono ? this.createWhatsAppLink(empresa.telefono) : '#';

        const redesHTML = this.createRedesSocialesHTML(redesSociales);

        this.footerElement.innerHTML = `
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>${empresa.nombre || 'Imprenta'}</h3>
                        <p>${empresa.direccion || ''}</p>
                    </div>
                    <div class="footer-section">
                        <h3>Contacto</h3>
                        ${empresa.telefono ? `<p><a href="${whatsappLink}" target="_blank" rel="noopener" class="footer-telefono-link whatsapp-link" title="Abrir WhatsApp en el navegador"><i class="fab fa-whatsapp whatsapp-icon" aria-hidden="true"></i> ${empresa.telefono}</a></p>` : ''}
                        ${empresa.email ? `<p>${empresa.email}</p>` : ''}
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

    /**
     * Crea el enlace de WhatsApp Web a partir del número de teléfono
     * Principio SOLID: Single Responsibility - Método con una única responsabilidad
     * @param {string} telefono - Número de teléfono
     * @returns {string} URL de WhatsApp Web (navegador)
     */
    createWhatsAppLink(telefono) {
        if (!telefono) return '#';
        
        // Limpiar el número: eliminar espacios, guiones, paréntesis, etc.
        let numeroLimpio = telefono.replace(/\s|-|\(|\)/g, '');
        
        // Si no comienza con código de país, agregar 54 (Argentina)
        // Asumimos que si tiene 11 dígitos o menos y no empieza con +, es número argentino
        if (!numeroLimpio.startsWith('+') && !numeroLimpio.startsWith('54') && numeroLimpio.length <= 11) {
            numeroLimpio = '54' + numeroLimpio;
        } else if (numeroLimpio.startsWith('+')) {
            numeroLimpio = numeroLimpio.substring(1);
        }
        
        // Usar WhatsApp Web para que se abra en el navegador
        return `https://web.whatsapp.com/send?phone=${numeroLimpio}`;
    }
}

export default FooterRenderer;

