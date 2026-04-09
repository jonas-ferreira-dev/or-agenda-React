import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/use-auth';

const navigationItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Agendamentos', to: '/agendamentos' },
  { label: 'Clientes', to: '/clientes' },
  { label: 'Serviços', to: '/servicos' },
  { label: 'Perfil', to: '/perfil' },
];

export function AppShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  async function handleLogout() {
    await signOut();
    navigate('/login', { replace: true });
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen((prev) => !prev);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="app-shell">
      {isMobileMenuOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={closeMobileMenu}
          aria-label="Fechar menu"
        />
      )}

      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <p className="sidebar-logo">OR Agenda</p>
            <p className="sidebar-subtitle">Painel Administrativo</p>
          </div>

          <nav className="sidebar-nav">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="ghost-button sidebar-logout" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </aside>

      <div className="app-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-button"
              onClick={toggleMobileMenu}
              aria-label="Abrir menu"
            >
              ☰
            </button>

            <div>
              <p className="topbar-title">Painel Administrativo</p>
              <p className="topbar-subtitle">
                Bem-vindo{user?.name ? `, ${user.name}` : ''}.
              </p>
            </div>
          </div>
        </header>

        <section className="page-content">
          <Outlet />
        </section>
      </div>
    </div>
  );
}