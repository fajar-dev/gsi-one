import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../assets/styles/Colors';

interface StatCardProps {
    label: string;
    value: number;
    color: string;
}

function StatCard({ label, value, color }: StatCardProps): React.ReactElement {
    return (
        <View style={[styles.card, { borderTopColor: color }]}>
            <Text style={[styles.value, { color }]}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 12,
        borderTopWidth: 3,
        paddingVertical: 14,
        paddingHorizontal: 10,
        alignItems: 'center',
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
    },
    value: {
        fontSize: 28,
        fontWeight: '800',
    },
    label: {
        fontSize: 11,
        color: colors.textSecondary,
        fontWeight: '600',
        marginTop: 4,
        textAlign: 'center',
    },
});

export default StatCard;
