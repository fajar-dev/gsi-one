import React from 'react';
import { Text } from 'react-native';

const Icon = ({ name, size, color, style, ...props }: any) => {
  return (
    <Text {...props} style={[{ fontSize: size, color }, style]}>
      {name}
    </Text>
  );
};

export default Icon;
