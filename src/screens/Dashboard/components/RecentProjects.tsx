import { ActionButton } from '../../../components/ui/ActionButton';
import { spacing, typography } from '../../../theme/tokens';
import { JSX } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthenticatedNavigationProp } from '../../../types/navigation';
import type { Project } from '../../../domain/models/project';
import { colors, neutral } from '../../../theme/colors';
import { scale, fontScale } from '../../../utils/responsive';
import ProjectPreviewCard from './ProjectPreviewCard';

interface RecentProjectsProps {
  projects: Project[];
  isLoading: boolean;
  accentColor?: string;
}

function RecentProjects({
  projects,
  isLoading,
  accentColor = colors.primary,
}: RecentProjectsProps): JSX.Element {
  const navigation = useNavigation<AuthenticatedNavigationProp>();
  const recentProjects = projects.slice(0, 3);

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Proyek Terbaru</Text>
        <ActionButton
          onPress={() => navigation.navigate('Projects')}
          accessibilityRole="button"
        >
          <Text style={[styles.seeAll, { color: accentColor }]}>
            Lihat Semua
          </Text>
        </ActionButton>
      </View>

      {recentProjects.length === 0 && !isLoading ? (
        <Text style={styles.emptyText}>Belum ada proyek yang terdaftar.</Text>
      ) : (
        recentProjects.map(project => (
          <ProjectPreviewCard
            key={project.id}
            project={project}
            onPress={() =>
              navigation.navigate('ProjectDetail', {
                projectId: project.id,
                projectName: project.project_name,
              })
            }
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(spacing.xl),
    marginBottom: scale(spacing.md),
  },
  sectionTitle: {
    fontSize: fontScale(typography.bodyLarge),
    fontWeight: '800',
    color: neutral[900],
  },
  seeAll: {
    fontSize: fontScale(13),
    fontWeight: '600',
  },
  emptyText: {
    fontSize: fontScale(typography.body),
    color: neutral[600],
    textAlign: 'center',
    marginVertical: scale(spacing.xl),
  },
});

export default RecentProjects;
