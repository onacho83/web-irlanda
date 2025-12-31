/**
 * ContactoRenderer - Renderiza la sección de contacto
 * Principio SOLID: Single Responsibility - Solo se encarga de renderizar el contacto
 */
class ContactoRenderer {
    constructor() {
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
        const whatsappLink = this.createWhatsAppLink(empresa.telefono);
        
        this.containerElement.innerHTML = `
            <div class="contacto-grid">
                <div class="contacto-item">
                    <strong>Teléfono:</strong>
                    <a href="${whatsappLink}" target="_blank" rel="noopener" class="telefono-link whatsapp-link" title="Abrir WhatsApp en el navegador">
                        <i class="fab fa-whatsapp whatsapp-icon" aria-hidden="true"></i> ${empresa.telefono}
                    </a>
                </div>
                <div class="contacto-item">
                    <strong>Email:</strong>
                    <a href="mailto:${empresa.email}">${empresa.email}</a>
                </div>
                <div class="contacto-item">
                    <strong>Dirección:</strong>
                    <p>${empresa.direccion}</p>
                </div>
                <div class="contacto-item">
                    <strong>Horario:</strong>
                    <p>${empresa.horario}</p>
                </div>
            </div>
        `;
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

export default ContactoRenderer;

