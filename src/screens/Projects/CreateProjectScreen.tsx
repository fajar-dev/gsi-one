import React from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ScrollView, SafeAreaView, ActivityIndicator, Platform,
    Modal, Pressable,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../../assets/styles/Colors';
import UserPickerModal from './components/UserPickerModal';
import { scale, fontScale } from '../../utils/responsive';
import ScreenHeader from '../../components/common/ScreenHeader';
import { formatDateDisplay } from '../../utils/formatters';
import { useCreateProjectForm } from './hooks/useCreateProjectForm';

type RouteProps = RouteProp<RootStackParamList, 'CreateProject'>;

function CreateProjectScreen(): React.ReactElement {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProps>();
    const {
        projectCodePrefix,
        projectCodeSuffix,
        setProjectCodeSuffix,
        projectName,
        setProjectName,
        budget,
        setBudget,
        startDate,
        endDate,
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
        isLoading,
        handleStartDateChange,
        handleEndDateChange,
        clientNotRegisteredNotice,
        handleSave,
        fullCodePreview,
    } = useCreateProjectForm(() => navigation.goBack(), route.params);

    return (
        <SafeAreaView style={styles.safe}>
            <ScreenHeader
                title="Tambah Proyek Baru"
                subtitle="Isi detail proyek yang akan didaftarkan"
                showBackButton
            />

            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <View style={styles.card}>
                    {clientNotRegisteredNotice ? (
                        <View style={styles.warningBanner}>
                            <Icon name="alert-triangle" size={scale(16)} color="#D97706" style={{ marginRight: scale(8) }} />
                            <Text style={styles.warningBannerText}>{clientNotRegisteredNotice}</Text>
                        </View>
                    ) : null}

                    <Text style={styles.label}>Kode Proyek <Text style={styles.required}>*</Text></Text>
                    <View style={styles.codeInputContainer}>
                        <View style={styles.codePrefixBadge}>
                            <Text style={styles.codePrefixText}>{projectCodePrefix}</Text>
                        </View>
                        <TextInput
                            style={styles.codeInput}
                            placeholder="NDT-001"
                            placeholderTextColor={colors.grey}
                            value={projectCodeSuffix}
                            onChangeText={setProjectCodeSuffix}
                            autoCapitalize="characters"
                            autoCorrect={false}
                            editable={!isLoading}
                        />
                    </View>
                    <Text style={styles.codePreviewText}>
                        Kode Proyek Akhir: <Text style={styles.codePreviewHighlight}>{fullCodePreview}</Text>
                    </Text>

                    <Text style={styles.label}>Nama Proyek <Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Contoh: Monitoring Jembatan Baja"
                        placeholderTextColor={colors.grey}
                        value={projectName}
                        onChangeText={setProjectName}
                        editable={!isLoading}
                    />

                    <Text style={styles.label}>Klien <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity
                        style={[styles.pickerTrigger, !selectedClient && styles.pickerTriggerEmpty]}
                        onPress={() => setPickerModal({
                            visible: true,
                            type: 'client',
                            title: 'Pilih Klien',
                            data: clientsList
                        })}
                        disabled={isLoading || isLoadingLists}>
                        <Text style={[styles.pickerTriggerText, !selectedClient && styles.pickerTriggerPlaceholder]}>
                            {selectedClient ? `${selectedClient.name} (${selectedClient.email})` : 'Pilih Klien...'}
                        </Text>
                        <Icon name="chevron-down" size={scale(16)} color={colors.grey} />
                    </TouchableOpacity>

                    <Text style={styles.label}>Marketing Penanggung Jawab <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity
                        style={[styles.pickerTrigger, !selectedMarketing && styles.pickerTriggerEmpty]}
                        onPress={() => setPickerModal({
                            visible: true,
                            type: 'marketing',
                            title: 'Pilih Marketing',
                            data: marketingsList
                        })}
                        disabled={isLoading || isLoadingLists}>
                        <Text style={[styles.pickerTriggerText, !selectedMarketing && styles.pickerTriggerPlaceholder]}>
                            {selectedMarketing ? `${selectedMarketing.name} (${selectedMarketing.email})` : 'Pilih Marketing...'}
                        </Text>
                        <Icon name="chevron-down" size={scale(16)} color={colors.grey} />
                    </TouchableOpacity>

                    <Text style={styles.label}>Engineer Penanggung Jawab <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity
                        style={[styles.pickerTrigger, !selectedEngineer && styles.pickerTriggerEmpty]}
                        onPress={() => setPickerModal({
                            visible: true,
                            type: 'engineer',
                            title: 'Pilih Engineer',
                            data: engineersList
                        })}
                        disabled={isLoading || isLoadingLists}>
                        <Text style={[styles.pickerTriggerText, !selectedEngineer && styles.pickerTriggerPlaceholder]}>
                            {selectedEngineer ? `${selectedEngineer.name} (${selectedEngineer.email})` : 'Pilih Engineer...'}
                        </Text>
                        <Icon name="chevron-down" size={scale(16)} color={colors.grey} />
                    </TouchableOpacity>

                    <Text style={styles.label}>Anggaran Proyek (Rp) <Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Contoh: 150000000"
                        placeholderTextColor={colors.grey}
                        keyboardType="number-pad"
                        value={budget}
                        onChangeText={setBudget}
                        editable={!isLoading}
                    />

                    <Text style={styles.label}>Tanggal Mulai <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity
                        style={styles.pickerTrigger}
                        onPress={() => setShowStartPicker(true)}
                        disabled={isLoading}>
                        <Text style={[styles.pickerTriggerText, !startDate && styles.pickerTriggerPlaceholder]}>
                            {formatDateDisplay(startDate)}
                        </Text>
                        <Icon name="calendar" size={scale(16)} color={colors.grey} />
                    </TouchableOpacity>

                    <Text style={styles.label}>Tanggal Estimasi Selesai <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity
                        style={styles.pickerTrigger}
                        onPress={() => setShowEndPicker(true)}
                        disabled={isLoading}>
                        <Text style={[styles.pickerTriggerText, !endDate && styles.pickerTriggerPlaceholder]}>
                            {formatDateDisplay(endDate)}
                        </Text>
                        <Icon name="calendar" size={scale(16)} color={colors.grey} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                        onPress={handleSave}
                        disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <Text style={styles.submitBtnText}>Simpan Proyek</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {Platform.OS === 'ios' ? (
                <Modal visible={showStartPicker} transparent animationType="fade" onRequestClose={() => setShowStartPicker(false)}>
                    <Pressable style={styles.modalOverlay} onPress={() => setShowStartPicker(false)}>
                        <Pressable style={styles.datePickerContent} onPress={() => {}}>
                            <DateTimePicker
                                value={startDate || new Date()}
                                mode="date"
                                display="inline"
                                onChange={handleStartDateChange}
                            />
                            <TouchableOpacity style={styles.doneBtn} onPress={() => setShowStartPicker(false)}>
                                <Text style={styles.doneBtnText}>Selesai</Text>
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
                        onChange={handleStartDateChange}
                    />
                )
            )}

            {Platform.OS === 'ios' ? (
                <Modal visible={showEndPicker} transparent animationType="fade" onRequestClose={() => setShowEndPicker(false)}>
                    <Pressable style={styles.modalOverlay} onPress={() => setShowEndPicker(false)}>
                        <Pressable style={styles.datePickerContent} onPress={() => {}}>
                            <DateTimePicker
                                value={endDate || (startDate ? new Date(startDate.getTime() + 86400000) : new Date())}
                                mode="date"
                                display="inline"
                                minimumDate={startDate ?? undefined}
                                onChange={handleEndDateChange}
                            />
                            <TouchableOpacity style={styles.doneBtn} onPress={() => setShowEndPicker(false)}>
                                <Text style={styles.doneBtnText}>Selesai</Text>
                            </TouchableOpacity>
                        </Pressable>
                    </Pressable>
                </Modal>
            ) : (
                showEndPicker && (
                    <DateTimePicker
                        value={endDate || (startDate ? new Date(startDate.getTime() + 86400000) : new Date())}
                        mode="date"
                        display="default"
                        minimumDate={startDate ?? undefined}
                        onChange={handleEndDateChange}
                    />
                )
            )}

            <UserPickerModal
                visible={pickerModal.visible}
                title={pickerModal.title}
                data={pickerModal.data}
                onSelect={(item) => {
                    if (pickerModal.type === 'client') setSelectedClient(item);
                    else if (pickerModal.type === 'marketing') setSelectedMarketing(item);
                    else if (pickerModal.type === 'engineer') setSelectedEngineer(item);
                    setPickerModal({ visible: false, type: '', title: '', data: [] });
                }}
                onClose={() => setPickerModal({ visible: false, type: '', title: '', data: [] })}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.backgroundSecondary },
    scroll: { padding: scale(16), paddingBottom: scale(32) },
    card: {
        backgroundColor: colors.white,
        borderRadius: scale(14),
        padding: scale(16),
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
    },
    warningBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FCD34D',
        borderRadius: scale(10),
        padding: scale(12),
        marginBottom: scale(12),
    },
    warningBannerText: {
        flex: 1,
        fontSize: fontScale(12),
        color: '#92400E',
        lineHeight: scale(16),
        fontWeight: '600',
    },
    label: {
        fontSize: fontScale(13),
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: scale(6),
        marginTop: scale(10),
    },
    required: {
        color: '#E53935',
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: scale(10),
        padding: scale(12),
        fontSize: fontScale(14),
        color: colors.textPrimary,
        backgroundColor: colors.backgroundSecondary,
        marginBottom: scale(8),
    },
    codeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: scale(10),
        backgroundColor: colors.backgroundSecondary,
        overflow: 'hidden',
    },
    codePrefixBadge: {
        backgroundColor: '#E0F2F1',
        paddingHorizontal: scale(12),
        paddingVertical: scale(12),
        borderRightWidth: 1,
        borderRightColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    codePrefixText: {
        fontSize: fontScale(13.5),
        fontWeight: '800',
        color: '#0B7552',
    },
    codeInput: {
        flex: 1,
        paddingHorizontal: scale(12),
        paddingVertical: scale(10),
        fontSize: fontScale(14),
        fontWeight: '600',
        color: colors.textPrimary,
    },
    codePreviewText: {
        fontSize: fontScale(11),
        color: colors.textSecondary,
        marginTop: scale(4),
        marginBottom: scale(8),
    },
    codePreviewHighlight: {
        fontWeight: '700',
        color: '#0F9F67',
    },
    pickerTrigger: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: scale(10),
        padding: scale(12),
        backgroundColor: colors.backgroundSecondary,
        marginBottom: scale(8),
    },
    pickerTriggerEmpty: {
        borderColor: colors.border,
    },
    pickerTriggerText: {
        fontSize: fontScale(14),
        color: colors.textPrimary,
        flex: 1,
        marginRight: scale(8),
    },
    pickerTriggerPlaceholder: {
        color: colors.grey,
    },
    submitBtn: {
        backgroundColor: '#0F9F67',
        borderRadius: scale(10),
        paddingVertical: scale(14),
        alignItems: 'center',
        marginTop: scale(24),
        marginBottom: scale(8),
    },
    submitBtnDisabled: {
        backgroundColor: colors.grey,
    },
    submitBtnText: {
        color: colors.white,
        fontSize: fontScale(15),
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: scale(20),
    },
    datePickerContent: {
        backgroundColor: '#FFF',
        borderRadius: scale(16),
        padding: scale(16),
        width: '100%',
        alignItems: 'center',
    },
    doneBtn: {
        backgroundColor: '#0F9F67',
        borderRadius: scale(10),
        paddingVertical: scale(12),
        paddingHorizontal: scale(32),
        marginTop: scale(12),
    },
    doneBtnText: {
        color: '#FFF',
        fontSize: fontScale(14),
        fontWeight: '700',
    },
});

export default CreateProjectScreen;
