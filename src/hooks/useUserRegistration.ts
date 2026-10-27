import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { CreateUserRole } from '../domain/models/auth';
import { ROLE_LABELS } from '../constants/roles';
import { getErrorMessage } from '../utils/errorHelpers';
import { validateNewUser } from '../domain/validation/user';

/** One registration workflow shared by Dashboard and Profile. */
export function useUserRegistration(onSuccess: () => void) {
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<CreateUserRole>('client');
  const [isSavingUser, setIsSavingUser] = useState(false);
  const adminCreateUser = useAuthStore(state => state.adminCreateUser);
  const reset = useCallback(() => {
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserRole('client');
    setIsSavingUser(false);
  }, []);
  const handleCreateUser = async () => {
    if (isSavingUser) return;
    const validation = validateNewUser(
      newUserName,
      newUserEmail,
      newUserPassword,
    );
    if (validation) {
      Alert.alert('Validasi', validation);
      return;
    }
    setIsSavingUser(true);
    try {
      const created = await adminCreateUser(
        newUserName.trim(),
        newUserEmail.trim(),
        newUserPassword,
        newUserRole,
      );
      setNewUserPassword('');
      onSuccess();
      Alert.alert(
        'Berhasil Registrasi',
        `Akun ${newUserName.trim()} [${
          ROLE_LABELS[newUserRole]
        }] berhasil dibuat.${
          created.ticket_number ? `\nNomor tiket: ${created.ticket_number}` : ''
        }`,
      );
    } catch (error: unknown) {
      Alert.alert('Gagal Membuat Pengguna', getErrorMessage(error));
    } finally {
      setIsSavingUser(false);
    }
  };
  return {
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
  };
}
