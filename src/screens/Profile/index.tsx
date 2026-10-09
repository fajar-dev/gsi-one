import React, { JSX } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../assets/styles/Colors';
import { scale, fontScale } from '../../utils/responsive';
import { useProfile } from './hooks/useProfile';
import { AdminRegisterUserModal } from './components/AdminRegisterUserModal';
import { EditProfileModal } from './components/EditProfileModal';
import { SupportCard } from '../../components/common/SupportCard';
import { canManageUsersRole } from '../../domain/enums/UserRole';

function ProfileScreen(): JSX.Element {
    const insets = useSafeAreaInsets();
    const {
        user,
        isMarketing,
        initials,
        roleLabel,
        roleIcon,
        showRegisterModal,
        setShowRegisterModal,
        showEditProfileModal,
        setShowEditProfileModal,
        newUserName,
        setNewUserName,
        newUserEmail,
        setNewUserEmail,
        newUserPassword,
        setNewUserPassword,
        newUserRole,
        setNewUserRole,
        isSavingUser,
        handleLogout,
        openRegisterModal,
        handleCreateUser,
    } = useProfile();

    const headerGradientColors: [string, string] = ['#002239', '#0F9F67'];

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={headerGradientColors}
                style={[
                    styles.headerGradient,
                    { paddingTop: insets.top > 0 ? insets.top + scale(12) : scale(20) }
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <Text style={styles.name}>{user?.full_name ?? 'Pengguna'}</Text>
                <View style={[styles.roleBadgePill, styles.roleBadgeMarketingPill]}>
                    <Icon name={roleIcon} size={12} color="#FFF" style={styles.roleBadgeIcon} />
                    <Text style={styles.roleBadgeText}>{roleLabel}</Text>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <View style={styles.cardHeaderRow}>
                        <Text style={styles.cardTitle}>Informasi Akun</Text>
                        <TouchableOpacity
                            style={styles.editProfileBtn}
                            onPress={() => setShowEditProfileModal(true)}
                            activeOpacity={0.7}
                        >
                            <Icon name="edit-3" size={14} color="#0F9F67" />
                            <Text style={styles.editProfileBtnText}>Edit Profil</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoLabelGroup}>
                            <Icon name="mail" size={16} color="#757575" style={styles.infoIcon} />
                            <Text style={styles.infoLabel}>Email</Text>
                        </View>
                        <Text style={styles.infoValue}>{user?.email ?? '-'}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <View style={styles.infoLabelGroup}>
                            <Icon name="shield" size={16} color="#757575" style={styles.infoIcon} />
                            <Text style={styles.infoLabel}>Role Akun</Text>
                        </View>
                        <Text style={styles.infoValue}>{roleLabel}</Text>
                    </View>
                </View>

                {canManageUsersRole(user?.role) && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Manajemen Sistem (Admin)</Text>
                        <TouchableOpacity style={styles.adminActionBtn} onPress={openRegisterModal} activeOpacity={0.8}>
                            <View style={styles.adminActionLeft}>
                                <View style={styles.adminActionIconCircle}>
                                    <Icon name="user-plus" size={16} color="#0F9F67" />
                                </View>
                                <View>
                                    <Text style={styles.adminActionTitle}>Tambah Pengguna Baru</Text>
                                    <Text style={styles.adminActionSub}>Daftarkan akun Klien, Marketing, atau Engineer</Text>
                                </View>
                            </View>
                            <Icon name="chevron-right" size={18} color="#BDBDBD" />
                        </TouchableOpacity>
                    </View>
                )}

                {isMarketing && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Informasi PIC Marketing</Text>
                        <Text style={styles.cardSubText}>
                            Sebagai Marketing GSI, Anda bertanggung jawab memantau prospek survey baru dan mengelola linimasa proyek klien.
                        </Text>
                    </View>
                )}

                <SupportCard />

                <View style={styles.appInfoBox}>
                    <Text style={styles.appNameText}>GSI One Mobile • v1.0.0</Text>
                    <Text style={styles.appCopyText}>PT Graha Survei Indonesia © 2026</Text>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
                    <Icon name="log-out" size={18} color="#FFF" style={styles.logoutIcon} />
                    <Text style={styles.logoutText}>Keluar Akun (Logout)</Text>
                </TouchableOpacity>

                <View style={{ height: scale(40) }} />
            </ScrollView>

            <EditProfileModal
                visible={showEditProfileModal}
                onClose={() => setShowEditProfileModal(false)}
            />

            <AdminRegisterUserModal
                visible={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                newUserName={newUserName}
                setNewUserName={setNewUserName}
                newUserEmail={newUserEmail}
                setNewUserEmail={setNewUserEmail}
                newUserPassword={newUserPassword}
                setNewUserPassword={setNewUserPassword}
                newUserRole={newUserRole}
                setNewUserRole={setNewUserRole}
                isSavingUser={isSavingUser}
                onSubmit={handleCreateUser}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F8F7',
    },
    headerGradient: {
        alignItems: 'center',
        paddingBottom: scale(28),
        borderBottomLeftRadius: scale(24),
        borderBottomRightRadius: scale(24),
    },
    avatarCircle: {
        width: scale(68),
        height: scale(68),
        borderRadius: scale(34),
        backgroundColor: '#0F9F67',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
        marginBottom: scale(10),
    },
    avatarText: {
        fontSize: fontScale(22),
        fontWeight: 'bold',
        color: '#FFF',
    },
    name: {
        fontSize: fontScale(18),
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: scale(6),
    },
    roleBadgePill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(4),
        paddingHorizontal: scale(12),
        borderRadius: scale(12),
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    roleBadgeMarketingPill: {
        backgroundColor: 'rgba(15, 159, 103, 0.4)',
    },
    roleBadgeIcon: {
        marginRight: scale(6),
    },
    roleBadgeText: {
        fontSize: fontScale(11),
        fontWeight: '700',
        color: '#FFF',
    },
    scrollContent: {
        padding: scale(16),
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: scale(16),
        padding: scale(16),
        marginBottom: scale(14),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(12),
    },
    cardTitle: {
        fontSize: fontScale(14),
        fontWeight: 'bold',
        color: '#002239',
    },
    editProfileBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: scale(10),
        paddingVertical: scale(4),
        borderRadius: scale(8),
    },
    editProfileBtnText: {
        fontSize: fontScale(11),
        fontWeight: '700',
        color: '#0F9F67',
        marginLeft: scale(4),
    },
    cardSubText: {
        fontSize: fontScale(12),
        color: colors.textSecondary,
        lineHeight: scale(18),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: scale(8),
    },
    infoLabelGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        marginRight: scale(8),
    },
    infoLabel: {
        fontSize: fontScale(13),
        color: '#616161',
    },
    infoValue: {
        fontSize: fontScale(13),
        fontWeight: '600',
        color: '#212121',
    },
    divider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: scale(4),
    },
    adminActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F0F9F5',
        padding: scale(12),
        borderRadius: scale(12),
        borderWidth: 1,
        borderColor: '#C2E8D8',
    },
    adminActionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
    },
    adminActionIconCircle: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    adminActionTitle: {
        fontSize: fontScale(13),
        fontWeight: 'bold',
        color: '#002239',
    },
    adminActionSub: {
        fontSize: fontScale(11),
        color: '#616161',
    },
    appInfoBox: {
        alignItems: 'center',
        marginVertical: scale(10),
    },
    appNameText: {
        fontSize: fontScale(12),
        fontWeight: '600',
        color: '#757575',
    },
    appCopyText: {
        fontSize: fontScale(11),
        color: '#9E9E9E',
        marginTop: scale(2),
    },
    logoutBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D32F2F',
        borderRadius: scale(12),
        paddingVertical: scale(14),
        marginTop: scale(8),
    },
    logoutIcon: {
        marginRight: scale(8),
    },
    logoutText: {
        fontSize: fontScale(14),
        fontWeight: 'bold',
        color: '#FFF',
    },
});

export default ProfileScreen;
