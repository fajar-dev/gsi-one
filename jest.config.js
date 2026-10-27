module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^react-native-linear-gradient$':
      '<rootDir>/src/platform/web/LinearGradient.tsx',
    '^react-native-youtube-iframe$':
      '<rootDir>/test/mocks/YoutubeIframeMock.tsx',
    '^@react-native-community/datetimepicker$':
      '<rootDir>/test/mocks/DateTimePickerMock.tsx',
    '^react-native-url-polyfill/auto$': '<rootDir>/test/mocks/EmptyMock.ts',
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/test/mocks/AsyncStorageMock.ts',
    '^react-native-image-picker$': '<rootDir>/test/mocks/ImagePickerMock.ts',
    '^@react-native-documents/picker$':
      '<rootDir>/test/mocks/DocumentPickerMock.ts',
    '^react-native-vector-icons/(.*)$':
      '<rootDir>/test/mocks/VectorIconsMock.tsx',
    '^react-native-vector-icons$': '<rootDir>/test/mocks/VectorIconsMock.tsx',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-safe-area-context|react-native-screens|react-native-vector-icons|react-native-image-picker|react-native-document-picker)/)',
  ],
};
