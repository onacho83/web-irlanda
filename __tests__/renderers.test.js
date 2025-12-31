/**
 * Tests básicos para renderers usando jsdom
 */
import ServiciosRenderer from '../js/renderers/servicios-renderer.js';
import PresentacionRenderer from '../js/renderers/presentacion-renderer.js';

describe('Renderers basic behaviors', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="servicios-container"></div>
      <section id="presentacion">
        <h2 id="presentacion-titulo"></h2>
        <p id="presentacion-texto"></p>
      </section>
    `;
  });

  test('ServiciosRenderer renders list', () => {
    const servicios = [ { titulo: 'A', descripcion: 'desc' } ];
    const renderer = new ServiciosRenderer();
    renderer.render({ servicios });
    expect(document.getElementById('servicios-container').innerHTML).toContain('A');
  });

  test('PresentacionRenderer uses passed config', () => {
    const cfg = { presentacion: { titulo: 'X', texto: 'Y' } };
    const renderer = new PresentacionRenderer();
    renderer.render(cfg);
    expect(document.getElementById('presentacion-titulo').textContent).toBe('X');
  });
});
