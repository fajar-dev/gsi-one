import { ActionButton } from '../../../components/ui/ActionButton';
import { styles } from './EditProjectModal.styles';

import React from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../../theme/colors';
import type {
  ProjectDetail,
  ProjectStatus,
} from '../../../domain/models/project';
import UserPickerModal from './UserPickerModal';
import {
  useEditProjectForm,
  formatDateDisplay,
  PROJECT_STATUS_OPTIONS,
} from '../hooks/useEditProjectForm';

interface EditProjectModalProps {
  visible: boolean;
  project: ProjectDetail;
  onClose: () => void;
  onSaveSuccess: () => void;
  onDeleteSuccess: () => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  visible,
  project,
  onClose,
  onSaveSuccess,
  onDeleteSuccess,
}) => {
  const {
    projectCode,
    setProjectCode,
    projectName,
    setProjectName,
    budget,
    setBudget,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    status,
    setStatus,
    showStartPicker,
    setShowStartPicker,
    showEndPicker,
    setShowEndPicker,
    clientsList,
    marketingsList,
    engineersList,
    isLoadingLists,
    selectedClient,
    setSelectedClient,
    selectedMarketing,
    setSelectedMarketing,
    selectedEngineer,
    setSelectedEngineer,
    pickerModal,
    setPickerModal,
    isSaving,
    handleSave,
    handleDelete,
  } = useEditProjectForm({
    visible,
    project,
    onClose,
    onSaveSuccess,
    onDeleteSuccess,
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => !isSaving && onClose()}
    >
      <ActionButton
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={() => !isSaving && onClose()}
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
                <Text style={styles.modalTitle}>Edit Detail Proyek</Text>
                <Text style={styles.modalSubtitle}>
                  Ubah informasi dasar proyek
                </Text>
              </View>
              <ActionButton
                compact
                onPress={onClose}
                style={styles.closeBtn}
                disabled={isSaving}
                accessibilityRole="button"
              >
                <Text style={styles.closeBtnText}>Batal</Text>
              </ActionButton>
            </View>

            <View style={styles.modalDivider} />

            <ScrollView
              style={styles.formScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.fieldLabel}>
                Kode Proyek <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: PRJ-NDT-002"
                placeholderTextColor={colors.grey}
                value={projectCode}
                onChangeText={setProjectCode}
                autoCapitalize="characters"
                autoCorrect={false}
                editable={!isSaving}
                accessibilityLabel="Contoh: PRJ-NDT-002"
              />

              <Text style={styles.fieldLabel}>
                Nama Proyek <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Monitoring Jembatan Baja"
                placeholderTextColor={colors.grey}
                value={projectName}
                onChangeText={setProjectName}
                editable={!isSaving}
                accessibilityLabel="Contoh: Monitoring Jembatan Baja"
              />

              <Text style={styles.fieldLabel}>
                Status Proyek <Text style={styles.required}>*</Text>
              </Text>
              <ActionButton
                style={styles.pickerTrigger}
                onPress={() =>
                  setPickerModal({
                    visible: true,
                    type: 'status',
                    title: 'Status Proyek',
                    data: PROJECT_STATUS_OPTIONS,
                  })
                }
                disabled={isSaving}
                accessibilityRole="button"
              >
                <Text style={styles.pickerTriggerText}>
                  {PROJECT_STATUS_OPTIONS.find(opt => opt.id === status)
                    ?.name || 'Pilih Status...'}
                </Text>
                <Text style={styles.chevronIcon}>▼</Text>
              </ActionButton>

              <Text style={styles.fieldLabel}>
                Klien <Text style={styles.required}>*</Text>
              </Text>
              <ActionButton
                style={[
                  styles.pickerTrigger,
                  !selectedClient && styles.pickerTriggerEmpty,
                ]}
                onPress={() =>
                  setPickerModal({
                    visible: true,
                    type: 'client',
                    title: 'Klien',
                    data: clientsList,
                  })
                }
                disabled={isSaving || isLoadingLists}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.pickerTriggerText,
                    !selectedClient && styles.pickerTriggerPlaceholder,
                  ]}
                >
                  {selectedClient
                    ? `${selectedClient.name} ${
                        selectedClient.email ? `(${selectedClient.email})` : ''
                      }`
                    : 'Pilih Klien...'}
                </Text>
                <Text style={styles.chevronIcon}>▼</Text>
              </ActionButton>

              <Text style={styles.fieldLabel}>
                Marketing Penanggung Jawab{' '}
                <Text style={styles.required}>*</Text>
              </Text>
              <ActionButton
                style={[
                  styles.pickerTrigger,
                  !selectedMarketing && styles.pickerTriggerEmpty,
                ]}
                onPress={() =>
                  setPickerModal({
                    visible: true,
                    type: 'marketing',
                    title: 'Marketing',
                    data: marketingsList,
                  })
                }
                disabled={isSaving || isLoadingLists}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.pickerTriggerText,
                    !selectedMarketing && styles.pickerTriggerPlaceholder,
                  ]}
                >
                  {selectedMarketing
                    ? `${selectedMarketing.name} (${selectedMarketing.email})`
                    : 'Pilih Marketing...'}
                </Text>
                <Text style={styles.chevronIcon}>▼</Text>
              </ActionButton>

              <Text style={styles.fieldLabel}>
                Engineer Penanggung Jawab <Text style={styles.required}>*</Text>
              </Text>
              <ActionButton
                style={[
                  styles.pickerTrigger,
                  !selectedEngineer && styles.pickerTriggerEmpty,
                ]}
                onPress={() =>
                  setPickerModal({
                    visible: true,
                    type: 'engineer',
                    title: 'Engineer',
                    data: engineersList,
                  })
                }
                disabled={isSaving || isLoadingLists}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.pickerTriggerText,
                    !selectedEngineer && styles.pickerTriggerPlaceholder,
                  ]}
                >
                  {selectedEngineer
                    ? `${selectedEngineer.name} (${selectedEngineer.email})`
                    : 'Pilih Engineer...'}
                </Text>
                <Text style={styles.chevronIcon}>▼</Text>
              </ActionButton>

              <Text style={styles.fieldLabel}>
                Anggaran (Rp) <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: 150000000"
                placeholderTextColor={colors.grey}
                keyboardType="number-pad"
                value={budget}
                onChangeText={setBudget}
                editable={!isSaving}
                accessibilityLabel="Contoh: 150000000"
              />

              <Text style={styles.fieldLabel}>
                Tanggal Mulai <Text style={styles.required}>*</Text>
              </Text>
              <ActionButton
                style={[styles.dateBtn, !startDate && styles.dateBtnEmpty]}
                onPress={() => {
                  setShowEndPicker(false);
                  setShowStartPicker(v => !v);
                }}
                disabled={isSaving}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.dateBtnText,
                    !startDate && styles.dateBtnPlaceholder,
                  ]}
                >
                  {formatDateDisplay(startDate)}
                </Text>
                <Text style={styles.calendarIcon}>&#128197;</Text>
              </ActionButton>

              {Platform.OS === 'ios' ? (
                <Modal
                  visible={showStartPicker}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setShowStartPicker(false)}
                >
                  <Pressable
                    style={styles.pickerOverlay}
                    onPress={() => setShowStartPicker(false)}
                    accessibilityRole="button"
                  >
                    <Pressable
                      style={styles.pickerModalBox}
                      onPress={event => event.stopPropagation()}
                      accessibilityRole="button"
                    >
                      <DateTimePicker
                        value={startDate || new Date()}
                        mode="date"
                        display="inline"
                        onChange={(_, selected) =>
                          selected && setStartDate(selected)
                        }
                      />
                      <ActionButton
                        style={styles.pickerDoneBtn}
                        onPress={() => setShowStartPicker(false)}
                        accessibilityRole="button"
                      >
                        <Text style={styles.pickerDoneBtnText}>Selesai</Text>
                      </ActionButton>
                    </Pressable>
                  </Pressable>
                </Modal>
              ) : (
                showStartPicker && (
                  <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(_, selected) => {
                      setShowStartPicker(false);
                      if (selected) setStartDate(selected);
                    }}
                  />
                )
              )}

              <Text style={styles.fieldLabel}>
                Estimasi Selesai <Text style={styles.required}>*</Text>
              </Text>
              <ActionButton
                style={[styles.dateBtn, !endDate && styles.dateBtnEmpty]}
                onPress={() => {
                  setShowStartPicker(false);
                  setShowEndPicker(v => !v);
                }}
                disabled={isSaving}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.dateBtnText,
                    !endDate && styles.dateBtnPlaceholder,
                  ]}
                >
                  {formatDateDisplay(endDate)}
                </Text>
                <Text style={styles.calendarIcon}>&#128197;</Text>
              </ActionButton>

              {Platform.OS === 'ios' ? (
                <Modal
                  visible={showEndPicker}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setShowEndPicker(false)}
                >
                  <Pressable
                    style={styles.pickerOverlay}
                    onPress={() => setShowEndPicker(false)}
                    accessibilityRole="button"
                  >
                    <Pressable
                      style={styles.pickerModalBox}
                      onPress={event => event.stopPropagation()}
                      accessibilityRole="button"
                    >
                      <DateTimePicker
                        value={
                          endDate ??
                          (startDate
                            ? new Date(startDate.getTime() + 86400000)
                            : new Date())
                        }
                        mode="date"
                        display="inline"
                        minimumDate={startDate ?? undefined}
                        onChange={(_, selected) =>
                          selected && setEndDate(selected)
                        }
                      />
                      <ActionButton
                        style={styles.pickerDoneBtn}
                        onPress={() => setShowEndPicker(false)}
                        accessibilityRole="button"
                      >
                        <Text style={styles.pickerDoneBtnText}>Selesai</Text>
                      </ActionButton>
                    </Pressable>
                  </Pressable>
                </Modal>
              ) : (
                showEndPicker && (
                  <DateTimePicker
                    value={
                      endDate ??
                      (startDate
                        ? new Date(startDate.getTime() + 86400000)
                        : new Date())
                    }
                    mode="date"
                    display="default"
                    minimumDate={startDate ?? undefined}
                    onChange={(_, selected) => {
                      setShowEndPicker(false);
                      if (selected) setEndDate(selected);
                    }}
                  />
                )
              )}

              <View style={styles.formBottomSpacer} />
            </ScrollView>

            <ActionButton
              style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              {isSaving ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
              )}
            </ActionButton>

            <ActionButton
              style={[styles.deleteBtn, isSaving && styles.deleteBtnDisabled]}
              onPress={handleDelete}
              disabled={isSaving}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <Text style={styles.deleteBtnText}>Hapus Proyek</Text>
            </ActionButton>
          </Pressable>
        </KeyboardAvoidingView>
      </ActionButton>

      <UserPickerModal
        visible={pickerModal.visible}
        title={pickerModal.title}
        data={pickerModal.data}
        onSelect={item => {
          if (pickerModal.type === 'client') setSelectedClient(item);
          else if (pickerModal.type === 'marketing') setSelectedMarketing(item);
          else if (pickerModal.type === 'engineer') setSelectedEngineer(item);
          else if (pickerModal.type === 'status')
            setStatus(item.id as ProjectStatus);
          setPickerModal({ visible: false, type: '', title: '', data: [] });
        }}
        onClose={() =>
          setPickerModal({ visible: false, type: '', title: '', data: [] })
        }
      />
    </Modal>
  );
};

export default EditProjectModal;
