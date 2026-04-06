import type { Client } from '../types/client';

type ClientsTableProps = {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
};

export function ClientsTable({ clients, onEdit, onDelete }: ClientsTableProps) {
  if (!clients.length) {
    return (
      <div className="empty-state">
        <h3>Nenhum cliente encontrado</h3>
        <p>Cadastre seu primeiro cliente para começar a gerenciar agendamentos.</p>
      </div>
    );
  }

  return (
    <div className="table-card">
      <table className="data-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.email || '-'}</td>
              <td>{client.phone || '-'}</td>
              <td>
                <div className="table-actions">
                  <button className="table-action-button" onClick={() => onEdit(client)}>
                    Editar
                  </button>
                  <button
                    className="table-action-button danger"
                    onClick={() => onDelete(client)}
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