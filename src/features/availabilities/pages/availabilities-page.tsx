// src/features/availabilities/pages/availabilities-page.tsx

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/shared/components/ui/button';
import { AvailabilityForm } from '../components/availability-form';
import { AvailabilityList } from '../components/availability-list';
import { listAvailabilities } from '../services/list-availabilities';
import type { ProfessionalAvailability } from '../types/availability';

export function AvailabilitiesPage() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] =
    useState<ProfessionalAvailability | null>(null);

  const availabilitiesQuery = useQuery({
    queryKey: ['professional-availabilities'],
    queryFn: listAvailabilities,
  });

  function handleCreate() {
    setSelectedAvailability(null);
    setIsModalOpen(true);
  }

  function handleEdit(availability: ProfessionalAvailability) {
    setSelectedAvailability(availability);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setSelectedAvailability(null);
    setIsModalOpen(false);
  }

  function handleSuccess() {
    queryClient.invalidateQueries({
      queryKey: ['professional-availabilities'],
    });

    handleCloseModal();
  }

  return (
    <div className="content-stack">
      <div className="page-header">
        <div>
          <span className="section-badge">Agenda</span>
          <h1 className="page-title">Horários de atendimento</h1>
          <p className="page-description">
            Defina os dias e horários em que seus clientes podem agendar pelo
            link público.
          </p>
        </div>

        <Button type="button" onClick={handleCreate}>
          Novo horário
        </Button>
      </div>

      <div className="availability-help-card">
        <strong>Como funciona?</strong>
        <p>
          Você pode cadastrar vários blocos no mesmo dia, como 10:00 às 12:00 e
          13:00 às 19:00. O sistema não permite horários sobrepostos.
        </p>
      </div>

      <div className="table-card">
        <div className="card-header-row">
          <div>
            <h2 className="card-title">Disponibilidade semanal</h2>
            <p className="page-description">
              Esses horários serão usados para controlar os agendamentos
              disponíveis.
            </p>
          </div>
        </div>

        {availabilitiesQuery.isLoading && <p>Carregando horários...</p>}

        {availabilitiesQuery.isError && (
          <p className="server-error">Erro ao carregar horários.</p>
        )}

        {availabilitiesQuery.data && (
          <AvailabilityList
            availabilities={availabilitiesQuery.data.data}
            onEdit={handleEdit}
          />
        )}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-card" role="dialog" aria-modal="true">
            <div className="modal-header">
              <div>
                <h2 className="modal-title">
                  {selectedAvailability ? 'Editar horário' : 'Novo horário'}
                </h2>
                <p className="modal-description">
                  {selectedAvailability
                    ? 'Altere o bloco de atendimento selecionado.'
                    : 'Cadastre um novo bloco de disponibilidade.'}
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

            <AvailabilityForm
              selectedAvailability={selectedAvailability}
              onSuccess={handleSuccess}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}