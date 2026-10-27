export const launchImageLibrary = jest
  .fn()
  .mockResolvedValue({ didCancel: true });
export const launchCamera = jest.fn().mockResolvedValue({ didCancel: true });
