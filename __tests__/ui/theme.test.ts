import { palette } from '../../src/theme/tokens';
import { getRoleTheme } from '../../src/theme/roleTheme';
import { Dimensions } from 'react-native';
import { scale, fontScale } from '../../src/utils/responsive';
function luminance(color: string) {
  const values = color
    .replace('#', '')
    .match(/../g)!
    .map(hex => parseInt(hex, 16) / 255)
    .map(value =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}
describe('readability and responsive theme', () => {
  afterEach(() => jest.restoreAllMocks());
  it.each([
    'primary',
    'secondary',
    'brand',
    'textPrimary',
    'textSecondary',
    'grey',
    'error',
  ] as const)('%s meets 4.5:1 contrast against white', key => {
    const a = luminance(palette[key]),
      b = luminance(palette.white);
    expect(
      (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
    ).toBeGreaterThanOrEqual(4.5);
  });
  it('falls back safely for unknown or inherited role names', () => {
    expect(getRoleTheme('toString').role).toBe('client');
    expect(getRoleTheme('unknown').accent).toBe(palette.brand);
  });
  it('caps desktop spacing rather than multiplying it by the full browser width', () => {
    jest
      .spyOn(Dimensions, 'get')
      .mockReturnValue({ width: 1440, height: 900, scale: 1, fontScale: 1 });
    expect(scale(16)).toBe(20);
  });
  it('keeps small-screen captions readable', () => {
    jest
      .spyOn(Dimensions, 'get')
      .mockReturnValue({ width: 320, height: 700, scale: 1, fontScale: 1 });
    expect(fontScale(10)).toBeGreaterThanOrEqual(12);
  });
});
