import 'react-native-url-polyfill/auto';

// React Native's global URL declarations omit these WHATWG members.
export function parseUrl(value: string): {
  protocol: string;
  hostname: string;
  pathname: string;
  hash: string;
  search: string;
} {
  return new URL(value) as unknown as ReturnType<typeof parseUrl>;
}
export function parseUrlParams(value: string): {
  get: (key: string) => string | null;
} {
  return new URLSearchParams(value) as unknown as ReturnType<
    typeof parseUrlParams
  >;
}
