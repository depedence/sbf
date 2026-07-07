import { FormEvent, useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getStatistic } from '../api/statistics';
import { getErrorMessage } from '../api/client';
import type { StatisticResponse } from '../api/types';
import { toDatetimeLocalValue } from '../lib/datetime';
import ErrorText from '../components/ErrorText';

const amountFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function startOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
}

interface CategoryDatum {
  name: string;
  amount: number;
}

export default function StatisticsPage() {
  const [from, setFrom] = useState(() => toDatetimeLocalValue(startOfMonth()));
  const [to, setTo] = useState(() => toDatetimeLocalValue(new Date()));
  const [stats, setStats] = useState<StatisticResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(fromValue: string, toValue: string) {
    setLoading(true);
    setError(null);
    try {
      setStats(await getStatistic(fromValue, toValue));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(from, to);
    // Only run once on mount — subsequent range changes are triggered by the form submit.
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!from || !to) {
      setError('Укажите обе даты периода');
      return;
    }
    load(from, to);
  }

  const difference = stats ? stats.totalIncome - stats.totalExpense : 0;

  const categoryData: CategoryDatum[] = stats
    ? Object.entries(stats.byCategory)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount)
    : [];

  const chartHeight = Math.max(120, categoryData.length * 40 + 40);

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink-primary mb-6">Статистика</h1>

      <form onSubmit={handleSubmit} className="card p-5 mb-6 flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex-1">
          <label className="label" htmlFor="stat-from">С</label>
          <input
            id="stat-from"
            type="datetime-local"
            className="input"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="label" htmlFor="stat-to">По</label>
          <input
            id="stat-to"
            type="datetime-local"
            className="input"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary shrink-0" disabled={loading}>
          {loading ? 'Считаем…' : 'Показать'}
        </button>
      </form>

      {error && <div className="mb-6"><ErrorText message={error} /></div>}

      {stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            <div className="card p-5">
              <p className="text-xs font-medium text-ink-secondary mb-2">Доходы</p>
              <p className="text-2xl font-semibold tabular-nums text-good">
                {amountFormatter.format(stats.totalIncome)}
              </p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-medium text-ink-secondary mb-2">Расходы</p>
              <p className="text-2xl font-semibold tabular-nums text-bad">
                {amountFormatter.format(stats.totalExpense)}
              </p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-medium text-ink-secondary mb-2">Разница</p>
              <p className={`text-2xl font-semibold tabular-nums ${difference >= 0 ? 'text-good' : 'text-bad'}`}>
                {difference >= 0 ? '+' : ''}
                {amountFormatter.format(difference)}
              </p>
            </div>
          </div>

          <div className="card p-5">
            <p className="text-sm font-medium text-ink-secondary mb-4">Траты по категориям</p>
            {categoryData.length === 0 ? (
              <p className="text-sm text-ink-muted">Нет данных за выбранный период.</p>
            ) : (
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ top: 4, right: 32, bottom: 4, left: 4 }}
                  barCategoryGap={12}
                >
                  <CartesianGrid horizontal={false} stroke="#2c2c2a" />
                  <XAxis
                    type="number"
                    tick={{ fill: '#898781', fontSize: 12 }}
                    axisLine={{ stroke: '#383835' }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fill: '#c3c2b7', fontSize: 12 }}
                    axisLine={{ stroke: '#383835' }}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.06)' }}
                    contentStyle={{
                      background: '#1a1a19',
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 8,
                      color: '#ffffff',
                    }}
                    labelStyle={{ color: '#c3c2b7' }}
                    formatter={(value) => [amountFormatter.format(Number(value)), 'Сумма']}
                  />
                  <Bar dataKey="amount" fill="#3987e5" radius={[0, 4, 4, 0]} maxBarSize={28}>
                    <LabelList
                      dataKey="amount"
                      position="right"
                      formatter={(value: unknown) => amountFormatter.format(Number(value))}
                      fill="#c3c2b7"
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
}
