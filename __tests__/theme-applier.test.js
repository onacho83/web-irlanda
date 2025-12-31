import ThemeApplier from '../js/theme-applier.js';

describe('ThemeApplier', () => {
  beforeEach(() => {
    document.documentElement.style.cssText = '';
    document.body.innerHTML = `<div id="hero"></div><section id="servicios"><h3>Title</h3><p class="whatsapp-link">Phone</p></section>`;
  });

  test('apply sets CSS variables from storage', () => {
    const fakeStorage = { get: () => ({
      colors: { primary: '#111111', secondary: '#222222', accent: '#333333', background: '#ffffff', backgroundLight: '#eeeeee', border: '#cccccc' },
      hero: { type: 'gradient' }
    }) };

    const applier = new ThemeApplier(fakeStorage);
    applier.apply();

    expect(document.documentElement.style.getPropertyValue('--color-primary')).toBe('#111111');
    expect(document.documentElement.style.getPropertyValue('--color-secondary')).toBe('#222222');
  });

  test('applyHeroBackground sets image when type is image', () => {
    const applier = new ThemeApplier({ get: () => null });
    applier.applyHeroBackground({ type: 'image', backgroundImage: 'hero.jpg' });

    const hero = document.getElementById('hero');
    expect(hero.style.backgroundImage).toContain('hero.jpg');
    expect(hero.style.backgroundSize).toBe('cover');
  });

  test('applySectionStylesFromConfig applies colors and ignores excluded classes', () => {
    const applier = new ThemeApplier({ get: () => null });
    const cfg = {
      servicios: {
        backgroundColor: '#fafafa',
        textColor: '#123456',
        backgroundImage: 'bg.jpg'
      }
    };

    applier.applySectionStylesFromConfig({ servicios: cfg.servicios });

    const sec = document.getElementById('servicios');
    expect(sec.style.backgroundColor).toBe('rgb(250, 250, 250)'); // '#fafafa' normalized
    // h3 should get color applied
    const h3 = sec.querySelector('h3');
    expect(h3.style.color).toBe('rgb(18, 52, 86)');
    // whatsapp-link should NOT be overwritten
    const p = sec.querySelector('.whatsapp-link');
    expect(p.style.color).toBe('');
    // background image set
    expect(sec.style.backgroundImage).toContain('bg.jpg');
  });
});
