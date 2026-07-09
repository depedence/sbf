import { create } from 'zustand';
import * as accountsApi from '../api/accounts';
import * as categoriesApi from '../api/categories';
import * as transactionsApi from '../api/transactions';
import * as statisticApi from '../api/statistics';
import { getErrorMessage } from '../api/client';
import { formatMoney } from '../lib/format';
import { toast } from './toastStore';
import type { Account, Category, CategoryRequest, StatisticResponse, Transaction, TransactionRequest } from '../types';

interface FinanceState {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  statistic: StatisticResponse | null;

  accountsLoading: boolean;
  categoriesLoading: boolean;
  transactionsLoading: boolean;
  statisticLoading: boolean;

  fetchAccounts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchStatistic: (from: string, to: string) => Promise<void>;
  fetchAll: () => Promise<void>;
  reset: () => void;

  createAccount: (name: string) => Promise<boolean>;
  deleteAccount: (id: number) => Promise<boolean>;

  createCategory: (request: CategoryRequest) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;

  createTransaction: (request: TransactionRequest) => Promise<boolean>;
  deleteTransaction: (id: number) => Promise<boolean>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  accounts: [],
  categories: [],
  transactions: [],
  statistic: null,

  accountsLoading: false,
  categoriesLoading: false,
  transactionsLoading: false,
  statisticLoading: false,

  fetchAccounts: async () => {
    set({ accountsLoading: true });
    try {
      const accounts = await accountsApi.getAccounts();
      set({ accounts });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Не удалось загрузить счета'));
    } finally {
      set({ accountsLoading: false });
    }
  },

  fetchCategories: async () => {
    set({ categoriesLoading: true });
    try {
      const categories = await categoriesApi.getCategories();
      set({ categories });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Не удалось загрузить категории'));
    } finally {
      set({ categoriesLoading: false });
    }
  },

  fetchTransactions: async () => {
    set({ transactionsLoading: true });
    try {
      const transactions = await transactionsApi.getTransactions();
      const sorted = [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      set({ transactions: sorted });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Не удалось загрузить операции'));
    } finally {
      set({ transactionsLoading: false });
    }
  },

  fetchStatistic: async (from, to) => {
    set({ statisticLoading: true });
    try {
      const statistic = await statisticApi.getStatistic(from, to);
      set({ statistic });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Не удалось загрузить статистику'));
    } finally {
      set({ statisticLoading: false });
    }
  },

  fetchAll: async () => {
    await Promise.all([get().fetchAccounts(), get().fetchCategories(), get().fetchTransactions()]);
  },

  reset: () =>
    set({
      accounts: [],
      categories: [],
      transactions: [],
      statistic: null,
    }),

  createAccount: async (name) => {
    try {
      const account = await accountsApi.createAccount(name);
      set((state) => ({ accounts: [account, ...state.accounts] }));
      toast.success(`Счёт «${account.name}» создан`);
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Не удалось создать счёт'));
      return false;
    }
  },

  deleteAccount: async (id) => {
    const account = get().accounts.find((a) => a.id === id);
    try {
      await accountsApi.deleteAccount(id);
      set((state) => ({ accounts: state.accounts.filter((a) => a.id !== id) }));
      toast.info(`Счёт «${account?.name ?? id}» удалён`);
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Не удалось удалить счёт'));
      return false;
    }
  },

  createCategory: async (request) => {
    try {
      const category = await categoriesApi.createCategory(request);
      set((state) => ({ categories: [category, ...state.categories] }));
      toast.success(`Категория «${category.name}» создана`);
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Не удалось создать категорию'));
      return false;
    }
  },

  deleteCategory: async (id) => {
    const category = get().categories.find((c) => c.id === id);
    try {
      await categoriesApi.deleteCategory(id);
      set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
      toast.info(`Категория «${category?.name ?? id}» удалена`);
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Не удалось удалить категорию'));
      return false;
    }
  },

  createTransaction: async (request) => {
    try {
      const transaction = await transactionsApi.createTransaction(request);
      set((state) => ({ transactions: [transaction, ...state.transactions] }));
      const verb = transaction.type === 'INCOME' ? 'Доход' : 'Расход';
      toast.success(`${verb} «${transaction.category.name}» на сумму ${formatMoney(transaction.amount)} добавлен`);
      await get().fetchAccounts();
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Не удалось создать операцию'));
      return false;
    }
  },

  deleteTransaction: async (id) => {
    try {
      await transactionsApi.deleteTransaction(id);
      set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) }));
      toast.info('Операция удалена');
      await get().fetchAccounts();
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Не удалось удалить операцию'));
      return false;
    }
  },
}));
