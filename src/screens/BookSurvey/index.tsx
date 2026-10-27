import { ActionButton } from '../../components/ui/ActionButton';
import { styles } from './index.styles';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { palette } from '../../theme/tokens';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { RootStackParamList } from '../../types/navigation';
import Header from '../Home/Header';
import ScreenHeader from '../../components/common/ScreenHeader';
import BottomNav from '../../components/BottomNav';
import { surveyService } from '../../services/surveyService';
import { scale } from '../../utils/responsive';
import { formatDateDb, formatDateDisplay } from '../../utils/formatters';

import { useAuthStore } from '../../store/authStore';

const SERVICE_OPTIONS = [
  'Building Assessment',
  'Bridge Assessment',
  'Jetty Assessment',
  'Industrial Assessment',
  'DAM Assessment',
  'Tunnel Assessment',
  'Inspection Services',
  'Loading Test',
  'Underwater Inspection',
  'SHMS & EEWS',
];

function BookSurvey(): React.ReactElement {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    company_name: '',
    email: user?.email || '',
    phone: '',
    location: '',
    message: '',
  });

  React.useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        full_name: prev.full_name || user.full_name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'dismissed') {
      return;
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const validateForm = (): string | null => {
    if (!form.full_name.trim()) return 'Nama lengkap wajib diisi';
    if (
      !form.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      return 'Email tidak valid';
    }
    if (!form.phone.trim() || !/^[0-9+\-\s()]{6,20}$/.test(form.phone.trim())) {
      return 'Nomor telepon tidak valid';
    }
    if (!selectedService) return 'Jenis layanan wajib dipilih';
    if (!form.location.trim()) return 'Lokasi wajib diisi';
    if (!selectedDate) return 'Tanggal yang diinginkan wajib dipilih';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Periksa kembali form', validationError);
      return;
    }

    setLoading(true);
    try {
      await surveyService.createBooking({
        full_name: form.full_name.trim(),
        company_name: form.company_name?.trim() || null,
        email: form.email.trim(),
        phone: form.phone.trim(),
        service_type: selectedService,
        location: form.location.trim(),
        preferred_date: formatDateDb(selectedDate as Date),
        message: form.message.trim() || null,
        status: 'pending',
      });

      navigation.navigate('SuccessScreen', { isAuthenticated: !!user });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Tidak dapat terhubung ke server';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {user ? (
        <ScreenHeader
          title="Book Site Survey"
          subtitle="Isi form berikut untuk membuat janji survey teknis"
          showBackButton={true}
        />
      ) : (
        <Header />
      )}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Book Site Survey</Text>
          <Text style={styles.cardSubtitle}>
            Isi form berikut untuk membuat janji survey teknis
          </Text>

          <Text style={styles.label}>
            Nama Lengkap <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama lengkap"
            placeholderTextColor="#94A3B8"
            value={form.full_name}
            onChangeText={v => handleChange('full_name', v)}
            editable={!loading}
            accessibilityLabel="Masukkan nama lengkap"
          />

          <Text style={styles.label}>Nama Perusahaan</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama perusahaan"
            placeholderTextColor="#94A3B8"
            value={form.company_name}
            onChangeText={v => handleChange('company_name', v)}
            editable={!loading}
            accessibilityLabel="Masukkan nama perusahaan"
          />

          <Text style={styles.label}>
            Email <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan email"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={v => handleChange('email', v)}
            editable={!loading}
            accessibilityLabel="Masukkan email"
          />

          <Text style={styles.label}>
            Nomor Telepon <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nomor telepon"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={v => handleChange('phone', v)}
            editable={!loading}
            accessibilityLabel="Masukkan nomor telepon"
          />

          <Text style={styles.label}>
            Jenis Layanan <Text style={styles.required}>*</Text>
          </Text>
          <ActionButton
            style={styles.picker}
            onPress={() => setShowServicePicker(true)}
            disabled={loading}
            accessibilityRole="button"
          >
            <Text
              style={
                selectedService ? styles.pickerText : styles.pickerPlaceholder
              }
            >
              {selectedService || 'Pilih jenis layanan'}
            </Text>
            <Icon name="chevron-down" size={scale(18)} color="#64748B" />
          </ActionButton>

          <Text style={styles.label}>
            Lokasi <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan lokasi survey"
            placeholderTextColor="#94A3B8"
            value={form.location}
            onChangeText={v => handleChange('location', v)}
            editable={!loading}
            accessibilityLabel="Masukkan lokasi survey"
          />

          <Text style={styles.label}>
            Tanggal yang Diinginkan <Text style={styles.required}>*</Text>
          </Text>
          <ActionButton
            style={styles.picker}
            onPress={() => setShowDatePicker(true)}
            disabled={loading}
            accessibilityRole="button"
          >
            <Text
              style={
                selectedDate ? styles.pickerText : styles.pickerPlaceholder
              }
            >
              {selectedDate
                ? formatDateDisplay(selectedDate)
                : 'Pilih tanggal survey'}
            </Text>
            <Icon name="calendar" size={scale(18)} color="#64748B" />
          </ActionButton>

          <Text style={styles.label}>Pesan Tambahan</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tuliskan pesan atau informasi tambahan"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            value={form.message}
            onChangeText={v => handleChange('message', v)}
            editable={!loading}
            accessibilityLabel="Tuliskan pesan atau informasi tambahan"
          />

          <ActionButton
            style={[styles.submitButton, loading && styles.submitDisabled]}
            activeOpacity={0.85}
            onPress={handleSubmit}
            disabled={loading}
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color={palette.white} />
            ) : (
              <Text style={styles.submitText}>Kirim Booking Survey</Text>
            )}
          </ActionButton>
        </View>
      </ScrollView>
      <BottomNav />

      <Modal
        visible={showServicePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowServicePicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowServicePicker(false)}
          accessibilityRole="button"
        >
          <Pressable
            style={styles.serviceModalContent}
            onPress={event => event.stopPropagation()}
            accessibilityRole="button"
          >
            <Text style={styles.modalTitle}>Pilih Jenis Layanan</Text>
            <FlatList
              data={SERVICE_OPTIONS}
              keyExtractor={item => item}
              style={styles.serviceList}
              renderItem={({ item }) => (
                <ActionButton
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedService(item);
                    setShowServicePicker(false);
                  }}
                  accessibilityRole="button"
                >
                  <Text style={styles.dropdownText}>{item}</Text>
                </ActionButton>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {Platform.OS === 'ios' ? (
        <Modal
          visible={showDatePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowDatePicker(false)}
            accessibilityRole="button"
          >
            <Pressable
              style={styles.datePickerContent}
              onPress={event => event.stopPropagation()}
              accessibilityRole="button"
            >
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display="inline"
                minimumDate={new Date()}
                onChange={(_event, date) => date && setSelectedDate(date)}
              />
              <ActionButton
                style={styles.doneButton}
                onPress={() => setShowDatePicker(false)}
                accessibilityRole="button"
              >
                <Text style={styles.doneButtonText}>Selesai</Text>
              </ActionButton>
            </Pressable>
          </Pressable>
        </Modal>
      ) : (
        showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={onDateChange}
          />
        )
      )}
    </KeyboardAvoidingView>
  );
}

export default BookSurvey;
