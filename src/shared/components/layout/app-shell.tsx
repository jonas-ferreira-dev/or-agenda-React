import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/agendamentos"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            Agendamentos
          </NavLink>

          <NavLink
            to="/clientes"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            Clientes
          </NavLink>

          <NavLink
            to="/servicos"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            Serviços
          </NavLink>

          <NavLink
            to="/perfil"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            Perfil
          </NavLink>
        </nav>

        <button className="ghost-button" onClick={handleLogout}>
          Sair
        </button>
      </aside>

      <div className="app-content">
        <header className="topbar">
          <div>
            <p className="topbar-title">Painel Administrativo</p>
            <p className="topbar-subtitle">
              Bem-vindo{user?.name ? `, ${user.name}` : ''}.
            </p>
          </div>
        </header>

        <section className="page-content">
          <Outlet />
        </section>
      </div>
    </div>
  );
}