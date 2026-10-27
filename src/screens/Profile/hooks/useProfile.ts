import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { useAuthStore } from '../../../store/authStore';

export const ROLE_LABELS: Record<string, string> = {
    admin: 'Administrator',
    marketing: 'Marketing & Business Dev',
    engineer: 'Engineer Lapangan',
    client: 'Klien',
};

export const ROLE_ICONS: Record<string, string> = {
    admin: 'shield',
    marketing: 'briefcase',
    engineer: 'tool',
    client: 'user',
};

export function useProfile() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { user, logout, adminCreateUser } = useAuthStore();
    const isMarketing = user?.role === 'marketing';

    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState<'client' | 'marketing' | 'engineer'>('client');
    const [isSavingUser, setIsSavingUser] = useState(false);

    const initials = user?.full_name
        ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    const roleLabel = user?.role ? (ROLE_LABELS[user.role] ?? user.role) : '-';
    const roleIcon = user?.role ? (ROLE_ICONS[user.role] ?? 'user') : 'user';

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
                        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
                        logout().catch(() => {});
                    },
                },
            ]
        );
    };

    const openRegisterModal = () => {
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserRole('client');
        setIsSavingUser(false);
        setShowRegisterModal(true);
    };

    const handleCreateUser = async () => {
        if (!newUserName.trim()) {
            Alert.alert('Validasi', 'Nama lengkap wajib diisi');
            return;
        }
        if (!newUserEmail.trim()) {
            Alert.alert('Validasi', 'Email wajib diisi');
            return;
        }
        if (!newUserPassword.trim() || newUserPassword.length < 8) {
            Alert.alert('Validasi', 'Password wajib diisi minimal 8 karakter');
            return;
        }

        setIsSavingUser(true);
        try {
            const created = await adminCreateUser(newUserName.trim(), newUserEmail.trim(), newUserPassword, newUserRole);
            setShowRegisterModal(false);
            Alert.alert('Berhasil', `Akun ${newUserName} [${ROLE_LABELS[newUserRole]}] berhasil dibuat.${created?.ticket_number ? `\nNomor tiket: ${created.ticket_number}` : ''}`);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat mendaftarkan pengguna baru';
            Alert.alert('Gagal Membuat Pengguna', message);
        } finally {
            setIsSavingUser(false);
        }
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
