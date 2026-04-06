import { useEffect, useState } from 'react';
import axios from 'axios';

import { Button } from '@/shared/components/ui/button';
import { listClients } from '../services/list-clients';
import { deleteClient } from '../services/delete-client';
import { ClientForm } from '../components/client-form';
import { ClientsTable } from '../components/clients-table';
import type { Client } from '../types/client';

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  async function loadClients() {
    try {
      setIsLoading(true);
      setPageError('');

      const response = await listClients();
      setClients(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setPageError(error.response?.data?.message || 'Erro ao carregar clientes.');
      } else {
        setPageError('Erro inesperado ao carregar clientes.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

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
      await deleteClient(client.id);
      await loadClients();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Erro ao excluir cliente.');
        return;
      }

      alert('Erro inesperado ao excluir cliente.');
    }
  }

  async function handleFormSuccess() {
    setIsFormOpen(false);
    setSelectedClient(null);
    await loadClients();
  }

  function handleCloseForm() {
    setIsFormOpen(false);
    setSelectedClient(null);
  }

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
        <ClientsTable
          clients={clients}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
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