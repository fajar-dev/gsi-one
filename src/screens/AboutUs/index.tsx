import { spacing } from '../../theme/tokens';
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import BottomNav from '../../components/BottomNav';
import Header from '../Home/Header';
import VideoSection from './VideoSection';
import AboutUsSection from './AboutUsSection';
import WhyGsiSection from './WhyGsiSection';

function AboutUs(): React.ReactElement {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Header />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <VideoSection />
          <AboutUsSection />
          <WhyGsiSection />
        </ScrollView>
      </View>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
});

export default AboutUs;
