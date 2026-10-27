import { ActionButton } from '../../components/ui/ActionButton';
import { styles } from './index.styles';
import { palette } from '../../theme/tokens';
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { RootStackParamList } from '../../types/navigation';
import BottomNav from '../../components/BottomNav';
import { scale } from '../../utils/responsive';

import { servicesData, ServiceTarget } from '../../data/services';

function ServicesScreen(): React.ReactElement {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const handleSelectService = (target: ServiceTarget) => {
    if (target.type === 'service') {
      navigation.navigate(target.screen);
    } else {
      navigation.navigate('StructureDetail', { id: target.structureId });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#062A3F" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.bannerContainer,
            { paddingTop: insets.top > 0 ? insets.top + scale(12) : scale(16) },
          ]}
        >
          <View style={styles.topHeaderRow}>
            <ActionButton
              style={styles.backButton}
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Kembali"
            >
              <Icon name="arrow-left" size={scale(20)} color={palette.white} />
            </ActionButton>
            <Text style={styles.bannerTitle}>Our Experience</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          <Text style={styles.bannerSubtitle}>
            Pengalaman rekayasa teknis dan asesmen keandalan berbagai jenis
            struktur serta infrastruktur strategis.
          </Text>
        </View>

        <View style={styles.listContainer}>
          {servicesData.map(item => (
            <ActionButton
              key={item.id}
              style={styles.serviceCard}
              activeOpacity={0.88}
              onPress={() => handleSelectService(item.target)}
              accessibilityRole="button"
            >
              <ImageBackground
                source={item.image}
                style={styles.cardImageBg}
                imageStyle={styles.cardImageStyle}
              >
                <View style={styles.cardOverlay} />
                <View style={styles.cardHeaderRow}>
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                  <View style={styles.iconCircle}>
                    <Icon
                      name={item.icon}
                      size={scale(16)}
                      color={palette.white}
                    />
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    {item.desc}
                  </Text>
                </View>
              </ImageBackground>
            </ActionButton>
          ))}
        </View>

        <View style={styles.ctaCard}>
          <View style={styles.ctaTextContainer}>
            <Text style={styles.ctaTitle}>Butuh Survei Lokasi Proyek?</Text>
            <Text style={styles.ctaDesc}>
              Konsultasikan kebutuhan inspeksi dan jadwalkan survei lapangan
              langsung bersama tim ahli GSI.
            </Text>
          </View>
          <ActionButton
            style={styles.ctaButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('BookSurvey')}
            accessibilityRole="button"
          >
            <Text style={styles.ctaButtonText}>Book Survey Now</Text>
            <Icon
              name="calendar"
              size={scale(16)}
              color={palette.white}
              style={{ marginLeft: scale(6) }}
            />
          </ActionButton>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

export default ServicesScreen;
