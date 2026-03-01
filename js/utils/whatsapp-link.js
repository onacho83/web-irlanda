/**
 * Utilidad para generar enlace de WhatsApp Web (DRY).
 * @param {string} telefono
 * @returns {string} URL de WhatsApp Web
 */
export function createWhatsAppLink(telefono) {
    if (!telefono) return '#';
    let numeroLimpio = telefono.replace(/\s|-|\(|\)/g, '');
    if (!numeroLimpio.startsWith('+') && !numeroLimpio.startsWith('54') && numeroLimpio.length <= 11) {
        numeroLimpio = '54' + numeroLimpio;
    } else if (numeroLimpio.startsWith('+')) {
        numeroLimpio = numeroLimpio.substring(1);
    }
    return `https://web.whatsapp.com/send?phone=${numeroLimpio}`;
}
