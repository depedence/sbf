import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useToastStore, type Toast, type ToastKind } from '../store/toastStore';
import clsx from 'clsx';

const STYLES: Record<ToastKind, { border: string; icon: JSX.Element; bar: string }> = {
  success: {
    border: 'border-income/40',
    icon: <CheckCircle2 className="h-5 w-5 text-income shrink-0" />,
    bar: 'bg-income',
  },
  error: {
    border: 'border-expense/40',
    icon: <XCircle className="h-5 w-5 text-expense shrink-0" />,
    bar: 'bg-expense',
  },
  info: {
    border: 'border-accent/40',
    icon: <Info className="h-5 w-5 text-accent shrink-0" />,
    bar: 'bg-accent',
  },
  warning: {
    border: 'border-warn/40',
    icon: <AlertTriangle className="h-5 w-5 text-warn shrink-0" />,
    bar: 'bg-warn',
  },
};

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const style = STYLES[toast.kind];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      className={clsx(
        'relative overflow-hidden pointer-events-auto flex items-start gap-3 w-80 rounded-xl border bg-base-800/95 backdrop-blur px-4 py-3 shadow-card',
        style.border,
      )}
    >
      {style.icon}
      <p className="flex-1 text-sm leading-snug text-ink-primary pr-2">{toast.message}</p>
      <button
        onClick={() => dismiss(toast.id)}
        className="text-ink-muted hover:text-ink-primary transition-colors"
        aria-label="Закрыть уведомление"
      >
        <X className="h-4 w-4" />
      </button>
      <motion.span
        className={clsx('absolute bottom-0 left-0 h-0.5', style.bar)}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 3, ease: 'linear' }}
      />
    </motion.div>
  );
}

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}
