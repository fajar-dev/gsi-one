import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BASE_WIDTH = 390;

export const scale = (size: number): number =>
    Math.round((SCREEN_WIDTH / BASE_WIDTH) * size);

export const fontScale = (size: number): number =>
    Math.round(Math.min((SCREEN_WIDTH / BASE_WIDTH) * size, size * 1.3));

export const wp = (percentage: number): number =>
    Math.round((SCREEN_WIDTH * percentage) / 100);

export const hp = (percentage: number): number =>
    Math.round((SCREEN_HEIGHT * percentage) / 100);

export { SCREEN_WIDTH, SCREEN_HEIGHT };