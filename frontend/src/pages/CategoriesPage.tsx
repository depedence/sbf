import { FormEvent, useEffect, useState } from 'react';
import { createCategory, deleteCategory, getCategories } from '../api/categories';
import { getErrorMessage } from '../api/client';
import type { Category, TransactionType } from '../api/types';
import ErrorText from '../components/ErrorText';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadCategories() {
    setLoading(true);
    setError(null);
    try {
      setCategories(await getCategories());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Введите название категории');
      return;
    }
    setFormError(null);
    setCreating(true);
    try {
      await createCategory({ name: name.trim(), type });
      setName('');
      setType('EXPENSE');
      await loadCategories();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Удалить категорию?')) return;
    setDeletingId(id);
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink-primary mb-6">Категории</h1>

      <div className="card p-5 mb-6">
        <h2 className="text-sm font-medium text-ink-secondary mb-4">Новая категория</h2>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1">
            <label className="label" htmlFor="category-name">Название</label>
            <input
              id="category-name"
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, Продукты"
            />
          </div>
          <div className="sm:w-48">
            <label className="label" htmlFor="category-type">Тип</label>
            <select
              id="category-type"
              className="input"
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
            >
              <option value="EXPENSE">Расход</option>
              <option value="INCOME">Доход</option>
            </select>
          </div>
          <button type="submit" className="btn-primary shrink-0" disabled={creating}>
            {creating ? 'Создаём…' : 'Добавить'}
          </button>
        </form>
        {formError && <div className="mt-3"><ErrorText message={formError} /></div>}
      </div>

      {error && <div className="mb-4"><ErrorText message={error} /></div>}

      {loading ? (
        <p className="text-ink-muted text-sm">Загрузка…</p>
      ) : categories.length === 0 ? (
        <div className="card p-8 text-center text-ink-muted text-sm">Категорий пока нет.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-ink-muted">
                <th className="px-4 py-3 font-medium">Название</th>
                <th className="px-4 py-3 font-medium">Тип</th>
                <th className="px-4 py-3 font-medium text-right">Действие</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-ink-primary">{category.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        category.type === 'INCOME' ? 'bg-good/10 text-good' : 'bg-bad/10 text-bad'
                      }`}
                    >
                      {category.type === 'INCOME' ? 'Доход' : 'Расход'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(category.id)}
                      disabled={deletingId === category.id}
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
