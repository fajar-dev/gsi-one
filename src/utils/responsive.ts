import { Dimensions, Platform } from 'react-native';
import { layout } from '../theme/tokens';

const screen = Dimensions.get('window');
const contentWidth = (width: number): number =>
  Platform.OS === 'web' ? Math.min(width, layout.webMaxWidth) : width;
const SCREEN_WIDTH = contentWidth(screen.width);

const BASE_WIDTH = 390;

export const scale = (size: number): number =>
  Math.round(
    Math.min(contentWidth(Dimensions.get('window').width) / BASE_WIDTH, 1.25) *
      size,
  );

export const fontScale = (size: number): number =>
  Math.round(
    Math.max(
      12,
      Math.min(
        (contentWidth(Dimensions.get('window').width) / BASE_WIDTH) * size,
        size * 1.15,
      ),
    ),
  );

export { SCREEN_WIDTH };
