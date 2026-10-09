import React, { JSX } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors, neutral } from '../../../../assets/styles/Colors';
import { scale, fontScale } from '../../../utils/responsive';

export interface QuickAccessItem {
  label: string;
  icon: string | JSX.Element;
  iconColor: string;
  bgStyle?: object;
  onPress: () => void;
}

interface QuickAccessGridProps {
  items: QuickAccessItem[];
}

function QuickAccessGrid({ items }: QuickAccessGridProps): JSX.Element {
  return (
    <View style={styles.row}>
      {items.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.item}
          activeOpacity={0.75}
          onPress={item.onPress}
        >
          <View style={[styles.iconBg, item.bgStyle]}>
            {typeof item.icon === 'string' ? (
              <Icon name={item.icon} size={20} color={item.iconColor} />
            ) : (
              item.icon
            )}
          </View>
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(8),
  },
  item: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: scale(8),
    padding: scale(10),
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
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
    fontSize: fontScale(10),
    fontWeight: '600',
    color: neutral[900],
    textAlign: 'center',
  },
});

export default QuickAccessGrid;
