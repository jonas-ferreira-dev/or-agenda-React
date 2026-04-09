export function DashboardPage() {
  return (
    <div className="dashboard-grid">

      <div className="dashboard-card">
        <span className="dashboard-card-label">Gerencie agendamentos</span>
        <h2>Agendamentos</h2>
        <p>
          Gerencie seus agendamentos.
        </p>
      </div>

      <div className="dashboard-card">
        <span className="dashboard-card-label">Controle seus serviços</span>
        <h2>Serviços</h2>
        <p>
          Gerencie seus serviços.
        </p>
      </div>
    </div>
  );
}