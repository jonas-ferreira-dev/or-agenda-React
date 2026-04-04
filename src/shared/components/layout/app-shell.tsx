import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function AppShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="sidebar-logo">OR Agenda</p>
          <p className="sidebar-subtitle">Painel Administrativo</p>
        </div>

        <nav className="sidebar-nav">
          <a className="sidebar-link active" href="/dashboard">
            Dashboard
          </a>
          <a className="sidebar-link" href="#">
            Agendamentos
          </a>
          <a className="sidebar-link" href="#">
            Clientes
          </a>
          <a className="sidebar-link" href="#">
            Serviços
          </a>
          <a className="sidebar-link" href="#">
            Perfil
          </a>
        </nav>
      </aside>

      <div className="app-content">
        <header className="topbar">
          <div>
            <p className="topbar-title">Painel Administrativo</p>
            <p className="topbar-subtitle">
              Bem vindo{user?.name ? `, ${user.name}` : ''}.
            </p>
          </div>

          <button className="ghost-button" onClick={handleLogout}>
            Sair
          </button>
        </header>

        <section className="page-content">
          <Outlet />
        </section>
      </div>
    </div>
  );
}