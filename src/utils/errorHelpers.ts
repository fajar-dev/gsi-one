export function getErrorMessage(error: unknown, fallback: string = 'Terjadi kesalahan tidak terduga'): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return fallback;
}
