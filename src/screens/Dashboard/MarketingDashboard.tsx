import { ErrorNotice } from '../../components/common/ErrorNotice';
import { palette, spacing, typography } from '../../theme/tokens';
import { JSX, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthenticatedNavigationProp } from '../../types/navigation';
import { roleColors, neutral, surface } from '../../theme/colors';
import { scale, fontScale } from '../../utils/responsive';
import { useAuthStore } from '../../store/authStore';
import { useProjectStore } from '../../store/projectStore';
import { getUserInitials } from '../../utils/userHelpers';

import DashboardHeader from './components/DashboardHeader';
import QuickAccessGrid from './components/QuickAccessGrid';
import RecentProjects from './components/RecentProjects';
import { SupportCard } from '../../components/common/SupportCard';

function MarketingDashboard(): JSX.Element {
  const navigation = useNavigation<AuthenticatedNavigationProp>();
  const { user } = useAuthStore();
  const { projects, isLoading, fetchProjects, error } = useProjectStore();

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, [fetchProjects]),
  );

  const initials = getUserInitials(user?.full_name);

  const quickAccessItems = [
    {
      label: 'Daftar Survey',
      icon: 'calendar',
      iconColor: palette.brand,
      bgStyle: { backgroundColor: '#E8F5E9' },
      onPress: () => navigation.navigate('SurveyRequests'),
    },
    {
      label: 'Daftar Proyek',
      icon: 'folder',
      iconColor: '#00796B',
      bgStyle: { backgroundColor: '#E0F2F1' },
      onPress: () => navigation.navigate('Projects'),
    },
    {
      label: 'Profil & Kontak',
      icon: 'user',
      iconColor: '#2E7D32',
      bgStyle: { backgroundColor: '#E8F5E9' },
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  return (
    <View style={styles.container}>
      <ErrorNotice message={error} onRetry={fetchProjects} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchProjects}
            colors={[palette.brand]}
          />
        }
      >
        <DashboardHeader
          gradientColors={[
            roleColors.marketing.gradientStart,
            roleColors.marketing.gradientEnd,
          ]}
          userName={user?.full_name || 'Tim Marketing'}
          initials={initials}
          roleLabel="Marketing & Business Dev"
          roleIcon="briefcase"
          rolePillStyle={styles.staticStyle1}
          subtitle="Pantau reservasi survey, hubungan klien, dan portofolio proyek GSI One."
        />

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Akses Cepat Marketing</Text>
          <QuickAccessGrid items={quickAccessItems} />

          <RecentProjects
            projects={projects}
            isLoading={isLoading}
            accentColor={roleColors.marketing.accent}
          />

          <SupportCard />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  staticStyle1: { backgroundColor: 'rgba(15, 159, 103, 0.4)' },

  container: { flex: 1, backgroundColor: surface.screen },
  scrollContent: { paddingBottom: scale(spacing.xxl) },
  body: {
    paddingHorizontal: scale(spacing.xl),
    paddingTop: scale(spacing.sm),
  },
  sectionTitle: {
    fontSize: fontScale(typography.bodyLarge),
    fontWeight: '800',
    color: neutral[900],
    marginTop: scale(spacing.xl),
    marginBottom: scale(spacing.md),
  },
});

export default MarketingDashboard;
