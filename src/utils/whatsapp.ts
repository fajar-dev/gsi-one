import { Linking, Alert } from 'react-native';
import { COMPANY_CONTACT } from '../constants/contact';

export const openWhatsAppConsultation = async (customMessage?: string): Promise<void> => {
    const phoneNumber = COMPANY_CONTACT.whatsappNumber;
    const text = customMessage
        ? customMessage
        : 'Halo GSI One, saya ingin konsultasi mengenai layanan & audit struktur.';
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

    try {
        const supported = await Linking.canOpenURL(whatsappUrl);
        if (supported) {
            await Linking.openURL(whatsappUrl);
        } else {
            await Linking.openURL(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(text)}`);
        }
    } catch {
        Alert.alert('Error', 'Tidak dapat membuka aplikasi WhatsApp.');
    }
};
