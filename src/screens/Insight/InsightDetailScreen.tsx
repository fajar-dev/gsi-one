import { ActionButton } from '../../components/ui/ActionButton';
import { styles } from './InsightDetailScreen.styles';
import { palette } from '../../theme/tokens';
import { View, Text, ScrollView, Image, StatusBar } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  RootStackParamList,
  RootStackNavigationProp,
} from '../../types/navigation';
import { insightsData } from '../../data/insights';
import { scale } from '../../utils/responsive';

type InsightDetailRouteProp = RouteProp<RootStackParamList, 'InsightDetail'>;

const InsightDetailScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<InsightDetailRouteProp>();
  const insets = useSafeAreaInsets();
  const { id } = route.params || {};

  const article = insightsData.find(item => item.id === id) || insightsData[0];

  const handleConsultation = () => {
    navigation.navigate('BookSurvey');
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
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
        >
          <Icon name="arrow-left" size={scale(22)} color={palette.white} />
        </ActionButton>

        <Text style={styles.headerTitle} numberOfLines={1}>
          Insight Struktur
        </Text>

        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          <Image
            source={article.image}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.articleHeader}>
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Icon name="book-open" size={scale(12)} color="#0B7552" />
              <Text style={styles.categoryBadgeText}>Insight Struktur</Text>
            </View>
            <Text style={styles.metaText}>{article.readTime}</Text>
          </View>

          <Text style={styles.articleTitle}>{article.title}</Text>
          <Text style={styles.dateText}>
            {article.date} • Dipublikasikan oleh Tim GSI
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.sectionContainer}>
          {article.intro.map((p, idx) => (
            <Text key={idx} style={styles.paragraphText}>
              {p}
            </Text>
          ))}
        </View>

        {article.sections.map((section, sIdx) => (
          <View key={sIdx} style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            {section.body.map((bText, bIdx) => (
              <Text key={bIdx} style={styles.paragraphText}>
                {bText}
              </Text>
            ))}
            {section.listItems && section.listItems.length > 0 && (
              <View style={styles.listContainer}>
                {section.listItems.map((item, lIdx) => (
                  <View key={lIdx} style={styles.listItemRow}>
                    <View style={styles.bulletDot} />
                    <Text style={styles.listItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <View style={styles.conclusionCard}>
          <LinearGradient
            colors={['#0F766E', '#0B7552']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.conclusionGradient}
          >
            <View style={styles.conclusionHeaderRow}>
              <Icon
                name="shield"
                size={scale(22)}
                color={palette.white}
                style={{ marginRight: scale(10) }}
              />
              <Text style={styles.conclusionTitle}>
                {article.conclusion.heading}
              </Text>
            </View>

            {article.conclusion.body.map((cText, cIdx) => (
              <Text key={cIdx} style={styles.conclusionText}>
                {cText}
              </Text>
            ))}

            <ActionButton
              style={styles.consultButton}
              activeOpacity={0.85}
              onPress={handleConsultation}
              accessibilityRole="button"
            >
              <Text style={styles.consultButtonText}>Konsultasi Sekarang</Text>
              <Icon name="chevron-right" size={scale(18)} color="#0B7552" />
            </ActionButton>
          </LinearGradient>
        </View>

        <View style={{ height: scale(40) }} />
      </ScrollView>
    </View>
  );
};

export default InsightDetailScreen;
