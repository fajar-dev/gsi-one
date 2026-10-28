const REQUEST_TIMEOUT_MS = 15_000;
const UPLOAD_TIMEOUT_MS = 60_000;

/** Bound transport waits and preserve cancellation from the original caller. */
export function createFetchWithTimeout(
  fetcher: typeof fetch,
  timeoutMs = REQUEST_TIMEOUT_MS,
): typeof fetch {
  return async (input, init) => {
    const request =
      typeof Request !== 'undefined' && input instanceof Request
        ? input
        : undefined;
    const signal = init?.signal ?? request?.signal;
    const aborted = () => {
      const error = new Error('Permintaan dibatalkan.');
      error.name = 'AbortError';
      return error;
    };
    if (signal?.aborted) throw aborted();
    const controller = new AbortController();
    const url =
      typeof input === 'string' ? input : request?.url ?? String(input);
    const method = (init?.method ?? request?.method ?? 'GET').toUpperCase();
    const storageAction = url.match(/\/storage\/v1\/object\/([^/?]+)/)?.[1];
    const upload =
      !!storageAction &&
      !['sign', 'list', 'info', 'move', 'copy'].includes(storageAction) &&
      ['POST', 'PUT'].includes(method);
    let timer: ReturnType<typeof setTimeout> | undefined;
    let onAbort: (() => void) | undefined;
    const deadline = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => {
          const error = new Error(
            'Permintaan terlalu lama. Periksa koneksi lalu coba lagi.',
          );
          error.name = 'TimeoutError';
          reject(error);
          controller.abort();
        },
        upload ? Math.max(timeoutMs, UPLOAD_TIMEOUT_MS) : timeoutMs,
      );
      onAbort = () => {
        reject(aborted());
        controller.abort();
      };
      signal?.addEventListener('abort', onAbort, { once: true });
    });
    try {
      return await Promise.race([
        fetcher(input, { ...init, signal: controller.signal }),
        deadline,
      ]);
    } finally {
      clearTimeout(timer);
      if (onAbort) signal?.removeEventListener('abort', onAbort);
    }
  };
}
