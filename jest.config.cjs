module.exports = {
  testEnvironment: 'jsdom',
  transform: {},
  // Tratar archivos .js como ESM para permitir 'import' en los tests
  extensionsToTreatAsEsm: ['.js'],
  testMatch: ['**/__tests__/**/*.test.js']
};
