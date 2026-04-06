import { useEffect, useState } from 'react';
import axios from 'axios';

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

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  async function loadPageData() {
    try {
      setIsLoading(true);
      setPageError('');

      const [appointmentsResponse, clientsResponse, servicesResponse] =
        await Promise.all([
          listAppointments(),
          listClients(1, 100),
          listServices(1, 100),
        ]);

      setAppointments(appointmentsResponse.data);
      setClients(clientsResponse.data);
      setServices(servicesResponse.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setPageError(
          error.response?.data?.message || 'Erro ao carregar agendamentos.'
        );
      } else {
        setPageError('Erro inesperado ao carregar agendamentos.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

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
      await deleteAppointment(appointment.id);
      await loadPageData();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Erro ao excluir agendamento.');
        return;
      }

      alert('Erro inesperado ao excluir agendamento.');
    }
  }

  async function handleFormSuccess() {
    setIsFormOpen(false);
    setSelectedAppointment(null);
    await loadPageData();
  }

  function handleCloseForm() {
    setIsFormOpen(false);
    setSelectedAppointment(null);
  }

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
        <AppointmentsTable
          appointments={appointments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
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

            <AppointmentForm
              appointment={selectedAppointment}
              clients={clients}
              services={services}
              onSuccess={handleFormSuccess}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}