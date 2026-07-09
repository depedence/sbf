import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftRight, ArrowRight, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { useFinanceStore } from '../store/financeStore';
import { useAuthStore } from '../store/authStore';
import { endOfToday, formatDateTime, formatMoney, startOfMonth, toLocalDateTimeString } from '../lib/format';
import clsx from 'clsx';

export function DashboardPage() {
  const email = useAuthStore((s) => s.email);
  const accounts = useFinanceStore((s) => s.accounts);
  const transactions = useFinanceStore((s) => s.transactions);
  const statistic = useFinanceStore((s) => s.statistic);
  const accountsLoading = useFinanceStore((s) => s.accountsLoading);
  const transactionsLoading = useFinanceStore((s) => s.transactionsLoading);
  const fetchAll = useFinanceStore((s) => s.fetchAll);
  const fetchStatistic = useFinanceStore((s) => s.fetchStatistic);

  useEffect(() => {
    fetchAll();
    fetchStatistic(toLocalDateTimeString(startOfMonth()), toLocalDateTimeString(endOfToday()));
  }, [fetchAll, fetchStatistic]);

  const totalBalance = useMemo(() => accounts.reduce((sum, a) => sum + a.balance, 0), [accounts]);
  const recent = transactions.slice(0, 5);

  return (
    <div>
      <PageHeader
        title={`Привет, ${email?.split('@')[0] ?? 'друг'} 👋`}
        subtitle="Вот как выглядят ваши финансы прямо сейчас"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Wallet className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-medium text-ink-secondary">Общий баланс</p>
          <p className="mt-1 text-2xl font-semibold text-ink-primary">{formatMoney(totalBalance)}</p>
          <p className="mt-2 text-xs text-ink-muted">{accounts.length} счёт(ов)</p>
        </Card>
        <Card className="p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-income/15 text-income">
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-medium text-ink-secondary">Доход в этом месяце</p>
          <p className="mt-1 text-2xl font-semibold text-income">{formatMoney(statistic?.totalIncome ?? 0)}</p>
        </Card>
        <Card className="p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-expense/15 text-expense">
            <TrendingDown className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-medium text-ink-secondary">Расход в этом месяце</p>
          <p className="mt-1 text-2xl font-semibold text-expense">{formatMoney(statistic?.totalExpense ?? 0)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-ink-secondary">Счета</h3>
            <Link to="/accounts" className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover">
              Все счета <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {accountsLoading && accounts.length === 0 ? (
            <Spinner />
          ) : accounts.length === 0 ? (
            <EmptyState icon={<Wallet className="h-5 w-5" />} title="Нет счетов" />
          ) : (
            <div className="flex flex-col gap-2">
              {accounts.slice(0, 5).map((a) => (
                <motion.div
                  key={a.id}
                  whileHover={{ x: 2 }}
                  className="flex items-center justify-between rounded-xl border border-base-700 px-3 py-2.5"
                >
                  <span className="text-sm text-ink-primary">{a.name}</span>
                  <span className={clsx('text-sm font-medium', a.balance < 0 ? 'text-expense' : 'text-ink-secondary')}>
                    {formatMoney(a.balance)}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-ink-secondary">Последние операции</h3>
            <Link to="/transactions" className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover">
              Все операции <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {transactionsLoading && transactions.length === 0 ? (
            <Spinner />
          ) : recent.length === 0 ? (
            <EmptyState icon={<ArrowLeftRight className="h-5 w-5" />} title="Пока нет операций" />
          ) : (
            <div className="flex flex-col gap-2">
              {recent.map((t) => (
                <motion.div
                  key={t.id}
                  whileHover={{ x: 2 }}
                  className="flex items-center gap-3 rounded-xl border border-base-700 px-3 py-2.5"
                >
                  <div
                    className={clsx(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      t.type === 'INCOME' ? 'bg-income/15 text-income' : 'bg-expense/15 text-expense',
                    )}
                  >
                    {t.type === 'INCOME' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink-primary">{t.category.name}</p>
                    <p className="text-xs text-ink-muted">{formatDateTime(t.date)}</p>
                  </div>
                  <Chip tone="neutral" className="!px-2 !py-0.5">
                    {t.account.name}
                  </Chip>
                  <span className={clsx('text-sm font-semibold', t.type === 'INCOME' ? 'text-income' : 'text-expense')}>
                    {t.type === 'INCOME' ? '+' : '-'}
                    {formatMoney(Math.abs(t.amount))}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
