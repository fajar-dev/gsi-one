import { ActionButton } from '../../../components/ui/ActionButton';
import { radius, spacing, typography } from '../../../theme/tokens';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Project } from '../../../domain/models/project';
import { colors } from '../../../theme/colors';
import { useAuthStore } from '../../../store/authStore';
import StatusBadge from '../../Projects/components/StatusBadge';

interface ProjectPreviewCardProps {
  project: Project;
  onPress: () => void;
}

function ProjectPreviewCard({
  project,
  onPress,
}: ProjectPreviewCardProps): React.ReactElement {
  const { user } = useAuthStore();
  const isClient = user?.role === 'client';

  const startDate = project.start_date
    ? new Date(project.start_date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '-';

  return (
    <ActionButton
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
    >
      <View style={styles.header}>
        <View style={styles.titleCol}>
          {!isClient && <Text style={styles.code}>{project.project_code}</Text>}
          <Text style={styles.name} numberOfLines={2}>
            {project.project_name}
          </Text>
        </View>
        <StatusBadge status={project.status} size="sm" />
      </View>
      <View style={styles.footer}>
        <Text style={styles.meta}>{project.client_name || 'Tanpa klien'}</Text>
        <Text style={styles.meta}>{startDate}</Text>
      </View>
    </ActionButton>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleCol: { flex: 1, marginRight: spacing.sm },
  code: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  meta: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
});

export default ProjectPreviewCard;
