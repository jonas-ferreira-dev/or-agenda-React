import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/login-form';
import { useAuth } from '../hooks/use-auth';

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="auth-badge">OR Agenda</span>
          <h1>Acesse o Painel Administrativo</h1>
          <p>
           Entre para gerenciar seus agendamentos.
          </p>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}