import { version as appVersion } from '../../../package.json';
import { ActionButton } from '../../components/ui/ActionButton';
import { styles } from './index.styles';
import { palette } from '../../theme/tokens';
import { JSX } from 'react';
import { View, Text, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from '../../utils/responsive';
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

  const headerGradientColors: [string, string] = ['#002239', palette.brand];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={headerGradientColors}
        style={[
          styles.headerGradient,
          { paddingTop: insets.top > 0 ? insets.top + scale(12) : scale(20) },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user?.full_name ?? 'Pengguna'}</Text>
        <View style={[styles.roleBadgePill, styles.roleBadgeMarketingPill]}>
          <Icon
            name={roleIcon}
            size={12}
            color={palette.white}
            style={styles.roleBadgeIcon}
          />
          <Text style={styles.roleBadgeText}>{roleLabel}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Informasi Akun</Text>
            <ActionButton
              compact
              style={styles.editProfileBtn}
              onPress={() => setShowEditProfileModal(true)}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Icon name="edit-3" size={14} color={palette.brand} />
              <Text style={styles.editProfileBtnText}>Edit Profil</Text>
            </ActionButton>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoLabelGroup}>
              <Icon
                name="mail"
                size={16}
                color={palette.textSecondary}
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>Email</Text>
            </View>
            <Text style={styles.infoValue}>{user?.email ?? '-'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.infoLabelGroup}>
              <Icon
                name="shield"
                size={16}
                color={palette.textSecondary}
                style={styles.infoIcon}
              />
              <Text style={styles.infoLabel}>Role Akun</Text>
            </View>
            <Text style={styles.infoValue}>{roleLabel}</Text>
          </View>
        </View>

        {canManageUsersRole(user?.role) && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Manajemen Sistem (Admin)</Text>
            <ActionButton
              style={styles.adminActionBtn}
              onPress={openRegisterModal}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <View style={styles.adminActionLeft}>
                <View style={styles.adminActionIconCircle}>
                  <Icon name="user-plus" size={16} color={palette.brand} />
                </View>
                <View style={styles.adminActionText}>
                  <Text style={styles.adminActionTitle}>
                    Tambah Pengguna Baru
                  </Text>
                  <Text style={styles.adminActionSub}>
                    Daftarkan akun Klien, Marketing, atau Engineer
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={18} color="#BDBDBD" />
            </ActionButton>
          </View>
        )}

        {isMarketing && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Informasi PIC Marketing</Text>
            <Text style={styles.cardSubText}>
              Sebagai Marketing GSI, Anda bertanggung jawab memantau prospek
              survey baru dan mengelola linimasa proyek klien.
            </Text>
          </View>
        )}

        <SupportCard />

        <View style={styles.appInfoBox}>
          <Text style={styles.appNameText}>GSI One Mobile • v{appVersion}</Text>
          <Text style={styles.appCopyText}>
            PT Graha Survei Indonesia © 2026
          </Text>
        </View>

        <ActionButton
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Icon
            name="log-out"
            size={18}
            color={palette.white}
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>Keluar Akun (Logout)</Text>
        </ActionButton>

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

export default ProfileScreen;
