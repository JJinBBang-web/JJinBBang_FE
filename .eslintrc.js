module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
  globals: {
    kakao: 'readonly',
  },
  rules: {
    // 기본 코드 정리 규칙 완화 (점진적으로 켜기 가능)
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'no-undef': 'off',
    'no-sequences': 'off',
    'no-unused-expressions': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
};