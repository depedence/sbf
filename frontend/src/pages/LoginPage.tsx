import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { getErrorMessage } from '../api/client';
import { useAuthStore } from '../store/authStore';
import ErrorText from '../components/ErrorText';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setValidationError('Введите корректный email');
      return false;
    }
    if (!password) {
      setValidationError('Введите пароль');
      return false;
    }
    setValidationError(null);
    return true;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const { token } = await login({ email: email.trim(), password });
      setAuth(token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center px-4">
      <div className="card w-full max-w-sm p-6">
        <h1 className="text-lg font-semibold text-ink-primary mb-1">Вход</h1>
        <p className="text-sm text-ink-muted mb-6">Войдите, чтобы управлять своими финансами</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <ErrorText message={validationError ?? apiError} />

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Входим…' : 'Войти'}
          </button>
        </form>

        <p className="mt-5 text-sm text-ink-muted text-center">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-accent hover:text-accent-hover">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
