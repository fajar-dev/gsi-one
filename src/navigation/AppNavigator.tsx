import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { navigationRef } from './navigationRef';
import Home from '../screens/Home';
import Partners from '../screens/Partners';
import AboutUs from '../screens/AboutUs';
import BookSurvey from '../screens/BookSurvey';
import SuccessScreen from '../screens/BookSurvey/SuccessScreen';
import Login from '../screens/Login';
import ResetPasswordScreen from '../screens/Login/ResetPasswordScreen';
import { RootStackParamList } from '../types/navigation';
import ForgotPassword from '../screens/Login/ForgotPasswordScreen';
import ServicesScreen from '../screens/Services';
import LayananKamiScreen from '../screens/Services/LayananKamiScreen';
import LayananDetailScreen from '../screens/Services/LayananDetailScreen';
import ServiceNDT from '../screens/Services/ServiceNDT';
import ServiceLoadingTest from '../screens/Services/ServiceLoadingTest';
import ServiceUnderwater from '../screens/Services/ServiceUnderwater';
import ServiceSHMS from '../screens/Services/ServiceSHMS';
import StructureDetail from '../screens/Structures/StructureDetail';
import InsightDetail from '../screens/Insight/InsightDetailScreen';
import AuthenticatedTabs from '../navigation/AuthenticatedTabs';
import ProjectDetailScreen from '../screens/Projects/ProjectDetailScreen';
import CreateProjectScreen from '../screens/Projects/CreateProjectScreen';
import SurveyRequestsScreen from '../screens/BookSurvey/SurveyRequestsScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();
export function AppNavigator(): React.ReactElement {
  const user = useAuthStore(state => state.user);
  const isPasswordRecovery = useAuthStore(state => state.isPasswordRecovery);
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        if (useAuthStore.getState().isPasswordRecovery)
          navigationRef.navigate('ResetPassword');
      }}
    >
      <Stack.Navigator
        initialRouteName={
          isPasswordRecovery
            ? 'ResetPassword'
            : user
            ? 'AuthenticatedTabs'
            : 'Home'
        }
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Services" component={ServicesScreen} />
        <Stack.Screen name="LayananKami" component={LayananKamiScreen} />
        <Stack.Screen name="LayananDetail" component={LayananDetailScreen} />
        <Stack.Screen name="Partners" component={Partners} />
        <Stack.Screen name="AboutUs" component={AboutUs} />
        <Stack.Screen name="BookSurvey" component={BookSurvey} />
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="ServiceNDT" component={ServiceNDT} />
        <Stack.Screen
          name="ServiceLoadingTest"
          component={ServiceLoadingTest}
        />
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
  );
}
