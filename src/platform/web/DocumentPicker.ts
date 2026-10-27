export const types = {
  allFiles: '*/*',
  images: 'image/*',
  plainText: 'text/plain',
  audio: 'audio/*',
  pdf: 'application/pdf',
  zip: 'application/zip',
  csv: 'text/csv',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
} as const;
export const errorCodes = {
  OPERATION_CANCELED: 'OPERATION_CANCELED',
  IN_PROGRESS: 'IN_PROGRESS',
  UNABLE_TO_OPEN_FILE_TYPE: 'UNABLE_TO_OPEN_FILE_TYPE',
} as const;
export function isErrorWithCode(
  error: unknown,
): error is Error & { code: string } {
  return (
    error instanceof Error && 'code' in error && typeof error.code === 'string'
  );
}
export interface PickResult {
  uri: string;
  name: string;
  size: number;
  type: string;
  isVirtual: false;
}
interface PickOptions {
  type?: string | readonly string[];
  allowMultiSelection?: boolean;
}
const canceled = () =>
  Object.assign(new Error('Pemilihan berkas dibatalkan.'), {
    code: errorCodes.OPERATION_CANCELED,
  });
export function pick(options: PickOptions = {}): Promise<PickResult[]> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(canceled());
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = Array.isArray(options.type)
      ? options.type.join(',')
      : (options.type as string | undefined) || types.allFiles;
    input.multiple = options.allowMultiSelection ?? false;
    input.onchange = () => {
      const files = Array.from(input.files ?? []);
      if (!files.length) {
        reject(canceled());
        return;
      }
      resolve(
        files.map(file => ({
          uri: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          type: file.type,
          isVirtual: false,
        })),
      );
    };
    input.oncancel = () => reject(canceled());
    input.click();
  });
}
export async function keepLocalCopy({
  files,
}: {
  files: Array<{ uri: string; fileName: string }>;
  destination?: string;
}) {
  return files.map(file => ({
    status: 'success' as const,
    localUri: file.uri,
  }));
}
export default { pick, keepLocalCopy, isErrorWithCode, errorCodes, types };
