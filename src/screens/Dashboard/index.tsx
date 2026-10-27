import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { useAuthStore } from '../../store/authStore';
import AdminDashboard from './AdminDashboard';
import MarketingDashboard from './MarketingDashboard';
import EngineerDashboard from './EngineerDashboard';
import ClientDashboard from './ClientDashboard';

function DashboardScreen(): React.ReactElement {
  const { user, isLoading } = useAuthStore();

  if (isLoading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.secondary || '#0B7552'} />
      </View>
    );
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'marketing':
      return <MarketingDashboard />;
    case 'engineer':
      return <EngineerDashboard />;
    case 'client':
    default:
      return <ClientDashboard />;
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
});

export default DashboardScreen;
