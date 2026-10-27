import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';

interface Point {
  x: number;
  y: number;
}

export interface LinearGradientProps extends ViewProps {
  colors: string[];
  start?: Point;
  end?: Point;
  locations?: number[];
  useAngle?: boolean;
  angleCenter?: Point;
  angle?: number;
  children?: React.ReactNode;
}

export const LinearGradient: React.FC<LinearGradientProps> = ({
  colors,
  start,
  end,
  locations,
  style,
  children,
  ...otherProps
}) => {
  let direction = 'to bottom';
  if (start && end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const cssAngle = (90 + angle) % 360;
    direction = `${cssAngle.toFixed(0)}deg`;
  }

  const colorStops = colors
    .map((color, index) => {
      if (locations && locations[index] !== undefined) {
        return `${color} ${(locations[index] * 100).toFixed(0)}%`;
      }
      const percent = ((index / Math.max(colors.length - 1, 1)) * 100).toFixed(
        0,
      );
      return `${color} ${percent}%`;
    })
    .join(', ');

  const gradientStyle = {
    backgroundImage: `linear-gradient(${direction}, ${colorStops})`,
  } as ViewStyle & { backgroundImage: string };

  return (
    <View style={[style, gradientStyle]} {...otherProps}>
      {children}
    </View>
  );
};

export default LinearGradient;
