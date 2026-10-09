import React, { useState, useEffect } from 'react';
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
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../../../assets/styles/Colors';
import { useAuthStore } from '../../../store/authStore';
import { getErrorMessage } from '../../../utils/errorHelpers';
import { surveyService } from '../../../services/surveyService';
import { projectService } from '../../../services/projectService';
import { SurveyRequestData } from '../../../domain/entities/SurveyRequestEntity';

interface AdminRegisterModalProps {
    visible: boolean;
    onClose: () => void;
}


const AdminRegisterModal: React.FC<AdminRegisterModalProps> = ({ visible, onClose }) => {
    const { adminCreateUser } = useAuthStore();
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState<'client' | 'marketing' | 'engineer' | 'admin'>('client');
    const [isSavingUser, setIsSavingUser] = useState(false);

    const [surveyBookings, setSurveyBookings] = useState<SurveyRequestData[]>([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(false);
    const [showBookingPicker, setShowBookingPicker] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<SurveyRequestData | null>(null);

    useEffect(() => {
        if (visible) {
            setNewUserName('');
            setNewUserEmail('');
            setNewUserPassword('');
            setNewUserRole('client');
            setSelectedBooking(null);
            setIsSavingUser(false);

            const loadUnregisteredBookings = async () => {
                setIsLoadingBookings(true);
                try {
                    const [bookings, existingClients] = await Promise.all([
                        surveyService.getBookings(),
                        projectService.getUsersByRole('client'),
                    ]);
                    const existingEmails = new Set(existingClients.map(c => c.email.toLowerCase()));
                    const unregistered = bookings.filter(
                        b => b.email && b.email !== '-' && !existingEmails.has(b.email.toLowerCase())
                    );
                    setSurveyBookings(unregistered.length > 0 ? unregistered : bookings);
                } catch {
                    setSurveyBookings([]);
                } finally {
                    setIsLoadingBookings(false);
                }
            };

            loadUnregisteredBookings();
        }
    }, [visible]);

    const handleSelectBooking = (booking: SurveyRequestData) => {
        setSelectedBooking(booking);
        setNewUserName(booking.clientName);
        setNewUserEmail(booking.email !== '-' ? booking.email : '');
        setNewUserRole('client');
        setShowBookingPicker(false);
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
            const createdUser = await adminCreateUser(newUserName.trim(), newUserEmail.trim(), newUserPassword, newUserRole);
            onClose();

            let successMessage = `Akun ${newUserName} [${
                newUserRole === 'client' ? 'Klien' : newUserRole === 'marketing' ? 'Marketing' : 'Engineer'
            }] berhasil dibuat.`;

            if (newUserRole === 'client' && createdUser?.ticket_number) {
                successMessage += `\n\nNomor Tiket Login Klien: ${createdUser.ticket_number}\n\nSilakan catat dan berikan nomor tiket ini kepada Klien untuk masuk ke aplikasi.`;
            }

            Alert.alert('Berhasil Registrasi', successMessage);
        } catch (err: unknown) {
            Alert.alert(
                'Gagal Membuat Pengguna',
                getErrorMessage(err, 'Terjadi kesalahan saat mendaftarkan pengguna baru')
            );
        } finally {
            setIsSavingUser(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={() => !isSavingUser && onClose()}>
            <TouchableOpacity
                style={styles.modalBackdrop}
                activeOpacity={1}
                onPress={() => !isSavingUser && onClose()}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.kvAvoid}>
                    <Pressable
                        style={styles.modalSheet}
                        onPress={e => e.stopPropagation()}>

                        <View style={styles.handleBar} />

                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>Daftar Akun Baru</Text>
                                <Text style={styles.modalSubtitle}>Buat akun GSI One baru untuk Klien/Staff</Text>
                            </View>
                            <TouchableOpacity
                                onPress={onClose}
                                style={styles.closeBtn}
                                disabled={isSavingUser}>
                                <Text style={styles.closeBtnText}>Batal</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalDivider} />

                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                            <Text style={styles.fieldLabel}>
                                Impor dari Booking Survey (Opsional)
                            </Text>
                            <TouchableOpacity
                                style={styles.pickerTrigger}
                                onPress={() => setShowBookingPicker(true)}
                                disabled={isSavingUser || isLoadingBookings}>
                                <Text style={[styles.pickerTriggerText, !selectedBooking && styles.pickerTriggerPlaceholder]} numberOfLines={1}>
                                    {selectedBooking
                                        ? `${selectedBooking.clientName} (${selectedBooking.companyName})`
                                        : isLoadingBookings
                                            ? 'Memuat data survey...'
                                            : surveyBookings.length > 0
                                                ? `-- Pilih dari ${surveyBookings.length} Booking Survey --`
                                                : 'Tidak ada booking survey baru'}
                                </Text>
                                <Icon name="chevron-down" size={16} color={colors.grey} />
                            </TouchableOpacity>

                            <Text style={styles.fieldLabel}>
                                Nama Lengkap <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nama Lengkap"
                                placeholderTextColor={colors.grey}
                                value={newUserName}
                                onChangeText={setNewUserName}
                                editable={!isSavingUser}
                            />

                            <Text style={styles.fieldLabel}>
                                Email <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Alamat email aktif"
                                placeholderTextColor={colors.grey}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={newUserEmail}
                                onChangeText={setNewUserEmail}
                                editable={!isSavingUser}
                            />

                            <Text style={styles.fieldLabel}>
                                Password <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Minimal 8 karakter"
                                placeholderTextColor={colors.grey}
                                secureTextEntry
                                autoCapitalize="none"
                                value={newUserPassword}
                                onChangeText={setNewUserPassword}
                                editable={!isSavingUser}
                            />

                            <Text style={styles.fieldLabel}>
                                Role Pengguna <Text style={styles.required}>*</Text>
                            </Text>
                            <View style={styles.roleChipsRow}>
                                <TouchableOpacity
                                    style={[styles.roleChip, newUserRole === 'client' && styles.roleChipClientActive]}
                                    onPress={() => setNewUserRole('client')}
                                    disabled={isSavingUser}>
                                    <Text style={[styles.roleChipText, newUserRole === 'client' && styles.roleChipTextActive]}>
                                        Klien
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.roleChip, newUserRole === 'marketing' && styles.roleChipMarketingActive]}
                                    onPress={() => setNewUserRole('marketing')}
                                    disabled={isSavingUser}>
                                    <Text style={[styles.roleChipText, newUserRole === 'marketing' && styles.roleChipTextActive]}>
                                        Marketing
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.roleChip, newUserRole === 'engineer' && styles.roleChipEngineerActive]}
                                    onPress={() => setNewUserRole('engineer')}
                                    disabled={isSavingUser}>
                                    <Text style={[styles.roleChipText, newUserRole === 'engineer' && styles.roleChipTextActive]}>
                                        Engineer
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.roleChip, newUserRole === 'admin' && styles.roleChipAdminActive]}
                                    onPress={() => setNewUserRole('admin')}
                                    disabled={isSavingUser}>
                                    <Text style={[styles.roleChipText, newUserRole === 'admin' && styles.roleChipTextActive]}>
                                        Admin
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.formSpacer} />
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.saveBtn, isSavingUser && styles.saveBtnDisabled]}
                            onPress={handleCreateUser}
                            disabled={isSavingUser}>
                            {isSavingUser ? (
                                <ActivityIndicator color={colors.white} />
                            ) : (
                                <Text style={styles.saveBtnText}>Buat Akun</Text>
                            )}
                        </TouchableOpacity>

                    </Pressable>
                </KeyboardAvoidingView>
            </TouchableOpacity>

            <Modal
                visible={showBookingPicker}
                transparent
                animationType="fade"
                onRequestClose={() => setShowBookingPicker(false)}>
                <Pressable style={styles.pickerModalBackdrop} onPress={() => setShowBookingPicker(false)}>
                    <Pressable style={styles.pickerModalCard} onPress={e => e.stopPropagation()}>
                        <View style={styles.pickerModalHeader}>
                            <Text style={styles.pickerModalTitle}>Pilih Booking Survey</Text>
                            <TouchableOpacity onPress={() => setShowBookingPicker(false)}>
                                <Icon name="x" size={20} color={colors.grey} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.pickerModalSub}>
                            Pilih calon klien dari permohonan survey untuk mengisi Nama & Email secara otomatis.
                        </Text>
                        <ScrollView style={styles.pickerModalList} showsVerticalScrollIndicator={false}>
                            {surveyBookings.map(b => (
                                <TouchableOpacity
                                    key={b.id}
                                    style={styles.pickerItem}
                                    onPress={() => handleSelectBooking(b)}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.pickerItemName}>{b.clientName}</Text>
                                        <Text style={styles.pickerItemSub}>
                                            {b.companyName} • {b.email !== '-' ? b.email : 'Tanpa email'}
                                        </Text>
                                        <Text style={styles.pickerItemDetail}>Layanan: {b.structureType}</Text>
                                    </View>
                                    <Icon name="arrow-right" size={16} color="#0F9F67" />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>
        </Modal>
    );
};

