import { ActionButton } from '../../components/ui/ActionButton';
import { spacing } from '../../theme/tokens';
import { styles } from './CreateProjectScreen.styles';

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import UserPickerModal from './components/UserPickerModal';
import { scale } from '../../utils/responsive';
import ScreenHeader from '../../components/common/ScreenHeader';
import { formatDateDisplay } from '../../utils/formatters';
import { useCreateProjectForm } from './hooks/useCreateProjectForm';

type RouteProps = RouteProp<RootStackParamList, 'CreateProject'>;

function CreateProjectScreen(): React.ReactElement {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader
        title="Tambah Proyek Baru"
        subtitle="Isi detail proyek yang akan didaftarkan"
        showBackButton
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {clientNotRegisteredNotice ? (
            <View style={styles.warningBanner}>
              <Icon
                name="alert-triangle"
                size={scale(16)}
                color="#D97706"
                style={{ marginRight: scale(spacing.sm) }}
              />
              <Text style={styles.warningBannerText}>
                {clientNotRegisteredNotice}
              </Text>
            </View>
          ) : null}

          <Text style={styles.label}>
            Kode Proyek <Text style={styles.required}>*</Text>
          </Text>
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
              accessibilityLabel="NDT-001"
            />
          </View>
          <Text style={styles.codePreviewText}>
            Kode Proyek Akhir:{' '}
            <Text style={styles.codePreviewHighlight}>{fullCodePreview}</Text>
          </Text>

          <Text style={styles.label}>
            Nama Proyek <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: Monitoring Jembatan Baja"
            placeholderTextColor={colors.grey}
            value={projectName}
            onChangeText={setProjectName}
            editable={!isLoading}
            accessibilityLabel="Contoh: Monitoring Jembatan Baja"
          />

          <Text style={styles.label}>
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
                title: 'Pilih Klien',
                data: clientsList,
              })
            }
            disabled={isLoading || isLoadingLists}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.pickerTriggerText,
                !selectedClient && styles.pickerTriggerPlaceholder,
              ]}
            >
              {selectedClient
                ? `${selectedClient.name} (${selectedClient.email})`
                : 'Pilih Klien...'}
            </Text>
            <Icon name="chevron-down" size={scale(16)} color={colors.grey} />
          </ActionButton>

          <Text style={styles.label}>
            Marketing Penanggung Jawab <Text style={styles.required}>*</Text>
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
                title: 'Pilih Marketing',
                data: marketingsList,
              })
            }
            disabled={isLoading || isLoadingLists}
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
            <Icon name="chevron-down" size={scale(16)} color={colors.grey} />
          </ActionButton>

          <Text style={styles.label}>
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
                title: 'Pilih Engineer',
                data: engineersList,
              })
            }
            disabled={isLoading || isLoadingLists}
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
            <Icon name="chevron-down" size={scale(16)} color={colors.grey} />
          </ActionButton>

          <Text style={styles.label}>
            Anggaran Proyek (Rp) <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: 150000000"
            placeholderTextColor={colors.grey}
            keyboardType="number-pad"
            value={budget}
            onChangeText={setBudget}
            editable={!isLoading}
            accessibilityLabel="Contoh: 150000000"
          />

          <Text style={styles.label}>
            Tanggal Mulai <Text style={styles.required}>*</Text>
          </Text>
          <ActionButton
            style={styles.pickerTrigger}
            onPress={() => setShowStartPicker(true)}
            disabled={isLoading}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.pickerTriggerText,
                !startDate && styles.pickerTriggerPlaceholder,
              ]}
            >
              {formatDateDisplay(startDate)}
            </Text>
            <Icon name="calendar" size={scale(16)} color={colors.grey} />
          </ActionButton>

          <Text style={styles.label}>
            Tanggal Estimasi Selesai <Text style={styles.required}>*</Text>
          </Text>
          <ActionButton
            style={styles.pickerTrigger}
            onPress={() => setShowEndPicker(true)}
            disabled={isLoading}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.pickerTriggerText,
                !endDate && styles.pickerTriggerPlaceholder,
              ]}
            >
              {formatDateDisplay(endDate)}
            </Text>
            <Icon name="calendar" size={scale(16)} color={colors.grey} />
          </ActionButton>

          <ActionButton
            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
            onPress={handleSave}
            disabled={isLoading}
            accessibilityRole="button"
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.submitBtnText}>Simpan Proyek</Text>
            )}
          </ActionButton>
        </View>
      </ScrollView>

      {Platform.OS === 'ios' ? (
        <Modal
          visible={showStartPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowStartPicker(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowStartPicker(false)}
            accessibilityRole="button"
          >
            <Pressable
              style={styles.datePickerContent}
              onPress={event => event.stopPropagation()}
              accessibilityRole="button"
            >
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display="inline"
                onChange={handleStartDateChange}
              />
              <ActionButton
                style={styles.doneBtn}
                onPress={() => setShowStartPicker(false)}
                accessibilityRole="button"
              >
                <Text style={styles.doneBtnText}>Selesai</Text>
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
            onChange={handleStartDateChange}
          />
        )
      )}

      {Platform.OS === 'ios' ? (
        <Modal
          visible={showEndPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowEndPicker(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowEndPicker(false)}
            accessibilityRole="button"
          >
            <Pressable
              style={styles.datePickerContent}
              onPress={event => event.stopPropagation()}
              accessibilityRole="button"
            >
              <DateTimePicker
                value={
                  endDate ||
                  (startDate
                    ? new Date(startDate.getTime() + 86400000)
                    : new Date())
                }
                mode="date"
                display="inline"
                minimumDate={startDate ?? undefined}
                onChange={handleEndDateChange}
              />
              <ActionButton
                style={styles.doneBtn}
                onPress={() => setShowEndPicker(false)}
                accessibilityRole="button"
              >
                <Text style={styles.doneBtnText}>Selesai</Text>
              </ActionButton>
            </Pressable>
          </Pressable>
        </Modal>
      ) : (
        showEndPicker && (
          <DateTimePicker
            value={
              endDate ||
              (startDate
                ? new Date(startDate.getTime() + 86400000)
                : new Date())
            }
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
        onSelect={item => {
          if (pickerModal.type === 'client') setSelectedClient(item);
          else if (pickerModal.type === 'marketing') setSelectedMarketing(item);
          else if (pickerModal.type === 'engineer') setSelectedEngineer(item);
          setPickerModal({ visible: false, type: '', title: '', data: [] });
        }}
        onClose={() =>
          setPickerModal({ visible: false, type: '', title: '', data: [] })
        }
      />
    </SafeAreaView>
  );
}

export default CreateProjectScreen;
