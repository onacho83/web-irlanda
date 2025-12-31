import { jest } from '@jest/globals';
import SectionStyleManager from '../js/dashboard/section-style-manager.js';

describe('SectionStyleManager', () => {
  let fakeThemeManager, fakeConfigStorage, manager;

  beforeEach(() => {
    document.body.innerHTML = '<section id="testsec"><h2>Hey</h2></section>';
    fakeThemeManager = { getConfig: () => ({ sections: { testsec: { backgroundColor: '#abc', textColor: '#321' } } }) };
    fakeConfigStorage = { save: jest.fn() };
    manager = new SectionStyleManager(fakeConfigStorage, fakeThemeManager);
  });

  test('applySectionStyle applies styles to section and children', () => {
    manager.applySectionStyles();
    const sec = document.getElementById('testsec');
    expect(sec.style.backgroundColor).toBe('rgb(170, 187, 204)');
    const h2 = sec.querySelector('h2');
    expect(h2.style.color).toBe('rgb(51, 34, 34)');
  });

  test('updateSectionStyle modifies config and saves', () => {
    // Prepare theme manager to return a mutable object
    const cfg = { sections: {} };
    fakeThemeManager.getConfig = () => cfg;

    manager = new SectionStyleManager(fakeConfigStorage, fakeThemeManager);
    manager.updateSectionStyle('newsec', 'backgroundColor', '#101010');

    expect(cfg.sections.newsec.backgroundColor).toBe('#101010');
    expect(fakeConfigStorage.save).toHaveBeenCalled();
  });

  test('getSectionStyles returns empty object if none', () => {
    const cfg = { sections: {} };
    fakeThemeManager.getConfig = () => cfg;
    manager = new SectionStyleManager(fakeConfigStorage, fakeThemeManager);
    expect(manager.getSectionStyles('missing')).toEqual({});
  });
});
