import { ActionButton } from '../../components/ui/ActionButton';
import {
  palette,
  touchTarget,
  spacing,
  typography,
  radius,
} from '../../theme/tokens';
import { memo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { scale, fontScale } from '../../utils/responsive';
import Icon from 'react-native-vector-icons/Feather';

import { openWhatsAppConsultation } from '../../utils/whatsapp';

const Hero = memo(() => {
  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.contentRow}>
          <View style={styles.leftColumn}>
            <Text style={styles.cardTitle}>
              Konsultasikan{'\n'}Kebutuhan{'\n'}Struktur Anda
            </Text>
            <Text style={styles.cardSubtitle}>
              Dapatkan rekomendasi layanan langsung dari engineer GSI.
            </Text>
          </View>

          <View style={styles.rightColumn}>
            <Image
              source={require('../../../assets/images/engineer_female.jpg')}
              style={styles.engineerImage}
              resizeMode="contain"
            />
          </View>
        </View>
        <ActionButton
          style={styles.consultButton}
          activeOpacity={0.8}
          onPress={() =>
            openWhatsAppConsultation(
              'Halo GSI One, saya ingin konsultasi gratis mengenai kebutuhan struktur.',
            )
          }
          accessibilityRole="button"
        >
          <Text style={styles.consultButtonText}>Konsultasi Gratis</Text>
          <Icon
            name="arrow-right"
            size={scale(14)}
            color={palette.white}
            style={{ marginLeft: scale(6) }}
          />
        </ActionButton>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: scale(spacing.lg),
    marginTop: -scale(40),
    zIndex: 5,
  },
  cardContainer: {
    backgroundColor: palette.white,
    borderRadius: scale(20),
    paddingHorizontal: scale(18),
    paddingVertical: scale(spacing.lg),
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    minHeight: scale(160),
  },
  contentRow: { flexDirection: 'row', alignItems: 'center' },
  leftColumn: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: scale(6),
  },
  cardTitle: {
    fontSize: fontScale(16.5),
    fontWeight: 'bold',
    color: '#0D3A2F',
    lineHeight: scale(21),
  },
  cardSubtitle: {
    fontSize: fontScale(typography.caption),
    color: '#718096',
    marginTop: scale(6),
    lineHeight: scale(16),
  },
  consultButton: {
    minHeight: touchTarget.minSize,
    minWidth: 170,
    backgroundColor: '#0B7552',
    borderRadius: scale(radius.md),
    paddingVertical: scale(10),
    paddingHorizontal: scale(14),
    alignSelf: 'flex-start',
    marginTop: scale(spacing.md),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0B7552',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  consultButtonText: {
    color: palette.white,
    fontSize: fontScale(typography.caption),
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  rightColumn: {
    width: scale(125),
    flexShrink: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  engineerImage: {
    width: '100%',
    height: scale(150),
  },
});

export default Hero;
