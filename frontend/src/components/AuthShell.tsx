import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Lock, Sparkles, Wallet, Zap } from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { Chip } from './ui/Chip';

const FEATURE_CHIPS = [
  { icon: <Lock className="h-3.5 w-3.5" />, label: 'JWT-безопасность', tone: 'accent' as const },
  { icon: <Zap className="h-3.5 w-3.5" />, label: 'Мгновенный баланс', tone: 'income' as const },
  { icon: <BarChart3 className="h-3.5 w-3.5" />, label: 'Аналитика по категориям', tone: 'warn' as const },
  { icon: <Wallet className="h-3.5 w-3.5" />, label: 'Безлимит счетов', tone: 'neutral' as const },
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-10 px-6 py-12 lg:flex-row lg:items-stretch lg:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex max-w-md flex-col justify-center gap-6 text-center lg:text-left"
        >
          <div className="flex items-center justify-center gap-3 lg:justify-start">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white text-xl font-bold shadow-glow">
              F
            </div>
            <span className="text-2xl font-semibold tracking-tight">Finly</span>
          </div>
          <h1 className="text-3xl font-semibold leading-tight text-ink-primary lg:text-4xl">
            Держите деньги <span className="text-accent">под контролем</span>
          </h1>
          <p className="text-sm leading-relaxed text-ink-secondary">
            Счета, категории и операции — в одном месте. Считаем баланс за вас, а вы просто
            записываете, куда уходят деньги.
          </p>
          <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
            {FEATURE_CHIPS.map((chip) => (
              <Chip key={chip.label} tone={chip.tone} icon={chip.icon}>
                {chip.label}
              </Chip>
            ))}
          </div>
          <div className="hidden items-center gap-2 text-xs text-ink-muted lg:flex">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Новый интерфейс Finly — быстрее и понятнее прежнего
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="flex w-full max-w-sm items-center"
        >
          <div className="w-full rounded-2xl border border-base-700 bg-base-800/80 p-7 shadow-glow backdrop-blur">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
