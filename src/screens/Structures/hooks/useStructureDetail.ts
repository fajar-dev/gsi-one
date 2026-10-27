import { useRef, useState, useEffect } from 'react';
import { Platform, ScrollView, useWindowDimensions } from 'react-native';
import { layout } from '../../../theme/tokens';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  RootStackNavigationProp,
  StructureDetailRouteProp,
} from '../../../types/navigation';
import { structures, StructureType } from '../../../data/structures';
import { openWhatsAppConsultation } from '../../../utils/whatsapp';

export const SLIDE_INTERVAL_MS = 3000;

export function useStructureDetail() {
  const { width } = useWindowDimensions();
  const cardWidth =
    Math.min(width, Platform.OS === 'web' ? layout.webMaxWidth : 1200) - 32;
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<StructureDetailRouteProp>();
  const { id } = route.params || {};

  const data: StructureType =
    structures.find(item => item.id === id) ?? structures[0];
  const carouselRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = data.caseStudies.length;

  useEffect(() => {
    setActiveIndex(0);
    carouselRef.current?.scrollTo({ x: 0, animated: false });
  }, [data.id]);

  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % totalSlides;
        carouselRef.current?.scrollTo({
          x: next * cardWidth,
          animated: true,
        });
        return next;
      });
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [totalSlides, data.id, cardWidth]);

  const handleConsultation = () => {
    openWhatsAppConsultation(
      `Halo GSI One, saya ingin konsultasi mengenai ${data.name}.`,
    );
  };

  return {
    data,
    navigation,
    carouselRef,
    cardWidth,
    activeIndex,
    totalSlides,
    handleConsultation,
  };
}
