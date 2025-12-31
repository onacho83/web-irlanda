import ContentManager from '../js/dashboard/content-manager.js';

describe('ContentManager storage integration', () => {
  test('add/update/delete/get servicios using fake storage', () => {
    const fakeStorage = {
      _store: {},
      setItem(k, v) { this._store[k] = v; },
      getItem(k) { return this._store[k] ?? null; },
      removeItem(k) { delete this._store[k]; }
    };

    // wrap fakeStorage to match StorageService interface
    const fakeStorageService = {
      set(k, v) { fakeStorage.setItem(k, JSON.stringify(v)); return true; },
      get(k) { const raw = fakeStorage.getItem(k); return raw ? JSON.parse(raw) : null; },
      remove(k) { fakeStorage.removeItem(k); return true; }
    };

    const cm = new ContentManager(null, fakeStorageService);

    // Initially empty
    expect(cm.getServicios()).toEqual([]);

    cm.addServicio({ titulo: 'A', descripcion: 'Desc A' });
    expect(cm.getServicios().length).toBe(1);

    cm.updateServicio(0, { titulo: 'A2', descripcion: 'Desc A2' });
    expect(cm.getServicios()[0].titulo).toBe('A2');

    cm.deleteServicio(0);
    expect(cm.getServicios().length).toBe(0);
  });
});
