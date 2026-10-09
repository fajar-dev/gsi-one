import React, { JSX } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthenticatedNavigationProp } from '../../../types/navigation';
import { Project } from '../../../services/projectService';
import { colors, neutral } from '../../../../assets/styles/Colors';
import { scale, fontScale } from '../../../utils/responsive';
import ProjectPreviewCard from './ProjectPreviewCard';

interface RecentProjectsProps {
  projects: Project[];
  isLoading: boolean;
  accentColor?: string;
}

function RecentProjects({ projects, isLoading, accentColor = colors.primary }: RecentProjectsProps): JSX.Element {
  const navigation = useNavigation<AuthenticatedNavigationProp>();
  const recentProjects = projects.slice(0, 3);

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Proyek Terbaru</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Projects')}>
          <Text style={[styles.seeAll, { color: accentColor }]}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>

      {recentProjects.length === 0 && !isLoading ? (
        <Text style={styles.emptyText}>Belum ada proyek yang terdaftar.</Text>
      ) : (
        recentProjects.map(project => (
          <ProjectPreviewCard
            key={project.id}
            project={project}
            onPress={() => navigation.navigate('ProjectDetail', {
              projectId: project.id,
              projectName: project.project_name,
            })}
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
    marginTop: scale(20),
    marginBottom: scale(12),
  },
  sectionTitle: {
    fontSize: fontScale(16),
    fontWeight: '800',
    color: neutral[900],
  },
  seeAll: {
    fontSize: fontScale(13),
    fontWeight: '600',
  },
  emptyText: {
    fontSize: fontScale(14),
    color: neutral[600],
    textAlign: 'center',
    marginVertical: scale(20),
  },
});

export default RecentProjects;
