import { useUserRegistration } from '../../../hooks/useUserRegistration';
import { ROLE_LABELS, ROLE_ICONS } from '../../../constants/roles';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { useAuthStore } from '../../../store/authStore';

export function useProfile() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, logout } = useAuthStore();
  const isMarketing = user?.role === 'marketing';

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const {
    newUserName,
    setNewUserName,
    newUserEmail,
    setNewUserEmail,
    newUserPassword,
    setNewUserPassword,
    newUserRole,
    setNewUserRole,
    isSavingUser,
    handleCreateUser,
    reset,
  } = useUserRegistration(() => setShowRegisterModal(false));

  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const roleLabel = user?.role ? ROLE_LABELS[user.role] ?? user.role : '-';
  const roleIcon = user?.role ? ROLE_ICONS[user.role] ?? 'user' : 'user';

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar dari akun ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar (Logout)',
          style: 'destructive',
          onPress: () => {
            const cleanup = logout();
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
            cleanup.catch(() => {});
          },
        },
      ],
    );
  };

  const openRegisterModal = () => {
    reset();
    setShowRegisterModal(true);
  };

  return {
    user,
    navigation,
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
  };
}
