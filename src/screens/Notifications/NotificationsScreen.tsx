import { ActionButton } from '../../components/ui/ActionButton';
import { styles } from './NotificationsScreen.styles';

import { JSX, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
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
import type { AppNotification } from '../../domain/models/notification';
import { RootStackParamList } from '../../types/navigation';
import { colors, neutral } from '../../theme/colors';
import { scale } from '../../utils/responsive';

type NotificationNavProp = NativeStackNavigationProp<RootStackParamList>;

type FilterType = 'all' | 'unread';

function getNotificationIcon(type: string): {
  icon: string;
  color: string;
  bgColor: string;
} {
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
    error,
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
    }, [user, fetchNotifications]),
  );

  const handleRefresh = async () => {
    if (!user) return;
    setRefreshing(true);
    await fetchNotifications(user.id, user.role);
    setRefreshing(false);
  };

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'unread') {
      return notifications.filter(item => !item.is_read);
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
      <ActionButton
        style={[styles.card, !item.is_read && styles.unreadCard]}
        activeOpacity={0.8}
        onPress={() => handleNotificationPress(item)}
        accessibilityRole="button"
      >
        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
          <Icon name={icon} size={scale(20)} color={color} />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text
              style={[styles.cardTitle, !item.is_read && styles.unreadText]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {!item.is_read && <View style={styles.unreadBadgeDot} />}
          </View>
          <Text style={styles.cardMessage} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.cardTime}>{formatTimeAgo(item.created_at)}</Text>
        </View>

        <ActionButton
          style={styles.deleteButton}
          activeOpacity={0.6}
          onPress={() => deleteNotification(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Hapus"
        >
          <Icon name="trash-2" size={scale(16)} color={neutral[400]} />
        </ActionButton>
      </ActionButton>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ActionButton
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
        >
          <Icon name="arrow-left" size={scale(20)} color={colors.textPrimary} />
        </ActionButton>

        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>Notifikasi</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {unreadCount > 0 ? (
          <ActionButton
            compact
            style={styles.markAllButton}
            onPress={() => user && markAllAsRead(user.id, user.role)}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <Text style={styles.markAllText}>Baca Semua</Text>
          </ActionButton>
        ) : (
          <View style={{ width: scale(70) }} />
        )}
      </View>

      <View style={styles.filterRow}>
        <ActionButton
          compact
          style={[
            styles.filterChip,
            activeFilter === 'all' && styles.filterChipActive,
          ]}
          onPress={() => setActiveFilter('all')}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'all' && styles.filterChipTextActive,
            ]}
          >
            Semua ({notifications.length})
          </Text>
        </ActionButton>

        <ActionButton
          compact
          style={[
            styles.filterChip,
            activeFilter === 'unread' && styles.filterChipActive,
          ]}
          onPress={() => setActiveFilter('unread')}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'unread' && styles.filterChipTextActive,
            ]}
          >
            Belum Dibaca ({unreadCount})
          </Text>
        </ActionButton>
      </View>

      {!!error && (
        <ActionButton
          onPress={handleRefresh}
          style={styles.emptyContainer}
          accessibilityRole="button"
        >
          <Text style={styles.emptyTitle}>Notifikasi belum dimuat</Text>
          <Text style={styles.emptySubtitle}>
            {error} Ketuk untuk mencoba lagi.
          </Text>
        </ActionButton>
      )}
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
            Pemberitahuan aktivitas proyek dan permohonan survey akan tampil di
            sini.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={item => item.id}
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

export default NotificationsScreen;
