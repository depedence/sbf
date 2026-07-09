import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Wallet } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useFinanceStore } from '../store/financeStore';
import { formatDate, formatMoney } from '../lib/format';

export function AccountsPage() {
  const accounts = useFinanceStore((s) => s.accounts);
  const loading = useFinanceStore((s) => s.accountsLoading);
  const fetchAccounts = useFinanceStore((s) => s.fetchAccounts);
  const createAccount = useFinanceStore((s) => s.createAccount);
  const deleteAccount = useFinanceStore((s) => s.deleteAccount);

  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    const ok = await createAccount(name.trim());
    setSubmitting(false);
    if (ok) setName('');
  }

  return (
    <div>
      <PageHeader title="Счета" subtitle="Все ваши кошельки, карты и накопления" />

      <Card className="mb-6 p-5">
        <form onSubmit={handleCreate} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="Название нового счёта"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, Наличные"
            />
          </div>
          <Button type="submit" loading={submitting} disabled={!name.trim()}>
            <Plus className="h-4 w-4" />
            Добавить счёт
          </Button>
        </form>
      </Card>

      {loading && accounts.length === 0 ? (
        <Spinner />
      ) : accounts.length === 0 ? (
        <EmptyState
          icon={<Wallet className="h-5 w-5" />}
          title="Пока нет ни одного счёта"
          description="Создайте первый счёт выше, чтобы начать учитывать операции"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {accounts.map((account) => (
              <Card key={account.id} className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <button
                    onClick={() => setTarget({ id: account.id, name: account.name })}
                    className="text-ink-muted transition-colors hover:text-expense"
                    aria-label="Удалить счёт"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="mt-4 truncate text-sm font-medium text-ink-secondary">{account.name}</h3>
                <p
                  className={`mt-1 text-2xl font-semibold ${account.balance < 0 ? 'text-expense' : 'text-ink-primary'}`}
                >
                  {formatMoney(account.balance)}
                </p>
                <p className="mt-3 text-xs text-ink-muted">Создан {formatDate(account.createdAt)}</p>
              </Card>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDialog
        open={!!target}
        title="Удалить счёт?"
        description={target ? `Счёт «${target.name}» будет удалён без возможности восстановления.` : undefined}
        onCancel={() => setTarget(null)}
        onConfirm={async () => {
          if (target) await deleteAccount(target.id);
          setTarget(null);
        }}
      />
    </div>
  );
}
