import { ActionButton } from '../../components/ui/ActionButton';
import { styles } from './LayananDetailScreen.styles';
import { palette, spacing } from '../../theme/tokens';
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Image,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { RootStackParamList } from '../../types/navigation';
import { meLayananData, LayananItem } from '../../data/layanan';
import { scale } from '../../utils/responsive';

type LayananDetailRouteProp = RouteProp<RootStackParamList, 'LayananDetail'>;

function LayananDetailScreen(): React.ReactElement {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<LayananDetailRouteProp>();
  const insets = useSafeAreaInsets();

  const { id } = route.params || {};
  const item: LayananItem | undefined =
    meLayananData.find(l => l.id === id) || meLayananData[0];

  if (!item) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Layanan tidak ditemukan</Text>
        <ActionButton
          style={styles.backBtnBtn}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
        >
          <Text style={styles.backBtnText}>Kembali</Text>
        </ActionButton>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#062A3F" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ImageBackground
          source={item.bannerImage}
          style={styles.heroBanner}
          imageStyle={styles.heroImageStyle}
        >
          <View style={styles.heroOverlay} />

          <View
            style={[
              styles.headerRow,
              {
                paddingTop: insets.top > 0 ? insets.top + scale(8) : scale(16),
              },
            ]}
          >
            <ActionButton
              style={styles.backButton}
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Kembali"
            >
              <Icon name="arrow-left" size={scale(20)} color={palette.white} />
            </ActionButton>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          </View>

          <View style={styles.heroBody}>
            <View style={styles.iconCircle}>
              <Icon name={item.icon} size={scale(22)} color={palette.white} />
            </View>
            <Text style={styles.heroTitle}>{item.title}</Text>
          </View>
        </ImageBackground>

        <View style={styles.contentBody}>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Deskripsi Layanan</Text>
            <Text style={styles.descText}>{item.desc}</Text>
          </View>

          {item.detailImage && (
            <View style={styles.illustrationCard}>
              <Text style={styles.sectionTitle}>Ilustrasi & Cakupan Kerja</Text>
              <Image
                source={item.detailImage}
                style={styles.detailImage}
                resizeMode="contain"
              />
            </View>
          )}

          {item.whenNeededItems && item.whenNeededItems.length > 0 && (
            <View style={styles.sectionCard}>
              <View style={styles.cardHeaderRow}>
                <Icon
                  name="help-circle"
                  size={scale(18)}
                  color="#0B7552"
                  style={styles.cardHeaderIcon}
                />
                <Text style={styles.sectionTitle}>{item.whenNeededTitle}</Text>
              </View>
              {item.whenNeededItems.map((bullet, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          )}

          {item.risksItems && item.risksItems.length > 0 && (
            <View style={styles.sectionCardWarning}>
              <View style={styles.cardHeaderRow}>
                <Icon
                  name="alert-circle"
                  size={scale(18)}
                  color="#DC2626"
                  style={styles.cardHeaderIcon}
                />
                <Text style={styles.sectionTitleWarning}>
                  {item.risksTitle}
                </Text>
              </View>
              {item.risksItems.map((bullet, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Icon
                    name="x-circle"
                    size={scale(14)}
                    color="#EF4444"
                    style={styles.iconMargin}
                  />
                  <Text style={styles.bulletTextWarning}>{bullet}</Text>
                </View>
              ))}
            </View>
          )}

          {item.solutionsItems && item.solutionsItems.length > 0 && (
            <View style={styles.sectionCard}>
              <View style={styles.cardHeaderRow}>
                <Icon
                  name="layers"
                  size={scale(18)}
                  color="#0284C7"
                  style={styles.cardHeaderIcon}
                />
                <Text style={styles.sectionTitle}>{item.solutionsTitle}</Text>
              </View>
              {item.solutionsItems.map((bullet, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Icon
                    name="check"
                    size={scale(14)}
                    color="#0284C7"
                    style={styles.iconMargin}
                  />
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          )}

          {item.benefits && item.benefits.length > 0 && (
            <View style={styles.sectionCardSuccess}>
              <View style={styles.cardHeaderRow}>
                <Icon
                  name="check-circle"
                  size={scale(18)}
                  color="#0B7552"
                  style={styles.cardHeaderIcon}
                />
                <Text style={styles.sectionTitleSuccess}>Manfaat Layanan</Text>
              </View>
              {item.benefits.map((bullet, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Icon
                    name="check-circle"
                    size={scale(14)}
                    color="#0B7552"
                    style={styles.iconMargin}
                  />
                  <Text style={styles.bulletTextSuccess}>{bullet}</Text>
                </View>
              ))}
            </View>
          )}

          {item.outputs && item.outputs.length > 0 && (
            <View style={styles.sectionCard}>
              <View style={styles.cardHeaderRow}>
                <Icon
                  name="file-text"
                  size={scale(18)}
                  color="#6366F1"
                  style={styles.cardHeaderIcon}
                />
                <Text style={styles.sectionTitle}>
                  Output yang Diterima Client
                </Text>
              </View>
              <View style={styles.outputGrid}>
                {item.outputs.map((out, idx) => (
                  <View key={idx} style={styles.outputTag}>
                    <Icon
                      name="award"
                      size={scale(13)}
                      color="#4F46E5"
                      style={{ marginRight: scale(6) }}
                    />
                    <Text style={styles.outputTagText}>{out}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.ctaBox}>
            <Text style={styles.ctaTitle}>
              Konsultasikan Kebutuhan Proyek Anda
            </Text>
            <Text style={styles.ctaDesc}>
              Tim teknis dan insinyur GSI siap membantu investigasi, evaluasi,
              hingga penyusunan rekomendasi teknis.
            </Text>
            <ActionButton
              style={styles.ctaButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('BookSurvey')}
              accessibilityRole="button"
            >
              <Text style={styles.ctaButtonText}>
                Jadwalkan Survei / Konsultasi
              </Text>
              <Icon
                name="calendar"
                size={scale(16)}
                color={palette.white}
                style={{ marginLeft: scale(spacing.sm) }}
              />
            </ActionButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default LayananDetailScreen;
