import React, { JSX, useEffect } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, StyleSheet, Linking, Alert, Platform } from 'react-native';

import Home from './src/screens/Home';
import Partners from './src/screens/Partners';
import AboutUs from './src/screens/AboutUs';
import BookSurvey from './src/screens/BookSurvey';
import SuccessScreen from './src/screens/BookSurvey/SuccessScreen';
import Login from './src/screens/Login';
import ResetPasswordScreen from './src/screens/Login/ResetPasswordScreen';
import { acceptRecoveryLink } from './src/services/passwordRecoveryService';
import { supabase } from './src/config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from './src/types/navigation';
import { useProjectStore } from './src/store/projectStore';
import { useNotificationStore } from './src/store/notificationStore';
import Register from './src/screens/Login/RegisterScreen';
import ForgotPassword from './src/screens/Login/ForgotPasswordScreen';
import ServicesScreen from './src/screens/Services';
import LayananKamiScreen from './src/screens/Services/LayananKamiScreen';
import LayananDetailScreen from './src/screens/Services/LayananDetailScreen';
import ServiceNDT from './src/screens/Services/ServiceNDT';
import ServiceLoadingTest from './src/screens/Services/ServiceLoadingTest';
import ServiceUnderwater from './src/screens/Services/ServiceUnderwater';
import ServiceSHMS from './src/screens/Services/ServiceSHMS';
import StructureDetail from './src/screens/Structures/StructureDetail';
import InsightDetail from './src/screens/Insight/InsightDetailScreen';

import AuthenticatedTabs from './src/navigation/AuthenticatedTabs';
import ProjectDetailScreen from './src/screens/Projects/ProjectDetailScreen';
import CreateProjectScreen from './src/screens/Projects/CreateProjectScreen';
import SurveyRequestsScreen from './src/screens/BookSurvey/SurveyRequestsScreen';
import NotificationsScreen from './src/screens/Notifications/NotificationsScreen';


import { useAuthStore, invalidateAuthInitialization } from './src/store/authStore';

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

function App(): JSX.Element {
  const { initialize, isInitialized, user, isPasswordRecovery } = useAuthStore();

  useEffect(() => {
    const clearPrivateState = useAuthStore.subscribe((state, previous) => {
      if (state.user?.id !== previous.user?.id) {
        const store = useProjectStore.getState();
        useProjectStore.setState({ projects: [], selectedProject: null, stats: null, error: null,
          isLoading: false, isLoadingDetail: false, detailRequestId: store.detailRequestId + 1 });
        useNotificationStore.setState({ notifications: [], unreadCount: 0, isLoading: false, ownerId: null, error: null });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        invalidateAuthInitialization();
        useAuthStore.setState({ user: null, token: null, isPasswordRecovery: false, isInitialized: true });
        AsyncStorage.removeItem('auth_user').catch(() => {});
        AsyncStorage.removeItem('auth_password_recovery').catch(() => {});
      } else if (session) {
        useAuthStore.setState({ token: session.access_token });
        if (event === 'PASSWORD_RECOVERY') {
          AsyncStorage.setItem('auth_password_recovery', 'true').catch(() => {});
          useAuthStore.setState({ isPasswordRecovery: true });
        }
        if (event === 'SIGNED_IN' && useAuthStore.getState().user?.id !== session.user.id) {
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
          const web = globalThis as unknown as { location?: { pathname: string }; history?: { replaceState: (data: null, title: string, url: string) => void } };
          if (Platform.OS === 'web' && web.location) web.history?.replaceState(null, '', web.location.pathname);
          if (navigationRef.isReady()) navigationRef.navigate('ResetPassword');
        }
      } catch (err) {
        if (active) Alert.alert('Reset Kata Sandi', err instanceof Error ? err.message : 'Tautan tidak valid.');
      }
    };
    const linking = Linking.addEventListener('url', ({ url }) => { handleUrl(url); });
    const webLocation = (globalThis as unknown as { location?: { href: string } }).location;
    if (Platform.OS === 'web' && webLocation) {
      handleUrl(webLocation.href);
    } else {
      Linking.getInitialURL().then(url => { if (url) handleUrl(url); }).catch(() => {});
    }
    initialize();
    return () => { active = false; subscription.unsubscribe(); linking.remove(); clearPrivateState(); };
  }, [initialize]);

  useEffect(() => {
    if (isPasswordRecovery && navigationRef.isReady()) navigationRef.navigate('ResetPassword');
  }, [isPasswordRecovery]);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = () => useNotificationStore.getState().fetchNotifications(user.id, user.role);
    fetchNotifications();
    const channel = supabase.channel(`user-notifications-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, fetchNotifications)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1565C0" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} onReady={() => {
        if (useAuthStore.getState().isPasswordRecovery) navigationRef.navigate('ResetPassword');
      }}>
        <Stack.Navigator
          initialRouteName={isPasswordRecovery ? 'ResetPassword' : user ? 'AuthenticatedTabs' : 'Home'}
          screenOptions={{ headerShown: false }}>

          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Services" component={ServicesScreen} />
          <Stack.Screen name="LayananKami" component={LayananKamiScreen} />
          <Stack.Screen name="LayananDetail" component={LayananDetailScreen} />
          <Stack.Screen name="Partners" component={Partners} />
          <Stack.Screen name="AboutUs" component={AboutUs} />
          <Stack.Screen name="BookSurvey" component={BookSurvey} />
          <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="ServiceNDT" component={ServiceNDT} />
          <Stack.Screen name="ServiceLoadingTest" component={ServiceLoadingTest} />
          <Stack.Screen name="ServiceUnderwater" component={ServiceUnderwater} />
          <Stack.Screen name="ServiceSHMS" component={ServiceSHMS} />
          <Stack.Screen name="StructureDetail" component={StructureDetail} />
          <Stack.Screen name="InsightDetail" component={InsightDetail} />

          <Stack.Screen name="AuthenticatedTabs" component={AuthenticatedTabs} />
          <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
          <Stack.Screen name="CreateProject" component={CreateProjectScreen} />
          <Stack.Screen name="SurveyRequests" component={SurveyRequestsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />


        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
});

export default App;
