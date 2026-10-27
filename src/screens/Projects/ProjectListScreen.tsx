import { ActionButton } from '../../components/ui/ActionButton';
import { styles } from './ProjectListScreen.styles';
import { ErrorNotice } from '../../components/common/ErrorNotice';
import { palette, spacing } from '../../theme/tokens';
import { useCallback, useState, useEffect, JSX } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types/navigation';
import { useProjectStore } from '../../store/projectStore';
import {
  canCreateProjectRole,
  canViewSurveysRole,
} from '../../domain/enums/UserRole';
import type { Project, ProjectStatus } from '../../domain/models/project';
import StatusBadge from './components/StatusBadge';
import { useAuthStore } from '../../store/authStore';
import { scale } from '../../utils/responsive';

type FilterStatus = 'all' | 'pending' | 'on_progress' | 'done' | 'on_hold';

const FILTER_OPTIONS: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'on_progress', label: 'Berjalan' },
  { key: 'pending', label: 'Menunggu' },
  { key: 'done', label: 'Selesai' },
  { key: 'on_hold', label: 'Ditunda' },
];

function ProjectListScreen(): JSX.Element {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const isMarketing = user?.role === 'marketing';
  const isClient = user?.role === 'client';
  const { projects, isLoading, fetchProjects, error } = useProjectStore();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [displayCount, setDisplayCount] = useState(10);

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, [fetchProjects]),
  );

  useEffect(() => {
    setDisplayCount(10);
  }, [search, activeFilter]);

  const handleCreateProject = () => {
    navigation.navigate('CreateProject');
  };

  const handleLoadMore = () => {
    if (displayCount < filtered.length) {
      setDisplayCount(prev => prev + 10);
    }
  };

  const filtered = projects.filter(p => {
    const matchesFilter = activeFilter === 'all' || p.status === activeFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.project_name.toLowerCase().includes(q) ||
      p.project_code?.toLowerCase().includes(q) ||
      (p.client_name ?? '').toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const renderItem = ({ item }: { item: Project }) => {
    const startDateStr = item.start_date
      ? new Date(item.start_date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '-';
    const estFinish = item.estimated_finish
      ? new Date(item.estimated_finish).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '-';

    return (
      <ActionButton
        style={[styles.card, isMarketing && styles.cardMarketingBorder]}
        onPress={() =>
          navigation.navigate('ProjectDetail', {
            projectId: item.id,
            projectName: item.project_name,
          })
        }
        activeOpacity={0.8}
        accessibilityRole="button"
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleCol}>
            {!isClient && (
              <Text style={styles.cardCode}>{item.project_code}</Text>
            )}
            <Text style={styles.cardName} numberOfLines={2}>
              {item.project_name}
            </Text>
            <View style={styles.clientRow}>
              <Icon
                name="user"
                size={12}
                color={palette.textSecondary}
                style={styles.clientIcon}
              />
              <Text style={styles.cardClient}>
                {item.client_name ?? 'Tanpa klien'}
              </Text>
            </View>
          </View>
          <StatusBadge status={item.status as ProjectStatus} />
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.dateBlock}>
            <Icon
              name="calendar"
              size={12}
              color={palette.textSecondary}
              style={styles.dateIcon}
            />
            <View>
              <Text style={styles.dateLabel}>Mulai</Text>
              <Text style={styles.dateValue}>{startDateStr}</Text>
            </View>
          </View>
          <View style={styles.dateSep} />
          <View style={styles.dateBlock}>
            <Icon
              name="clock"
              size={12}
              color={palette.textSecondary}
              style={styles.dateIcon}
            />
            <View>
              <Text style={styles.dateLabel}>Est. Selesai</Text>
              <Text style={styles.dateValue}>{estFinish}</Text>
            </View>
          </View>
        </View>
      </ActionButton>
    );
  };

  const headerGradientColors: [string, string] = ['#002239', palette.brand];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={headerGradientColors}
        style={[
          styles.headerGradient,
          { paddingTop: insets.top > 0 ? insets.top + scale(8) : scale(16) },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>Daftar Proyek</Text>
          <View style={styles.headerRightActions}>
            {canViewSurveysRole(user?.role) && (
              <ActionButton
                compact
                style={styles.headerSurveyBtn}
                onPress={() => navigation.navigate('SurveyRequests')}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <Icon
                  name="calendar"
                  size={scale(12)}
                  color={palette.white}
                  style={{ marginRight: scale(spacing.xs) }}
                />
                <Text style={styles.headerSurveyBtnText}>Survey Marketing</Text>
              </ActionButton>
            )}
            {canCreateProjectRole(user?.role) && (
              <ActionButton
                compact
                style={styles.headerAddBtn}
                onPress={handleCreateProject}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <Text style={styles.headerAddBtnText}>+ Proyek Baru</Text>
              </ActionButton>
            )}
          </View>
        </View>
        <Text style={styles.headerSubtitle}>
          Pantau status, jadwal, dan perkembangan seluruh proyek GSI One.
        </Text>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.searchBox}>
          <Icon
            name="search"
            size={16}
            color={palette.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama, kode, atau klien..."
            placeholderTextColor={palette.grey}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            accessibilityLabel="Cari nama, kode, atau klien..."
          />
          {search.length > 0 && (
            <ActionButton
              onPress={() => setSearch('')}
              style={styles.clearSearchBtn}
              accessibilityRole="button"
              accessibilityLabel="Tutup"
            >
              <Icon name="x" size={14} color={palette.textSecondary} />
            </ActionButton>
          )}
        </View>

        <View style={styles.filterRow}>
          {FILTER_OPTIONS.map(opt => (
            <ActionButton
              compact
              key={opt.key}
              style={[
                styles.chip,
                activeFilter === opt.key &&
                  (isMarketing
                    ? styles.chipActiveMarketing
                    : styles.chipActive),
              ]}
              onPress={() => setActiveFilter(opt.key)}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.chipText,
                  activeFilter === opt.key && styles.chipTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </ActionButton>
          ))}
        </View>

        <ErrorNotice message={error} onRetry={fetchProjects} />
        {isLoading && projects.length === 0 ? (
          <ActivityIndicator color={palette.brand} style={styles.loader} />
        ) : (
          <FlatList
            data={filtered.slice(0, displayCount)}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={fetchProjects}
                colors={[palette.brand]}
              />
            }
            ListFooterComponent={
              displayCount < filtered.length ? (
                <ActivityIndicator
                  color={palette.brand}
                  style={{ marginVertical: scale(spacing.md) }}
                />
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Icon name="folder-off" size={40} color="#BDBDBD" />
                <Text style={styles.emptyTitle}>Tidak Ada Proyek</Text>
                <Text style={styles.emptyDesc}>
                  {search
                    ? 'Tidak ada proyek yang cocok dengan kata kunci pencarian.'
                    : 'Belum ada proyek yang terdaftar.'}
                </Text>
                {canCreateProjectRole(user?.role) && !search && (
                  <ActionButton
                    style={styles.emptyAddBtn}
                    onPress={handleCreateProject}
                    accessibilityRole="button"
                  >
                    <Text style={styles.emptyAddBtnText}>
                      + Tambah Proyek Pertama
                    </Text>
                  </ActionButton>
                )}
              </View>
            }
          />
        )}
      </View>

      {canCreateProjectRole(user?.role) && (
        <ActionButton
          style={styles.fab}
          onPress={handleCreateProject}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Text style={styles.fabIcon}>+</Text>
        </ActionButton>
      )}
    </View>
  );
}

export default ProjectListScreen;
