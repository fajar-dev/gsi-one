
import {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    APP_ENV,
    API_BASE_URL_EMULATOR,
    API_BASE_URL_SIMULATOR,
    API_BASE_URL_PRODUCTION,
} from '@env';

const getApiBaseUrl = (): string => {
    const prodUrl = typeof API_BASE_URL_PRODUCTION !== 'undefined' ? API_BASE_URL_PRODUCTION : '';
    const simUrl = typeof API_BASE_URL_SIMULATOR !== 'undefined' ? API_BASE_URL_SIMULATOR : '';
    const emuUrl = typeof API_BASE_URL_EMULATOR !== 'undefined' ? API_BASE_URL_EMULATOR : '';
    const env = typeof APP_ENV !== 'undefined' ? APP_ENV : 'development';

    if (env === 'production') {
        return prodUrl || 'https://grahasurvei.com';
    }
    if (env === 'simulator') {
        return simUrl || 'http://localhost:3000';
    }
    return emuUrl || 'http://10.0.2.2:3000';
};

const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
    BOOKING_MODERN: `${API_BASE_URL}/api/booking`,

    LOGIN_MODERN: `${API_BASE_URL}/api/login`,

    REGISTER_MODERN: `${API_BASE_URL}/api/register`
};


export default API_BASE_URL;

export const SUPABASE_CONFIG = {
    URL: typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : '',
    ANON_KEY: typeof SUPABASE_ANON_KEY !== 'undefined' ? SUPABASE_ANON_KEY : '',
};

