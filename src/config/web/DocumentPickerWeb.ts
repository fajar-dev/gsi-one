
declare const document: any;

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
};

export const errorCodes = {
  OPERATION_CANCELED: 'OPERATION_CANCELED',
  IN_PROGRESS: 'IN_PROGRESS',
  UNABLE_TO_OPEN_FILE_TYPE: 'UNABLE_TO_OPEN_FILE_TYPE',
};

export const isErrorWithCode = (error: any): boolean => {
  return Boolean(error && typeof error.code === 'string');
};

export interface PickResult {
  uri: string;
  name: string;
  size?: number;
  type?: string;
  isVirtual?: boolean;
  convertibleToMimeTypes?: string[];
}

export const pick = async (_options?: any): Promise<PickResult[]> => {
  return new Promise<PickResult[]>((resolve, reject) => {
    if (typeof document === 'undefined') {
      const err = new Error('User canceled document picker');
      (err as any).code = errorCodes.OPERATION_CANCELED;
      return reject(err);
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';

    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) {
        const err = new Error('User canceled document picker');
        (err as any).code = errorCodes.OPERATION_CANCELED;
        return reject(err);
      }

      const uri = URL.createObjectURL(file);
      resolve([
        {
          uri,
          name: file.name,
          size: file.size,
          type: file.type,
        },
      ]);
    };

    input.oncancel = () => {
      const err = new Error('User canceled document picker');
      (err as any).code = errorCodes.OPERATION_CANCELED;
      reject(err);
    };

    input.click();
  });
};

export const keepLocalCopy = async ({
  files,
}: {
  files: Array<{ uri: string; fileName: string; destination?: string }>;
}) => {
  return files.map((f) => ({
    status: 'success' as const,
    localUri: f.uri,
  }));
};

export default {
  pick,
  keepLocalCopy,
  isErrorWithCode,
  errorCodes,
  types,
};
