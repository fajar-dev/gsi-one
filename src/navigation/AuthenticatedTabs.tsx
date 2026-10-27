import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AuthenticatedTabParamList,
  RootStackParamList,
} from '../types/navigation';
import { colors } from '../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';

import DashboardScreen from '../screens/Dashboard';
import ProjectListScreen from '../screens/Projects/ProjectListScreen';
import ProfileScreen from '../screens/Profile';

const Tab = createBottomTabNavigator<AuthenticatedTabParamList>();

import Icon from 'react-native-vector-icons/Feather';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Dashboard: 'grid',
    Projects: 'briefcase',
    Profile: 'user',
  };
  const iconName = icons[label] || 'help-circle';
  return (
    <View style={styles.iconWrapper}>
      <Icon
        name={iconName}
        size={22}
        color={focused ? colors.secondary : colors.grey}
      />
    </View>
  );
}

const DashboardIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon label="Dashboard" focused={focused} />
);
const ProjectsIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon label="Projects" focused={focused} />
);
const ProfileIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon label="Profile" focused={focused} />
);

function AuthenticatedTabs(): React.ReactElement {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, isInitialized } = useAuthStore();

  useEffect(() => {
    if (isInitialized && !user) {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  }, [isInitialized, navigation, user]);

  if (!user) return <View />;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 72 + insets.bottom,
            paddingBottom: Math.max(insets.bottom, 8),
          },
        ],
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.grey,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIconStyle: styles.tabIcon,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Beranda',
          tabBarIcon: DashboardIcon,
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectListScreen}
        options={{
          tabBarLabel: 'Proyek',
          tabBarIcon: ProjectsIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    height: 72,
    paddingBottom: 8,
    paddingTop: 6,
    elevation: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabIcon: { width: 24, height: 24 },
  tabLabel: {
    fontSize: 12,
    lineHeight: 16,
    flexShrink: 0,
    fontWeight: '600',
    marginTop: 2,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AuthenticatedTabs;
