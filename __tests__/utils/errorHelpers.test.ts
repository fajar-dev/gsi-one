import { getErrorMessage } from '../../src/utils/errorHelpers';

describe('errorHelpers - getErrorMessage', () => {
  it('should return error message when error is an instance of Error', () => {
    const error = new Error('Database connection failed');
    expect(getErrorMessage(error)).toBe('Database connection failed');
  });

  it('should return the string directly when error is a string', () => {
    const error = 'Unauthorized access';
    expect(getErrorMessage(error)).toBe('Unauthorized access');
  });

  it('should return fallback message when error is unknown or null', () => {
    expect(getErrorMessage(null)).toBe('Terjadi kesalahan tidak terduga');
    expect(getErrorMessage(undefined)).toBe('Terjadi kesalahan tidak terduga');
    expect(getErrorMessage(123)).toBe('Terjadi kesalahan tidak terduga');
  });

  it('should return custom fallback when provided', () => {
    const customFallback = 'Custom failure message';
    expect(getErrorMessage({}, customFallback)).toBe(customFallback);
  });
});
