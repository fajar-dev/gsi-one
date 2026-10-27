import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp as BottomTabNavProp } from '@react-navigation/bottom-tabs';
import type {
  CompositeNavigationProp,
  RouteProp,
  NavigatorScreenParams,
} from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Services: undefined;
  LayananKami: undefined;
  LayananDetail: { id: string };
  Partners: undefined;
  AboutUs: undefined;
  BookSurvey: undefined;
  SuccessScreen: { isAuthenticated?: boolean } | undefined;
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  ServiceNDT: undefined;
  ServiceLoadingTest: undefined;
  ServiceUnderwater: undefined;
  ServiceSHMS: undefined;
  StructureDetail: { id: string } | undefined;
  InsightDetail: { id: string };
  AuthenticatedTabs:
    | NavigatorScreenParams<AuthenticatedTabParamList>
    | undefined;
  ProjectDetail: { projectId: string; projectName: string };
  CreateProject:
    | {
        initialProjectName?: string;
        initialClientName?: string;
        initialServiceType?: string;
        surveyBookingId?: number;
      }
    | undefined;
  SurveyRequests: undefined;
  Notifications: undefined;
};

export type AuthenticatedTabParamList = {
  Dashboard: undefined;
  Projects: undefined;
  Profile: undefined;
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export type AuthenticatedNavigationProp = CompositeNavigationProp<
  BottomTabNavProp<AuthenticatedTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type StructureDetailRouteProp = RouteProp<
  RootStackParamList,
  'StructureDetail'
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
