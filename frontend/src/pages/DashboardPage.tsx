import { FormEvent, useEffect, useState } from 'react';
import { createAccount, deleteAccount, getAccounts } from '../api/accounts';
import { getErrorMessage } from '../api/client';
import type { Account } from '../api/types';
import Modal from '../components/Modal';
import ErrorText from '../components/ErrorText';

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadAccounts() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!newName.trim()) {
      setFormError('Введите название счёта');
      return;
    }
    setFormError(null);
    setCreating(true);
    try {
      await createAccount(newName.trim());
      setNewName('');
      setModalOpen(false);
      await loadAccounts();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Удалить счёт?')) return;
    setDeletingId(id);
    try {
      await deleteAccount(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-ink-primary">Счета</h1>
        <button type="button" className="btn-primary" onClick={() => setModalOpen(true)}>
          + Создать счёт
        </button>
      </div>

      {error && <div className="mb-4"><ErrorText message={error} /></div>}

      {loading ? (
        <p className="text-ink-muted text-sm">Загрузка…</p>
      ) : accounts.length === 0 ? (
        <div className="card p-8 text-center text-ink-muted text-sm">
          Пока нет ни одного счёта. Создайте первый.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <div key={account.id} className="card p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <p className="font-medium text-ink-primary break-words pr-2">{account.name}</p>
                <button
                  type="button"
                  onClick={() => handleDelete(account.id)}
                  disabled={deletingId === account.id}
                  className="text-ink-muted hover:text-bad text-sm shrink-0"
                  aria-label="Удалить счёт"
                >
                  Удалить
                </button>
              </div>
              <p className="text-2xl font-semibold tabular-nums text-ink-primary">
                {currencyFormatter.format(account.balance)}
              </p>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title="Новый счёт" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="label" htmlFor="account-name">Название</label>
              <input
                id="account-name"
                type="text"
                className="input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Например, Наличные"
                autoFocus
              />
            </div>
            <ErrorText message={formError} />
            <div className="flex gap-2 justify-end">
              <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                Отмена
              </button>
              <button type="submit" className="btn-primary" disabled={creating}>
                {creating ? 'Создаём…' : 'Создать'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
