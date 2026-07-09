import { FormEvent, useEffect, useState } from 'react';
import { getAccounts } from '../api/accounts';
import { getCategories } from '../api/categories';
import { createTransaction, deleteTransaction, getTransactions } from '../api/transactions';
import { getErrorMessage } from '../api/client';
import type { Account, Category, Transaction } from '../api/types';
import { formatDateTime, toDatetimeLocalValue } from '../lib/datetime';
import ErrorText from '../components/ErrorText';

const amountFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [date, setDate] = useState(() => toDatetimeLocalValue(new Date()));
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [txs, accs, cats] = await Promise.all([
        getTransactions(),
        getAccounts(),
        getCategories(),
      ]);
      setTransactions(
        [...txs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      );
      setAccounts(accs);
      setCategories(cats);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!accountId) {
      setFormError('Выберите счёт');
      return;
    }
    if (!categoryId) {
      setFormError('Выберите категорию');
      return;
    }
    const amountValue = Number(amount);
    if (!amount || !(amountValue > 0)) {
      setFormError('Введите сумму больше нуля');
      return;
    }
    if (!date) {
      setFormError('Укажите дату');
      return;
    }

    setFormError(null);
    setCreating(true);
    try {
      await createTransaction({
        accountId: Number(accountId),
        categoryId: Number(categoryId),
        amount: amountValue,
        comment,
        date,
      });
      setAmount('');
      setComment('');
      setDate(toDatetimeLocalValue(new Date()));
      await loadAll();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Удалить транзакцию?')) return;
    setDeletingId(id);
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink-primary mb-6">Транзакции</h1>

      <div className="card p-5 mb-6">
        <h2 className="text-sm font-medium text-ink-secondary mb-4">Новая транзакция</h2>
        {accounts.length === 0 || categories.length === 0 ? (
          <p className="text-sm text-ink-muted">
            Чтобы создать транзакцию, сначала добавьте хотя бы один счёт и одну категорию.
          </p>
        ) : (
          <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="label" htmlFor="tx-account">Счёт</label>
              <select
                id="tx-account"
                className="input"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              >
                <option value="">Выберите счёт</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="tx-category">Категория</label>
              <select
                id="tx-category"
                className="input"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Выберите категорию</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type === 'INCOME' ? 'доход' : 'расход'})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="tx-amount">Сумма</label>
              <input
                id="tx-amount"
                type="number"
                min="0.01"
                step="0.01"
                className="input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="label" htmlFor="tx-date">Дата</label>
              <input
                id="tx-date"
                type="datetime-local"
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="label" htmlFor="tx-comment">Комментарий</label>
              <input
                id="tx-comment"
                type="text"
                className="input"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Необязательно"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
              <button type="submit" className="btn-primary" disabled={creating}>
                {creating ? 'Создаём…' : 'Добавить транзакцию'}
              </button>
            </div>
          </form>
        )}
        {formError && <div className="mt-3"><ErrorText message={formError} /></div>}
      </div>

      {error && <div className="mb-4"><ErrorText message={error} /></div>}

      {loading ? (
        <p className="text-ink-muted text-sm">Загрузка…</p>
      ) : transactions.length === 0 ? (
        <div className="card p-8 text-center text-ink-muted text-sm">Транзакций пока нет.</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-ink-muted">
                <th className="px-4 py-3 font-medium whitespace-nowrap">Дата</th>
                <th className="px-4 py-3 font-medium">Счёт</th>
                <th className="px-4 py-3 font-medium">Категория</th>
                <th className="px-4 py-3 font-medium text-right">Сумма</th>
                <th className="px-4 py-3 font-medium">Комментарий</th>
                <th className="px-4 py-3 font-medium text-right">Действие</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 whitespace-nowrap text-ink-secondary tabular-nums">
                    {formatDateTime(tx.date)}
                  </td>
                  <td className="px-4 py-3 text-ink-primary">{tx.account?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-ink-primary">{tx.category?.name ?? '—'}</td>
                  <td
                    className={`px-4 py-3 text-right tabular-nums font-medium ${
                      tx.type === 'INCOME' ? 'text-good' : 'text-bad'
                    }`}
                  >
                    {tx.type === 'INCOME' ? '+' : '-'}
                    {amountFormatter.format(tx.amount)}
                  </td>
                  <td className="px-4 py-3 text-ink-secondary break-words max-w-xs">
                    {tx.comment || '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(tx.id)}
                      disabled={deletingId === tx.id}
                      className="text-ink-muted hover:text-bad"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
