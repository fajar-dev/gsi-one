import { createFetchWithTimeout } from '../../src/utils/fetchWithTimeout';
import { deferred } from '../../test/helpers/deferred';
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());
it('ends a hanging request even when the transport ignores abort, then permits retry', async () => {
  const pending = deferred<Response>();
  const response = { ok: true } as Response;
  const fetcher = jest
    .fn()
    .mockReturnValueOnce(pending.promise)
    .mockResolvedValueOnce(response);
  const request = createFetchWithTimeout(fetcher, 100);
  const first = request('https://example.com/data');
  const failure = first.catch((error: unknown) => error);
  jest.advanceTimersByTime(100);
  expect(await failure).toMatchObject({
    name: 'TimeoutError',
    message: expect.stringContaining('Periksa koneksi'),
  });
  expect(fetcher.mock.calls[0][1].signal.aborted).toBe(true);
  await expect(request('https://example.com/data')).resolves.toBe(response);
  pending.resolve(response);
  expect(jest.getTimerCount()).toBe(0);
});
it('preserves cancellation from a caller and clears the deadline', async () => {
  const fetcher = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>(
    () => new Promise<Response>(() => {}),
  );
  const controller = new AbortController();
  const request = createFetchWithTimeout(fetcher, 100);
  const pending = request('https://example.com/data', {
    signal: controller.signal,
  });
  controller.abort();
  await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
  expect(fetcher.mock.calls[0]?.[1]?.signal?.aborted).toBe(true);
  expect(jest.getTimerCount()).toBe(0);
});
it('does not send an already cancelled request', async () => {
  const controller = new AbortController();
  controller.abort();
  const fetcher = jest.fn();
  await expect(
    createFetchWithTimeout(fetcher)('https://example.com', {
      signal: controller.signal,
    }),
  ).rejects.toMatchObject({ name: 'AbortError' });
  expect(fetcher).not.toHaveBeenCalled();
});
it('bounds signed-URL creation like a normal request rather than an upload', async () => {
  const fetcher = jest.fn(() => new Promise<Response>(() => {}));
  const failure = createFetchWithTimeout(fetcher, 100)(
    'https://example.com/storage/v1/object/sign/projects/file.png',
    { method: 'POST' },
  ).catch((error: unknown) => error);
  jest.advanceTimersByTime(100);
  expect(await failure).toMatchObject({ name: 'TimeoutError' });
});
it('allows longer uploads while still terminating a stalled upload', async () => {
  const fetcher = jest.fn(() => new Promise<Response>(() => {}));
  let finished = false;
  const failure = createFetchWithTimeout(fetcher)(
    'https://example.com/storage/v1/object/projects/file.png',
    { method: 'POST' },
  ).catch((error: unknown) => {
    finished = true;
    return error;
  });
  jest.advanceTimersByTime(15_000);
  await Promise.resolve();
  expect(finished).toBe(false);
  jest.advanceTimersByTime(45_000);
  expect(await failure).toMatchObject({ name: 'TimeoutError' });
});
