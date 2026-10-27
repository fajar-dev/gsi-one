import { spacing } from '../../theme/tokens';
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { scale } from '../../utils/responsive';

import Header from './Header';
import Hero from './Hero';
import StartSection from './StartSection';
import ServicesSection from './ServicesSection';
import WhyChooseGsi from './WhyChooseGsi';
import InsightStruktur from './InsightStruktur';
import ClientRegisterBanner from './ClientRegisterBanner';
import BottomNav from '../../components/BottomNav';

function Home(): React.ReactElement {
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const atBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    setIsAtBottom(atBottom);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.scrollWrapper}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <Header />
            <Hero />
            <StartSection />
            <ServicesSection />
            <WhyChooseGsi />
            <InsightStruktur />
            <ClientRegisterBanner />
          </ScrollView>

          {!isAtBottom && (
            <LinearGradient
              pointerEvents="none"
              colors={['transparent', 'rgba(245, 248, 247, 0.8)']}
              style={styles.bottomGradient}
            />
          )}
        </View>
      </View>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8F7',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F5F8F7',
  },
  scrollWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scale(spacing.xxl),
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    zIndex: 1,
  },
});

export default Home;
