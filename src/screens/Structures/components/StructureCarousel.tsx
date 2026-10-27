import { palette, spacing } from '../../../theme/tokens';
import React from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';

interface StructureCarouselProps {
  carouselRef: React.RefObject<ScrollView | null>;
  caseStudies: Array<{ photo: ImageSourcePropType }>;
  activeIndex: number;
  cardWidth: number;
}

export const StructureCarousel: React.FC<StructureCarouselProps> = ({
  carouselRef,
  caseStudies,
  activeIndex,
  cardWidth,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        ref={carouselRef}
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      >
        {caseStudies.map((study, index) => (
          <View key={index} style={[styles.caseCard, { width: cardWidth }]}>
            <Image
              source={study.photo}
              style={styles.casePhoto}
              resizeMode="cover"
              fadeDuration={0}
            />
          </View>
        ))}
      </ScrollView>

      {caseStudies.length > 1 && (
        <View style={styles.dotsRow}>
          {caseStudies.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.activeDot]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  caseCard: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: palette.white,
  },
  casePhoto: {
    width: '100%',
    height: 200,
    borderRadius: 14,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  activeDot: {
    width: 18,
    backgroundColor: palette.brand,
  },
});
