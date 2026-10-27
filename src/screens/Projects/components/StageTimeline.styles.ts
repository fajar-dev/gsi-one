import {
  touchTarget,
  spacing,
  radius,
  typography,
} from '../../../theme/tokens';
import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
export const styles = StyleSheet.create({
  container: { paddingVertical: spacing.sm },
  stageRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  lineCol: {
    width: 28,
    paddingTop: 10,
    alignItems: 'center',
  },
  node: {
    width: 24,
    height: 24,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    zIndex: 1,
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  connector: {
    width: 2,
    flex: 1,
    minHeight: 20,
    marginVertical: 2,
  },
  stageContent: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: spacing.md,
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  stageTitleRow: {
    flexDirection: 'row',
    flex: 1,
    marginRight: spacing.sm,
  },
  seqText: {
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.textSecondary,
    marginRight: spacing.xs,
    minWidth: 18,
  },
  stageTitle: {
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expandedContent: {
    marginTop: spacing.sm,
    paddingLeft: spacing.xs,
  },
  stageDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionBtn: {
    alignItems: 'center',
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  actionBtnSecondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionBtnText: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  actionBtnSecondaryText: {
    color: colors.primary,
  },
  updatesSection: { marginBottom: spacing.md },
  filesSection: { marginBottom: spacing.xs },
  sectionLabel: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  updateItem: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.sm,
    padding: 10,
    marginBottom: 6,
  },
  updateItemProgress: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  updateHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  updateTypeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
  },
  updateTypeText: {
    fontSize: typography.caption,
    fontWeight: '700',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.primary,
    minWidth: 32,
  },
  updateDesc: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 19,
  },
  updateDate: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  emptyNote: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
