import { ActionButton } from '../../../components/ui/ActionButton';
import { palette, spacing, radius, typography } from '../../../theme/tokens';
import { JSX } from 'react';
import {
  Platform,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors, neutral } from '../../../theme/colors';
import { scale, fontScale } from '../../../utils/responsive';

export interface QuickAccessItem {
  label: string;
  icon: string | JSX.Element;
  iconColor: string;
  bgStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
}

interface QuickAccessGridProps {
  items: QuickAccessItem[];
}

function QuickAccessGrid({ items }: QuickAccessGridProps): JSX.Element {
  const { width } = useWindowDimensions();
  const cardBasis = Platform.OS !== 'web' && width >= 720 ? '22%' : '45%';
  return (
    <View style={styles.row}>
      {items.map(item => (
        <ActionButton
          key={item.label}
          style={[styles.item, { flexBasis: cardBasis }]}
          activeOpacity={0.75}
          onPress={item.onPress}
          accessibilityRole="button"
        >
          <View style={[styles.iconBg, item.bgStyle]}>
            {typeof item.icon === 'string' ? (
              <Icon name={item.icon} size={20} color={item.iconColor} />
            ) : (
              item.icon
            )}
          </View>
          <Text style={styles.label}>{item.label}</Text>
        </ActionButton>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(spacing.md),
    flexWrap: 'wrap',
  },
  item: {
    flexGrow: 1,
    flexBasis: '45%',
    minWidth: 130,
    backgroundColor: colors.white,
    borderRadius: scale(radius.sm),
    padding: scale(spacing.lg),
    alignItems: 'center',
    elevation: 2,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  iconBg: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(6),
  },
  label: {
    fontSize: fontScale(typography.caption),
    fontWeight: '600',
    color: neutral[900],
    textAlign: 'center',
  },
});

export default QuickAccessGrid;
