import React, { JSX, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { AppNotification } from '../../services/notificationService';
import { RootStackParamList } from '../../types/navigation';
import { colors, neutral } from '../../../assets/styles/Colors';
import { scale, fontScale } from '../../utils/responsive';

type NotificationNavProp = NativeStackNavigationProp<RootStackParamList>;

type FilterType = 'all' | 'unread';

function getNotificationIcon(type: string): { icon: string; color: string; bgColor: string } {
  switch (type) {
    case 'book_survey':
      return { icon: 'clipboard', color: '#2563EB', bgColor: '#EFF6FF' };
    case 'project_created':
      return { icon: 'folder-plus', color: '#059669', bgColor: '#ECFDF5' };
    case 'engineer_assigned':
      return { icon: 'user-check', color: '#0D9488', bgColor: '#F0FDFA' };
    case 'project_updated':
      return { icon: 'edit-3', color: '#D97706', bgColor: '#FFFBEB' };
    case 'stage_updated':
      return { icon: 'layers', color: '#7C3AED', bgColor: '#F5F3FF' };
    case 'file_uploaded':
      return { icon: 'paperclip', color: '#DB2777', bgColor: '#FDF2F8' };
    default:
      return { icon: 'bell', color: '#4B5563', bgColor: '#F3F4F6' };
  }
}

function formatTimeAgo(isoString: string): string {
  if (!isoString) return 'Baru saja';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} mnt lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hr lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  } catch {
    return 'Baru saja';
  }
}

function NotificationsScreen(): JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NotificationNavProp>();
  const { user } = useAuthStore();
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchNotifications(user.id, user.role);
      }
    }, [user, fetchNotifications])
  );

  const handleRefresh = async () => {
    if (!user) return;
    setRefreshing(true);
    await fetchNotifications(user.id, user.role);
    setRefreshing(false);
  };

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'unread') {
      return notifications.filter((item) => !item.is_read);
    }
    return notifications;
  }, [notifications, activeFilter]);

  const handleNotificationPress = async (item: AppNotification) => {
    if (!item.is_read) {
      await markAsRead(item.id);
    }

    if (item.reference_id) {
      if (item.type === 'book_survey') {
        navigation.navigate('SurveyRequests');
      } else {
        navigation.navigate('ProjectDetail', {
          projectId: item.reference_id,
          projectName: 'Detail Proyek',
        });
      }
    }
  };

  const renderItem = ({ item }: { item: AppNotification }) => {
    const { icon, color, bgColor } = getNotificationIcon(item.type);

    return (
      <TouchableOpacity
        style={[styles.card, !item.is_read && styles.unreadCard]}
        activeOpacity={0.8}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
          <Icon name={icon} size={scale(20)} color={color} />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, !item.is_read && styles.unreadText]} numberOfLines={1}>
              {item.title}
            </Text>
            {!item.is_read && <View style={styles.unreadBadgeDot} />}
          </View>
          <Text style={styles.cardMessage} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.cardTime}>{formatTimeAgo(item.created_at)}</Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.6}
          onPress={() => deleteNotification(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="trash-2" size={scale(16)} color={neutral[400]} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={scale(20)} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>Notifikasi</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {unreadCount > 0 ? (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={() => user && markAllAsRead(user.id, user.role)}
            activeOpacity={0.7}
          >
            <Text style={styles.markAllText}>Baca Semua</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: scale(70) }} />
        )}
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
          onPress={() => setActiveFilter('all')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'all' && styles.filterChipTextActive,
            ]}
          >
            Semua ({notifications.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'unread' && styles.filterChipActive]}
          onPress={() => setActiveFilter('unread')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'unread' && styles.filterChipTextActive,
            ]}
          >
            Belum Dibaca ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && notifications.length === 0 ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      ) : filteredNotifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Icon name="bell-off" size={scale(36)} color={neutral[400]} />
          </View>
          <Text style={styles.emptyTitle}>
            {activeFilter === 'unread'
              ? 'Tidak ada notifikasi belum dibaca'
              : 'Belum ada notifikasi'}
          </Text>
          <Text style={styles.emptySubtitle}>
            Pemberitahuan aktivitas proyek dan permohonan survey akan tampil di sini.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.secondary]}
              tintColor={colors.secondary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(14),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: scale(8),
    borderRadius: scale(20),
    backgroundColor: '#F1F5F9',
  },
  headerTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  headerTitle: {
    fontSize: fontScale(18),
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(10),
  },
  headerBadgeText: {
    color: colors.white,
    fontSize: fontScale(11),
    fontWeight: '800',
  },
  markAllButton: {
    paddingVertical: scale(6),
    paddingHorizontal: scale(10),
    borderRadius: scale(8),
    backgroundColor: '#EFF6FF',
  },
  markAllText: {
    color: colors.secondary,
    fontSize: fontScale(12),
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    gap: scale(10),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterChip: {
    paddingHorizontal: scale(14),
    paddingVertical: scale(7),
    borderRadius: scale(20),
    backgroundColor: '#F1F5F9',
  },
  filterChipActive: {
    backgroundColor: colors.secondary,
  },
  filterChipText: {
    fontSize: fontScale(12),
    fontWeight: '600',
    color: neutral[600],
  },
  filterChipTextActive: {
    color: colors.white,
  },
  listContent: {
    padding: scale(16),
    gap: scale(12),
  },
  card: {
    flexDirection: 'row',
    padding: scale(14),
    backgroundColor: colors.white,
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'flex-start',
  },
  unreadCard: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  iconContainer: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(4),
  },
  cardTitle: {
    fontSize: fontScale(14),
    fontWeight: '600',
    color: neutral[800],
    flex: 1,
    marginRight: scale(6),
  },
  unreadText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  unreadBadgeDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#2563EB',
  },
  cardMessage: {
    fontSize: fontScale(12),
    color: neutral[600],
    lineHeight: scale(17),
    marginBottom: scale(6),
  },
  cardTime: {
    fontSize: fontScale(10),
    fontWeight: '500',
    color: neutral[400],
  },
  deleteButton: {
    padding: scale(4),
    marginLeft: scale(6),
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(32),
  },
  emptyIconCircle: {
    width: scale(72),
    height: scale(72),
    borderRadius: scale(36),
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  emptyTitle: {
    fontSize: fontScale(15),
    fontWeight: '700',
    color: neutral[800],
    marginBottom: scale(6),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: fontScale(12),
    color: neutral[500],
    textAlign: 'center',
    lineHeight: scale(18),
  },
});

export default NotificationsScreen;
