import { useDashboardStats } from '../hooks/use-dashboard-stats';

export function DashboardPage() {
  const { data: stats, isLoading, isError } = useDashboardStats();

  if (isError) {
    return (
      <div className="empty-state">
        <h3>Erro ao carregar dashboard</h3>
        <p>Tente novamente em instantes.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <span className="dashboard-card-label">Agendamentos em aberto</span>
        <h2>{isLoading ? '...' : stats?.open_appointments ?? 0}</h2>
        <p>Quantidade de agendamentos ainda não finalizados.</p>
      </div>

      <div className="dashboard-card">
        <span className="dashboard-card-label">Clientes cadastrados</span>
        <h2>{isLoading ? '...' : stats?.clients_count ?? 0}</h2>
        <p>Total de clientes cadastrados.</p>
      </div>

      <div className="dashboard-card">
        <span className="dashboard-card-label">Atendimentos concluídos hoje</span>
        <h2>{isLoading ? '...' : stats?.completed_today ?? 0}</h2>
        <p>Total de atendimentos finalizados hoje.</p>
      </div>
    </div>
  );
}