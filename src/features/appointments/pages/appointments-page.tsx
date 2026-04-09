import { useState } from 'react';
import axios from 'axios';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { Button } from '@/shared/components/ui/button';
import { listAppointments } from '../services/list-appointments';
import { deleteAppointment } from '../services/delete-appointment';
import { AppointmentForm } from '../components/appointment-form';
import { AppointmentsTable } from '../components/appointments-table';
import type { Appointment } from '../types/appointment';

import { listClients } from '@/features/clients/services/list-clients';
import { listServices } from '@/features/services/services/list-services';
import type { Client } from '@/features/clients/types/client';
import type { Service } from '@/features/services/types/service';

const APPOINTMENTS_QUERY_KEY = ['appointments'];
const APPOINTMENT_FORM_CLIENTS_QUERY_KEY = ['appointment-form-clients'];
const APPOINTMENT_FORM_SERVICES_QUERY_KEY = ['appointment-form-services'];

export function AppointmentsPage() {
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const {
    data: appointmentsData,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: APPOINTMENTS_QUERY_KEY,
    queryFn: () => listAppointments(),
    staleTime: 1000 * 60 * 2,
  });

  const {
    data: clientsData,
    isLoading: isLoadingClients,
  } = useQuery({
    queryKey: APPOINTMENT_FORM_CLIENTS_QUERY_KEY,
    queryFn: () => listClients(1, 100),
    enabled: isFormOpen,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: servicesData,
    isLoading: isLoadingServices,
  } = useQuery({
    queryKey: APPOINTMENT_FORM_SERVICES_QUERY_KEY,
    queryFn: () => listServices(1, 100),
    enabled: isFormOpen,
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: (appointmentId: number) => deleteAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });

  const appointments = appointmentsData?.data ?? [];
  const clients: Client[] = clientsData?.data ?? [];
  const services: Service[] = servicesData?.data ?? [];

  function getPageErrorMessage() {
    if (!error) return '';

    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || 'Erro ao carregar agendamentos.';
    }

    return 'Erro inesperado ao carregar agendamentos.';
  }

  function handleCreate() {
    setSelectedAppointment(null);
    setIsFormOpen(true);
  }

  function handleEdit(appointment: Appointment) {
    setSelectedAppointment(appointment);
    setIsFormOpen(true);
  }

  async function handleDelete(appointment: Appointment) {
    const confirmed = window.confirm(
      `Deseja excluir o agendamento de "${appointment.client?.name ?? 'cliente'}"?`
    );

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(appointment.id);
    } catch (mutationError) {
      if (axios.isAxiosError(mutationError)) {
        alert(
          mutationError.response?.data?.message || 'Erro ao excluir agendamento.'
        );
        return;
      }

      alert('Erro inesperado ao excluir agendamento.');
    }
  }

  async function handleFormSuccess() {
    setIsFormOpen(false);
    setSelectedAppointment(null);

    await queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
  }

  function handleCloseForm() {
    setIsFormOpen(false);
    setSelectedAppointment(null);
  }

  const pageError = getPageErrorMessage();
  const isFormDataLoading = isLoadingClients || isLoadingServices;

  return (
    <div className="content-stack">
      <div className="page-header">
        <div>
          <span className="section-badge">Agendamentos</span>
          <h1 className="page-title">Gestão de agendamentos</h1>
          <p className="page-description">
            Organize sua agenda, clientes e serviços em um só lugar.
          </p>
        </div>

        <Button onClick={handleCreate}>Novo agendamento</Button>
      </div>

      {pageError && <p className="server-error">{pageError}</p>}

      {isLoading ? (
        <div className="table-card">
          <p>Carregando agendamentos...</p>
        </div>
      ) : (
        <>
          {isFetching && (
            <div className="table-card">
              <p>Atualizando lista...</p>
            </div>
          )}

          <AppointmentsTable
            appointments={appointments}
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
                <h2>
                  {selectedAppointment ? 'Editar agendamento' : 'Novo agendamento'}
                </h2>
                <p>
                  {selectedAppointment
                    ? 'Atualize os dados do agendamento.'
                    : 'Preencha os dados para cadastrar um novo agendamento.'}
                </p>
              </div>

              <button className="modal-close-button" onClick={handleCloseForm}>
                Fechar
              </button>
            </div>

            {isFormDataLoading ? (
              <div className="table-card">
                <p>Carregando dados do formulário...</p>
              </div>
            ) : (
              <AppointmentForm
                appointment={selectedAppointment}
                clients={clients}
                services={services}
                onSuccess={handleFormSuccess}
                onCancel={handleCloseForm}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}