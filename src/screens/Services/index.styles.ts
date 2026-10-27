import {
  buttonMetrics,
  palette,
  touchTarget,
  spacing,
  typography,
  radius,
} from '../../theme/tokens';
import { StyleSheet } from 'react-native';
import { scale, fontScale } from '../../utils/responsive';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8F7',
  },
  scrollContent: {
    paddingBottom: scale(28),
  },
  bannerContainer: {
    backgroundColor: '#062A3F',
    paddingHorizontal: scale(spacing.lg),
    paddingBottom: scale(spacing.xl),
    borderBottomLeftRadius: scale(24),
    borderBottomRightRadius: scale(24),
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(14),
  },
  backButton: {
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    width: touchTarget.minSize,
    height: touchTarget.minSize,
    borderRadius: scale(18),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: fontScale(17),
    fontWeight: 'bold',
    color: palette.white,
    textAlign: 'center',
    flex: 1,
  },
  headerPlaceholder: {
    width: scale(36),
  },
  bannerSubtitle: {
    fontSize: fontScale(typography.caption),
    color: '#94A3B8',
    lineHeight: scale(17),
    marginBottom: scale(14),
  },

  listContainer: {
    paddingHorizontal: scale(spacing.lg),
    marginTop: scale(spacing.lg),
  },

  serviceCard: {
    height: scale(170),
    borderRadius: scale(18),
    overflow: 'hidden',
    marginBottom: scale(14),
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImageBg: {
    flex: 1,
    justifyContent: 'space-between',
    padding: scale(14),
  },
  cardImageStyle: {
    borderRadius: scale(18),
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 42, 63, 0.60)',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeContainer: {
    backgroundColor: 'rgba(11, 117, 82, 0.9)',
    paddingHorizontal: scale(10),
    paddingVertical: scale(spacing.xs),
    borderRadius: scale(radius.sm),
  },
  badgeText: {
    fontSize: fontScale(typography.caption),
    color: palette.white,
    fontWeight: 'bold',
  },
  iconCircle: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(radius.lg),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    marginTop: 'auto',
  },
  cardTitle: {
    fontSize: fontScale(typography.bodyLarge),
    fontWeight: 'bold',
    color: palette.white,
    marginBottom: scale(spacing.xs),
  },
  cardDesc: {
    fontSize: fontScale(typography.caption),
    color: '#E2E8F0',
    lineHeight: scale(16),
    marginBottom: scale(spacing.sm),
  },

  ctaCard: {
    backgroundColor: '#0B7552',
    marginHorizontal: scale(spacing.lg),
    marginTop: scale(spacing.sm),
    borderRadius: scale(18),
    padding: scale(18),
  },
  ctaTextContainer: {
    marginBottom: scale(spacing.md),
  },
  ctaTitle: {
    fontSize: fontScale(typography.bodyLarge),
    fontWeight: 'bold',
    color: palette.white,
    marginBottom: scale(spacing.xs),
  },
  ctaDesc: {
    fontSize: fontScale(typography.caption),
    color: '#E6F4EA',
    lineHeight: scale(17),
  },
  ctaButton: {
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    backgroundColor: '#062A3F',
    borderRadius: scale(10),
    paddingVertical: buttonMetrics.paddingVertical,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButtonText: {
    color: palette.white,
    fontWeight: 'bold',
    fontSize: fontScale(13),
  },
});
