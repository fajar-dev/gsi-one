/** Browser object URLs live until their selected file is replaced or the modal closes. */
export function releaseObjectUrl(uri?: string): void {
  if (uri?.startsWith('blob:') && typeof URL.revokeObjectURL === 'function')
    URL.revokeObjectURL(uri);
}
