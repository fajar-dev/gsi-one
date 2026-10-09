import React, { JSX } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, neutral } from '../../../../assets/styles/Colors';
import { scale, fontScale } from '../../../utils/responsive';
import StatCard from './StatCard';

interface DashboardStats {
  total: number;
  on_progress: number;
  done: number;
  pending: number;
  on_hold: number;
}

interface ProjectSummaryProps {
  stats: DashboardStats | null;
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
  onHold: '#9E9E9E',
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
          {}
          <View style={styles.chartCard}>
            <MiniDonutChart stats={stats} />
          </View>

          {}
          <View style={styles.statsRow}>
            <StatCard label="Berjalan" value={stats.on_progress} color={statColors.onProgress} />
            <View style={styles.statGap} />
            <StatCard label="Selesai" value={stats.done} color={statColors.done} />
            <View style={styles.statGap} />
            <StatCard label="Menunggu" value={stats.pending} color={statColors.pending} />
            <View style={styles.statGap} />
            <StatCard label="Ditunda" value={stats.on_hold} color={statColors.onHold} />
          </View>
        </>
      ) : null}
    </View>
  );
}

function MiniDonutChart({ stats }: { stats: DashboardStats }) {
  const total = stats.total;
  if (total === 0) return null;

  const segments = [
    { value: stats.on_progress, color: colors.secondary, label: 'Berjalan' },
    { value: stats.done, color: '#2E7D32', label: 'Selesai' },
    { value: stats.pending, color: colors.primary, label: 'Menunggu' },
    { value: stats.on_hold, color: '#9E9E9E', label: 'Ditunda' },
  ].filter(s => s.value > 0);

  const size = 110;
  const strokeWidth = 18;
  const innerSize = size - strokeWidth * 2;

  return (
    <View style={donutStyles.wrapper}>
      <View style={[donutStyles.ringWrap, { width: size, height: size }]}>
        {segments.map((seg, idx) => {
          const pct = seg.value / total;
          const deg = pct * 360;
          const right = deg >= 90 ? seg.color : 'transparent';
          const bottom = deg >= 180 ? seg.color : 'transparent';
          const left = deg >= 270 ? seg.color : 'transparent';
          return (
            <View
              key={idx}
              style={[
                donutStyles.arcBorder,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  borderWidth: strokeWidth,
                  borderTopColor: seg.color,
                  borderRightColor: right,
                  borderBottomColor: bottom,
                  borderLeftColor: left,
                },
              ]}
            />
          );
        })}
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
        {segments.map((seg, idx) => (
          <View key={idx} style={donutStyles.legendRow}>
            <View style={[donutStyles.dot, { backgroundColor: seg.color }]} />
            <Text style={donutStyles.legendLabel}>{seg.label}</Text>
            <Text style={[donutStyles.legendVal, { color: seg.color }]}>{seg.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: fontScale(16),
    fontWeight: '800',
    color: neutral[900],
    marginTop: scale(16),
    marginBottom: scale(12),
  },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: scale(14),
    padding: scale(16),
    marginBottom: scale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: scale(4),
  },
  statGap: { width: scale(8) },
  loader: {
    marginVertical: scale(20),
  },
});

const donutStyles = StyleSheet.create({
  wrapper: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 8 },
  ringWrap: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  arcBorder: { position: 'absolute' },
  centerHole: {
    position: 'absolute',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerNum: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  centerLbl: { fontSize: 10, color: colors.textSecondary, fontWeight: '600', marginTop: 2 },
  legend: { flex: 1, gap: 8 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  legendLabel: { fontSize: 12, color: colors.textSecondary, flex: 1, fontWeight: '500' },
  legendVal: { fontSize: 14, fontWeight: '800', minWidth: 20, textAlign: 'right' },
});

export default ProjectSummary;
