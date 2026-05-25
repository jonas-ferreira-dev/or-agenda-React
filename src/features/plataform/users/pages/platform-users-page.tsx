import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/shared/components/ui/button';
import { PlatformUserForm } from '../components/platform-user-form';
import { PlatformUserFilters } from '../components/platform-user-filters';
import { PlatformUsersTable } from '../components/platform-users-table';
import { listPlatformUsers } from '../services/list-platform-users';
import type { PlatformUser } from '../types/plataform-user';
import {
  INITIAL_PLATFORM_USER_FILTERS,
  type PlatformUserFilters as PlatformUserFiltersType,
} from '../types/platform-user-filters';

const PLATFORM_USERS_QUERY_KEY = ['platform-users'];

export function PlatformUsersPage() {
  const queryClient = useQueryClient();

  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState<PlatformUserFiltersType>(
    INITIAL_PLATFORM_USER_FILTERS
  );

  const usersQuery = useQuery({
    queryKey: [...PLATFORM_USERS_QUERY_KEY, filters],
    queryFn: () => listPlatformUsers(filters),
  });

  function handleSuccess() {
    queryClient.invalidateQueries({
      queryKey: PLATFORM_USERS_QUERY_KEY,
    });

    setSelectedUser(null);
    setIsModalOpen(false);
  }

  function handleClearFilters() {
    setFilters(INITIAL_PLATFORM_USER_FILTERS);
  }

  function handleCreateUser() {
    setSelectedUser(null);
    setIsModalOpen(true);
  }

  function handleEditUser(user: PlatformUser) {
    setSelectedUser(user);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setSelectedUser(null);
    setIsModalOpen(false);
  }

  return (
    <div className="content-stack">
      <div className="page-header">
        <div>
          <span className="section-badge">Plataforma</span>
          <h1 className="page-title">Usuários da plataforma</h1>
          <p className="page-description">
            Cadastre, edite, bloqueie ou desbloqueie o acesso dos clientes.
          </p>
        </div>

        <Button type="button" onClick={handleCreateUser}>
          Novo usuário
        </Button>
      </div>

      <PlatformUserFilters
        filters={filters}
        onChange={setFilters}
        onClear={handleClearFilters}
      />

      <div className="table-card">
        <div className="card-header-row">
          <div>
            <h2 className="card-title">Usuários cadastrados</h2>
            <p className="page-description">
              {usersQuery.data?.meta.total ?? 0} usuário(s) encontrado(s).
            </p>
          </div>
        </div>

        {usersQuery.isLoading && <p>Carregando usuários...</p>}

        {usersQuery.isError && (
          <p className="server-error">Erro ao carregar usuários.</p>
        )}

        {usersQuery.data && (
          <PlatformUsersTable
            users={usersQuery.data.data}
            onEdit={handleEditUser}
          />
        )}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-card" role="dialog" aria-modal="true">
            <div className="modal-header">
              <div>
                <h2 className="modal-title">
                  {selectedUser ? 'Editar usuário' : 'Novo usuário'}
                </h2>

                <p className="modal-description">
                  {selectedUser
                    ? 'Altere os dados de acesso do cliente selecionado.'
                    : 'Crie o acesso inicial para um novo cliente.'}
                </p>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={handleCloseModal}
                aria-label="Fechar modal"
              >
                ×
              </button>
            </div>

            <PlatformUserForm
              selectedUser={selectedUser}
              onSuccess={handleSuccess}
              onCancelEdit={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}