import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import { BarChart3, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { useFinanceStore } from '../store/financeStore';
import { endOfToday, formatMoney, startOfMonth, toDateInputValue, toLocalDateTimeString } from '../lib/format';

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: 'accent' | 'income' | 'expense';
}) {
  const toneClasses = {
    accent: 'bg-accent/15 text-accent',
    income: 'bg-income/15 text-income',
    expense: 'bg-expense/15 text-expense',
  }[tone];
  return (
    <Card className="p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses}`}>{icon}</div>
      <p className="mt-4 text-xs font-medium text-ink-secondary">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink-primary">{value}</p>
    </Card>
  );
}

export function StatisticsPage() {
  const categories = useFinanceStore((s) => s.categories);
  const fetchCategories = useFinanceStore((s) => s.fetchCategories);
  const statistic = useFinanceStore((s) => s.statistic);
  const loading = useFinanceStore((s) => s.statisticLoading);
  const fetchStatistic = useFinanceStore((s) => s.fetchStatistic);

  const [from, setFrom] = useState(toDateInputValue(startOfMonth()));
  const [to, setTo] = useState(toDateInputValue(endOfToday()));

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const fromDate = new Date(`${from}T00:00:00`);
    const toDate = new Date(`${to}T23:59:59`);
    fetchStatistic(toLocalDateTimeString(fromDate), toLocalDateTimeString(toDate));
  }, [from, to, fetchStatistic]);

  const chartData = useMemo(() => {
    if (!statistic) return [];
    return Object.entries(statistic.byCategory)
      .map(([name, value]) => {
        const category = categories.find((c) => c.name === name);
        return { name, value, type: category?.type ?? 'EXPENSE' };
      })
      .sort((a, b) => b.value - a.value);
  }, [statistic, categories]);

  const net = statistic ? statistic.totalIncome - statistic.totalExpense : 0;

  return (
    <div>
      <PageHeader title="Статистика" subtitle="Доходы и расходы за выбранный период" />

      <Card className="mb-6 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Input label="С" type="date" value={from} onChange={(e) => setFrom(e.target.value)} max={to} />
          <Input label="По" type="date" value={to} onChange={(e) => setTo(e.target.value)} min={from} />
        </div>
      </Card>

      {loading && !statistic ? (
        <Spinner />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              label="Доходы"
              value={formatMoney(statistic?.totalIncome ?? 0)}
              tone="income"
            />
            <StatCard
              icon={<TrendingDown className="h-5 w-5" />}
              label="Расходы"
              value={formatMoney(statistic?.totalExpense ?? 0)}
              tone="expense"
            />
            <StatCard
              icon={<Wallet className="h-5 w-5" />}
              label="Баланс за период"
              value={formatMoney(net)}
              tone="accent"
            />
          </div>

          <Card className="p-5">
            <h3 className="mb-4 text-sm font-medium text-ink-secondary">Разбивка по категориям</h3>
            {chartData.length === 0 ? (
              <EmptyState icon={<BarChart3 className="h-5 w-5" />} title="Нет операций за этот период" />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%', height: Math.max(220, chartData.length * 44) }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 12, right: 24 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                      tick={{ fill: '#a8acba', fontSize: 12, fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                      contentStyle={{
                        background: '#1c1e25',
                        border: '1px solid #31343f',
                        borderRadius: 10,
                        fontFamily: 'JetBrains Mono',
                        fontSize: 12,
                      }}
                      formatter={(value: number) => formatMoney(value)}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} animationDuration={700}>
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.type === 'INCOME' ? '#34d399' : '#fb7185'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
