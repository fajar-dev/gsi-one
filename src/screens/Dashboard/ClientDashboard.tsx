import { ActionButton } from '../../components/ui/ActionButton';
import { summarizeStages } from '../../domain/models/projectProgress';
import { styles } from './ClientDashboard.styles';
import { ErrorNotice } from '../../components/common/ErrorNotice';
import { palette, spacing } from '../../theme/tokens';
import { JSX, useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, Image, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Svg, { Path } from 'react-native-svg';
import { AuthenticatedNavigationProp } from '../../types/navigation';
import { colors, roleColors, neutral } from '../../theme/colors';
import { scale } from '../../utils/responsive';
import { useAuthStore } from '../../store/authStore';
import { useProjectStore } from '../../store/projectStore';
import type { ProjectDetail } from '../../domain/models/project';
import { projectService } from '../../services/projectService';
import { getUserInitials } from '../../utils/userHelpers';
import { ProjectStatusEnum } from '../../domain/enums/ProjectStatus';
import {
  getProjectImage,
  getProjectDuration,
} from '../../utils/projectHelpers';

import DashboardHeader from './components/DashboardHeader';
import QuickAccessGrid from './components/QuickAccessGrid';
import SupportCard from '../../components/common/SupportCard';

const BridgeSvgIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 18V14C4 14 6 12 8 12C10 12 14 14 14 14C16 14 18 12 20 12C21 12 22 13 22 13.5V18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
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
  const [projectDetailsMap, setProjectDetailsMap] = useState<
    Record<string, ProjectDetail>
  >({});
  const [_isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, [fetchProjects]),
  );

  useEffect(() => {
    let active = true;
    if (projects.length > 0) {
      const activeList = projects.filter(
        p => p.status === ProjectStatusEnum.ON_PROGRESS,
      );
      const targetProjects = (
        activeList.length > 0 ? activeList : [projects[0]]
      ).slice(0, 3);

      setIsLoadingDetail(true);
      setDetailError(null);

      Promise.all(
        targetProjects.map(p =>
          projectService.getProjectDetail(p.id, user?.role),
        ),
      )
        .then(details => {
          if (!active) return;
          const map: Record<string, ProjectDetail> = {};
          details.forEach(d => {
            if (d) map[d.id] = d;
          });
          setProjectDetailsMap(map);
        })
        .catch((err: unknown) => {
          if (!active) return;
          const message =
            err instanceof Error
              ? err.message
              : 'Gagal memuat detail proyek aktif';
          setDetailError(message);
        })
        .finally(() => {
          if (active) setIsLoadingDetail(false);
        });
    } else {
      setProjectDetailsMap({});
      setDetailError(null);
    }
    return () => {
      active = false;
    };
  }, [projects, user?.role, user?.id]);

  const initials = getUserInitials(user?.full_name);

  const hasProjects = projects.length > 0;
  const activeProjects = projects.filter(
    p => p.status === ProjectStatusEnum.ON_PROGRESS,
  );
  const displayProjects =
    activeProjects.length > 0
      ? activeProjects.slice(0, 3)
      : hasProjects
      ? [projects[0]]
      : [];

  const primaryProject = displayProjects[0] || null;
  const primaryDetail = primaryProject
    ? projectDetailsMap[primaryProject.id]
    : null;

  const {
    total: totalStages,
    completed: completedStages,
    inProgress: inProgressStages,
    active: activeStageObj,
  } = summarizeStages(primaryDetail?.stages);
  const currentStageTitle = activeStageObj?.title || 'Tahapan belum ditentukan';

  const getLatestUpdates = () => {
    const items: Array<{
      id: string;
      title: string;
      projectId: string;
      projectName: string;
      createdAt: string;
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
                id: `file-${f.id}`,
                projectId: proj.id,
                projectName: proj.project_name,
                createdAt: f.created_at || '',
                title: `${f.file_name} ditambahkan`,
                metaTime: f.created_at
                  ? new Date(f.created_at).toLocaleDateString('id-ID')
                  : 'Baru saja',
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
                id: `note-${u.id}`,
                projectId: proj.id,
                projectName: proj.project_name,
                createdAt: u.created_at || '',
                title: u.description,
                metaTime: u.created_at
                  ? new Date(u.created_at).toLocaleDateString('id-ID')
                  : 'Baru saja',
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

    return items
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5);
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
      icon: (<BridgeSvgIcon color="#2E5F6F" />) as JSX.Element,
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
      <ErrorNotice message={detailError} onRetry={fetchProjects} />
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
            roleColors.client.gradientStart,
            roleColors.client.gradientEnd,
          ]}
          userName={user?.full_name || 'Bapak/Ibu'}
          initials={initials}
          roleLabel="Klien"
          roleIcon="user"
          companyName={primaryProject?.client_name || 'Graha Survei Indonesia'}
          subtitle="Pantau progres assessment seluruh Asset Anda."
        />

        <View style={styles.body}>
          <Text style={[styles.sectionTitle, { marginTop: scale(spacing.sm) }]}>
            Akses Cepat
          </Text>
          <QuickAccessGrid items={quickAccessItems} />

          {!hasProjects ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyCardTitle}>Belum ada proyek aktif</Text>
              <Text style={styles.emptyCardDesc}>
                Tim GSI akan menghubungkan proyek Anda setelah survey disetujui.
              </Text>
              <ActionButton
                style={styles.bookBtn}
                onPress={() => navigation.navigate('BookSurvey')}
                accessibilityRole="button"
              >
                <Text style={styles.bookBtnText}>Ajukan Survey Baru</Text>
              </ActionButton>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Proyek Aktif</Text>
              {displayProjects.map((proj, idx) => {
                const det = projectDetailsMap[proj.id];
                const {
                  total: projTotalStages,
                  completed: projCompletedStages,
                  percent: projProgress,
                  active,
                } = summarizeStages(det?.stages);
                const projStageTitle =
                  active?.title || 'Tahapan belum ditentukan';

                return (
                  <View
                    key={proj.id}
                    style={[
                      styles.activeProjectCard,
                      idx < displayProjects.length - 1 && {
                        marginBottom: scale(spacing.md),
                      },
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
                            <Text style={styles.stageBadgeText}>
                              {projStageTitle}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.metaRow}>
                          <Icon
                            name="briefcase"
                            size={12}
                            color={neutral[600]}
                          />
                          <Text style={styles.metaText}>
                            {proj.client_name || 'Klien belum ditentukan'}
                          </Text>
                        </View>
                        <View style={styles.metaRow}>
                          <Icon
                            name="calendar"
                            size={12}
                            color={neutral[600]}
                          />
                          <Text style={styles.metaText}>
                            {getProjectDuration(
                              proj.start_date,
                              proj.estimated_finish,
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.progressContainer}>
                      <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>
                          Progres Keseluruhan
                        </Text>
                        <Text style={styles.progressPercent}>
                          {projProgress}%
                        </Text>
                      </View>
                      <View style={styles.progressBarBg}>
                        <View
                          style={[
                            styles.progressBarFill,
                            { width: `${projProgress}%` as `${number}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressSub}>
                        {projTotalStages > 0
                          ? `${projCompletedStages} dari ${projTotalStages} tahapan telah selesai dikerjakan`
                          : 'Tahapan proyek belum ditentukan'}
                      </Text>
                    </View>

                    <ActionButton
                      style={styles.detailBtn}
                      activeOpacity={0.8}
                      onPress={() =>
                        navigation.navigate('ProjectDetail', {
                          projectId: proj.id,
                          projectName: proj.project_name,
                        })
                      }
                      accessibilityRole="button"
                    >
                      <Text style={styles.detailBtnText}>
                        Lihat Detail Proyek
                      </Text>
                    </ActionButton>
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
                    <Text style={styles.statNumber}>{totalStages}</Text>
                    <Text style={styles.statLabel}>Total Tahapan</Text>
                  </View>
                </View>
                <View style={styles.statGridCard}>
                  <View style={[styles.statIconBg, styles.staticStyle1]}>
                    <Icon name="check-circle" size={18} color="#2E7D32" />
                  </View>
                  <View style={styles.statTextCol}>
                    <Text style={styles.statNumber}>{completedStages}</Text>
                    <Text style={styles.statLabel}>
                      Tahapan Selesai Dikerjakan
                    </Text>
                  </View>
                </View>
                <View style={styles.statGridCard}>
                  <View style={[styles.statIconBg, styles.staticStyle2]}>
                    <Icon name="clock" size={18} color="#1565C0" />
                  </View>
                  <View style={styles.statTextCol}>
                    <Text style={styles.statNumber}>{inProgressStages}</Text>
                    <Text style={styles.statLabel}>Tahapan Dalam Proses</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitle}>
                Tahap yang Sedang Dikerjakan
              </Text>
              <ActionButton
                style={styles.agendaCard}
                activeOpacity={0.85}
                onPress={navigateToProject}
                accessibilityRole="button"
              >
                <Image
                  source={require('../../../assets/images/projects/bridge-3.jpg')}
                  style={styles.agendaImage}
                />
                <View style={styles.agendaInfoCol}>
                  <Text style={styles.agendaTitle}>
                    {activeStageObj ? activeStageObj.title : currentStageTitle}
                  </Text>
                  <View style={styles.agendaMeta}>
                    <Icon name="activity" size={12} color={neutral[600]} />
                    <Text style={styles.agendaMetaText} numberOfLines={1}>
                      {activeStageObj?.description ||
                        'Tahapan inspeksi & pemetaan teknis di lapangan'}
                    </Text>
                  </View>
                  <View style={styles.agendaMeta}>
                    <Icon name="briefcase" size={12} color={neutral[600]} />
                    <Text style={styles.agendaMetaText}>
                      {primaryProject?.client_name || 'Klien belum ditentukan'}
                    </Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={20} color={neutral[600]} />
              </ActionButton>

              <Text style={styles.sectionTitle}>Update Terbaru</Text>
              {latestUpdates.length > 0 ? (
                latestUpdates.map(upd => (
                  <ActionButton
                    key={upd.id}
                    style={styles.updateCard}
                    activeOpacity={0.85}
                    onPress={() =>
                      navigation.navigate('ProjectDetail', {
                        projectId: upd.projectId,
                        projectName: upd.projectName,
                      })
                    }
                    accessibilityRole="button"
                  >
                    <View
                      style={[
                        styles.updateIconBg,
                        { backgroundColor: upd.iconBg },
                      ]}
                    >
                      <Icon
                        name={upd.iconName}
                        size={18}
                        color={upd.iconColor}
                      />
                    </View>
                    <View style={styles.updateTextCol}>
                      <Text style={styles.updateTitle} numberOfLines={2}>
                        {upd.title}
                      </Text>
                      <Text style={styles.updateMeta}>{upd.metaTime}</Text>
                    </View>
                    <View
                      style={[
                        styles.updateBadge,
                        { backgroundColor: upd.iconBg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.updateBadgeText,
                          { color: upd.iconColor },
                        ]}
                      >
                        {upd.badgeText}
                      </Text>
                    </View>
                    <Icon
                      name="chevron-right"
                      size={20}
                      color={neutral[600]}
                      style={styles.staticStyle3}
                    />
                  </ActionButton>
                ))
              ) : (
                <View style={styles.emptyUpdateCard}>
                  <Icon name="info" size={18} color={colors.grey} />
                  <Text style={styles.emptyUpdateText}>
                    Belum ada pembaruan dokumen atau progres pada proyek Anda.
                  </Text>
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

export default ClientDashboard;
