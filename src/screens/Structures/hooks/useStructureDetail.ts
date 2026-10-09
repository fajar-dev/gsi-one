import { useRef, useState, useEffect } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackNavigationProp, StructureDetailRouteProp } from '../../../types/navigation';
import { structures, StructureType } from '../../../data/structures';
import { openWhatsAppConsultation } from '../../../utils/whatsapp';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const CARD_WIDTH = SCREEN_WIDTH - 32;
export const SLIDE_INTERVAL_MS = 3000;

export function useStructureDetail() {
    const navigation = useNavigation<RootStackNavigationProp>();
    const route = useRoute<StructureDetailRouteProp>();
    const { id } = route.params || {};

    const data: StructureType = structures.find((item) => item.id === id) ?? structures[0];
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
            setActiveIndex((prev) => {
                const next = (prev + 1) % totalSlides;
                carouselRef.current?.scrollTo({
                    x: next * CARD_WIDTH,
                    animated: true,
                });
                return next;
            });
        }, SLIDE_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [totalSlides, data.id]);

    const handleConsultation = () => {
        openWhatsAppConsultation(`Halo GSI One, saya ingin konsultasi mengenai ${data.name}.`);
    };

    return {
        data,
        navigation,
        carouselRef,
        activeIndex,
        totalSlides,
        handleConsultation,
    };
}
