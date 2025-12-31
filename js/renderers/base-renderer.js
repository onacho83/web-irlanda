/**
 * BaseRenderer - Clase base para renderizadores
 * Principio SOLID: Single Responsibility + Open/Closed
 */
class BaseRenderer {
    constructor(rootId = null) {
        this.rootId = rootId;
        this.root = rootId ? document.getElementById(rootId) : null;
    }

    attach(rootId) {
        this.rootId = rootId;
        this.root = document.getElementById(rootId);
    }

    setHTML(html) {
        if (!this.root) return;
        this.root.innerHTML = html;
    }

    setText(selector, text) {
        if (!this.root) return;
        const el = this.root.querySelector(selector);
        if (el) el.textContent = text;
    }

    setAttr(selector, attr, value) {
        if (!this.root) return;
        const el = this.root.querySelector(selector);
        if (el) el.setAttribute(attr, value);
    }

    clear() {
        if (this.root) this.root.innerHTML = '';
    }
}

export default BaseRenderer;
