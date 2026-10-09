import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { colors } from '../../../../assets/styles/Colors';
import { ROLE_LABELS } from '../hooks/useProfile';

interface AdminRegisterUserModalProps {
    visible: boolean;
    onClose: () => void;
    newUserName: string;
    setNewUserName: (val: string) => void;
    newUserEmail: string;
    setNewUserEmail: (val: string) => void;
    newUserPassword: string;
    setNewUserPassword: (val: string) => void;
    newUserRole: 'client' | 'marketing' | 'engineer';
    setNewUserRole: (val: 'client' | 'marketing' | 'engineer') => void;
    isSavingUser: boolean;
    onSubmit: () => void;
}

export const AdminRegisterUserModal: React.FC<AdminRegisterUserModalProps> = ({
    visible,
    onClose,
    newUserName,
    setNewUserName,
    newUserEmail,
    setNewUserEmail,
    newUserPassword,
    setNewUserPassword,
    newUserRole,
    setNewUserRole,
    isSavingUser,
    onSubmit,
}) => {
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoid}>
                    <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
                        <View style={styles.modalIndicator} />
                        <Text style={styles.modalTitle}>Tambah Pengguna Baru</Text>
                        <Text style={styles.modalSubtitle}>Buat akun pengguna baru untuk klien atau staf internal.</Text>

                        <Text style={styles.fieldLabel}>Nama Lengkap *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Contoh: Budi Santoso"
                            placeholderTextColor="#9E9E9E"
                            value={newUserName}
                            onChangeText={setNewUserName}
                        />

                        <Text style={styles.fieldLabel}>Email *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Contoh: budi@perusahaan.com"
                            placeholderTextColor="#9E9E9E"
                            value={newUserEmail}
                            onChangeText={setNewUserEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={styles.fieldLabel}>Password *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Minimal 6 karakter"
                            placeholderTextColor="#9E9E9E"
                            value={newUserPassword}
                            onChangeText={setNewUserPassword}
                            secureTextEntry
                        />

                        <Text style={styles.fieldLabel}>Peran (Role) *</Text>
                        <View style={styles.rolePickerRow}>
                            {(['client', 'marketing', 'engineer'] as const).map(r => (
                                <TouchableOpacity
                                    key={r}
                                    style={[styles.roleChip, newUserRole === r && styles.roleChipActive]}
                                    onPress={() => setNewUserRole(r)}>
                                    <Text style={[styles.roleChipText, newUserRole === r && styles.roleChipTextActive]}>
                                        {ROLE_LABELS[r]}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose}>
                                <Text style={styles.modalCancelText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalSaveBtn, isSavingUser && styles.modalSaveBtnDisabled]}
                                onPress={onSubmit}
                                disabled={isSavingUser}>
                                {isSavingUser ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={styles.modalSaveText}>Daftarkan</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </KeyboardAvoidingView>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.48)',
        justifyContent: 'flex-end',
    },
    keyboardAvoid: {
        width: '100%',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 44 : 24,
        maxHeight: '92%',
    },
    modalIndicator: {
        width: 36,
        height: 5,
        borderRadius: 3,
        backgroundColor: colors.border,
        alignSelf: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.textPrimary,
        marginTop: 10,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        color: colors.textPrimary,
        backgroundColor: colors.backgroundSecondary,
    },
    rolePickerRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 4,
        marginBottom: 12,
    },
    roleChip: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.backgroundSecondary,
    },
    roleChipActive: {
        backgroundColor: colors.secondary + '18',
        borderColor: colors.secondary,
    },
    roleChipText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    roleChipTextActive: {
        color: colors.secondary,
        fontWeight: '700',
    },
    modalBtnRow: {
        flexDirection: 'row',
        marginTop: 16,
        gap: 12,
    },
    modalCancelBtn: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },
    modalCancelText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '700',
    },
    modalSaveBtn: {
        flex: 1,
        backgroundColor: colors.secondary,
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },
    modalSaveBtnDisabled: {
        backgroundColor: colors.grey,
    },
    modalSaveText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
});
