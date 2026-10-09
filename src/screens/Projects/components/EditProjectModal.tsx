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
    ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../../../assets/styles/Colors';
import { ProjectDetail, ProjectStatus } from '../../../services/projectService';
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
        projectCode, setProjectCode,
        projectName, setProjectName,
        budget, setBudget,
        startDate, setStartDate,
        endDate, setEndDate,
        status, setStatus,
        showStartPicker, setShowStartPicker,
        showEndPicker, setShowEndPicker,
        clientsList,
        marketingsList,
        engineersList,
        isLoadingLists,
        selectedClient, setSelectedClient,
        selectedMarketing, setSelectedMarketing,
        selectedEngineer, setSelectedEngineer,
        pickerModal, setPickerModal,
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
            onRequestClose={() => !isSaving && onClose()}>
            <TouchableOpacity
                style={styles.modalBackdrop}
                activeOpacity={1}
                onPress={() => !isSaving && onClose()}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.kvAvoid}>
                    <Pressable
                        style={styles.modalSheet}
                        onPress={e => e.stopPropagation()}>

                        <View style={styles.handleBar} />

                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>Edit Detail Proyek</Text>
                                <Text style={styles.modalSubtitle}>Ubah informasi dasar proyek</Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn} disabled={isSaving}>
                                <Text style={styles.closeBtnText}>Batal</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalDivider} />

                        <ScrollView
                            style={styles.formScroll}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled">

                            <Text style={styles.fieldLabel}>Kode Proyek <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Contoh: PRJ-NDT-002"
                                placeholderTextColor={colors.grey}
                                value={projectCode}
                                onChangeText={setProjectCode}
                                autoCapitalize="characters"
                                autoCorrect={false}
                                editable={!isSaving}
                            />

                            <Text style={styles.fieldLabel}>Nama Proyek <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Contoh: Monitoring Jembatan Baja"
                                placeholderTextColor={colors.grey}
                                value={projectName}
                                onChangeText={setProjectName}
                                editable={!isSaving}
                            />

                            <Text style={styles.fieldLabel}>Status Proyek <Text style={styles.required}>*</Text></Text>
                            <TouchableOpacity
                                style={styles.pickerTrigger}
                                onPress={() => setPickerModal({
                                    visible: true,
                                    type: 'status',
                                    title: 'Status Proyek',
                                    data: PROJECT_STATUS_OPTIONS
                                })}
                                disabled={isSaving}>
                                <Text style={styles.pickerTriggerText}>
                                    {PROJECT_STATUS_OPTIONS.find(opt => opt.id === status)?.name || 'Pilih Status...'}
                                </Text>
                                <Text style={styles.chevronIcon}>▼</Text>
                            </TouchableOpacity>

                            <Text style={styles.fieldLabel}>Klien <Text style={styles.required}>*</Text></Text>
                            <TouchableOpacity
                                style={[styles.pickerTrigger, !selectedClient && styles.pickerTriggerEmpty]}
                                onPress={() => setPickerModal({
                                    visible: true,
                                    type: 'client',
                                    title: 'Klien',
                                    data: clientsList
                                })}
                                disabled={isSaving || isLoadingLists}>
                                <Text style={[styles.pickerTriggerText, !selectedClient && styles.pickerTriggerPlaceholder]}>
                                    {selectedClient ? `${selectedClient.name} ${selectedClient.email ? `(${selectedClient.email})` : ''}` : 'Pilih Klien...'}
                                </Text>
                                <Text style={styles.chevronIcon}>▼</Text>
                            </TouchableOpacity>

                            <Text style={styles.fieldLabel}>Marketing Penanggung Jawab <Text style={styles.required}>*</Text></Text>
                            <TouchableOpacity
                                style={[styles.pickerTrigger, !selectedMarketing && styles.pickerTriggerEmpty]}
                                onPress={() => setPickerModal({
                                    visible: true,
                                    type: 'marketing',
                                    title: 'Marketing',
                                    data: marketingsList
                                })}
                                disabled={isSaving || isLoadingLists}>
                                <Text style={[styles.pickerTriggerText, !selectedMarketing && styles.pickerTriggerPlaceholder]}>
                                    {selectedMarketing ? `${selectedMarketing.name} (${selectedMarketing.email})` : 'Pilih Marketing...'}
                                </Text>
                                <Text style={styles.chevronIcon}>▼</Text>
                            </TouchableOpacity>

                            <Text style={styles.fieldLabel}>Engineer Penanggung Jawab <Text style={styles.required}>*</Text></Text>
                            <TouchableOpacity
                                style={[styles.pickerTrigger, !selectedEngineer && styles.pickerTriggerEmpty]}
                                onPress={() => setPickerModal({
                                    visible: true,
                                    type: 'engineer',
                                    title: 'Engineer',
                                    data: engineersList
                                })}
                                disabled={isSaving || isLoadingLists}>
                                <Text style={[styles.pickerTriggerText, !selectedEngineer && styles.pickerTriggerPlaceholder]}>
                                    {selectedEngineer ? `${selectedEngineer.name} (${selectedEngineer.email})` : 'Pilih Engineer...'}
                                </Text>
                                <Text style={styles.chevronIcon}>▼</Text>
                            </TouchableOpacity>

                            <Text style={styles.fieldLabel}>Anggaran (Rp) <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Contoh: 150000000"
                                placeholderTextColor={colors.grey}
                                keyboardType="number-pad"
                                value={budget}
                                onChangeText={setBudget}
                                editable={!isSaving}
                            />

                            <Text style={styles.fieldLabel}>Tanggal Mulai <Text style={styles.required}>*</Text></Text>
                            <TouchableOpacity
                                style={[styles.dateBtn, !startDate && styles.dateBtnEmpty]}
                                onPress={() => {
                                    setShowEndPicker(false);
                                    setShowStartPicker(v => !v);
                                }}
                                disabled={isSaving}>
                                <Text style={[styles.dateBtnText, !startDate && styles.dateBtnPlaceholder]}>
                                    {formatDateDisplay(startDate)}
                                </Text>
                                <Text style={styles.calendarIcon}>&#128197;</Text>
                            </TouchableOpacity>

                            {Platform.OS === 'ios' ? (
                                <Modal visible={showStartPicker} transparent animationType="fade" onRequestClose={() => setShowStartPicker(false)}>
                                    <Pressable style={styles.pickerOverlay} onPress={() => setShowStartPicker(false)}>
                                        <Pressable style={styles.pickerModalBox} onPress={() => {}}>
                                            <DateTimePicker
                                                value={startDate || new Date()}
                                                mode="date"
                                                display="inline"
                                                onChange={(_, selected) => selected && setStartDate(selected)}
                                            />
                                            <TouchableOpacity style={styles.pickerDoneBtn} onPress={() => setShowStartPicker(false)}>
                                                <Text style={styles.pickerDoneBtnText}>Selesai</Text>
                                            </TouchableOpacity>
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

                            <Text style={styles.fieldLabel}>Estimasi Selesai <Text style={styles.required}>*</Text></Text>
                            <TouchableOpacity
                                style={[styles.dateBtn, !endDate && styles.dateBtnEmpty]}
                                onPress={() => {
                                    setShowStartPicker(false);
                                    setShowEndPicker(v => !v);
                                }}
                                disabled={isSaving}>
                                <Text style={[styles.dateBtnText, !endDate && styles.dateBtnPlaceholder]}>
                                    {formatDateDisplay(endDate)}
                                </Text>
                                <Text style={styles.calendarIcon}>&#128197;</Text>
                            </TouchableOpacity>

                            {Platform.OS === 'ios' ? (
                                <Modal visible={showEndPicker} transparent animationType="fade" onRequestClose={() => setShowEndPicker(false)}>
                                    <Pressable style={styles.pickerOverlay} onPress={() => setShowEndPicker(false)}>
                                        <Pressable style={styles.pickerModalBox} onPress={() => {}}>
                                            <DateTimePicker
                                                value={endDate ?? (startDate ? new Date(startDate.getTime() + 86400000) : new Date())}
                                                mode="date"
                                                display="inline"
                                                minimumDate={startDate ?? undefined}
                                                onChange={(_, selected) => selected && setEndDate(selected)}
                                            />
                                            <TouchableOpacity style={styles.pickerDoneBtn} onPress={() => setShowEndPicker(false)}>
                                                <Text style={styles.pickerDoneBtnText}>Selesai</Text>
                                            </TouchableOpacity>
                                        </Pressable>
                                    </Pressable>
                                </Modal>
                            ) : (
                                showEndPicker && (
                                    <DateTimePicker
                                        value={endDate ?? (startDate ? new Date(startDate.getTime() + 86400000) : new Date())}
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

                        <TouchableOpacity
                            style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
                            onPress={handleSave}
                            disabled={isSaving}
                            activeOpacity={0.85}>
                            {isSaving ? (
                                <ActivityIndicator color={colors.white} />
                            ) : (
                                <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.deleteBtn, isSaving && styles.deleteBtnDisabled]}
                            onPress={handleDelete}
                            disabled={isSaving}
                            activeOpacity={0.85}>
                            <Text style={styles.deleteBtnText}>Hapus Proyek</Text>
                        </TouchableOpacity>

                    </Pressable>
                </KeyboardAvoidingView>
            </TouchableOpacity>

            <UserPickerModal
                visible={pickerModal.visible}
                title={pickerModal.title}
                data={pickerModal.data}
                onSelect={(item) => {
                    if (pickerModal.type === 'client') setSelectedClient(item);
                    else if (pickerModal.type === 'marketing') setSelectedMarketing(item);
                    else if (pickerModal.type === 'engineer') setSelectedEngineer(item);
                    else if (pickerModal.type === 'status') setStatus(item.id as ProjectStatus);
                    setPickerModal({ visible: false, type: '', title: '', data: [] });
                }}
                onClose={() => setPickerModal({ visible: false, type: '', title: '', data: [] })}
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
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
        paddingBottom: Platform.OS === 'ios' ? 48 : 36,
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
    closeBtnText: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    modalDivider: {
        height: 1,
        backgroundColor: colors.borderLight,
        marginBottom: 16,
    },
    formScroll: {
        maxHeight: 400,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 7,
        marginTop: 10,
    },
    required: {
        color: '#E53935',
    },
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
    pickerTrigger: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        padding: 14,
        backgroundColor: colors.backgroundSecondary,
        marginBottom: 14,
    },
    pickerTriggerEmpty: {
        borderColor: colors.border,
    },
    pickerTriggerText: {
        fontSize: 14,
        color: colors.textPrimary,
        flex: 1,
    },
    pickerTriggerPlaceholder: {
        color: colors.grey,
    },
    chevronIcon: {
        fontSize: 10,
        color: colors.grey,
        marginLeft: 8,
    },
    dateBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        padding: 14,
        backgroundColor: colors.backgroundSecondary,
        marginBottom: 14,
    },
    dateBtnEmpty: {
        borderColor: colors.border,
    },
    dateBtnText: {
        fontSize: 14,
        color: colors.textPrimary,
    },
    dateBtnPlaceholder: {
        color: colors.grey,
    },
    calendarIcon: {
        fontSize: 14,
        color: colors.grey,
    },
    saveBtn: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    saveBtnDisabled: {
        backgroundColor: colors.grey,
    },
    saveBtnText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    formBottomSpacer: {
        height: 20,
    },
    deleteBtn: {
        backgroundColor: '#D32F2F',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    deleteBtnDisabled: {
        backgroundColor: colors.grey,
    },
    deleteBtnText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    pickerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    pickerModalBox: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        width: '100%',
        alignItems: 'center',
    },
    pickerDoneBtn: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginTop: 12,
    },
    pickerDoneBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
});

export default EditProjectModal;
