import React, { JSX } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors, neutral } from '../../../assets/styles/Colors';
import { scale, fontScale } from '../../utils/responsive';

interface SupportCardProps {
  style?: object;
}

export function SupportCard({ style }: SupportCardProps): JSX.Element {
  const handleCallSupport = () => {
    const phoneNumber = 'tel:+622187654321';
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (supported) {
          Linking.openURL(phoneNumber);
        } else {
          Alert.alert('Kontak Layanan', 'Nomor telepon layanan pelanggan: +62 21 8765 4321');
        }
      })
      .catch(() => {
        Alert.alert('Kontak Layanan', 'Nomor telepon layanan pelanggan: +62 21 8765 4321');
      });
  };

  const handleOpenWebsite = () => {
    const url = 'https://grahasurvei.com';
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Situs Resmi', 'Kunjungi web kami di https://grahasurvei.com');
        }
      })
      .catch(() => {
        Alert.alert('Situs Resmi', 'Kunjungi web kami di https://grahasurvei.com');
      });
  };

  return (
    <View style={[styles.card, style]}>
      <Text style={styles.cardTitle}>Dukungan & Bantuan</Text>

      <TouchableOpacity
        style={styles.infoRow}
        activeOpacity={0.7}
        onPress={handleCallSupport}
      >
        <View style={styles.infoLabelGroup}>
          <Icon name="phone-call" size={scale(18)} color="#64748B" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Layanan Pelanggan</Text>
        </View>
        <Text style={styles.infoValue}>+62 21 8765 4321</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.infoRow}
        activeOpacity={0.7}
        onPress={handleOpenWebsite}
      >
        <View style={styles.infoLabelGroup}>
          <Icon name="globe" size={scale(18)} color="#64748B" style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Situs Resmi</Text>
        </View>
        <Text style={styles.infoValue}>grahasurvei.com</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: scale(16),
    padding: scale(18),
    marginTop: scale(16),
    marginBottom: scale(12),
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: fontScale(15),
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: scale(14),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(2),
  },
  infoLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: scale(10),
  },
  infoLabel: {
    fontSize: fontScale(13),
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: fontScale(13),
    fontWeight: '700',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: scale(12),
  },
});

export default SupportCard;
