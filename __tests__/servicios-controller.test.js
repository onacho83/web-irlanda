import { jest } from '@jest/globals';
import ServiciosController from '../js/dashboard/controllers/servicios-controller.js';

describe('ServiciosController', () => {
  test('renders and manages services with fake storage', () => {
    // set up fake DOM
    document.body.innerHTML = `
      <div id="servicios-list"></div>
      <div id="servicio-form" hidden>
        <input id="servicio-titulo" />
        <textarea id="servicio-descripcion"></textarea>
        <input id="servicio-icono" />
        <input id="servicio-index" value="-1" />
      </div>
    `;

    const fakeStorageService = {
      _store: {},
      set(k, v) { this._store[k] = JSON.stringify(v); return true; },
      get(k) { const raw = this._store[k]; return raw ? JSON.parse(raw) : null; },
      remove(k) { delete this._store[k]; return true; }
    };

    const contentManager = { 
      getServicios: () => [],
      addServicio: () => {},
      updateServicio: () => {},
      deleteServicio: () => {}
    };

    const notifier = jest.fn();
    const refresher = jest.fn();

    const controller = new ServiciosController(contentManager, notifier, refresher);
    controller.renderList();

    expect(document.getElementById('servicios-list').innerHTML).toContain('No hay servicios definidos.');
  });

  test('save adds a new service when index is -1', () => {
    document.getElementById('servicio-titulo').value = 'Nuevo servicio';
    document.getElementById('servicio-descripcion').value = 'Descripción';
    document.getElementById('servicio-icono').value = '🔧';
    document.getElementById('servicio-index').value = '-1';

    const fakeContentManager = {
      services: [],
      getServicios() { return this.services; },
      addServicio(s) { this.services.push(s); },
      updateServicio() {},
      deleteServicio() {}
    };

    const notifier2 = jest.fn();
    const refresher2 = jest.fn();
    const controller2 = new ServiciosController(fakeContentManager, notifier2, refresher2);
    controller2.save();

    expect(fakeContentManager.services.length).toBe(1);
    expect(fakeContentManager.services[0].titulo).toBe('Nuevo servicio');
    expect(notifier2).toHaveBeenCalledWith('Servicio agregado', 'success');
  });

  test('save updates an existing service when index >= 0', () => {
    const fakeContentManager = {
      services: [{ titulo: 'Old', descripcion: 'Old desc', icono: '📄' }],
      getServicios() { return this.services; },
      addServicio() {},
      updateServicio(i, s) { this.services[i] = s; },
      deleteServicio() {}
    };

    // Simulate editing
    document.getElementById('servicio-titulo').value = 'Updated';
    document.getElementById('servicio-descripcion').value = 'Updated desc';
    document.getElementById('servicio-icono').value = '🔁';
    document.getElementById('servicio-index').value = '0';

    const notifier3 = jest.fn();
    const refresher3 = jest.fn();
    const controller3 = new ServiciosController(fakeContentManager, notifier3, refresher3);
    controller3.save();

    expect(fakeContentManager.services[0].titulo).toBe('Updated');
    expect(notifier3).toHaveBeenCalledWith('Servicio actualizado', 'success');
  });

  test('delete calls contentManager.deleteServicio and refreshes list', () => {
    const fakeContentManager = {
      services: [{ titulo: 'ToDelete', descripcion: '' }],
      getServicios() { return this.services; },
      addServicio() {},
      updateServicio() {},
      deleteServicio(i) { this.services.splice(i, 1); }
    };

    window.confirm = jest.fn(() => true);

    const notifier4 = jest.fn();
    const refresher4 = jest.fn();
    const controller4 = new ServiciosController(fakeContentManager, notifier4, refresher4);

    // seed list
    controller4.renderList();
    // call delete
    controller4.delete(0);

    expect(fakeContentManager.services.length).toBe(0);
    expect(refresher4).toHaveBeenCalled();
  });
});
