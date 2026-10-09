import React, { JSX, useState, useCallback } from 'react';
import { View, ScrollView, Text, RefreshControl, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthenticatedNavigationProp } from '../../types/navigation';
import { roleColors, neutral, surface } from '../../../assets/styles/Colors';
import { scale, fontScale } from '../../utils/responsive';
import { useAuthStore } from '../../store/authStore';
import { useProjectStore } from '../../store/projectStore';
import { getUserInitials } from '../../utils/userHelpers';

import DashboardHeader from './components/DashboardHeader';
import QuickAccessGrid from './components/QuickAccessGrid';
import ProjectSummary from './components/ProjectSummary';
import RecentProjects from './components/RecentProjects';
import AdminRegisterModal from './components/AdminRegisterModal';
import { SupportCard } from '../../components/common/SupportCard';

function AdminDashboard(): JSX.Element {
  const navigation = useNavigation<AuthenticatedNavigationProp>();
  const { user } = useAuthStore();
  const { projects, stats, isLoading, fetchProjects } = useProjectStore();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, [fetchProjects])
  );

  const initials = getUserInitials(user?.full_name);

  const quickAccessItems = [
    {
      label: 'Daftar User',
      icon: 'user-plus',
      iconColor: '#2E5F6F',
      onPress: () => setShowRegisterModal(true),
    },
    {
      label: 'Survey Marketing',
      icon: 'calendar',
      iconColor: '#0F9F67',
      bgStyle: { backgroundColor: '#E8F5E9' },
      onPress: () => navigation.navigate('SurveyRequests'),
    },
    {
      label: 'Proyek Baru',
      icon: 'plus-circle',
      iconColor: '#2E7D32',
      bgStyle: { backgroundColor: '#E8F5E9' },
      onPress: () => navigation.navigate('CreateProject'),
    },
    {
      label: 'Semua Proyek',
      icon: 'folder',
      iconColor: '#E65100',
      bgStyle: { backgroundColor: '#FFF3E0' },
      onPress: () => navigation.navigate('Projects'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchProjects} colors={['#0F9F67']} />
        }
      >
        <DashboardHeader
          gradientColors={[roleColors.admin.gradientStart, roleColors.admin.gradientEnd]}
          userName={user?.full_name || 'Administrator'}
          initials={initials}
          roleLabel="System Administrator"
          roleIcon="shield"
          rolePillStyle={{ backgroundColor: 'rgba(15, 159, 103, 0.4)' }}
          subtitle="Kelola akun pengguna, pendaftaran proyek, dan kontrol operasional sistem GSI One."
        />

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Akses Cepat Administrator</Text>
          <QuickAccessGrid items={quickAccessItems} />

          <ProjectSummary
            stats={stats}
            isLoading={isLoading}
            loaderColor={roleColors.admin.accent}
          />

          <RecentProjects
            projects={projects}
            isLoading={isLoading}
            accentColor={roleColors.admin.accent}
          />

          <SupportCard />
        </View>
      </ScrollView>

      <AdminRegisterModal
        visible={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.screen },
  scrollContent: { paddingBottom: scale(24) },
  body: {
    paddingHorizontal: scale(16),
    paddingTop: scale(8),
  },
  sectionTitle: {
    fontSize: fontScale(16),
    fontWeight: '800',
    color: neutral[900],
    marginTop: scale(20),
    marginBottom: scale(12),
  },
});

export default AdminDashboard;
