import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ImageSourcePropType,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../types/navigation';
import { colors } from '../../../assets/styles/Colors';
import { scale, fontScale } from '../../utils/responsive';

type Structure = {
    id: string;
    name: string;
    icon: ImageSourcePropType;
    color: string;
};

const structures: Structure[] = [
    {
        id: 'building',
        name: 'Building\nAssessment',
        icon: require('../../../assets/icons/building.png'),
        color: colors.info,
    },
    {
        id: 'bridge',
        name: 'Bridge\nAssessment',
        icon: require('../../../assets/icons/bridge.png'),
        color: colors.secondaryDark,
    },
    {
        id: 'jetty',
        name: 'Jetty\nAssessment',
        icon: require('../../../assets/icons/marine.png'),
        color: colors.primaryLight,
    },
    {
        id: 'industrial',
        name: 'Industrial\nAssessment',
        icon: require('../../../assets/icons/industrial.png'),
        color: '#EF4444',
    },
    {
        id: 'dam',
        name: 'DAM\nAssessment',
        icon: require('../../../assets/icons/dam.png'),
        color: colors.accentDark,
    },
    {
        id: 'tunnel',
        name: 'Tunnel\nAssessment',
        icon: require('../../../assets/icons/tunnel.png'),
        color: colors.grey,
    },
];

const StructureSection = () => {
    const navigation = useNavigation<RootStackNavigationProp>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Structure, Our Excellences</Text>

            <View style={styles.grid}>
                {structures.map((structure) => (
                    <TouchableOpacity
                        key={structure.id}
                        style={styles.card}
                        onPress={() =>
                            navigation.navigate('StructureDetail', {
                                id: structure.id,
                            })
                        }>
                        <View style={[
                            styles.iconContainer,
                            { backgroundColor: structure.color + '20' },
                        ]}>
                            <Image
                                source={structure.icon}
                                style={styles.icon}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.structureText}>
                            {structure.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        marginHorizontal: scale(16),
        marginTop: scale(16),
        padding: scale(16),
        borderRadius: scale(16),
    },
    title: {
        fontSize: fontScale(18),
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1F2937',
        marginBottom: scale(16),
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '31%',
        alignItems: 'center',
        marginBottom: scale(16),
    },
    iconContainer: {
        width: scale(80),
        height: scale(80),
        borderRadius: scale(16),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(8),
    },
    icon: {
        width: scale(72),
        height: scale(72),
    },
    structureText: {
        fontSize: fontScale(12),
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: fontScale(16),
        fontWeight: '500',
    },
});

export default StructureSection;