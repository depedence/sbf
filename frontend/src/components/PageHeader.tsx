import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 flex flex-wrap items-center justify-between gap-3"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-primary">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-secondary">{subtitle}</p>}
      </div>
      {action}
    </motion.div>
  );
}
