import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePlatformUser } from '../services/update-platform-user';
import type { PlatformUser } from '../types/plataform-user';

type PlatformUsersTableProps = {
  users: PlatformUser[];
  onEdit: (user: PlatformUser) => void;
};

export function PlatformUsersTable({ users, onEdit }: PlatformUsersTableProps) {
  const queryClient = useQueryClient();

  const toggleStatusMutation = useMutation({
    mutationFn: (user: PlatformUser) =>
      updatePlatformUser(user.id, {
        is_active: !user.is_active,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['platform-users'],
      });
    },
  });

  if (users.length === 0) {
    return (
      <div className="empty-state">
        <h2>Nenhum usuário encontrado</h2>
        <p>Crie o primeiro usuário ou ajuste os filtros de busca.</p>
      </div>
    );
  }

  return (
    <div className="responsive-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Usuário</th>
            <th>E-mail</th>
            <th>Tipo</th>
            <th>Status</th>
            <th className="table-actions-column">Ações</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <strong>{user.name}</strong>
              </td>

              <td>{user.email}</td>

              <td>
                {user.is_platform_admin ? (
                  <span className="status-badge status-confirmed">
                    Admin plataforma
                  </span>
                ) : (
                  <span className="status-badge status-scheduled">
                    Cliente
                  </span>
                )}
              </td>

              <td>
                {user.is_active ? (
                  <span className="status-badge status-confirmed">Ativo</span>
                ) : (
                  <span className="status-badge status-cancelled">
                    Bloqueado
                  </span>
                )}
              </td>

              <td>
                <div className="table-actions">
                  <button type="button" className="ghost-button" onClick={() => onEdit(user)}>
                    Editar
                  </button>

                  {!user.is_platform_admin && (
                    <button
                    type="button"
                    className="ghost-button"
                    disabled={toggleStatusMutation.isPending}
                    onClick={() => toggleStatusMutation.mutate(user)}
                    >
                    {user.is_active ? 'Bloquear' : 'Desbloquear'}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}