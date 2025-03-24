module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/server/**/*.{js,jsx}',
    '!src/server/index.js',
  ],
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 50,
      functions: 50,
      lines: 50
    }
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/src/client/'
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node']
}; 