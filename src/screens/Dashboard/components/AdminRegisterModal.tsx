import { ActionButton } from '../../../components/ui/ActionButton';
import { styles } from './AdminRegisterModal.styles';
import { palette } from '../../../theme/tokens';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../../theme/colors';
import { useUserRegistration } from '../../../hooks/useUserRegistration';

import { surveyService } from '../../../services/surveyService';
import { projectService } from '../../../services/projectService';
import { SurveyRequestData } from '../../../domain/entities/SurveyRequestEntity';

interface AdminRegisterModalProps {
  visible: boolean;
  onClose: () => void;
}

const AdminRegisterModal: React.FC<AdminRegisterModalProps> = ({
  visible,
  onClose,
}) => {
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
  } = useUserRegistration(onClose);

  const [surveyBookings, setSurveyBookings] = useState<SurveyRequestData[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [showBookingPicker, setShowBookingPicker] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<SurveyRequestData | null>(null);

  useEffect(() => {
    if (visible) {
      reset();
      setSelectedBooking(null);

      const loadUnregisteredBookings = async () => {
        setIsLoadingBookings(true);
        try {
          const [bookings, existingClients] = await Promise.all([
            surveyService.getBookings(),
            projectService.getUsersByRole('client'),
          ]);
          const existingEmails = new Set(
            existingClients.map(c => c.email.toLowerCase()),
          );
          const unregistered = bookings.filter(
            b =>
              b.email &&
              b.email !== '-' &&
              !existingEmails.has(b.email.toLowerCase()),
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
  }, [visible, reset]);

  const handleSelectBooking = (booking: SurveyRequestData) => {
    setSelectedBooking(booking);
    setNewUserName(booking.clientName);
    setNewUserEmail(booking.email !== '-' ? booking.email : '');
    setNewUserRole('client');
    setShowBookingPicker(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => !isSavingUser && onClose()}
    >
      <ActionButton
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={() => !isSavingUser && onClose()}
        accessible={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.kvAvoid}
        >
          <Pressable
            style={styles.modalSheet}
            onPress={e => e.stopPropagation()}
            accessible={false}
          >
            <View style={styles.handleBar} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Daftar Akun Baru</Text>
                <Text style={styles.modalSubtitle}>
                  Buat akun GSI One baru untuk Klien/Staff
                </Text>
              </View>
              <ActionButton
                compact
                onPress={onClose}
                style={styles.closeBtn}
                disabled={isSavingUser}
                accessibilityRole="button"
              >
                <Text style={styles.closeBtnText}>Batal</Text>
              </ActionButton>
            </View>

            <View style={styles.modalDivider} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.fieldLabel}>
                Impor dari Booking Survey (Opsional)
              </Text>
              <ActionButton
                style={styles.pickerTrigger}
                onPress={() => setShowBookingPicker(true)}
                disabled={isSavingUser || isLoadingBookings}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.pickerTriggerText,
                    !selectedBooking && styles.pickerTriggerPlaceholder,
                  ]}
                  numberOfLines={1}
                >
                  {selectedBooking
                    ? `${selectedBooking.clientName} (${selectedBooking.companyName})`
                    : isLoadingBookings
                    ? 'Memuat data survey...'
                    : surveyBookings.length > 0
                    ? `-- Pilih dari ${surveyBookings.length} Booking Survey --`
                    : 'Tidak ada booking survey baru'}
                </Text>
                <Icon name="chevron-down" size={16} color={colors.grey} />
              </ActionButton>

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
                accessibilityLabel="Nama Lengkap"
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
                accessibilityLabel="Alamat email aktif"
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
                accessibilityLabel="Minimal 8 karakter"
                autoCorrect={false}
              />

              <Text style={styles.fieldLabel}>
                Role Pengguna <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.roleChipsRow}>
                <ActionButton
                  compact
                  style={[
                    styles.roleChip,
                    newUserRole === 'client' && styles.roleChipClientActive,
                  ]}
                  onPress={() => setNewUserRole('client')}
                  disabled={isSavingUser}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.roleChipText,
                      newUserRole === 'client' && styles.roleChipTextActive,
                    ]}
                  >
                    Klien
                  </Text>
                </ActionButton>
                <ActionButton
                  compact
                  style={[
                    styles.roleChip,
                    newUserRole === 'marketing' &&
                      styles.roleChipMarketingActive,
                  ]}
                  onPress={() => setNewUserRole('marketing')}
                  disabled={isSavingUser}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.roleChipText,
                      newUserRole === 'marketing' && styles.roleChipTextActive,
                    ]}
                  >
                    Marketing
                  </Text>
                </ActionButton>
                <ActionButton
                  compact
                  style={[
                    styles.roleChip,
                    newUserRole === 'engineer' && styles.roleChipEngineerActive,
                  ]}
                  onPress={() => setNewUserRole('engineer')}
                  disabled={isSavingUser}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.roleChipText,
                      newUserRole === 'engineer' && styles.roleChipTextActive,
                    ]}
                  >
                    Engineer
                  </Text>
                </ActionButton>
                <ActionButton
                  compact
                  style={[
                    styles.roleChip,
                    newUserRole === 'admin' && styles.roleChipAdminActive,
                  ]}
                  onPress={() => setNewUserRole('admin')}
                  disabled={isSavingUser}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.roleChipText,
                      newUserRole === 'admin' && styles.roleChipTextActive,
                    ]}
                  >
                    Admin
                  </Text>
                </ActionButton>
              </View>

              <View style={styles.formSpacer} />
            </ScrollView>

            <ActionButton
              style={[styles.saveBtn, isSavingUser && styles.saveBtnDisabled]}
              onPress={handleCreateUser}
              disabled={isSavingUser}
              accessibilityRole="button"
            >
              {isSavingUser ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.saveBtnText}>Buat Akun</Text>
              )}
            </ActionButton>
          </Pressable>
        </KeyboardAvoidingView>
      </ActionButton>

      <Modal
        visible={showBookingPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBookingPicker(false)}
      >
        <Pressable
          style={styles.pickerModalBackdrop}
          onPress={() => setShowBookingPicker(false)}
          accessibilityRole="button"
        >
          <Pressable
            style={styles.pickerModalCard}
            onPress={e => e.stopPropagation()}
            accessibilityRole="button"
          >
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>Pilih Booking Survey</Text>
              <ActionButton
                onPress={() => setShowBookingPicker(false)}
                accessibilityRole="button"
                accessibilityLabel="Tutup"
              >
                <Icon name="x" size={20} color={colors.grey} />
              </ActionButton>
            </View>
            <Text style={styles.pickerModalSub}>
              Pilih calon klien dari permohonan survey untuk mengisi Nama &
              Email secara otomatis.
            </Text>
            <ScrollView
              style={styles.pickerModalList}
              showsVerticalScrollIndicator={false}
            >
              {surveyBookings.map(b => (
                <ActionButton
                  key={b.id}
                  style={styles.pickerItem}
                  onPress={() => handleSelectBooking(b)}
                  accessibilityRole="button"
                >
                  <View style={styles.staticStyle1}>
                    <Text style={styles.pickerItemName}>{b.clientName}</Text>
                    <Text style={styles.pickerItemSub}>
                      {b.companyName} •{' '}
                      {b.email !== '-' ? b.email : 'Tanpa email'}
                    </Text>
                    <Text style={styles.pickerItemDetail}>
                      Layanan: {b.structureType}
                    </Text>
                  </View>
                  <Icon name="arrow-right" size={16} color={palette.brand} />
                </ActionButton>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </Modal>
  );
};

export default AdminRegisterModal;
