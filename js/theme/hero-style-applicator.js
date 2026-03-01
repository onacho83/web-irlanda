/**
 * Lógica única de aplicación de fondo del hero (OCP).
 * Usado por ThemeApplier y BackgroundManager para evitar duplicación.
 */

/**
 * Aplica el fondo del hero a un elemento según la configuración.
 * @param {HTMLElement} heroElement - Elemento de la sección hero
 * @param {Object} heroConfig - { type: 'gradient'|'solid'|'image', backgroundColor?, backgroundImage? }
 * @param {() => string} getPrimaryColor - Función que devuelve color primario
 * @param {() => string} getSecondaryColor - Función que devuelve color secundario
 */
export function applyHeroBackgroundToElement(heroElement, heroConfig, getPrimaryColor, getSecondaryColor) {
    if (!heroElement) return;

    heroElement.style.background = '';
    heroElement.style.backgroundImage = '';
    heroElement.style.backgroundColor = '';

    const type = heroConfig?.type || 'gradient';
    switch (type) {
        case 'solid':
            heroElement.style.backgroundColor = heroConfig.backgroundColor || '#2563eb';
            heroElement.style.backgroundImage = 'none';
            break;
        case 'image':
            if (heroConfig.backgroundImage) {
                heroElement.style.backgroundImage = `url('${heroConfig.backgroundImage}')`;
                heroElement.style.backgroundSize = 'cover';
                heroElement.style.backgroundPosition = 'center';
                heroElement.style.backgroundColor = '#2563eb';
            }
            break;
        case 'gradient':
        default: {
            const primary = getPrimaryColor ? getPrimaryColor() : '#2563eb';
            const secondary = getSecondaryColor ? getSecondaryColor() : '#1e40af';
            heroElement.style.background = `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;
            break;
        }
    }
}
