import { ActionButton } from '../../components/ui/ActionButton';
import { palette, touchTarget, spacing, typography } from '../../theme/tokens';
import { JSX, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { AuthenticatedNavigationProp } from '../../types/navigation';
import { colors, roleColors, surface } from '../../theme/colors';
import { scale, fontScale } from '../../utils/responsive';
import { useAuthStore } from '../../store/authStore';
import { useProjectStore } from '../../store/projectStore';
import { getUserInitials } from '../../utils/userHelpers';

import DashboardHeader from './components/DashboardHeader';
import ProjectSummary from './components/ProjectSummary';
import RecentProjects from './components/RecentProjects';
import { SupportCard } from '../../components/common/SupportCard';

const ENGINEER_STAT_COLORS = {
  onProgress: roleColors.engineer.accent,
  done: roleColors.engineer.forest,
  pending: roleColors.engineer.teal,
  onHold: colors.grey,
};

function EngineerDashboard(): JSX.Element {
  const navigation = useNavigation<AuthenticatedNavigationProp>();
  const { user } = useAuthStore();
  const { projects, stats, isLoading, fetchProjects } = useProjectStore();

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, [fetchProjects]),
  );

  const initials = getUserInitials(user?.full_name);

  return (
    <View style={styles.container}>
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
            roleColors.engineer.gradientStart,
            roleColors.engineer.gradientEnd,
          ]}
          userName={user?.full_name || 'Engineer Lapangan'}
          initials={initials}
          roleLabel="Engineer Lapangan"
          roleIcon="tool"
          rolePillStyle={styles.staticStyle1}
          subtitle="Kelola perbaruan progres proyek di lapangan serta hasil pengujian & inspeksi NDT."
        />

        <View style={styles.body}>
          <View style={styles.actionCard}>
            <Text style={styles.actionCardTitle}>
              Menu Tim Teknis / Engineer
            </Text>
            <View style={styles.quickActionList}>
              <ActionButton
                style={styles.actionBtn}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Projects')}
                accessibilityRole="button"
              >
                <View style={styles.actionIconWrapper}>
                  <Icon name="check-square" size={20} color={palette.brand} />
                </View>
                <View style={styles.actionTextWrapper}>
                  <Text style={styles.actionBtnTitle}>
                    Update Progress Lapangan
                  </Text>
                  <Text style={styles.actionBtnSub}>
                    Perbarui status tahapan & progres proyek
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color={palette.brand} />
              </ActionButton>

              <ActionButton
                style={[styles.actionBtn, styles.quickActionMarginTop]}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Projects')}
                accessibilityRole="button"
              >
                <View style={styles.actionIconWrapper}>
                  <Icon name="file-text" size={20} color={palette.brand} />
                </View>
                <View style={styles.actionTextWrapper}>
                  <Text style={styles.actionBtnTitle}>
                    Unggah Hasil Pengujian (NDT)
                  </Text>
                  <Text style={styles.actionBtnSub}>
                    Upload dokumen PDF laporan atau foto inspeksi
                  </Text>
                </View>
                <Icon name="chevron-right" size={20} color={palette.brand} />
              </ActionButton>
            </View>
          </View>

          <ProjectSummary
            stats={stats}
            isLoading={isLoading}
            statColors={ENGINEER_STAT_COLORS}
            loaderColor={roleColors.engineer.accent}
          />

          <RecentProjects
            projects={projects}
            isLoading={isLoading}
            accentColor={roleColors.engineer.accent}
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
  actionCard: {
    backgroundColor: colors.white,
    borderRadius: scale(14),
    padding: scale(spacing.lg),
    marginTop: scale(spacing.md),
    marginBottom: scale(spacing.lg),
    borderLeftWidth: 4,
    borderLeftColor: palette.brand,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  actionCardTitle: {
    fontSize: fontScale(typography.caption),
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: scale(10),
  },
  quickActionList: { gap: scale(spacing.sm) },
  quickActionMarginTop: { marginTop: scale(spacing.sm) },
  actionBtn: {
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8F7',
    padding: scale(spacing.md),
    borderRadius: scale(10),
  },
  actionIconWrapper: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextWrapper: {
    flex: 1,
    marginLeft: scale(spacing.md),
  },
  actionBtnTitle: {
    fontSize: fontScale(typography.body),
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actionBtnSub: {
    fontSize: fontScale(typography.caption),
    color: colors.textSecondary,
    marginTop: scale(2),
  },
});

export default EngineerDashboard;
