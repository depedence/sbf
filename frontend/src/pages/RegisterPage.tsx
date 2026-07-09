import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { AuthShell } from '../components/AuthShell';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

export function RegisterPage() {
  const register = useAuthStore((s) => s.register);
  const authBusy = useAuthStore((s) => s.authBusy);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = await register(name, email, password);
    if (ok) navigate('/', { replace: true });
  }

  return (
    <AuthShell>
      <div className="mb-6 flex items-center gap-2">
        <UserPlus className="h-5 w-5 text-accent" />
        <h2 className="text-xl font-semibold text-ink-primary">Создать аккаунт</h2>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          label="Имя"
          type="text"
          name="name"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Александр"
        />
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
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <Button type="submit" loading={authBusy} className="mt-2 w-full">
          Зарегистрироваться
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-secondary">
        Уже есть аккаунт?{' '}
        <Link to="/login" className="font-medium text-accent hover:text-accent-hover">
          Войти
        </Link>
      </p>
    </AuthShell>
  );
}
