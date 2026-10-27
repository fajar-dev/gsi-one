import { ActionButton } from '../../components/ui/ActionButton';
import { styles } from './StructureDetail.styles';
import { palette } from '../../theme/tokens';
import React, { JSX } from 'react';
import { View, Text, ScrollView, StatusBar, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { scale } from '../../utils/responsive';
import { useStructureDetail } from './hooks/useStructureDetail';
import { StructureCarousel } from './components/StructureCarousel';

function StructureDetail(): JSX.Element {
  const insets = useSafeAreaInsets();
  const {
    data,
    navigation,
    carouselRef,
    activeIndex,
    cardWidth,
    handleConsultation,
  } = useStructureDetail();

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

        <Text style={styles.headerTitle}>{data.headerTitle}</Text>

        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.detailHeader}>
          <View style={styles.titleIconChip}>
            <Image
              source={data.icon}
              style={styles.titleIcon}
              resizeMode="contain"
            />
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.titleText}>{data.name}</Text>
            <Text style={styles.subText}>{data.shortDescription}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.eyebrow}>
            <View style={styles.eyebrowDot} />
            <Text style={styles.eyebrowLabel}>Mengenal Assessment Ini</Text>
            <View style={styles.eyebrowLine} />
          </View>

          {data.definition.split('\n\n').map((para: string, i: number) => (
            <Text
              key={i}
              style={[
                styles.definition,
                i < data.definition.split('\n\n').length - 1 &&
                  styles.definitionSpaced,
              ]}
            >
              {para}
            </Text>
          ))}
        </View>

        {data.reasons && data.reasons.length > 0 && (
          <View style={styles.section}>
            <View style={styles.eyebrow}>
              <View style={styles.eyebrowDot} />
              <Text style={styles.eyebrowLabel}>
                Mengapa Assessment Penting?
              </Text>
              <View style={styles.eyebrowLine} />
            </View>
            <Text style={styles.reasonsIntro}>
              Seiring bertambahnya usia, kualitas struktur dapat menurun akibat:
            </Text>
            <View style={styles.bulletList}>
              {data.reasons.map((item: string, index: number) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {data.benefits && data.benefits.length > 0 && (
          <View style={styles.section}>
            <View style={styles.eyebrow}>
              <View style={styles.eyebrowDot} />
              <Text style={styles.eyebrowLabel}>Manfaat</Text>
              <View style={styles.eyebrowLine} />
            </View>
            <View style={styles.benefitsGrid}>
              {data.benefits.map((item: string, index: number) => (
                <View key={index} style={styles.benefitItem}>
                  <Text style={styles.benefitCheck}>✓</Text>
                  <Text style={styles.benefitText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {data.aimGoals && data.aimGoals.length > 0 && (
          <View style={styles.section}>
            <View style={styles.eyebrow}>
              <View style={styles.eyebrowDot} />
              <Text style={styles.eyebrowLabel}>
                Asset Integrity Management
              </Text>
              <View style={styles.eyebrowLine} />
            </View>
            <Text style={styles.reasonsIntro}>
              Strategi pengelolaan aset yang menjaga bangunan industri tetap:
            </Text>
            {data.aimGoals.map(
              (goal: { label: string; description: string }, index: number) => (
                <View key={index} style={styles.aimCard}>
                  <Text style={styles.aimLabel}>✔ {goal.label}</Text>
                  <Text style={styles.aimDescription}>{goal.description}</Text>
                </View>
              ),
            )}
          </View>
        )}

        {data.whenNeeded && data.whenNeeded.length > 0 && (
          <View style={styles.section}>
            <View style={styles.eyebrow}>
              <View style={styles.eyebrowDot} />
              <Text style={styles.eyebrowLabel}>Kapan Perlu Dilakukan?</Text>
              <View style={styles.eyebrowLine} />
            </View>
            <View style={styles.bulletList}>
              {data.whenNeeded.map((item: string, index: number) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.eyebrow}>
            <View style={styles.eyebrowDot} />
            <Text style={styles.eyebrowLabel}>Project Experiences</Text>
            <View style={styles.eyebrowLine} />
          </View>
          <StructureCarousel
            carouselRef={carouselRef}
            caseStudies={data.caseStudies}
            activeIndex={activeIndex}
            cardWidth={cardWidth}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.eyebrow}>
            <View style={styles.eyebrowDot} />
            <Text style={styles.eyebrowLabel}>Proses Pengerjaan</Text>
            <View style={styles.eyebrowLine} />
          </View>
          <View style={styles.stepRow}>
            {data.steps.map(
              (step: { title: string; duration?: string }, index: number) => (
                <React.Fragment key={index}>
                  <View style={styles.stepItem}>
                    <View style={styles.stepNumCircle}>
                      <Text style={styles.stepNumText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDuration}>{step.duration}</Text>
                  </View>
                  {index < data.steps.length - 1 && (
                    <View style={styles.stepConnector} />
                  )}
                </React.Fragment>
              ),
            )}
          </View>
        </View>

        <ActionButton
          style={styles.ctaButton}
          onPress={handleConsultation}
          accessibilityRole="button"
        >
          <Text style={styles.ctaButtonText}>Konsultasi {data.name}</Text>
        </ActionButton>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

export default StructureDetail;
