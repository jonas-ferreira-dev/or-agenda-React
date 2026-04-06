import type { Service } from '../types/service';

type ServicesTableProps = {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
};

export function ServicesTable({
  services,
  onEdit,
  onDelete,
}: ServicesTableProps) {
  if (!services.length) {
    return (
      <div className="empty-state">
        <h3>Nenhum serviço encontrado</h3>
        <p>Cadastre seu primeiro serviço para começar a criar agendamentos.</p>
      </div>
    );
  }

  return (
    <div className="table-card">
      <table className="data-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Duração</th>
            <th>Preço</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.name}</td>
              <td>{service.duration_minutes} min</td>
              <td>{service.price ? `R$ ${service.price}` : '-'}</td>
              <td>{service.active ? 'Ativo' : 'Inativo'}</td>
              <td>
                <div className="table-actions">
                  <button
                    className="table-action-button"
                    onClick={() => onEdit(service)}
                  >
                    Editar
                  </button>
                  <button
                    className="table-action-button danger"
                    onClick={() => onDelete(service)}
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}