import React from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { CARD_WIDTH } from '../hooks/useStructureDetail';

interface StructureCarouselProps {
    carouselRef: React.RefObject<ScrollView | null>;
    caseStudies: Array<{ photo: any }>;
    activeIndex: number;
}

export const StructureCarousel: React.FC<StructureCarouselProps> = ({
    carouselRef,
    caseStudies,
    activeIndex,
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
                    <View key={index} style={styles.caseCard}>
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
                            style={[
                                styles.dot,
                                i === activeIndex && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    caseCard: {
        width: CARD_WIDTH,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
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
        marginTop: 12,
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
        backgroundColor: '#0F9F67',
    },
});
