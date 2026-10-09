import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProjectStageStatus, ProjectStatus } from '../../../services/projectService';

type StatusType = ProjectStatus | ProjectStageStatus;

const STATUS_CONFIG: Record<StatusType, { label: string; bg: string; text: string }> = {
    pending: { label: 'Menunggu', bg: '#FFF3E0', text: '#E65100' },
    on_progress: { label: 'Berjalan', bg: '#E3F2FD', text: '#1565C0' },
    in_progress: { label: 'Berjalan', bg: '#E3F2FD', text: '#1565C0' },
    done: { label: 'Selesai', bg: '#E8F5E9', text: '#2E7D32' },
    on_hold: { label: 'Ditunda', bg: '#FCE4EC', text: '#C62828' },
};

interface StatusBadgeProps {
    status: StatusType;
    size?: 'sm' | 'md';
}

function StatusBadge({ status, size = 'md' }: StatusBadgeProps): React.ReactElement {
    const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    return (
        <View style={[styles.badge, { backgroundColor: config.bg }, size === 'sm' && styles.badgeSm]}>
            <Text style={[styles.label, { color: config.text }, size === 'sm' && styles.labelSm]}>
                {config.label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    badgeSm: {
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
    },
    labelSm: {
        fontSize: 10,
    },
});

export default StatusBadge;
