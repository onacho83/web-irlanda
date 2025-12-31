import { jest } from '@jest/globals';
import PresentacionController from '../js/dashboard/controllers/presentacion-controller.js';

describe('PresentacionController', () => {
  test('loadValues populates inputs from content', () => {
    document.body.innerHTML = `
      <input id="presentacion-titulo" />
      <textarea id="presentacion-texto"></textarea>
      <input id="presentacion-lead" />
      <input id="presentacion-imagen" />
      <input id="presentacion-cta-text" />
      <input id="presentacion-cta-link" />
    `;

    const content = { presentacion: { titulo: 'T', texto: 'X', lead: 'L', imagen: 'img.jpg', ctaText: 'Call', ctaLink: '/contact' } };
    const controller = new PresentacionController({}, null, null);
    controller.loadValues(content);

    expect(document.getElementById('presentacion-titulo').value).toBe('T');
    expect(document.getElementById('presentacion-texto').value).toBe('X');
  });

  test('save updates contentManager and notifies', () => {
    document.body.innerHTML = `
      <input id="presentacion-titulo" value="A" />
      <textarea id="presentacion-texto">B</textarea>
      <input id="presentacion-lead" value="C" />
      <input id="presentacion-imagen" value="D" />
      <input id="presentacion-cta-text" value="E" />
      <input id="presentacion-cta-link" value="F" />
    `;

    const fakeCM = { updatePresentacion: jest.fn() };
    const notifier = jest.fn();
    const refresher = jest.fn();

    const controller = new PresentacionController(fakeCM, notifier, refresher);
    controller.save();

    expect(fakeCM.updatePresentacion).toHaveBeenCalledWith({ titulo: 'A', texto: 'B', lead: 'C', imagen: 'D', ctaText: 'E', ctaLink: 'F' });
    expect(notifier).toHaveBeenCalledWith('Presentación guardada', 'success');
    expect(refresher).toHaveBeenCalled();
  });
});
