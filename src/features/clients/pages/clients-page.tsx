import { useState } from 'react';
import axios from 'axios';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { Button } from '@/shared/components/ui/button';
import { listClients } from '../services/list-clients';
import { deleteClient } from '../services/delete-client';
import { ClientForm } from '../components/client-form';
import { ClientsTable } from '../components/clients-table';
import type { Client } from '../types/client';

const CLIENTS_QUERY_KEY = ['clients'];

export function ClientsPage() {
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: CLIENTS_QUERY_KEY,
    queryFn: () => listClients(),
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: (clientId: number) => deleteClient(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });

  const clients = data?.data ?? [];

  function getPageErrorMessage() {
    if (!error) return '';

    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || 'Erro ao carregar clientes.';
    }

    return 'Erro inesperado ao carregar clientes.';
  }

  function handleCreate() {
    setSelectedClient(null);
    setIsFormOpen(true);
  }

  function handleEdit(client: Client) {
    setSelectedClient(client);
    setIsFormOpen(true);
  }

  async function handleDelete(client: Client) {
    const confirmed = window.confirm(`Deseja excluir o cliente "${client.name}"?`);

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(client.id);
    } catch (mutationError) {
      if (axios.isAxiosError(mutationError)) {
        alert(mutationError.response?.data?.message || 'Erro ao excluir cliente.');
        return;
      }

      alert('Erro inesperado ao excluir cliente.');
    }
  }

  async function handleFormSuccess() {
    setIsFormOpen(false);
    setSelectedClient(null);

    await queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
  }

  function handleCloseForm() {
    setIsFormOpen(false);
    setSelectedClient(null);
  }

  const pageError = getPageErrorMessage();

  return (
    <div className="content-stack">
      <div className="page-header">
        <div>
          <span className="section-badge">Clientes</span>
          <h1 className="page-title">Cadastro de clientes</h1>
          <p className="page-description">
            Gerencie os clientes vinculados à sua agenda.
          </p>
        </div>

        <Button onClick={handleCreate}>Novo cliente</Button>
      </div>

      {pageError && <p className="server-error">{pageError}</p>}

      {isLoading ? (
        <div className="table-card">
          <p>Carregando clientes...</p>
        </div>
      ) : (
        <>
          {isFetching && (
            <div className="table-card">
              <p>Atualizando lista...</p>
            </div>
          )}

          <ClientsTable
            clients={clients}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}

      {isFormOpen && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedClient ? 'Editar cliente' : 'Novo cliente'}</h2>
                <p>
                  {selectedClient
                    ? 'Atualize os dados do cliente.'
                    : 'Preencha os dados para cadastrar um novo cliente.'}
                </p>
              </div>

              <button className="modal-close-button" onClick={handleCloseForm}>
                Fechar
              </button>
            </div>

            <ClientForm
              client={selectedClient}
              onSuccess={handleFormSuccess}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}