import React, { JSX } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { scale, fontScale } from '../../utils/responsive';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSurveyRequests } from '../../hooks/useSurveyRequests';

function SurveyRequestsScreen(): JSX.Element {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();
    const {
        user,
        filteredRequests,
        search,
        setSearch,
        activeFilter,
        setActiveFilter,
        totalCount,
        pendingCount,
        claimedCount,
        isLoading,
        refreshRequests,
        handleClaim,
        handleDelete,
        handleCallPhone,
        handleOpenWhatsApp,
    } = useSurveyRequests();

    const isAdmin = user?.role === 'admin';

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#002239', '#0F9F67']}
                style={[
                    styles.headerGradient,
                    { paddingTop: insets.top > 0 ? insets.top + scale(8) : scale(16) }
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerTopRow}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Icon name="arrow-left" size={scale(20)} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Daftar Pengajuan Survey</Text>
                    <View style={styles.headerRightPlaceholder} />
                </View>
                <Text style={styles.headerSubtitle}>
                    Pantau dan ambil permohonan survey dari calon klien baru.
                </Text>
            </LinearGradient>

            <View style={styles.body}>
                <View style={styles.searchBox}>
                    <Icon name="search" size={16} color="#757575" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari nama, perusahaan, atau lokasi..."
                        placeholderTextColor="#9E9E9E"
                        value={search}
                        onChangeText={setSearch}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')} style={styles.clearSearchBtn}>
                            <Icon name="x" size={14} color="#757575" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={[styles.chip, activeFilter === 'all' && styles.chipActive]}
                        onPress={() => setActiveFilter('all')}
                    >
                        <Text style={[styles.chipText, activeFilter === 'all' && styles.chipTextActive]}>
                            Semua ({totalCount})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.chip, activeFilter === 'pending' && styles.chipActive]}
                        onPress={() => setActiveFilter('pending')}
                    >
                        <Text style={[styles.chipText, activeFilter === 'pending' && styles.chipTextActive]}>
                            Belum Dihubungi ({pendingCount})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.chip, activeFilter === 'claimed' && styles.chipActive]}
                        onPress={() => setActiveFilter('claimed')}
                    >
                        <Text style={[styles.chipText, activeFilter === 'claimed' && styles.chipTextActive]}>
                            Sudah Dihubungi ({claimedCount})
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={refreshRequests} colors={['#0F9F67']} />
                    }
                >
                    {filteredRequests.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Icon name="inbox" size={40} color="#BDBDBD" />
                            <Text style={styles.emptyTitle}>Tidak Ada Pengajuan Survey</Text>
                            <Text style={styles.emptySub}>
                                {search ? 'Tidak ditemukan hasil pengajuan yang cocok.' : 'Belum ada pengajuan survey pada kategori ini.'}
                            </Text>
                        </View>
                    ) : (
                        filteredRequests.map(item => {
                            const isClaimed = item.status === 'claimed';

                            return (
                                <View key={item.id} style={styles.card}>
                                    {}
                                    <View style={styles.cardHeaderRow}>
                                        <View style={styles.clientInfoCol}>
                                            <Text style={styles.clientName}>{item.clientName}</Text>
                                            <Text style={styles.companyName}>{item.companyName}</Text>
                                        </View>

                                        <View style={styles.headerRightCol}>
                                            {isClaimed ? (
                                                <View style={styles.claimedBadgePill}>
                                                    <Icon name="check-circle" size={12} color="#0F9F67" style={styles.badgeIcon} />
                                                    <Text style={styles.claimedBadgeText}>Sudah Dihubungi</Text>
                                                </View>
                                            ) : (
                                                <View style={styles.pendingBadgePill}>
                                                    <Icon name="clock" size={12} color="#E65100" style={styles.badgeIcon} />
                                                    <Text style={styles.pendingBadgeText}>Belum Dihubungi</Text>
                                                </View>
                                            )}

                                            {isAdmin && (
                                                <TouchableOpacity
                                                    style={styles.deleteBtn}
                                                    onPress={() => handleDelete(item)}
                                                    activeOpacity={0.7}
                                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                                >
                                                    <Icon name="trash-2" size={15} color="#E53935" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>

                                    <View style={styles.divider} />

                                    {}
                                    <View style={styles.detailRow}>
                                        <Icon name="layers" size={14} color="#757575" />
                                        <Text style={styles.detailText}>{item.structureType}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Icon name="map-pin" size={14} color="#757575" />
                                        <Text style={styles.detailText}>{item.location}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Icon name="calendar" size={14} color="#757575" />
                                        <Text style={styles.detailText}>Diajukan: {item.submittedDate}</Text>
                                    </View>

                                    {item.notes ? (
                                        <View style={styles.notesBox}>
                                            <Text style={styles.notesLabel}>Catatan Klien:</Text>
                                            <Text style={styles.notesText}>{item.notes}</Text>
                                        </View>
                                    ) : null}

                                    {}
                                    {isClaimed ? (
                                        <View style={styles.claimedFooter}>
                                            <View style={styles.claimedByRow}>
                                                <Icon name="user-check" size={14} color="#0F9F67" />
                                                <Text style={styles.claimedByText}>
                                                    Sudah dihubungi oleh: {item.claimedBy || 'Staf Marketing GSI'} ({item.claimedAt || 'Selesai'})
                                                </Text>
                                            </View>

                                            <View style={styles.contactBtnRow}>
                                                <TouchableOpacity
                                                    style={styles.contactBtnCall}
                                                    onPress={() => handleCallPhone(item.phone)}
                                                >
                                                    <Icon name="phone" size={14} color="#00796B" />
                                                    <Text style={styles.contactBtnCallText}>Telepon</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.contactBtnWA}
                                                    onPress={() => handleOpenWhatsApp(item)}
                                                >
                                                    <Icon name="message-circle" size={14} color="#0F9F67" />
                                                    <Text style={styles.contactBtnWAText}>WhatsApp</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.contactBtnProject}
                                                    onPress={() => navigation.navigate('CreateProject', {
                                                        initialProjectName: `${item.structureType} - ${item.companyName}`,
                                                        initialClientName: item.clientName,
                                                        initialServiceType: item.structureType,
                                                        surveyBookingId: item.rawDbId,
                                                    })}
                                                >
                                                    <Icon name="plus-circle" size={14} color="#004D40" />
                                                    <Text style={styles.contactBtnProjectText}>Buat Proyek</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ) : (
                                        <View style={styles.actionFooter}>
                                            <TouchableOpacity
                                                style={styles.claimActionBtn}
                                                activeOpacity={0.85}
                                                onPress={() => handleClaim(item)}
                                            >
                                                <Icon name="user-plus" size={16} color="#FFF" />
                                                <Text style={styles.claimActionBtnText}>Ambil & Hubungi Klien</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            );
                        })
                    )}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F8F7',
    },
    headerGradient: {
        paddingHorizontal: scale(16),
        paddingBottom: scale(20),
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: scale(8),
    },
    backBtn: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: fontScale(18),
        fontWeight: '800',
        color: '#FFF',
    },
    headerRightPlaceholder: {
        width: scale(36),
    },
    headerSubtitle: {
        fontSize: fontScale(12),
        color: 'rgba(255, 255, 255, 0.85)',
        textAlign: 'center',
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
    searchIcon: {
        marginRight: scale(8),
    },
    searchInput: {
        flex: 1,
        fontSize: fontScale(13),
        color: '#212121',
        paddingVertical: scale(10),
    },
    clearSearchBtn: {
        padding: scale(4),
    },
    filterRow: {
        flexDirection: 'row',
        marginBottom: scale(12),
        gap: scale(6),
    },
    chip: {
        paddingHorizontal: scale(10),
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
    chipText: {
        fontSize: fontScale(11),
        fontWeight: '600',
        color: '#616161',
    },
    chipTextActive: {
        color: '#FFF',
        fontWeight: '700',
    },
    scrollContent: {
        paddingBottom: scale(24),
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: scale(40),
    },
    emptyTitle: {
        fontSize: fontScale(14),
        fontWeight: '700',
        color: '#424242',
        marginTop: scale(10),
    },
    emptySub: {
        fontSize: fontScale(12),
        color: '#757575',
        textAlign: 'center',
        marginTop: scale(4),
        paddingHorizontal: scale(20),
    },
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
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    clientInfoCol: {
        flex: 1,
        marginRight: scale(8),
    },
    clientName: {
        fontSize: fontScale(15),
        fontWeight: '700',
        color: '#212121',
    },
    companyName: {
        fontSize: fontScale(12),
        color: '#757575',
        fontWeight: '500',
        marginTop: scale(2),
    },
    pendingBadgePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF3E0',
        paddingHorizontal: scale(8),
        paddingVertical: scale(4),
        borderRadius: scale(12),
    },
    pendingBadgeText: {
        fontSize: fontScale(10),
        fontWeight: '700',
        color: '#E65100',
    },
    claimedBadgePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: scale(8),
        paddingVertical: scale(4),
        borderRadius: scale(12),
    },
    claimedBadgeText: {
        fontSize: fontScale(10),
        fontWeight: '700',
        color: '#0F9F67',
    },
    badgeIcon: {
        marginRight: scale(4),
    },
    divider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: scale(10),
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(6),
    },
    detailText: {
        fontSize: fontScale(12),
        color: '#424242',
        marginLeft: scale(8),
    },
    notesBox: {
        backgroundColor: '#F9F9F9',
        borderRadius: scale(8),
        padding: scale(10),
        marginTop: scale(6),
        borderLeftWidth: 3,
        borderLeftColor: '#0F9F67',
    },
    notesLabel: {
        fontSize: fontScale(10),
        fontWeight: '700',
        color: '#616161',
        marginBottom: scale(2),
    },
    notesText: {
        fontSize: fontScale(11),
        color: '#424242',
        lineHeight: scale(16),
    },
    claimedFooter: {
        marginTop: scale(12),
        paddingTop: scale(10),
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    claimedByRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(8),
    },
    claimedByText: {
        fontSize: fontScale(11),
        fontWeight: '600',
        color: '#0F9F67',
        marginLeft: scale(6),
    },
    contactBtnRow: {
        flexDirection: 'row',
        gap: scale(8),
    },
    contactBtnCall: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E0F2F1',
        paddingVertical: scale(8),
        borderRadius: scale(8),
    },
    contactBtnCallText: {
        fontSize: fontScale(11),
        fontWeight: '700',
        color: '#00796B',
        marginLeft: scale(6),
    },
    contactBtnWA: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E8F5E9',
        paddingVertical: scale(8),
        borderRadius: scale(8),
    },
    contactBtnWAText: {
        fontSize: fontScale(11),
        fontWeight: '700',
        color: '#0F9F67',
        marginLeft: scale(6),
    },
    contactBtnProject: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E0F2F1',
        paddingVertical: scale(8),
        borderRadius: scale(8),
    },
    contactBtnProjectText: {
        fontSize: fontScale(11),
        fontWeight: '700',
        color: '#004D40',
        marginLeft: scale(4),
    },
    actionFooter: {
        marginTop: scale(12),
        paddingTop: scale(10),
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    claimActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0F9F67',
        paddingVertical: scale(10),
        borderRadius: scale(8),
    },
    claimActionBtnText: {
        fontSize: fontScale(12),
        fontWeight: '700',
        color: '#FFF',
        marginLeft: scale(8),
    },
    headerRightCol: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    deleteBtn: {
        width: scale(30),
        height: scale(30),
        borderRadius: scale(15),
        backgroundColor: '#FFEBEE',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SurveyRequestsScreen;
