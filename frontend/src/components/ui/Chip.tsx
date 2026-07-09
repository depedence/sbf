import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

type Tone = 'accent' | 'income' | 'expense' | 'warn' | 'neutral';

const TONES: Record<Tone, string> = {
  accent: 'bg-accent/15 text-accent border-accent/30',
  income: 'bg-income/15 text-income border-income/30',
  expense: 'bg-expense/15 text-expense border-expense/30',
  warn: 'bg-warn/15 text-warn border-warn/30',
  neutral: 'bg-base-700 text-ink-secondary border-base-600',
};

export function Chip({
  children,
  tone = 'neutral',
  icon,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      whileHover={{ y: -1 }}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </motion.span>
  );
}
