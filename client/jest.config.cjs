/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // Resolve .tsx/.ts files
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // Setup matchers and polyfills
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  // Map path aliases used in code
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\./axios$': '<rootDir>/src/api/__mocks__/axios.ts',
    // Vite-specific: stub CSS/image imports
    '\\.(css|less|scss|svg|png|jpg)$': '<rootDir>/__mocks__/fileMock.cjs',
  },
  // Where to find tests
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  // Transform everything via ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
  },
  // ESM interop for packages that ship as ESM
  transformIgnorePatterns: [
    'node_modules/(?!(@dnd-kit|react-router-dom|react-router)/)',
  ],
};
