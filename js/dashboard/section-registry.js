/**
 * Registro de secciones (OCP).
 * Añadir una nueva sección solo requiere agregar una entrada aquí.
 */

/** @type {{ id: string, displayName: string, defaultTextColor: string }[]} */
const SECTIONS = [
    { id: 'header', displayName: 'Header', defaultTextColor: '#1f2937' },
    { id: 'hero', displayName: 'Hero', defaultTextColor: '#ffffff' },
    { id: 'presentacion', displayName: 'Presentación', defaultTextColor: '#1f2937' },
    { id: 'servicios', displayName: 'Servicios', defaultTextColor: '#1f2937' },
    { id: 'contacto', displayName: 'Contacto', defaultTextColor: '#1f2937' },
    { id: 'footer', displayName: 'Footer', defaultTextColor: '#ffffff' }
];

/**
 * @returns {{ id: string, displayName: string, defaultTextColor: string }[]}
 */
export function getAllSections() {
    return [...SECTIONS];
}

/**
 * @param {string} sectionId
 * @returns {{ id: string, displayName: string, defaultTextColor: string } | undefined}
 */
export function getSection(sectionId) {
    return SECTIONS.find(s => s.id === sectionId);
}

/**
 * @param {string} sectionId
 * @returns {string}
 */
export function getDefaultTextColor(sectionId) {
    const section = getSection(sectionId);
    return section ? section.defaultTextColor : '#000000';
}

/**
 * @param {string} sectionId
 * @returns {string}
 */
export function getSectionDisplayName(sectionId) {
    const section = getSection(sectionId);
    return section ? section.displayName : sectionId;
}
