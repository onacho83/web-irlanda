import { jest } from '@jest/globals';
import ServiciosController from '../js/dashboard/controllers/servicios-controller.js';

describe('ServiciosController showForm behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="servicio-form" hidden>
        <input id="servicio-titulo" />
        <textarea id="servicio-descripcion"></textarea>
        <input id="servicio-icono" />
        <input id="servicio-index" value="-1" />
      </div>
    `;
  });

  test('showForm populates fields for new item', () => {
    const fakeContentManager = { getServicios: () => [] };
    const controller = new ServiciosController(fakeContentManager);
    controller.showForm(-1);

    expect(document.getElementById('servicio-form').hidden).toBe(false);
    expect(document.getElementById('servicio-titulo').value).toBe('');
  });

  test('showForm populates fields for existing item', () => {
    const fakeContentManager = { getServicios: () => [{ titulo: 'S1', descripcion: 'D1', icono: 'I1' }] };
    const controller = new ServiciosController(fakeContentManager);
    controller.showForm(0);

    expect(document.getElementById('servicio-titulo').value).toBe('S1');
    expect(document.getElementById('servicio-index').value).toBe('0');
  });
});