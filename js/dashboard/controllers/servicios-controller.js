/**
 * ServiciosController - Separa la lógica de CRUD de servicios del DashboardApp
 * Principio SOLID: Single Responsibility
 */
class ServiciosController {
    constructor(contentManager, notifier = null, previewRefresher = null) {
        this.contentManager = contentManager;
        this.notifier = notifier || function() {};
        this.refreshPreview = previewRefresher || function() {};
    }

    renderList() {
        const list = document.getElementById('servicios-list');
        if (!list) return;
        const servicios = this.contentManager.getServicios() || [];
        list.innerHTML = '';

        if (servicios.length === 0) {
            list.innerHTML = '<div class="control-group">No hay servicios definidos.</div>';
            return;
        }

        servicios.forEach((s, idx) => {
            const item = document.createElement('div');
            item.className = 'servicio-item';
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';
            item.style.padding = '0.5rem';
            item.style.border = '1px solid var(--dashboard-border)';
            item.style.borderRadius = '8px';

            item.innerHTML = `
                <div style="display:flex; gap:0.75rem; align-items:center;">
                    <div style="font-size:1.25rem;">${s.icono || '📄'}</div>
                    <div>
                        <strong>${s.titulo}</strong>
                        <div style="color:var(--dashboard-text-light); font-size:0.9rem;">${s.descripcion}</div>
                    </div>
                </div>
                <div style="display:flex; gap:0.5rem;">
                    <button class="btn btn-small" data-action="edit" data-index="${idx}">Editar</button>
                    <button class="btn btn-danger" data-action="delete" data-index="${idx}">Eliminar</button>
                </div>
            `;

            list.appendChild(item);
        });

        // Delegación de eventos para editar/eliminar
        list.querySelectorAll('button[data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.index, 10);
                this.showForm(idx);
            });
        });

        list.querySelectorAll('button[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.index, 10);
                if (confirm('¿Eliminar este servicio?')) {
                    this.delete(idx);
                }
            });
        });
    }

    showForm(index = -1) {
        const form = document.getElementById('servicio-form');
        const titulo = document.getElementById('servicio-titulo');
        const descripcion = document.getElementById('servicio-descripcion');
        const icono = document.getElementById('servicio-icono');
        const idxInput = document.getElementById('servicio-index');

        if (!form || !titulo || !descripcion || !icono || !idxInput) return;

        if (index >= 0) {
            const servicios = this.contentManager.getServicios();
            const servicio = servicios[index] || { titulo: '', descripcion: '', icono: '' };
            titulo.value = servicio.titulo || '';
            descripcion.value = servicio.descripcion || '';
            icono.value = servicio.icono || '';
            idxInput.value = String(index);
        } else {
            titulo.value = '';
            descripcion.value = '';
            icono.value = '';
            idxInput.value = '-1';
        }

        form.hidden = false;
    }

    hideForm() {
        const form = document.getElementById('servicio-form');
        if (form) form.hidden = true;
    }

    save() {
        const titulo = document.getElementById('servicio-titulo').value.trim();
        const descripcion = document.getElementById('servicio-descripcion').value.trim();
        const icono = document.getElementById('servicio-icono').value.trim() || '📄';
        const idx = parseInt(document.getElementById('servicio-index').value, 10);

        if (!titulo) {
            this.notifier('El título es requerido', 'danger');
            return;
        }

        const servicio = { titulo, descripcion, icono };

        if (idx >= 0) {
            this.contentManager.updateServicio(idx, servicio);
            this.notifier('Servicio actualizado', 'success');
        } else {
            this.contentManager.addServicio(servicio);
            this.notifier('Servicio agregado', 'success');
        }

        this.hideForm();
        this.renderList();
        this.refreshPreview();
    }

    delete(index) {
        this.contentManager.deleteServicio(index);
        this.renderList();
        this.refreshPreview();
    }
}

export default ServiciosController;
