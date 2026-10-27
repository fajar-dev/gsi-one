import { ActionButton } from '../../components/ui/ActionButton';
import { styles } from './ServicesSection.styles';
import { palette } from '../../theme/tokens';
import { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../types/navigation';
import { scale } from '../../utils/responsive';
import Icon from 'react-native-vector-icons/Feather';

import { servicesData, ServiceTarget } from '../../data/services';

const ServicesSection = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelectService = (target: ServiceTarget) => {
    setIsModalVisible(false);
    if (target.type === 'service') {
      navigation.navigate(target.screen);
    } else {
      navigation.navigate('StructureDetail', { id: target.structureId });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Our Experience</Text>
        <ActionButton
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Services')}
          accessibilityRole="button"
        >
          <Text style={styles.seeAllText}>Lihat Semua ›</Text>
        </ActionButton>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {servicesData.map(item => (
          <ActionButton
            key={item.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => handleSelectService(item.target)}
            accessibilityRole="button"
          >
            <ImageBackground
              source={item.image}
              style={styles.cardBg}
              imageStyle={styles.cardImageStyle}
            >
              <View style={styles.overlay} />

              <View style={styles.iconCircle}>
                <Icon name={item.icon} size={scale(16)} color={palette.white} />
              </View>

              <Text style={styles.cardLabel}>{item.name}</Text>
            </ImageBackground>
          </ActionButton>
        ))}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsModalVisible(false)}
          accessibilityRole="button"
        >
          <Pressable
            style={styles.modalContent}
            onPress={e => e.stopPropagation()}
            accessibilityRole="button"
          >
            <View style={styles.modalDragHandle} />

            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>Semua Layanan GSI</Text>
                <Text style={styles.modalSubtitle}>
                  Pilih layanan untuk melihat detail teknis dan cakupan
                  pekerjaan.
                </Text>
              </View>
              <ActionButton
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Tutup"
              >
                <Icon name="x" size={scale(20)} color="#4A5568" />
              </ActionButton>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalListContent}
            >
              {servicesData.map(item => (
                <ActionButton
                  key={item.id}
                  style={styles.serviceItemCard}
                  activeOpacity={0.8}
                  onPress={() => handleSelectService(item.target)}
                  accessibilityRole="button"
                >
                  <View style={styles.serviceItemIconCircle}>
                    <Icon name={item.icon} size={scale(20)} color="#0B7552" />
                  </View>
                  <View style={styles.serviceItemBody}>
                    <View style={styles.serviceTitleRow}>
                      <Text style={styles.serviceItemTitle}>{item.title}</Text>
                      <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    </View>
                    <Text style={styles.serviceItemDesc}>{item.desc}</Text>
                  </View>
                  <Icon name="chevron-right" size={scale(18)} color="#A0AEC0" />
                </ActionButton>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default ServicesSection;
