export interface ImagePickerResponse {
  didCancel?: boolean;
  errorCode?: string;
  errorMessage?: string;
  assets?: Array<{
    base64?: string;
    uri?: string;
    width?: number;
    height?: number;
    fileSize?: number;
    type?: string;
    fileName?: string;
    duration?: number;
    bitrate?: number;
    timestamp?: string;
    id?: string;
  }>;
}

export interface CameraOptions {
  mediaType?: 'photo' | 'video' | 'mixed';
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  videoQuality?: 'low' | 'medium' | 'high';
  durationLimit?: number;
  saveToPhotos?: boolean;
  cameraType?: 'back' | 'front';
  includeBase64?: boolean;
  includeExtra?: boolean;
  presentationStyle?:
    | 'currentContext'
    | 'overCurrentContext'
    | 'fullScreen'
    | 'pageSheet'
    | 'formSheet'
    | 'popover';
  assetRepresentationMode?: 'auto' | 'current' | 'compatible';
}

export type ImageLibraryOptions = CameraOptions & {
  selectionLimit?: number;
};

export type Callback = (response: ImagePickerResponse) => void;

export const launchImageLibrary = (
  _options?: ImageLibraryOptions,
  callback?: Callback,
): Promise<ImagePickerResponse> => {
  return new Promise(resolve => {
    if (typeof document === 'undefined') {
      const res: ImagePickerResponse = { didCancel: true };
      if (callback) callback(res);
      return resolve(res);
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        const res: ImagePickerResponse = { didCancel: true };
        if (callback) callback(res);
        return resolve(res);
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64Str =
          typeof reader.result === 'string'
            ? reader.result.split(',')[1]
            : undefined;
        const res: ImagePickerResponse = {
          assets: [
            {
              uri:
                typeof reader.result === 'string' ? reader.result : undefined,
              fileName: file.name,
              fileSize: file.size,
              type: file.type,
              base64: base64Str,
            },
          ],
        };
        if (callback) callback(res);
        resolve(res);
      };
      reader.onerror = () => {
        const res: ImagePickerResponse = {
          errorCode: 'OTHERS',
          errorMessage: 'Gagal membaca berkas gambar',
        };
        if (callback) callback(res);
        resolve(res);
      };
      reader.readAsDataURL(file);
    };

    input.oncancel = () => {
      const res: ImagePickerResponse = { didCancel: true };
      if (callback) callback(res);
      resolve(res);
    };

    input.click();
  });
};

export const launchCamera = launchImageLibrary;

export default {
  launchImageLibrary,
  launchCamera,
};
