import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { AuthShell } from '../components/AuthShell';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

export function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const authBusy = useAuthStore((s) => s.authBusy);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) navigate('/', { replace: true });
  }

  return (
    <AuthShell>
      <div className="mb-6 flex items-center gap-2">
        <LogIn className="h-5 w-5 text-accent" />
        <h2 className="text-xl font-semibold text-ink-primary">Вход в аккаунт</h2>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <Input
          label="Пароль"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <Button type="submit" loading={authBusy} className="mt-2 w-full">
          Войти
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-secondary">
        Нет аккаунта?{' '}
        <Link to="/register" className="font-medium text-accent hover:text-accent-hover">
          Зарегистрироваться
        </Link>
      </p>
    </AuthShell>
  );
}
