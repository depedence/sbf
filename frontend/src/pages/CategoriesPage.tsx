import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Tags, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Chip } from '../components/ui/Chip';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useFinanceStore } from '../store/financeStore';
import type { TransactionType } from '../types';
import clsx from 'clsx';

const FILTERS: { value: TransactionType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Все' },
  { value: 'INCOME', label: 'Доходы' },
  { value: 'EXPENSE', label: 'Расходы' },
];

export function CategoriesPage() {
  const categories = useFinanceStore((s) => s.categories);
  const loading = useFinanceStore((s) => s.categoriesLoading);
  const fetchCategories = useFinanceStore((s) => s.fetchCategories);
  const createCategory = useFinanceStore((s) => s.createCategory);
  const deleteCategory = useFinanceStore((s) => s.deleteCategory);

  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [filter, setFilter] = useState<TransactionType | 'ALL'>('ALL');
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const visible = useMemo(
    () => (filter === 'ALL' ? categories : categories.filter((c) => c.type === filter)),
    [categories, filter],
  );

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    const ok = await createCategory({ name: name.trim(), type });
    setSubmitting(false);
    if (ok) setName('');
  }

  return (
    <div>
      <PageHeader title="Категории" subtitle="Группируйте операции по смыслу — еда, транспорт, зарплата" />

      <Card className="mb-6 p-5">
        <form onSubmit={handleCreate} className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input
                label="Название категории"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например, Продукты"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('INCOME')}
                className={clsx(
                  'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                  type === 'INCOME'
                    ? 'border-income/40 bg-income/15 text-income'
                    : 'border-base-600 text-ink-secondary hover:border-income/30',
                )}
              >
                <TrendingUp className="h-4 w-4" /> Доход
              </button>
              <button
                type="button"
                onClick={() => setType('EXPENSE')}
                className={clsx(
                  'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                  type === 'EXPENSE'
                    ? 'border-expense/40 bg-expense/15 text-expense'
                    : 'border-base-600 text-ink-secondary hover:border-expense/30',
                )}
              >
                <TrendingDown className="h-4 w-4" /> Расход
              </button>
            </div>
            <Button type="submit" loading={submitting} disabled={!name.trim()}>
              <Plus className="h-4 w-4" />
              Добавить
            </Button>
          </div>
        </form>
      </Card>

      <div className="mb-4 flex gap-2">
        {FILTERS.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}>
            <Chip tone={filter === f.value ? 'accent' : 'neutral'}>{f.label}</Chip>
          </button>
        ))}
      </div>

      {loading && categories.length === 0 ? (
        <Spinner />
      ) : visible.length === 0 ? (
        <EmptyState icon={<Tags className="h-5 w-5" />} title="Категорий пока нет" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {visible.map((category) => (
              <Card key={category.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={clsx(
                      'flex h-9 w-9 items-center justify-center rounded-lg',
                      category.type === 'INCOME' ? 'bg-income/15 text-income' : 'bg-expense/15 text-expense',
                    )}
                  >
                    {category.type === 'INCOME' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-ink-primary">{category.name}</span>
                </div>
                <button
                  onClick={() => setTarget({ id: category.id, name: category.name })}
                  className="text-ink-muted transition-colors hover:text-expense"
                  aria-label="Удалить категорию"
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
        title="Удалить категорию?"
        description={target ? `Категория «${target.name}» будет удалена без возможности восстановления.` : undefined}
        onCancel={() => setTarget(null)}
        onConfirm={async () => {
          if (target) await deleteCategory(target.id);
          setTarget(null);
        }}
      />
    </div>
  );
}
