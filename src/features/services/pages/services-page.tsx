import { useState } from 'react';
import axios from 'axios';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { Button } from '@/shared/components/ui/button';
import { listServices } from '../services/list-services';
import { deleteService } from '../services/delete-service';
import { ServiceForm } from '../components/service-form';
import { ServicesTable } from '../components/services-table';
import type { Service } from '../types/service';

const SERVICES_QUERY_KEY = ['services'];

export function ServicesPage() {
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: SERVICES_QUERY_KEY,
    queryFn: () => listServices(),
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: (serviceId: number) => deleteService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY });
    },
  });

  const services = data?.data ?? [];

  function getPageErrorMessage() {
    if (!error) return '';

    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || 'Erro ao carregar serviços.';
    }

    return 'Erro inesperado ao carregar serviços.';
  }

  function handleCreate() {
    setSelectedService(null);
    setIsFormOpen(true);
  }

  function handleEdit(service: Service) {
    setSelectedService(service);
    setIsFormOpen(true);
  }

  async function handleDelete(service: Service) {
    const confirmed = window.confirm(`Deseja excluir o serviço "${service.name}"?`);

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(service.id);
    } catch (mutationError) {
      if (axios.isAxiosError(mutationError)) {
        alert(mutationError.response?.data?.message || 'Erro ao excluir serviço.');
        return;
      }

      alert('Erro inesperado ao excluir serviço.');
    }
  }

  async function handleFormSuccess() {
    setIsFormOpen(false);
    setSelectedService(null);

    await queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY });
  }

  function handleCloseForm() {
    setIsFormOpen(false);
    setSelectedService(null);
  }

  const pageError = getPageErrorMessage();

  return (
    <div className="content-stack">
      <div className="page-header">
        <div>
          <span className="section-badge">Serviços</span>
          <h1 className="page-title">Cadastro de serviços</h1>
          <p className="page-description">
            Gerencie os serviços disponíveis para seus agendamentos.
          </p>
        </div>

        <Button onClick={handleCreate}>Novo serviço</Button>
      </div>

      {pageError && <p className="server-error">{pageError}</p>}

      {isLoading ? (
        <div className="table-card">
          <p>Carregando serviços...</p>
        </div>
      ) : (
        <>
          {isFetching && (
            <div className="table-card">
              <p>Atualizando lista...</p>
            </div>
          )}

          <ServicesTable
            services={services}
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
                <h2>{selectedService ? 'Editar serviço' : 'Novo serviço'}</h2>
                <p>
                  {selectedService
                    ? 'Atualize os dados do serviço.'
                    : 'Preencha os dados para cadastrar um novo serviço.'}
                </p>
              </div>

              <button className="modal-close-button" onClick={handleCloseForm}>
                Fechar
              </button>
            </div>

            <ServiceForm
              service={selectedService}
              onSuccess={handleFormSuccess}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}