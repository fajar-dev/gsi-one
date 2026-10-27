import { palette, typography, spacing } from '../../../theme/tokens';
import { JSX } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, neutral } from '../../../theme/colors';
import { scale, fontScale } from '../../../utils/responsive';
import StatCard from './StatCard';
import Svg, { Circle } from 'react-native-svg';

import type { ProjectStatistics } from '../../../domain/models/projectStatistics';

interface ProjectSummaryProps {
  stats: ProjectStatistics | null;
  isLoading: boolean;
  statColors?: {
    onProgress: string;
    done: string;
    pending: string;
    onHold: string;
  };
  loaderColor?: string;
}

const DEFAULT_STAT_COLORS = {
  onProgress: colors.secondary,
  done: '#2E7D32',
  pending: colors.primary,
  onHold: palette.grey,
};

function ProjectSummary({
  stats,
  isLoading,
  statColors = DEFAULT_STAT_COLORS,
  loaderColor = colors.primary,
}: ProjectSummaryProps): JSX.Element {
  return (
    <View>
      <Text style={styles.sectionTitle}>Ringkasan Status Proyek</Text>

      {isLoading && !stats ? (
        <ActivityIndicator color={loaderColor} style={styles.loader} />
      ) : stats ? (
        <>
          <View style={styles.chartCard}>
            <MiniDonutChart stats={stats} />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              label="Berjalan"
              value={stats.on_progress}
              color={statColors.onProgress}
            />
            <View style={styles.statGap} />
            <StatCard
              label="Selesai"
              value={stats.done}
              color={statColors.done}
            />
            <View style={styles.statGap} />
            <StatCard
              label="Menunggu"
              value={stats.pending}
              color={statColors.pending}
            />
            <View style={styles.statGap} />
            <StatCard
              label="Ditunda"
              value={stats.on_hold}
              color={statColors.onHold}
            />
          </View>
        </>
      ) : null}
    </View>
  );
}

function MiniDonutChart({ stats }: { stats: ProjectStatistics }) {
  const total = stats.total;
  if (total === 0)
    return (
      <Text style={donutStyles.centerLbl}>
        Belum ada proyek untuk diringkas.
      </Text>
    );

  const segments = [
    { value: stats.on_progress, color: colors.secondary, label: 'Berjalan' },
    { value: stats.done, color: '#2E7D32', label: 'Selesai' },
    { value: stats.pending, color: colors.primary, label: 'Menunggu' },
    { value: stats.on_hold, color: palette.grey, label: 'Ditunda' },
  ].filter(s => s.value > 0);

  const size = 110;
  const strokeWidth = 18;
  const innerSize = size - strokeWidth * 2;
  const ringRadius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * ringRadius;
  let offset = 0;

  return (
    <View style={donutStyles.wrapper}>
      <View style={[donutStyles.ringWrap, { width: size, height: size }]}>
        <Svg
          width={size}
          height={size}
          accessible
          accessibilityLabel={`${total} proyek: ${segments
            .map(segment => `${segment.label} ${segment.value}`)
            .join(', ')}`}
        >
          {segments.map(segment => {
            const length = (segment.value / total) * circumference;
            const startOffset = offset;
            offset += length;
            return (
              <Circle
                key={segment.label}
                cx={size / 2}
                cy={size / 2}
                r={ringRadius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={[length, circumference - length]}
                strokeDashoffset={-startOffset}
                rotation={-90}
                origin={`${size / 2}, ${size / 2}`}
              />
            );
          })}
        </Svg>
        <View
          style={[
            donutStyles.centerHole,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
            },
          ]}
        >
          <Text style={donutStyles.centerNum}>{total}</Text>
          <Text style={donutStyles.centerLbl}>Proyek</Text>
        </View>
      </View>

      <View style={donutStyles.legend}>
        {segments.map(seg => (
          <View key={seg.label} style={donutStyles.legendRow}>
            <View style={[donutStyles.dot, { backgroundColor: seg.color }]} />
            <Text style={donutStyles.legendLabel}>{seg.label}</Text>
            <Text style={[donutStyles.legendVal, { color: seg.color }]}>
              {seg.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: fontScale(typography.bodyLarge),
    fontWeight: '800',
    color: neutral[900],
    marginTop: scale(spacing.lg),
    marginBottom: scale(spacing.md),
  },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: scale(14),
    padding: scale(spacing.lg),
    marginBottom: scale(spacing.md),
    elevation: 2,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: scale(spacing.xs),
  },
  statGap: { width: scale(8) },
  loader: {
    marginVertical: scale(spacing.xl),
  },
});

const donutStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.sm,
  },
  ringWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerHole: {
    position: 'absolute',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerNum: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  centerLbl: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  legend: { flex: 1, gap: spacing.sm },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 9, height: 9, borderRadius: 5 },
  legendLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    flex: 1,
    fontWeight: '500',
  },
  legendVal: {
    fontSize: typography.body,
    fontWeight: '800',
    minWidth: 20,
    textAlign: 'right',
  },
});

export default ProjectSummary;
