import { create } from 'zustand';
import type { AlertButton, AlertOptions } from 'react-native';
interface AppAlert {
  title: string;
  message?: string;
  buttons: AlertButton[];
  options?: AlertOptions;
}
interface AlertState {
  queue: AppAlert[];
  show: (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: AlertOptions,
  ) => void;
  choose: (index: number) => void;
  dismiss: () => void;
  clear: () => void;
}
/** React Native Web's Alert implementation is empty; preserve native semantics. */
export const useAlertStore = create<AlertState>((set, get) => ({
  queue: [],
  clear: () => set({ queue: [] }),
  show: (title, message, buttons, options) =>
    set(state => ({
      queue: [
        ...state.queue,
        {
          title,
          message,
          buttons: buttons?.length ? buttons : [{ text: 'OK' }],
          options,
        },
      ],
    })),
  choose: index => {
    const current = get().queue[0];
    const button = current?.buttons[index];
    if (!button) return;
    set(state => ({ queue: state.queue.slice(1) }));
    button.onPress?.();
  },
  dismiss: () => {
    const current = get().queue[0];
    if (!current?.options?.cancelable) return;
    set(state => ({ queue: state.queue.slice(1) }));
    current.options.onDismiss?.();
  },
}));
