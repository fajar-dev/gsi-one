import { useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { acceptRecoveryLink } from '../services/passwordRecoveryService';
import { supabase } from '../config/supabase';
import { useAuthStore, invalidateAuthInitialization } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';
import { useNotificationStore } from '../store/notificationStore';
import { navigationRef } from '../navigation/navigationRef';

export function useAppSession(): void {
  const initialize = useAuthStore(state => state.initialize);
  const user = useAuthStore(state => state.user);
  const isPasswordRecovery = useAuthStore(state => state.isPasswordRecovery);
  useEffect(() => {
    const clearPrivateState = useAuthStore.subscribe((state, previous) => {
      if (state.user?.id !== previous.user?.id) {
        useProjectStore.getState().resetForSession();
        useNotificationStore.getState().resetForSession();
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        invalidateAuthInitialization();
        useAuthStore.setState({
          user: null,
          token: null,
          isPasswordRecovery: false,
          isInitialized: true,
        });
        AsyncStorage.removeItem('auth_user').catch(() => {});
        AsyncStorage.removeItem('auth_password_recovery').catch(() => {});
      } else if (session) {
        useAuthStore.setState({ token: session.access_token });
        if (event === 'PASSWORD_RECOVERY') {
          AsyncStorage.setItem('auth_password_recovery', 'true').catch(
            () => {},
          );
          useAuthStore.setState({ isPasswordRecovery: true });
        }
        if (
          event === 'SIGNED_IN' &&
          useAuthStore.getState().user?.id !== session.user.id
        ) {
          setTimeout(() => initialize(), 0);
        }
      }
    });
    let active = true;
    const handleUrl = async (url: string) => {
      try {
        if (await acceptRecoveryLink(url)) {
          await AsyncStorage.setItem('auth_password_recovery', 'true');
          if (!active) return;
          useAuthStore.setState({ isPasswordRecovery: true });
          const web = globalThis as unknown as {
            location?: { pathname: string };
            history?: {
              replaceState: (data: null, title: string, url: string) => void;
            };
          };
          if (Platform.OS === 'web' && web.location)
            web.history?.replaceState(null, '', web.location.pathname);
          if (navigationRef.isReady()) navigationRef.navigate('ResetPassword');
        }
      } catch (err) {
        if (active)
          Alert.alert(
            'Reset Kata Sandi',
            err instanceof Error ? err.message : 'Tautan tidak valid.',
          );
      }
    };
    const linking = Linking.addEventListener('url', ({ url }) => {
      handleUrl(url);
    });
    const webLocation = (
      globalThis as unknown as { location?: { href: string } }
    ).location;
    if (Platform.OS === 'web' && webLocation) {
      handleUrl(webLocation.href);
    } else {
      Linking.getInitialURL()
        .then(url => {
          if (url) handleUrl(url);
        })
        .catch(() => {});
    }
    initialize();
    return () => {
      active = false;
      subscription.unsubscribe();
      linking.remove();
      clearPrivateState();
    };
  }, [initialize]);

  useEffect(() => {
    if (isPasswordRecovery && navigationRef.isReady())
      navigationRef.navigate('ResetPassword');
  }, [isPasswordRecovery]);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = () =>
      useNotificationStore.getState().fetchNotifications(user.id, user.role);
    fetchNotifications();
    const channel = supabase
      .channel(`user-notifications-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        fetchNotifications,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
}
