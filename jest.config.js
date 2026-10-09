module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^react-native-linear-gradient$': '<rootDir>/src/config/LinearGradientMock.tsx',
    '^react-native-youtube-iframe$': '<rootDir>/src/config/YoutubeIframeMock.tsx',
    '^@react-native-community/datetimepicker$': '<rootDir>/src/config/DateTimePickerMock.tsx',
    '^react-native-url-polyfill/auto$': '<rootDir>/src/config/EmptyMock.ts',
    '^@react-native-async-storage/async-storage$': '<rootDir>/src/config/AsyncStorageMock.ts',
    '^react-native-image-picker$': '<rootDir>/src/config/ImagePickerMock.ts',
    '^@react-native-documents/picker$': '<rootDir>/src/config/DocumentPickerMock.ts',
    '^react-native-vector-icons/(.*)$': '<rootDir>/src/config/VectorIconsMock.tsx',
    '^react-native-vector-icons$': '<rootDir>/src/config/VectorIconsMock.tsx',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-safe-area-context|react-native-screens|react-native-vector-icons|react-native-image-picker|react-native-document-picker)/)',
  ],
};
