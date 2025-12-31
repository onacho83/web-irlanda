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
});
