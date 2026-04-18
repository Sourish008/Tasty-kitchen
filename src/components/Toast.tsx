import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { type Toast as ToastType, useToastStore } from '../stores/useToastStore';

interface ToastProps {
  toast: ToastType;
}

const icons = {
  success: <CheckCircle2 size={20} className="shrink-0 text-emerald-500" />,
  error:   <XCircle     size={20} className="shrink-0 text-red-500" />,
  info:    <Info        size={20} className="shrink-0 text-blue-500" />,
  warning: <AlertTriangle size={20} className="shrink-0 text-amber-500" />,
};

const progressColors = {
  success: 'bg-emerald-500',
  error:   'bg-red-500',
  info:    'bg-blue-500',
  warning: 'bg-amber-500',
};

const borderColors = {
  success: 'border-l-emerald-500',
  error:   'border-l-red-500',
  info:    'border-l-blue-500',
  warning: 'border-l-amber-500',
};

const Toast = ({ toast }: ToastProps) => {
  const { removeToast } = useToastStore();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const duration = toast.duration ?? 3500;
  const progressRef = useRef<HTMLDivElement>(null);

  // Mount animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Animate progress bar
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.transition = `width ${duration}ms linear`;
      progressRef.current.style.width = '0%';
    }
  }, [duration]);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => removeToast(toast.id), 380);
  };

  // Auto-dismiss
  useEffect(() => {
    const t = setTimeout(() => dismiss(), duration);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      role="alert"
      style={{
        transform: visible && !leaving ? 'translateX(0) scale(1)' : 'translateX(110%) scale(0.95)',
        opacity: visible && !leaving ? 1 : 0,
        transition: 'transform 0.38s cubic-bezier(0.34,1.56,0.64,1), opacity 0.32s ease',
      }}
      className={`
        relative flex items-start gap-3 w-full max-w-sm
        bg-white dark:bg-gray-800
        border border-[var(--border-color)] border-l-4 ${borderColors[toast.type]}
        rounded-2xl shadow-2xl dark:shadow-black/40
        px-4 py-3 overflow-hidden
        pointer-events-auto
      `}
    >
      {/* Icon */}
      <div className="mt-0.5">{icons[toast.type]}</div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-1">
        <p className="font-semibold text-sm text-[var(--text-main)] leading-snug">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={dismiss}
        className="shrink-0 p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100 dark:bg-gray-700">
        <div
          ref={progressRef}
          className={`h-full ${progressColors[toast.type]} w-full`}
        />
      </div>
    </div>
  );
};

export default Toast;
