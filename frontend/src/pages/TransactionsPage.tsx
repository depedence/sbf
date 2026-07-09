import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Plus, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Chip } from '../components/ui/Chip';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useFinanceStore } from '../store/financeStore';
import { formatDateTime, formatMoney } from '../lib/format';
import type { TransactionType } from '../types';

function toBackendDateTime(datetimeLocalValue: string): string {
  return datetimeLocalValue.length === 16 ? `${datetimeLocalValue}:00` : datetimeLocalValue;
}

function nowForInput(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function TransactionsPage() {
  const accounts = useFinanceStore((s) => s.accounts);
  const categories = useFinanceStore((s) => s.categories);
  const transactions = useFinanceStore((s) => s.transactions);
  const loading = useFinanceStore((s) => s.transactionsLoading);
  const fetchAll = useFinanceStore((s) => s.fetchAll);
  const createTransaction = useFinanceStore((s) => s.createTransaction);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);

  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [date, setDate] = useState(nowForInput());
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState<{ id: number; label: string } | null>(null);

  const [typeFilter, setTypeFilter] = useState<TransactionType | 'ALL'>('ALL');
  const [accountFilter, setAccountFilter] = useState('ALL');

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const selectedCategory = categories.find((c) => String(c.id) === categoryId);

  const filtered = useMemo(
    () =>
      transactions.filter((t) => {
        if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
        if (accountFilter !== 'ALL' && String(t.account.id) !== accountFilter) return false;
        return true;
      }),
    [transactions, typeFilter, accountFilter],
  );

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!accountId || !categoryId || !parsedAmount) return;
    setSubmitting(true);
    const ok = await createTransaction({
      accountId: Number(accountId),
      categoryId: Number(categoryId),
      amount: parsedAmount,
      comment,
      date: toBackendDateTime(date),
    });
    setSubmitting(false);
    if (ok) {
      setAmount('');
      setComment('');
    }
  }

  return (
    <div>
      <PageHeader title="Операции" subtitle="Каждая копейка дохода и расхода — под учётом" />

      <Card className="mb-6 p-5">
        {accounts.length === 0 || categories.length === 0 ? (
          <p className="text-sm text-ink-secondary">
            Сначала создайте хотя бы один счёт и одну категорию, чтобы добавить операцию.
          </p>
        ) : (
          <form onSubmit={handleCreate} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Select label="Счёт" value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
              <option value="" disabled>
                Выберите счёт
              </option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
            <Select label="Категория" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              <option value="" disabled>
                Выберите категорию
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.type === 'INCOME' ? 'доход' : 'расход'}
                </option>
              ))}
            </Select>
            <Input
              label="Сумма"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
            <Input
              label="Комментарий"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Необязательно"
            />
            <Input label="Дата" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
            <div className="sm:col-span-2 lg:col-span-5 flex items-center justify-between gap-3">
              {selectedCategory && (
                <Chip tone={selectedCategory.type === 'INCOME' ? 'income' : 'expense'}>
                  Тип определится автоматически: {selectedCategory.type === 'INCOME' ? 'доход' : 'расход'}
                </Chip>
              )}
              <Button type="submit" loading={submitting} className="ml-auto">
                <Plus className="h-4 w-4" />
                Добавить операцию
              </Button>
            </div>
          </form>
        )}
      </Card>

      <div className="mb-4 flex flex-wrap gap-2">
        {(['ALL', 'INCOME', 'EXPENSE'] as const).map((v) => (
          <button key={v} onClick={() => setTypeFilter(v)}>
            <Chip tone={typeFilter === v ? 'accent' : 'neutral'}>
              {v === 'ALL' ? 'Все типы' : v === 'INCOME' ? 'Доходы' : 'Расходы'}
            </Chip>
          </button>
        ))}
        <select
          value={accountFilter}
          onChange={(e) => setAccountFilter(e.target.value)}
          className="rounded-full border border-base-600 bg-base-800 px-3 py-1 text-xs text-ink-secondary outline-none"
        >
          <option value="ALL">Все счета</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {loading && transactions.length === 0 ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<ArrowLeftRight className="h-5 w-5" />} title="Операций пока нет" />
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {filtered.map((t) => (
              <Card key={t.id} className="flex items-center gap-4 p-4">
                <div
                  className={clsx(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                    t.type === 'INCOME' ? 'bg-income/15 text-income' : 'bg-expense/15 text-expense',
                  )}
                >
                  {t.type === 'INCOME' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-medium text-ink-primary">{t.category.name}</span>
                    <Chip tone="neutral" className="!px-2 !py-0.5">
                      {t.account.name}
                    </Chip>
                  </div>
                  {t.comment && <p className="mt-0.5 truncate text-xs text-ink-muted">{t.comment}</p>}
                  <p className="mt-0.5 text-xs text-ink-muted">{formatDateTime(t.date)}</p>
                </div>
                <span className={clsx('shrink-0 text-base font-semibold', t.type === 'INCOME' ? 'text-income' : 'text-expense')}>
                  {t.type === 'INCOME' ? '+' : '-'}
                  {formatMoney(Math.abs(t.amount))}
                </span>
                <button
                  onClick={() => setTarget({ id: t.id, label: `${t.category.name} · ${formatMoney(t.amount)}` })}
                  className="text-ink-muted transition-colors hover:text-expense"
                  aria-label="Удалить операцию"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDialog
        open={!!target}
        title="Удалить операцию?"
        description={target ? `Операция «${target.label}» будет удалена, баланс счёта пересчитается.` : undefined}
        onCancel={() => setTarget(null)}
        onConfirm={async () => {
          if (target) await deleteTransaction(target.id);
          setTarget(null);
        }}
      />
    </div>
  );
}
