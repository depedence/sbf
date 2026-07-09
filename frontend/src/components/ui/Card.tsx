import { motion, type HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';

export function Card({ className, children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={clsx(
        'rounded-2xl border border-base-700 bg-base-800/70 backdrop-blur-sm shadow-card',
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
