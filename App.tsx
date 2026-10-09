import React, { JSX, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import Home from './src/screens/Home';
import Partners from './src/screens/Partners';
import AboutUs from './src/screens/AboutUs';
import BookSurvey from './src/screens/BookSurvey';
import SuccessScreen from './src/screens/BookSurvey/SuccessScreen';
import Login from './src/screens/Login';
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


import { useAuthStore } from './src/store/authStore';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const { initialize, isInitialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1565C0" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
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
