import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-base-600 py-16 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-base-700 text-ink-muted">{icon}</div>
      <p className="text-sm font-medium text-ink-secondary">{title}</p>
      {description && <p className="max-w-xs text-xs text-ink-muted">{description}</p>}
    </motion.div>
  );
}
