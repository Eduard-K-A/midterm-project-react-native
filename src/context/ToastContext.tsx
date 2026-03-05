import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { View, StyleSheet } from 'react-native';
import Toast, { ToastType } from '../components/Toast';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  /** Display a toast notification from anywhere in the component tree. */
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * ToastProvider renders a single Toast component at the top of its subtree
 * and exposes `showToast` via context. Any child can call `useToast()`
 * without prop drilling or per-screen state.
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');

  // useRef for the timer so clearing it doesn't trigger a re-render
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (msg: string, toastType: ToastType = 'info', duration: number = 2800) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      setMessage(msg);
      setType(toastType);
      setVisible(true);

      // Auto-dismiss after the specified duration
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, duration);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      <View style={styles.root}>
        {children}
        <Toast visible={visible} message={message} type={type} />
      </View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