const styles = StyleSheet.create({
    pickerTrigger: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F8FAFC',
        marginBottom: 16,
    },
    pickerTriggerText: {
        fontSize: 14,
        color: colors.textPrimary,
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
    },
    pickerTriggerPlaceholder: {
        color: colors.grey,
        fontWeight: '400',
    },
    pickerModalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    pickerModalCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxHeight: '80%',
    },
    pickerModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    pickerModalTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    pickerModalSub: {
        fontSize: 12,
        color: colors.grey,
        marginBottom: 16,
    },
    pickerModalList: {
        maxHeight: 320,
    },
    pickerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    pickerItemName: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    pickerItemSub: {
        fontSize: 12,
        color: '#475569',
        marginTop: 2,
    },
    pickerItemDetail: {
        fontSize: 11,
        color: '#0F9F67',
        fontWeight: '600',
        marginTop: 2,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.48)',
        justifyContent: 'flex-end',
    },
    kvAvoid: {
        width: '100%',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 12,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 36 : 24,
        maxHeight: '92%',
    },
    handleBar: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.border,
        alignSelf: 'center',
        marginBottom: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    modalSubtitle: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 3,
    },
    closeBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: colors.backgroundSecondary,
        borderWidth: 1,
        borderColor: colors.border,
    },
    closeBtnText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
    modalDivider: { height: 1, backgroundColor: colors.borderLight, marginBottom: 16 },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 7,
        marginTop: 10,
    },
    required: { color: '#E53935' },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        color: colors.textPrimary,
        backgroundColor: colors.backgroundSecondary,
        marginBottom: 14,
    },
    roleChipsRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 4,
    },
    roleChip: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
    },
    roleChipClientActive: {
        borderColor: '#2E7D32',
        backgroundColor: '#E8F5E9',
    },
    roleChipMarketingActive: {
        borderColor: '#E65100',
        backgroundColor: '#FFF3E0',
    },
    roleChipEngineerActive: {
        borderColor: '#1565C0',
        backgroundColor: '#E3F2FD',
    },
    roleChipAdminActive: {
        borderColor: '#C62828',
        backgroundColor: '#FFEBEE',
    },
    roleChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    roleChipTextActive: {
        color: colors.textPrimary,
        fontWeight: '700',
    },
    saveBtn: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    saveBtnDisabled: { backgroundColor: colors.grey },
    saveBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
    formSpacer: { height: 24 },
});

export default AdminRegisterModal;
