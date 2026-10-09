import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TextInput, TouchableOpacity, ActivityIndicator, Alert,
    Modal, FlatList, Pressable, Platform, KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { RootStackParamList } from '../../types/navigation';
import Header from '../Home/header';
import ScreenHeader from '../../components/common/ScreenHeader';
import BottomNav from '../../components/BottomNav';
import { surveyService } from '../../services/surveyService';
import { scale, fontScale } from '../../utils/responsive';
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
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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

    const onDateChange = (event: any, date?: Date) => {
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
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
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
            const message = err instanceof Error ? err.message : 'Tidak dapat terhubung ke server';
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
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Book Site Survey</Text>
                    <Text style={styles.cardSubtitle}>Isi form berikut untuk membuat janji survey teknis</Text>

                    <Text style={styles.label}>Nama Lengkap <Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Masukkan nama lengkap"
                        placeholderTextColor="#94A3B8"
                        value={form.full_name}
                        onChangeText={(v) => handleChange('full_name', v)}
                        editable={!loading}
                    />

                    <Text style={styles.label}>Nama Perusahaan</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Masukkan nama perusahaan"
                        placeholderTextColor="#94A3B8"
                        value={form.company_name}
                        onChangeText={(v) => handleChange('company_name', v)}
                        editable={!loading}
                    />

                    <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Masukkan email"
                        placeholderTextColor="#94A3B8"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={form.email}
                        onChangeText={(v) => handleChange('email', v)}
                        editable={!loading}
                    />

                    <Text style={styles.label}>Nomor Telepon <Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Masukkan nomor telepon"
                        placeholderTextColor="#94A3B8"
                        keyboardType="phone-pad"
                        value={form.phone}
                        onChangeText={(v) => handleChange('phone', v)}
                        editable={!loading}
                    />

                    <Text style={styles.label}>Jenis Layanan <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity
                        style={styles.picker}
                        onPress={() => setShowServicePicker(true)}
                        disabled={loading}
                    >
                        <Text style={selectedService ? styles.pickerText : styles.pickerPlaceholder}>
                            {selectedService || 'Pilih jenis layanan'}
                        </Text>
                        <Icon name="chevron-down" size={scale(18)} color="#64748B" />
                    </TouchableOpacity>

                    <Text style={styles.label}>Lokasi <Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Masukkan lokasi survey"
                        placeholderTextColor="#94A3B8"
                        value={form.location}
                        onChangeText={(v) => handleChange('location', v)}
                        editable={!loading}
                    />

                    <Text style={styles.label}>Tanggal yang Diinginkan <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity
                        style={styles.picker}
                        onPress={() => setShowDatePicker(true)}
                        disabled={loading}
                    >
                        <Text style={selectedDate ? styles.pickerText : styles.pickerPlaceholder}>
                            {selectedDate ? formatDateDisplay(selectedDate) : 'Pilih tanggal survey'}
                        </Text>
                        <Icon name="calendar" size={scale(18)} color="#64748B" />
                    </TouchableOpacity>

                    <Text style={styles.label}>Pesan Tambahan</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Tuliskan pesan atau informasi tambahan"
                        placeholderTextColor="#94A3B8"
                        multiline
                        numberOfLines={4}
                        value={form.message}
                        onChangeText={(v) => handleChange('message', v)}
                        editable={!loading}
                    />

                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.submitDisabled]}
                        activeOpacity={0.85}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitText}>Kirim Booking Survey</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <BottomNav />

            <Modal
                visible={showServicePicker}
                transparent
                animationType="fade"
                onRequestClose={() => setShowServicePicker(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setShowServicePicker(false)}>
                    <Pressable style={styles.serviceModalContent} onPress={() => { }}>
                        <Text style={styles.modalTitle}>Pilih Jenis Layanan</Text>
                        <FlatList
                            data={SERVICE_OPTIONS}
                            keyExtractor={(item) => item}
                            style={styles.serviceList}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setSelectedService(item);
                                        setShowServicePicker(false);
                                    }}
                                >
                                    <Text style={styles.dropdownText}>{item}</Text>
                                </TouchableOpacity>
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
                    <Pressable style={styles.modalOverlay} onPress={() => setShowDatePicker(false)}>
                        <Pressable style={styles.datePickerContent} onPress={() => { }}>
                            <DateTimePicker
                                value={selectedDate || new Date()}
                                mode="date"
                                display="inline"
                                minimumDate={new Date()}
                                onChange={(event, date) => date && setSelectedDate(date)}
                            />
                            <TouchableOpacity
                                style={styles.doneButton}
                                onPress={() => setShowDatePicker(false)}
                            >
                                <Text style={styles.doneButtonText}>Selesai</Text>
                            </TouchableOpacity>
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F8F7' },
    scrollContent: { padding: scale(16), paddingBottom: scale(24) },
    card: {
        backgroundColor: '#fff',
        borderRadius: scale(16),
        padding: scale(20),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
    },
    cardTitle: {
        fontSize: fontScale(20),
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: scale(4),
    },
    cardSubtitle: {
        fontSize: fontScale(12.5),
        color: '#64748B',
        marginBottom: scale(20),
    },
    label: {
        fontSize: fontScale(12.5),
        fontWeight: '600',
        color: '#334155',
        marginBottom: scale(6),
        marginTop: scale(12),
    },
    required: { color: '#EF4444' },
    input: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: scale(10),
        paddingHorizontal: scale(14),
        paddingVertical: scale(10),
        fontSize: fontScale(13.5),
        color: '#0F172A',
        backgroundColor: '#F8FAFC',
    },
    textArea: {
        height: scale(90),
        textAlignVertical: 'top',
    },
    picker: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: scale(10),
        paddingHorizontal: scale(14),
        paddingVertical: scale(12),
        backgroundColor: '#F8FAFC',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pickerText: { fontSize: fontScale(13.5), color: '#0F172A' },
    pickerPlaceholder: { fontSize: fontScale(13.5), color: '#94A3B8' },
    dropdownItem: {
        paddingHorizontal: scale(14),
        paddingVertical: scale(12),
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    dropdownText: { fontSize: fontScale(13.5), color: '#0F172A' },
    submitButton: {
        backgroundColor: '#0B7552',
        borderRadius: scale(12),
        paddingVertical: scale(14),
        alignItems: 'center',
        marginTop: scale(24),
        elevation: 3,
        shadowColor: '#0B7552',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    submitDisabled: { backgroundColor: '#94A3B8' },
    submitText: {
        color: '#fff',
        fontSize: fontScale(14.5),
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    serviceModalContent: {
        backgroundColor: '#fff',
        borderRadius: scale(16),
        padding: scale(16),
        width: '88%',
    },
    serviceList: {
        maxHeight: scale(320),
    },
    modalTitle: {
        fontSize: fontScale(15),
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: scale(12),
    },
    datePickerContent: {
        backgroundColor: '#fff',
        borderRadius: scale(16),
        padding: scale(16),
        width: '90%',
    },
    doneButton: {
        backgroundColor: '#0B7552',
        borderRadius: scale(10),
        paddingVertical: scale(12),
        alignItems: 'center',
        marginTop: scale(12),
    },
    doneButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: fontScale(13.5),
    },
});

export default BookSurvey;