import { useCallback, useEffect, useState } from 'react';

/** Small confirmation message, e.g. "Product saved", that disappears after 3 seconds. */
export function useToast() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  const show = useCallback((text) => setMessage(text), []);

  const toast = message ? (
    <div className="toast" role="status">
      {message}
    </div>
  ) : null;

  return [toast, show];
}
