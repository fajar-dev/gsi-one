import React, { JSX } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { RootStackParamList } from '../../types/navigation';
import BottomNav from '../../components/BottomNav';
import { scale, fontScale } from '../../utils/responsive';

function Partners(): JSX.Element {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();

    const partners = [
        { id: 1, name: 'Adaro', logo: require('../../../assets/partners/adaro.png') },
        { id: 2, name: 'ASDP', logo: require('../../../assets/partners/asdp.png') },
        { id: 3, name: 'Astra', logo: require('../../../assets/partners/astra.png') },
        { id: 4, name: 'Bayan', logo: require('../../../assets/partners/bayan.png') },
        { id: 5, name: 'Buma', logo: require('../../../assets/partners/buma.png') },
        { id: 6, name: 'Freeport', logo: require('../../../assets/partners/freeport.png') },
        { id: 7, name: 'Kideco', logo: require('../../../assets/partners/kideco.png') },
        { id: 8, name: 'NPC1', logo: require('../../../assets/partners/npc1.png') },
        { id: 9, name: 'Paramount', logo: require('../../../assets/partners/paramount.png') },
        { id: 10, name: 'Pelindo', logo: require('../../../assets/partners/pelindo.png') },
        { id: 11, name: 'Pertamina', logo: require('../../../assets/partners/pertamina.png') },
        { id: 12, name: 'PLN', logo: require('../../../assets/partners/pln.png') },
        { id: 13, name: 'PUPR', logo: require('../../../assets/partners/pupr.png') },
        { id: 14, name: 'Sampoerna', logo: require('../../../assets/partners/sampoerna.png') },
        { id: 15, name: 'Smart', logo: require('../../../assets/partners/smart.png') },
        { id: 16, name: 'Telkom', logo: require('../../../assets/partners/telkom.png') },
        { id: 17, name: 'Wika', logo: require('../../../assets/partners/wika.png') },
        { id: 18, name: 'Wings', logo: require('../../../assets/partners/wings.png') },
        { id: 19, name: 'Musi', logo: require('../../../assets/partners/Musi.png') },
        { id: 20, name: 'Donggi Senoro', logo: require('../../../assets/partners/donggi-senoro.webp') },
        { id: 21, name: 'Indorama', logo: require('../../../assets/partners/indorama.jpg') },
        { id: 22, name: 'Leighton', logo: require('../../../assets/partners/Leighton-Logo.png') },
        { id: 23, name: 'ABB', logo: require('../../../assets/partners/logo ABB.jpg') },
        { id: 24, name: 'AKR', logo: require('../../../assets/partners/logo AKR.jpg') },
        { id: 25, name: 'BRI', logo: require('../../../assets/partners/logo bri.jpg') },
        { id: 26, name: 'CMNP', logo: require('../../../assets/partners/logo CMNP.jpg') },
        { id: 27, name: 'Danamon', logo: require('../../../assets/partners/logo danamoin.png') },
        { id: 28, name: 'DSSP Power', logo: require('../../../assets/partners/logo dssp power.jpg') },
        { id: 29, name: 'ICA', logo: require('../../../assets/partners/logo ICA.jpg') },
        { id: 30, name: 'Ithaca Resources', logo: require('../../../assets/partners/logo ithaca resources.png') },
        { id: 31, name: 'KAI', logo: require('../../../assets/partners/logo KAI.png') },
        { id: 32, name: 'KPK', logo: require('../../../assets/partners/logo KPK.png') },
        { id: 33, name: 'LBE', logo: require('../../../assets/partners/logo LBE.png') },
        { id: 34, name: 'MRT', logo: require('../../../assets/partners/logo mrt.png') },
        { id: 35, name: 'Muamalat', logo: require('../../../assets/partners/logo muamalat.png') },
        { id: 36, name: 'TCM', logo: require('../../../assets/partners/logo tcm.webp') },
        { id: 37, name: 'Vale', logo: require('../../../assets/partners/logo vale.png') },
        { id: 38, name: 'Atang Gunung Meratus', logo: require('../../../assets/partners/Atang-Gunung-Meratus.png') },
        { id: 39, name: 'Bukaka', logo: require('../../../assets/partners/bukaka.png') },
        { id: 40, name: 'Bukit Asam', logo: require('../../../assets/partners/bukti asam.png') },
        { id: 41, name: 'Indonesian Power', logo: require('../../../assets/partners/indonesian power.jpg') },
        { id: 42, name: 'ITM', logo: require('../../../assets/partners/logo itm.jpg') },
        { id: 43, name: 'IPIP', logo: require('../../../assets/partners/logo-ipip-150x150.png') },
        { id: 44, name: 'Paragon', logo: require('../../../assets/partners/paragon.jpg') },
        { id: 45, name: 'Prodia', logo: require('../../../assets/partners/prodia.png') },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#062A3F" />
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={[
                        styles.bannerContainer,
                        { paddingTop: insets.top > 0 ? insets.top + scale(12) : scale(16) },
                    ]}
                >
                    <View style={styles.topHeaderRow}>
                        <TouchableOpacity
                            style={styles.backButton}
                            activeOpacity={0.7}
                            onPress={() => navigation.goBack()}
                        >
                            <Icon name="arrow-left" size={scale(20)} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.bannerTitle}>Trusted by Leading Organizations</Text>
                        <View style={styles.headerPlaceholder} />
                    </View>

                    <Text style={styles.bannerSubtitle}>
                        Leading companies and institutions across Indonesia and beyond trust GSI for reliable structural inspection, assessment, and engineering solutions.
                    </Text>
                </View>

                <View style={styles.gridContainer}>
                    <View style={styles.partnersGrid}>
                        {partners.map((partner) => (
                            <View key={partner.id} style={styles.partnerCard}>
                                <Image
                                    source={partner.logo}
                                    style={styles.partnerLogo}
                                    resizeMode="contain"
                                />
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F8F7',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: scale(28),
    },
    bannerContainer: {
        backgroundColor: '#062A3F',
        paddingHorizontal: scale(16),
        paddingBottom: scale(20),
        borderBottomLeftRadius: scale(24),
        borderBottomRightRadius: scale(24),
    },
    topHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: scale(14),
    },
    backButton: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerTitle: {
        fontSize: fontScale(17),
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        flex: 1,
    },
    headerPlaceholder: {
        width: scale(36),
    },
    bannerSubtitle: {
        fontSize: fontScale(12),
        color: '#94A3B8',
        lineHeight: scale(17),
        marginBottom: scale(14),
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: scale(12),
        paddingHorizontal: scale(12),
        height: scale(44),
    },
    searchIcon: {
        marginRight: scale(8),
    },
    searchInput: {
        flex: 1,
        fontSize: fontScale(13),
        color: '#0F172A',
    },
    gridContainer: {
        paddingHorizontal: scale(16),
        marginTop: scale(16),
    },
    partnersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    partnerCard: {
        width: '31%',
        height: scale(72),
        backgroundColor: '#FFF',
        borderRadius: scale(14),
        padding: scale(10),
        marginBottom: scale(12),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
    },
    partnerLogo: {
        width: '100%',
        height: '100%',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: scale(40),
    },
    emptyTitle: {
        fontSize: fontScale(16),
        fontWeight: 'bold',
        color: '#334155',
        marginTop: scale(12),
    },
    emptySubtitle: {
        fontSize: fontScale(12),
        color: '#64748B',
        marginTop: scale(4),
    },
});

export default Partners;