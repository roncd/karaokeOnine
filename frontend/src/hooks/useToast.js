import { useCallback, useRef, useState } from 'react';
import { buildToast } from '../components/toastMessages';

export function useToast(duration = 3000) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback(
    (presetKey, overrides = {}) => {
      hideToast();
      setToast(buildToast(presetKey, overrides));
      timerRef.current = setTimeout(hideToast, duration);
    },
    [duration, hideToast],
  );

  return { toast, showToast, hideToast };
}
