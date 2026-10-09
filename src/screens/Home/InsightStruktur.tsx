import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { scale, fontScale } from '../../utils/responsive';
import { insightsData, InsightArticle } from '../../data/insights';
import { RootStackNavigationProp } from '../../types/navigation';

const InsightStruktur = () => {
    const navigation = useNavigation<RootStackNavigationProp>();

    const handleOpenDetail = (article: InsightArticle) => {
        navigation.navigate('InsightDetail', { id: article.id });
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>Insight Struktur</Text>
            </View>

            <View style={styles.cardsContainer}>
                {insightsData.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.card}
                        activeOpacity={0.85}
                        onPress={() => handleOpenDetail(item)}
                    >
                        <Image
                            source={item.image}
                            style={styles.thumbnail}
                            resizeMode="cover"
                        />

                        <View style={styles.contentContainer}>
                            <Text style={styles.articleTitle} numberOfLines={2}>
                                {item.title}
                            </Text>
                            <View style={styles.linkRow}>
                                <Text style={styles.linkText}>Baca Artikel</Text>
                                <Icon name="chevron-right" size={scale(14)} color="#0B7552" style={styles.chevronIcon} />
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: scale(28),
        paddingHorizontal: scale(16),
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(14),
    },
    sectionTitle: {
        fontSize: fontScale(15),
        fontWeight: 'bold',
        color: '#1A202C',
    },
    cardsContainer: {
        gap: scale(12),
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: scale(16),
        padding: scale(12),
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    thumbnail: {
        width: scale(96),
        height: scale(72),
        borderRadius: scale(12),
        backgroundColor: '#F1F5F9',
    },
    contentContainer: {
        flex: 1,
        marginLeft: scale(14),
        justifyContent: 'center',
    },
    articleTitle: {
        fontSize: fontScale(12.5),
        fontWeight: 'bold',
        color: '#2D3748',
        lineHeight: scale(18),
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: scale(8),
    },
    linkText: {
        fontSize: fontScale(11.5),
        color: '#0B7552',
        fontWeight: 'bold',
    },
    chevronIcon: {
        marginLeft: scale(2),
    },
});

export default InsightStruktur;
