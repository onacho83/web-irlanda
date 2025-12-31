import StorageService from '../js/services/storage-service.js';

describe('StorageService', () => {
  test('set/get/remove with a fake storage', () => {
    const fake = {
      _store: {},
      setItem(k, v) { this._store[k] = v; },
      getItem(k) { return this._store[k] ?? null; },
      removeItem(k) { delete this._store[k]; }
    };

    const s = new StorageService(fake);
    expect(s.set('key', { a: 1 })).toBe(true);
    expect(s.get('key')).toEqual({ a: 1 });
    expect(s.remove('key')).toBe(true);
    expect(s.get('key')).toBeNull();
  });
});
