import { useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { acceptRecoveryLink } from '../services/passwordRecoveryService';
import { supabase } from '../config/supabase';
import { useAuthStore, invalidateAuthInitialization } from '../store/authStore';
import { useAlertStore } from '../store/alertStore';
import { useProjectStore } from '../store/projectStore';
import { useNotificationStore } from '../store/notificationStore';
import { navigationRef } from '../navigation/navigationRef';

export function useAppSession(): void {
  const initialize = useAuthStore(state => state.initialize);
  const user = useAuthStore(state => state.user);
  const isPasswordRecovery = useAuthStore(state => state.isPasswordRecovery);
  useEffect(() => {
    let active = true;
    let deferredInitialization: ReturnType<typeof setTimeout> | undefined;
    const clearPrivateState = useAuthStore.subscribe((state, previous) => {
      if (state.user?.id !== previous.user?.id) {
        useAlertStore.getState().clear();
        useProjectStore.getState().resetForSession();
        useNotificationStore.getState().resetForSession();
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const state = useAuthStore.getState();
      // Our explicit logout owns cleanup and may be followed by a queued login.
      if (state.isLoggingOut) return;
      if (event === 'SIGNED_OUT') {
        clearTimeout(deferredInitialization);
        invalidateAuthInitialization();
        useAuthStore.setState({
          user: null,
          token: null,
          isPasswordRecovery: false,
          isInitialized: true,
          isLoading: false,
          isSendingPasswordReset: false,
        });
        AsyncStorage.removeItem('auth_user').catch(() => {});
        AsyncStorage.removeItem('auth_password_recovery').catch(() => {});
      } else if (session) {
        if (!state.isLoading && state.user?.id === session.user.id)
          useAuthStore.setState({ token: session.access_token });
        if (event === 'PASSWORD_RECOVERY') {
          AsyncStorage.setItem('auth_password_recovery', 'true').catch(
            () => {},
          );
          useAuthStore.setState({ isPasswordRecovery: true });
        }
        if (
          event === 'SIGNED_IN' &&
          state.isInitialized &&
          !state.isLoading &&
          useAuthStore.getState().user?.id !== session.user.id
        ) {
          clearTimeout(deferredInitialization);
          deferredInitialization = setTimeout(() => {
            const current = useAuthStore.getState();
            if (
              active &&
              !current.isLoading &&
              !current.isLoggingOut &&
              current.user?.id !== session.user.id
            )
              initialize();
          }, 0);
        }
      }
    });
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
      clearTimeout(deferredInitialization);
      subscription.unsubscribe();
      linking.remove();
      clearPrivateState();
    };
  }, [initialize]);

  useEffect(() => {
    if (isPasswordRecovery && navigationRef.isReady())
      navigationRef.navigate('ResetPassword');
  }, [isPasswordRecovery]);

  const userId = user?.id;
  const role = user?.role;
  useEffect(() => {
    if (!userId) return;
    const fetchNotifications = () =>
      useNotificationStore.getState().fetchNotifications(userId, role);
    fetchNotifications();
    const channel = supabase
      .channel(`user-notifications-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        fetchNotifications,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, role]);
}
