import { ActionButton } from '../../../components/ui/ActionButton';
import { styles } from './ServiceDetailTemplate.styles';
import { palette } from '../../../theme/tokens';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Image,
  ImageSourcePropType,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../types/navigation';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { scale } from '../../../utils/responsive';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
}

export interface ServiceMethodItem {
  image: ImageSourcePropType;
  label: string;
}

export interface ServiceMethodDetail {
  title: string;
  description: string;
  parameters?: string[];
}

export interface ServiceDetailTemplateProps {
  title: string;
  aboutText: React.ReactNode | string;
  methods?: ServiceMethodItem[];
  methodDetails?: ServiceMethodDetail[];
  benefits?: string[];
  ctaText?: string;
  onCtaPress?: () => void;
}

export const ServiceDetailTemplate: React.FC<ServiceDetailTemplateProps> = ({
  title,
  aboutText,
  methods = [],
  methodDetails,
  benefits = [],
  ctaText = 'Ajukan Survei Sekarang',
  onCtaPress,
}) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const insets = useSafeAreaInsets();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  const handleCta = () => {
    if (onCtaPress) {
      onCtaPress();
    } else {
      navigation.navigate('BookSurvey');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#002239" />

      <LinearGradient
        colors={['#002239', palette.brand]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          { paddingTop: insets.top > 0 ? insets.top + scale(10) : scale(16) },
        ]}
      >
        <ActionButton
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
        >
          <Icon name="arrow-left" size={scale(22)} color={palette.white} />
        </ActionButton>

        <Text style={styles.headerTitle}>{title}</Text>

        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Tentang Layanan</Text>
          {typeof aboutText === 'string' ? (
            <Text style={styles.sectionText}>{aboutText}</Text>
          ) : (
            aboutText
          )}
        </View>

        {methods.length > 0 && (
          <View style={styles.cardSection}>
            <Text style={styles.sectionTitle}>Metode Pengujian</Text>
            <View style={styles.methodsGrid}>
              {methods.map((item, index) => (
                <View key={index} style={styles.methodCard}>
                  <View style={styles.methodIcon}>
                    <Image
                      source={item.image}
                      style={styles.methodImage}
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={styles.methodLabel} numberOfLines={2}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {methodDetails && methodDetails.length > 0 && (
          <View style={styles.cardSection}>
            <Text style={styles.sectionTitle}>Detail Pengujian</Text>
            {methodDetails.map((detail, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <View key={index} style={styles.accordionCard}>
                  <ActionButton
                    style={styles.accordionHeader}
                    activeOpacity={0.7}
                    onPress={() => toggleAccordion(index)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.accordionTitle}>{detail.title}</Text>
                    <Icon
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={scale(18)}
                      color={palette.brand}
                    />
                  </ActionButton>

                  {isExpanded && (
                    <View style={styles.accordionBody}>
                      <Text style={styles.accordionDesc}>
                        {detail.description}
                      </Text>
                      {detail.parameters && detail.parameters.length > 0 && (
                        <View style={styles.paramSection}>
                          <Text style={styles.paramHeading}>
                            Parameter yang Diukur:
                          </Text>
                          {detail.parameters.map((param, pIdx) => (
                            <View key={pIdx} style={styles.paramRow}>
                              <View style={styles.paramBullet} />
                              <Text style={styles.paramText}>{param}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {benefits.length > 0 && (
          <View style={styles.cardSection}>
            <Text style={styles.sectionTitle}>Keunggulan</Text>
            {benefits.map((item, index) => (
              <View key={index} style={styles.benefitItem}>
                <View style={styles.bulletIconCircle}>
                  <Icon name="check" size={scale(12)} color="#0B7552" />
                </View>
                <Text style={styles.benefitText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        <ActionButton
          style={styles.ctaButton}
          activeOpacity={0.85}
          onPress={handleCta}
          accessibilityRole="button"
        >
          <Text style={styles.ctaButtonText}>{ctaText}</Text>
        </ActionButton>
      </ScrollView>
    </View>
  );
};
