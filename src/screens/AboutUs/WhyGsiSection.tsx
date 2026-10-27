import { palette, spacing, radius, typography } from '../../theme/tokens';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from 'react-native';

type WhyGsiItem = {
  icon: ImageSourcePropType;
  text: string;
};

const WHY_GSI_ITEMS: WhyGsiItem[] = [
  {
    icon: require('../../../assets/icons/experience.png'),
    text: 'Berpangalaman lebih dari 1000 Pengujian Struktur di dalam hingga Luar Negri.',
  },
  {
    icon: require('../../../assets/icons/tools.png'),
    text: '"One Stop Solution For Structural Testing". GSI mempunyai peralatan lengkap dan terkini',
  },
  {
    icon: require('../../../assets/icons/ahli.png'),
    text: 'Tenaga Ahli, Engineer dan Teknisi kompeten, berpengalaman dan memiliki Sertifikasi.',
  },
  {
    icon: require('../../../assets/icons/iso.png'),
    text: 'ISO 9001 - Quality Management Systems & ISO 37001 — Anti-Bribery Management Systems.',
  },
];

function WhyGsiSection(): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Why Graha Survei Indonesia ?</Text>

      <View style={styles.listContainer}>
        {WHY_GSI_ITEMS.map((item, index) => (
          <View key={index} style={styles.pill}>
            <Image
              source={item.icon}
              style={styles.icon}
              resizeMode="contain"
            />

            <Text style={styles.pillText}>{item.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    elevation: 2,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: typography.bodyLarge,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.md,
    color: '#1A1A1A',
  },
  listContainer: {
    gap: spacing.sm,
  },
  pill: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 28,
    height: 28,
    flexShrink: 0,
  },
  pillText: {
    fontSize: typography.caption,
    color: '#333',
    textAlign: 'justify',
    lineHeight: 18,
    flex: 1,
  },
});

export default WhyGsiSection;
