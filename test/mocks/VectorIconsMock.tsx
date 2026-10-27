import { Text, TextProps } from 'react-native';

const Icon = ({
  name,
  size,
  color,
  style,
  ...props
}: TextProps & { name: string; size?: number; color?: string }) => {
  return (
    <Text {...props} style={[{ fontSize: size, color }, style]}>
      {name}
    </Text>
  );
};

export default Icon;
