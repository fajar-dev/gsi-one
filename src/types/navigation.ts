import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp as BottomTabNavProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
    Home: undefined;
    Services: undefined;
    LayananKami: undefined;
    LayananDetail: { id: string };
    Partners: undefined;
    AboutUs: undefined;
    CompanyProfile: undefined;
    BookSurvey: undefined;
    SuccessScreen: { isAuthenticated?: boolean } | undefined;
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    ResetPassword: undefined;
    Welcome: undefined;
    ServiceNDT: undefined;
    ServiceLoadingTest: undefined;
    ServiceUnderwater: undefined;
    ServiceSHMS: undefined;
    StructureDetail: { id: string } | undefined;
    InsightDetail: { id: string };
    AuthenticatedTabs: undefined;
    ProjectDetail: { projectId: string; projectName: string };
    CreateProject: { initialProjectName?: string; initialClientName?: string; initialServiceType?: string; surveyBookingId?: number } | undefined;
    SurveyRequests: undefined;
    Notifications: undefined;
};


export type AuthenticatedTabParamList = {
    Dashboard: undefined;
    Projects: undefined;
    Profile: undefined;
};

export type BottomTabParamList = {
    HomeTab: undefined;
    AboutTab: undefined;
    CompanyTab: undefined;
    BookTab: undefined;
    LoginTab: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type RootBottomTabNavigationProp = BottomTabNavProp<BottomTabParamList>;
export type MainNavigationProp = CompositeNavigationProp<
    RootBottomTabNavigationProp,
    RootStackNavigationProp
>;

export type AuthenticatedNavigationProp = CompositeNavigationProp<
    BottomTabNavProp<AuthenticatedTabParamList>,
    NativeStackNavigationProp<RootStackParamList>
>;

export type StructureDetailRouteProp = RouteProp<RootStackParamList, 'StructureDetail'>;

export const ROUTES = {
    HOME: 'Home',
    SERVICES: 'Services',
    LAYANAN_KAMI: 'LayananKami',
    PARTNERS: 'Partners',
    ABOUT_US: 'AboutUs',
    COMPANY_PROFILE: 'CompanyProfile',
    BOOK_SURVEY: 'BookSurvey',
    SUCCESS_SCREEN: 'SuccessScreen',
    LOGIN: 'Login',
    REGISTER: 'Register',
    FORGOT_PASSWORD: 'ForgotPassword',
    WELCOME: 'Welcome',
    SERVICE_NDT: 'ServiceNDT',
    SERVICE_LOADING_TEST: 'ServiceLoadingTest',
    SERVICE_UNDERWATER: 'ServiceUnderwater',
    SERVICE_SHMS: 'ServiceSHMS',
    STRUCTURE_DETAIL: 'StructureDetail',
    INSIGHT_DETAIL: 'InsightDetail',
    AUTHENTICATED_TABS: 'AuthenticatedTabs',
    PROJECT_DETAIL: 'ProjectDetail',
    CREATE_PROJECT: 'CreateProject',
    SURVEY_REQUESTS: 'SurveyRequests',
    NOTIFICATIONS: 'Notifications',
} as const satisfies Record<string, keyof RootStackParamList>;


declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}