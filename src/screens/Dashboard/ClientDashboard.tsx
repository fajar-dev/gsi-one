import React, { JSX, useEffect, useState, useCallback } from 'react';
import {
  View, ScrollView, Text, TouchableOpacity, Image,
  RefreshControl, StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Svg, { Path } from 'react-native-svg';
import { AuthenticatedNavigationProp } from '../../types/navigation';
import { colors, roleColors, neutral, surface } from '../../../assets/styles/Colors';
import { scale, fontScale } from '../../utils/responsive';
import { useAuthStore } from '../../store/authStore';
import { useProjectStore } from '../../store/projectStore';
import { projectService, ProjectDetail } from '../../services/projectService';
import { getUserInitials } from '../../utils/userHelpers';
import { ProjectStatusEnum, ProjectStageStatusEnum } from '../../domain/enums/ProjectStatus';
import {
  getProjectImage,
  getProjectLocation,
  getProjectDuration,
  getBridgeStats,
  getProgressSubtext,
} from '../../utils/projectHelpers';

import DashboardHeader from './components/DashboardHeader';
import QuickAccessGrid from './components/QuickAccessGrid';
import SupportCard from '../../components/common/SupportCard';


const BridgeSvgIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M2 18V14C4 14 6 12 8 12C10 12 14 14 14 14C16 14 18 12 20 12C21 12 22 13 22 13.5V18" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M4 14V18" stroke={color} strokeWidth={2} />
    <Path d="M10 12.5V18" stroke={color} strokeWidth={2} />
    <Path d="M16 13V18" stroke={color} strokeWidth={2} />
    <Path d="M2 18H22" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

function ClientDashboard(): JSX.Element {
  const navigation = useNavigation<AuthenticatedNavigationProp>();
  const { user } = useAuthStore();
  const { projects, isLoading, fetchProjects } = useProjectStore();
  const [projectDetailsMap, setProjectDetailsMap] = useState<Record<string, ProjectDetail>>({});
  const [_isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [_detailError, setDetailError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, [fetchProjects])
  );

  useEffect(() => {
    if (projects.length > 0) {
      const activeList = projects.filter(p => p.status === ProjectStatusEnum.ON_PROGRESS);
      const targetProjects = (activeList.length > 0 ? activeList : [projects[0]]).slice(0, 3);

      setIsLoadingDetail(true);
      setDetailError(null);

      Promise.all(
        targetProjects.map(p =>
          projectService.getProjectDetail(p.id, user?.role).catch(() => null)
        )
      )
        .then(details => {
          const map: Record<string, ProjectDetail> = {};
          details.forEach(d => {
            if (d) map[d.id] = d;
          });
          setProjectDetailsMap(map);
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : 'Gagal memuat detail proyek aktif';
          setDetailError(message);
        })
        .finally(() => setIsLoadingDetail(false));
    } else {
      setProjectDetailsMap({});
      setDetailError(null);
    }
  }, [projects, user?.role]);

  const initials = getUserInitials(user?.full_name);

  const hasProjects = projects.length > 0;
  const activeProjects = projects.filter(p => p.status === ProjectStatusEnum.ON_PROGRESS);
  const displayProjects = activeProjects.length > 0
    ? activeProjects.slice(0, 3)
    : (hasProjects ? [projects[0]] : []);

  const primaryProject = displayProjects[0] || null;
  const primaryDetail = primaryProject ? projectDetailsMap[primaryProject.id] : null;

  let totalStages = 0;
  let completedStages = 0;
  let inProgressStages = 0;
  let currentStageTitle = 'Persiapan';
  let activeStageObj: any = null;

  if (primaryDetail?.stages && primaryDetail.stages.length > 0) {
    totalStages = primaryDetail.stages.length;
    completedStages = primaryDetail.stages.filter(s => s.status === ProjectStageStatusEnum.DONE).length;
    inProgressStages = primaryDetail.stages.filter(s => s.status === ProjectStageStatusEnum.IN_PROGRESS).length;
    if (inProgressStages === 0 && completedStages < totalStages) {
      inProgressStages = 1;
    }
    activeStageObj = primaryDetail.stages.find(s => s.status === ProjectStageStatusEnum.IN_PROGRESS)
      || primaryDetail.stages.find(s => s.status === ProjectStageStatusEnum.PENDING)
      || primaryDetail.stages[primaryDetail.stages.length - 1];
    if (activeStageObj) {
      currentStageTitle = activeStageObj.title;
    }
  }

  const primaryBridgeStats = getBridgeStats(primaryProject?.project_name, 0);

  const getLatestUpdates = () => {
    const items: Array<{
      id: string;
      title: string;
      metaTime: string;
      iconName: string;
      iconColor: string;
      iconBg: string;
      badgeText: string;
    }> = [];

    displayProjects.forEach(proj => {
      const det = projectDetailsMap[proj.id];
      if (det?.stages) {
        det.stages.forEach(stg => {
          if (stg.files && stg.files.length > 0) {
            stg.files.forEach(f => {
              const isImg = f.file_type === 'image';
              items.push({
                id: f.id,
                title: `${f.file_name} ditambahkan`,
                metaTime: f.created_at ? new Date(f.created_at).toLocaleDateString('id-ID') : 'Baru saja',
                iconName: isImg ? 'image' : 'file-text',
                iconColor: isImg ? '#1565C0' : '#2E7D32',
                iconBg: isImg ? '#E3F2FD' : '#E8F5E9',
                badgeText: isImg ? 'Gambar' : 'Dokumen',
              });
            });
          }
          if (stg.updates && stg.updates.length > 0) {
            stg.updates.forEach(u => {
              items.push({
                id: u.id,
                title: u.description,
                metaTime: u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID') : 'Baru saja',
                iconName: 'activity',
                iconColor: '#E65100',
                iconBg: '#FFF3E0',
                badgeText: 'Progres',
              });
            });
          }
        });
      }
    });

    return items.slice(0, 5);
  };

  const latestUpdates = getLatestUpdates();

  const navigateToProject = () => {
    if (primaryProject) {
      navigation.navigate('ProjectDetail', {
        projectId: primaryProject.id,
        projectName: primaryProject.project_name,
      });
    }
  };

  const quickAccessItems = [
    {
      label: 'Daftar Proyek',
      icon: <BridgeSvgIcon color="#2E5F6F" /> as JSX.Element,
      iconColor: '#2E7D32',
      onPress: () => navigation.navigate('Projects'),
    },
    {
      label: 'Hasil Pengujian',
      icon: 'clipboard',
      iconColor: '#2E7D32',
      bgStyle: { backgroundColor: '#E8F5E9' },
      onPress: navigateToProject,
    },
    {
      label: 'Dokumen',
      icon: 'folder',
      iconColor: '#E65100',
      bgStyle: { backgroundColor: '#FFF3E0' },
      onPress: navigateToProject,
    },
    {
      label: 'Hubungi PIC',
      icon: 'headphones',
      iconColor: '#4A148C',
      bgStyle: { backgroundColor: '#F3E5F5' },
      onPress: () => navigation.navigate('Profile'),
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
          gradientColors={[roleColors.client.gradientStart, roleColors.client.gradientEnd]}
          userName={user?.full_name || 'Bapak/Ibu'}
          initials={initials}
          roleLabel="Klien"
          roleIcon="user"
          companyName={primaryProject?.client_name || 'Graha Survei Indonesia'}
          subtitle="Pantau progres assessment seluruh Asset Anda."
        />

        <View style={styles.body}>
          <Text style={[styles.sectionTitle, { marginTop: scale(8) }]}>Akses Cepat</Text>
          <QuickAccessGrid items={quickAccessItems} />

          {!hasProjects ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyCardTitle}>Belum ada proyek aktif</Text>
              <Text style={styles.emptyCardDesc}>
                Tim GSI akan menghubungkan proyek Anda setelah survey disetujui.
              </Text>
              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => navigation.navigate('BookSurvey')}
              >
                <Text style={styles.bookBtnText}>Ajukan Survey Baru</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Proyek Aktif</Text>
              {displayProjects.map((proj, idx) => {
                const det = projectDetailsMap[proj.id];
                let projTotalStages = 0;
                let projCompletedStages = 0;
                let projProgress = 0;
                let projStageTitle = 'Persiapan';

                if (det?.stages && det.stages.length > 0) {
                  projTotalStages = det.stages.length;
                  projCompletedStages = det.stages.filter(s => s.status === ProjectStageStatusEnum.DONE).length;
                  const weight = 100 / projTotalStages;
                  projProgress = Math.min(100, Math.round(projCompletedStages * weight));
                  const activeStg = det.stages.find(s => s.status === ProjectStageStatusEnum.IN_PROGRESS)
                    || det.stages.find(s => s.status === ProjectStageStatusEnum.PENDING)
                    || det.stages[det.stages.length - 1];
                  if (activeStg) projStageTitle = activeStg.title;
                }

                const projStats = getBridgeStats(proj.project_name, projProgress);

                return (
                  <View
                    key={proj.id}
                    style={[
                      styles.activeProjectCard,
                      idx < displayProjects.length - 1 && { marginBottom: scale(12) },
                    ]}
                  >
                    <View style={styles.cardMainRow}>
                      <Image
                        source={getProjectImage(proj.project_name)}
                        style={styles.projectImage}
                      />
                      <View style={styles.projectInfoCol}>
                        <Text style={styles.projectTitle} numberOfLines={2}>
                          {proj.project_name}
                        </Text>
                        <Text style={styles.projectCode}>
                          {proj.project_code || 'GSI-ONE'}
                        </Text>
                        <View style={styles.badgeWrapper}>
                          <View style={styles.stageBadge}>
                            <Text style={styles.stageBadgeText}>{projStageTitle}</Text>
                          </View>
                        </View>
                        <View style={styles.metaRow}>
                          <Icon name="map-pin" size={12} color={neutral[600]} />
                          <Text style={styles.metaText}>
                            {getProjectLocation(proj.client_name, proj.project_name)}
                          </Text>
                        </View>
                        <View style={styles.metaRow}>
                          <Icon name="calendar" size={12} color={neutral[600]} />
                          <Text style={styles.metaText}>
                            {getProjectDuration(proj.start_date, proj.estimated_finish)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.progressContainer}>
                      <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Progres Keseluruhan</Text>
                        <Text style={styles.progressPercent}>{projProgress}%</Text>
                      </View>
                      <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${projProgress}%` as any }]} />
                      </View>
                      <Text style={styles.progressSub}>
                        {projTotalStages > 0
                          ? `${projCompletedStages} dari ${projTotalStages} tahapan telah selesai dikerjakan`
                          : getProgressSubtext(proj.project_name || '', projStats)}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.detailBtn}
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate('ProjectDetail', {
                        projectId: proj.id,
                        projectName: proj.project_name,
                      })}
                    >
                      <Text style={styles.detailBtnText}>Lihat Detail Proyek</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}

              <Text style={styles.sectionTitle}>Ringkasan Proyek</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statGridCard}>
                  <View style={styles.statIconBg}>
                    <BridgeSvgIcon color="#2E5F6F" />
                  </View>
                  <View style={styles.statTextCol}>
                    <Text style={styles.statNumber}>{primaryBridgeStats.total}</Text>
                    <Text style={styles.statLabel}>Total Aset</Text>
                  </View>
                </View>
                <View style={styles.statGridCard}>
                  <View style={[styles.statIconBg, { backgroundColor: '#E8F5E9' }]}>
                    <Icon name="check-circle" size={18} color="#2E7D32" />
                  </View>
                  <View style={styles.statTextCol}>
                    <Text style={styles.statNumber}>{completedStages}</Text>
                    <Text style={styles.statLabel}>Tahapan Selesai Dikerjakan</Text>
                  </View>
                </View>
                <View style={styles.statGridCard}>
                  <View style={[styles.statIconBg, { backgroundColor: '#E3F2FD' }]}>
                    <Icon name="clock" size={18} color="#1565C0" />
                  </View>
                  <View style={styles.statTextCol}>
                    <Text style={styles.statNumber}>{inProgressStages}</Text>
                    <Text style={styles.statLabel}>Tahapan Dalam Proses</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Tahap yang Sedang Dikerjakan</Text>
              <TouchableOpacity style={styles.agendaCard} activeOpacity={0.85} onPress={navigateToProject}>
                <Image
                  source={require('../../../assets/images/projects/bridge-3.jpg')}
                  style={styles.agendaImage}
                />
                <View style={styles.agendaInfoCol}>
                  <Text style={styles.agendaTitle}>{activeStageObj ? activeStageObj.title : currentStageTitle}</Text>
                  <View style={styles.agendaMeta}>
                    <Icon name="activity" size={12} color={neutral[600]} />
                    <Text style={styles.agendaMetaText} numberOfLines={1}>
                      {activeStageObj?.description || 'Tahapan inspeksi & pemetaan teknis di lapangan'}
                    </Text>
                  </View>
                  <View style={styles.agendaMeta}>
                    <Icon name="map-pin" size={12} color={neutral[600]} />
                    <Text style={styles.agendaMetaText}>
                      {getProjectLocation(primaryProject?.client_name, primaryProject?.project_name)}
                    </Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={20} color={neutral[600]} />
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Update Terbaru</Text>
              {latestUpdates.length > 0 ? (
                latestUpdates.map(upd => (
                  <TouchableOpacity
                    key={upd.id}
                    style={styles.updateCard}
                    activeOpacity={0.85}
                    onPress={navigateToProject}
                  >
                    <View style={[styles.updateIconBg, { backgroundColor: upd.iconBg }]}>
                      <Icon name={upd.iconName as any} size={18} color={upd.iconColor} />
                    </View>
                    <View style={styles.updateTextCol}>
                      <Text style={styles.updateTitle} numberOfLines={2}>
                        {upd.title}
                      </Text>
                      <Text style={styles.updateMeta}>{upd.metaTime}</Text>
                    </View>
                    <View style={[styles.updateBadge, { backgroundColor: upd.iconBg }]}>
                      <Text style={[styles.updateBadgeText, { color: upd.iconColor }]}>{upd.badgeText}</Text>
                    </View>
                    <Icon name="chevron-right" size={20} color={neutral[600]} style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyUpdateCard}>
                  <Icon name="info" size={18} color={colors.grey} />
                  <Text style={styles.emptyUpdateText}>Belum ada pembaruan dokumen atau progres pada proyek Anda.</Text>
                </View>
              )}
            </>
          )}

          <SupportCard />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: surface.screen },
  scrollContent: { paddingBottom: scale(24) },
  body: { paddingHorizontal: scale(16), paddingTop: scale(8) },
  sectionTitle: {
    fontSize: fontScale(16), fontWeight: '800', color: neutral[900],
    marginTop: scale(20), marginBottom: scale(12),
  },
  emptyCard: {
    backgroundColor: colors.white, borderRadius: scale(12), padding: scale(24),
    alignItems: 'center', elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6,
    marginTop: scale(16),
  },
  emptyCardTitle: { fontSize: fontScale(15), fontWeight: '700', color: colors.textPrimary, marginBottom: scale(8) },
  emptyCardDesc: { fontSize: fontScale(13), color: colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: scale(20) },
  bookBtn: { backgroundColor: '#0F9F67', paddingHorizontal: scale(24), paddingVertical: scale(12), borderRadius: scale(8) },
  bookBtnText: { color: colors.white, fontWeight: '700', fontSize: fontScale(14) },
  activeProjectCard: {
    backgroundColor: colors.white, borderRadius: scale(12), padding: scale(16),
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6,
  },
  cardMainRow: { flexDirection: 'row' },
  projectImage: { width: scale(96), height: scale(96), borderRadius: scale(8), marginRight: scale(12), resizeMode: 'cover' },
  projectInfoCol: { flex: 1 },
  projectTitle: { fontSize: fontScale(15), fontWeight: '800', color: neutral[900], lineHeight: 20 },
  projectCode: { fontSize: fontScale(11), color: neutral[600], fontWeight: '500', marginTop: scale(2) },
  badgeWrapper: { flexDirection: 'row', marginTop: scale(6), marginBottom: scale(6) },
  stageBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: scale(8), paddingVertical: scale(4), borderRadius: scale(4) },
  stageBadgeText: { fontSize: fontScale(10), fontWeight: '700', color: '#2E7D32' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: scale(6), marginTop: scale(4) },
  metaText: { fontSize: fontScale(11), color: neutral[600], fontWeight: '500' },
  divider: { height: 1, backgroundColor: neutral[200], marginVertical: scale(12) },
  progressContainer: { marginBottom: scale(12) },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: scale(6) },
  progressLabel: { fontSize: fontScale(12), fontWeight: '600', color: neutral[600] },
  progressPercent: { fontSize: fontScale(14), fontWeight: '800', color: '#0F9F67' },
  progressBarBg: { height: scale(6), backgroundColor: neutral[300], borderRadius: scale(3), overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#0F9F67', borderRadius: scale(3) },
  progressSub: { fontSize: fontScale(11), color: neutral[600], marginTop: scale(6) },
  detailBtn: { backgroundColor: '#002239', paddingVertical: scale(10), borderRadius: scale(8), alignItems: 'center' },
  detailBtnText: { color: colors.white, fontWeight: '700', fontSize: fontScale(13) },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: scale(6) },
  statGridCard: {
    flex: 1, backgroundColor: colors.white, borderRadius: scale(8), padding: scale(8),
    flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3,
  },
  statIconBg: {
    width: scale(28), height: scale(28), borderRadius: scale(6), backgroundColor: '#E0F2F1',
    justifyContent: 'center', alignItems: 'center', marginRight: scale(6),
  },
  statTextCol: { flex: 1 },
  statNumber: { fontSize: fontScale(14), fontWeight: '800', color: neutral[900] },
  statLabel: { fontSize: fontScale(8), color: neutral[600], fontWeight: '500', marginTop: scale(1), lineHeight: 11 },
  agendaCard: {
    backgroundColor: colors.white, borderRadius: scale(12), padding: scale(12),
    flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6,
  },
  agendaImage: { width: scale(64), height: scale(48), borderRadius: scale(6), marginRight: scale(12) },
  agendaInfoCol: { flex: 1 },
  agendaTitle: { fontSize: fontScale(13), fontWeight: '700', color: neutral[900] },
  agendaMeta: { flexDirection: 'row', alignItems: 'center', gap: scale(4), marginTop: scale(3) },
  agendaMetaText: { fontSize: fontScale(11), color: neutral[600], fontWeight: '500', flex: 1 },
  updateCard: {
    backgroundColor: colors.white, borderRadius: scale(12), padding: scale(12),
    flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6,
    marginBottom: scale(8),
  },
  updateIconBg: {
    width: scale(36), height: scale(36), borderRadius: scale(18),
    backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center',
    marginRight: scale(12),
  },
  updateTextCol: { flex: 1 },
  updateTitle: { fontSize: fontScale(12), fontWeight: '600', color: neutral[900], lineHeight: 18 },
  updateMeta: { fontSize: fontScale(10), color: neutral[600], marginTop: scale(3) },
  updateBadge: {
    backgroundColor: '#E8F5E9', paddingHorizontal: scale(8), paddingVertical: scale(3),
    borderRadius: scale(4), marginRight: scale(4),
  },
  updateBadgeText: { fontSize: fontScale(9), fontWeight: '700', color: '#2E7D32' },
  emptyText: { fontSize: fontScale(12), color: neutral[500], textAlign: 'center', paddingVertical: scale(12) },
  emptyUpdateCard: {
    backgroundColor: colors.white,
    borderRadius: scale(10),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    borderWidth: 1,
    borderColor: neutral[200],
    marginBottom: scale(12),
  },
  emptyUpdateText: {
    flex: 1,
    fontSize: fontScale(12),
    color: neutral[600],
    lineHeight: 18,
  },
});

export default ClientDashboard;
