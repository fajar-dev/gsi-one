import React, { useCallback, useState, useEffect, JSX } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, TextInput,
    StyleSheet, RefreshControl, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../../assets/styles/Colors';
import { useProjectStore } from '../../store/projectStore';
import { canCreateProjectRole, canViewSurveysRole } from '../../domain/enums/UserRole';
import { Project, ProjectStatus } from '../../services/projectService';
import StatusBadge from './components/StatusBadge';
import { useAuthStore } from '../../store/authStore';
import { scale, fontScale } from '../../utils/responsive';

type FilterStatus = 'all' | 'pending' | 'on_progress' | 'done' | 'on_hold';

const FILTER_OPTIONS: { key: FilterStatus; label: string }[] = [
    { key: 'all', label: 'Semua' },
    { key: 'on_progress', label: 'Berjalan' },
    { key: 'pending', label: 'Menunggu' },
    { key: 'done', label: 'Selesai' },
    { key: 'on_hold', label: 'Ditunda' },
];

function ProjectListScreen(): JSX.Element {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();
    const { user } = useAuthStore();
    const isMarketing = user?.role === 'marketing';
    const isClient = user?.role === 'client';
    const { projects, isLoading, fetchProjects } = useProjectStore();
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
    const [displayCount, setDisplayCount] = useState(10);

    useFocusEffect(
        useCallback(() => {
            fetchProjects();
        }, [fetchProjects])
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
        const matchesSearch = !q
            || p.project_name.toLowerCase().includes(q)
            || p.project_code?.toLowerCase().includes(q)
            || (p.client_name ?? '').toLowerCase().includes(q);
        return matchesFilter && matchesSearch;
    });

    const renderItem = ({ item }: { item: Project }) => {
        const startDateStr = item.start_date
            ? new Date(item.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            : '-';
        const estFinish = item.estimated_finish
            ? new Date(item.estimated_finish).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            : '-';

        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    isMarketing && styles.cardMarketingBorder
                ]}
                onPress={() => navigation.navigate('ProjectDetail', {
                    projectId: item.id,
                    projectName: item.project_name,
                })}
                activeOpacity={0.8}>
                <View style={styles.cardHeader}>
                    <View style={styles.cardTitleCol}>
                        {!isClient && <Text style={styles.cardCode}>{item.project_code}</Text>}
                        <Text style={styles.cardName} numberOfLines={2}>{item.project_name}</Text>
                        <View style={styles.clientRow}>
                            <Icon name="user" size={12} color="#757575" style={styles.clientIcon} />
                            <Text style={styles.cardClient}>{item.client_name ?? 'Tanpa klien'}</Text>
                        </View>
                    </View>
                    <StatusBadge status={item.status as ProjectStatus} />
                </View>

                <View style={styles.cardFooter}>
                    <View style={styles.dateBlock}>
                        <Icon name="calendar" size={12} color="#757575" style={styles.dateIcon} />
                        <View>
                            <Text style={styles.dateLabel}>Mulai</Text>
                            <Text style={styles.dateValue}>{startDateStr}</Text>
                        </View>
                    </View>
                    <View style={styles.dateSep} />
                    <View style={styles.dateBlock}>
                        <Icon name="clock" size={12} color="#757575" style={styles.dateIcon} />
                        <View>
                            <Text style={styles.dateLabel}>Est. Selesai</Text>
                            <Text style={styles.dateValue}>{estFinish}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const headerGradientColors: [string, string] = ['#002239', '#0F9F67'];

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={headerGradientColors}
                style={[
                    styles.headerGradient,
                    { paddingTop: insets.top > 0 ? insets.top + scale(8) : scale(16) }
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerTopRow}>
                    <Text style={styles.headerTitle}>Daftar Proyek</Text>
                    <View style={styles.headerRightActions}>
                        {canViewSurveysRole(user?.role) && (
                            <TouchableOpacity
                                style={styles.headerSurveyBtn}
                                onPress={() => navigation.navigate('SurveyRequests')}
                                activeOpacity={0.8}
                            >
                                <Icon name="calendar" size={scale(12)} color="#FFF" style={{ marginRight: scale(4) }} />
                                <Text style={styles.headerSurveyBtnText}>Survey Marketing</Text>
                            </TouchableOpacity>
                        )}
                        {canCreateProjectRole(user?.role) && (
                            <TouchableOpacity style={styles.headerAddBtn} onPress={handleCreateProject} activeOpacity={0.8}>
                                <Text style={styles.headerAddBtnText}>+ Proyek Baru</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <Text style={styles.headerSubtitle}>
                    Pantau status, jadwal, dan perkembangan seluruh proyek GSI One.
                </Text>
            </LinearGradient>

            <View style={styles.body}>
                <View style={styles.searchBox}>
                    <Icon name="search" size={16} color="#757575" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari nama, kode, atau klien..."
                        placeholderTextColor="#9E9E9E"
                        value={search}
                        onChangeText={setSearch}
                        autoCorrect={false}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')} style={styles.clearSearchBtn}>
                            <Icon name="x" size={14} color="#757575" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.filterRow}>
                    {FILTER_OPTIONS.map(opt => (
                        <TouchableOpacity
                            key={opt.key}
                            style={[
                                styles.chip,
                                activeFilter === opt.key && (isMarketing ? styles.chipActiveMarketing : styles.chipActive)
                            ]}
                            onPress={() => setActiveFilter(opt.key)}>
                            <Text style={[
                                styles.chipText,
                                activeFilter === opt.key && styles.chipTextActive
                            ]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {isLoading && projects.length === 0 ? (
                    <ActivityIndicator color="#0F9F67" style={styles.loader} />
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
                            <RefreshControl refreshing={isLoading} onRefresh={fetchProjects} colors={['#0F9F67']} />
                        }
                        ListFooterComponent={
                            displayCount < filtered.length ? (
                                <ActivityIndicator color="#0F9F67" style={{ marginVertical: scale(12) }} />
                            ) : null
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Icon name="folder-off" size={40} color="#BDBDBD" />
                                <Text style={styles.emptyTitle}>Tidak Ada Proyek</Text>
                                <Text style={styles.emptyDesc}>
                                    {search ? 'Tidak ada proyek yang cocok dengan kata kunci pencarian.' : 'Belum ada proyek yang terdaftar.'}
                                </Text>
                                {canCreateProjectRole(user?.role) && !search && (
                                    <TouchableOpacity style={styles.emptyAddBtn} onPress={handleCreateProject}>
                                        <Text style={styles.emptyAddBtnText}>+ Tambah Proyek Pertama</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        }
                    />
                )}
            </View>

            {canCreateProjectRole(user?.role) && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={handleCreateProject}
                    activeOpacity={0.85}>
                    <Text style={styles.fabIcon}>+</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F8F7' },
    headerGradient: {
        paddingHorizontal: scale(16),
        paddingBottom: scale(20),
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: scale(6),
    },
    headerTitle: {
        fontSize: fontScale(18),
        fontWeight: '800',
        color: '#FFF',
    },
    headerSubtitle: {
        fontSize: fontScale(12),
        color: 'rgba(255, 255, 255, 0.85)',
    },
    headerRightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
    },
    headerSurveyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 159, 103, 0.35)',
        paddingHorizontal: scale(10),
        paddingVertical: scale(6),
        borderRadius: scale(16),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    headerSurveyBtnText: {
        color: '#FFF',
        fontSize: fontScale(11),
        fontWeight: '700',
    },
    headerAddBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: scale(12),
        paddingVertical: scale(6),
        borderRadius: scale(16),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    headerAddBtnText: {
        color: '#FFF',
        fontSize: fontScale(11),
        fontWeight: '700',
    },
    body: {
        flex: 1,
        paddingHorizontal: scale(16),
        paddingTop: scale(12),
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: scale(10),
        paddingHorizontal: scale(12),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        marginBottom: scale(12),
    },
    searchIcon: { marginRight: scale(8) },
    searchInput: {
        flex: 1,
        fontSize: fontScale(13),
        color: '#212121',
        paddingVertical: scale(10),
    },
    clearSearchBtn: { padding: scale(4) },
    filterRow: {
        flexDirection: 'row',
        marginBottom: scale(12),
        gap: scale(6),
    },
    chip: {
        paddingHorizontal: scale(12),
        paddingVertical: scale(6),
        borderRadius: scale(16),
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    chipActive: {
        backgroundColor: '#0F9F67',
        borderColor: '#0F9F67',
    },
    chipActiveMarketing: {
        backgroundColor: '#0F9F67',
        borderColor: '#0F9F67',
    },
    chipText: {
        fontSize: fontScale(11),
        fontWeight: '600',
        color: '#616161',
    },
    chipTextActive: {
        color: '#FFF',
        fontWeight: '700',
    },
    loader: { marginTop: scale(40) },
    listContent: { paddingBottom: scale(100) },
    card: {
        backgroundColor: '#FFF',
        borderRadius: scale(12),
        padding: scale(14),
        marginBottom: scale(12),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        borderLeftWidth: 4,
        borderLeftColor: '#0F9F67',
    },
    cardMarketingBorder: {
        borderLeftColor: '#0F9F67',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: scale(10),
    },
    cardTitleCol: { flex: 1, marginRight: scale(10) },
    cardCode: {
        fontSize: fontScale(10),
        color: '#757575',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: scale(2),
    },
    cardName: {
        fontSize: fontScale(14),
        fontWeight: '700',
        color: '#212121',
        lineHeight: scale(19),
        marginBottom: scale(4),
    },
    clientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: scale(2),
    },
    clientIcon: { marginRight: scale(4) },
    cardClient: { fontSize: fontScale(12), color: '#616161' },
    cardFooter: {
        flexDirection: 'row',
        paddingTop: scale(10),
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    dateBlock: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateIcon: { marginRight: scale(6) },
    dateSep: {
        width: 1,
        backgroundColor: '#EEEEEE',
        marginHorizontal: scale(10),
    },
    dateLabel: {
        fontSize: fontScale(9),
        color: '#757575',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    dateValue: { fontSize: fontScale(12), fontWeight: '600', color: '#212121' },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: scale(40) },
    emptyTitle: { fontSize: fontScale(14), fontWeight: '700', color: '#424242', marginTop: scale(10) },
    emptyDesc: {
        fontSize: fontScale(12),
        color: '#757575',
        textAlign: 'center',
        marginTop: scale(4),
        paddingHorizontal: scale(20),
    },
    emptyAddBtn: {
        backgroundColor: '#0F9F67',
        paddingHorizontal: scale(16),
        paddingVertical: scale(10),
        borderRadius: scale(8),
        marginTop: scale(16),
    },
    emptyAddBtnText: { color: '#FFF', fontWeight: '700', fontSize: fontScale(12) },
    fab: {
        position: 'absolute',
        bottom: scale(24),
        right: scale(20),
        width: scale(52),
        height: scale(52),
        borderRadius: scale(26),
        backgroundColor: colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
    },
    fabIcon: { color: '#FFF', fontSize: fontScale(24), fontWeight: '300' },
});

export default ProjectListScreen;
