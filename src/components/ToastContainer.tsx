import { createPortal } from 'react-dom';
import { useToastStore } from '../stores/useToastStore';
import Toast from './Toast';

const ToastContainer = () => {
  const { toasts } = useToastStore();

  return createPortal(
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none"
      style={{ maxWidth: '24rem', width: 'calc(100vw - 3rem)' }}
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
