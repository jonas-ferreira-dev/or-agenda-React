import { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

import type { Appointment } from '../types/appointment';
import {
  getAppointmentStatusClass,
  getAppointmentStatusLabel,
} from '../utils/appointment-status';
import { formatDate, formatTime } from '@/shared/utils/format';
import { CancelAppointmentModal } from './cancel-appointment-modal';
import { completeAppointment } from '../services/complete-appointment';

type AppointmentsTableProps = {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
  onCancelled: () => void;
};

export function AppointmentsTable({
  appointments,
  onEdit,
  onDelete,
  onCancelled,
}: AppointmentsTableProps) {
  const [appointmentToCancel, setAppointmentToCancel] =
    useState<Appointment | null>(null);
  const [actionError, setActionError] = useState('');
  const [completingAppointmentId, setCompletingAppointmentId] =
    useState<number | null>(null);
  const [actionSuccess, setActionSuccess] = useState('');
  

  const completeMutation = useMutation({
  mutationFn: (appointmentId: number) => {
    setCompletingAppointmentId(appointmentId);
    return completeAppointment(appointmentId);
  },
  onSuccess: () => {
    setActionError('');
    setCompletingAppointmentId(null);
    showSuccessMessage('Agendamento registrado como concluído.');
    onCancelled();
  },
  onError: (error) => {
    setCompletingAppointmentId(null);
    setActionSuccess('');

    if (axios.isAxiosError(error)) {
      setActionError(
        error.response?.data?.message || 'Erro ao concluir agendamento.'
      );
      return;
    }

    setActionError('Erro inesperado ao concluir agendamento.');
  },
});

function showSuccessMessage(message: string) {
  setActionSuccess(message);

  window.setTimeout(() => {
    setActionSuccess('');
  }, 3500);
}

  if (!appointments.length) {
    return (
      <div className="appointments-empty-state">
        <div>
          <span>Nenhum resultado</span>
          <h3>Nenhum agendamento encontrado</h3>
          <p>
            Ajuste os filtros ou cadastre um novo agendamento para começar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="appointments-list-card">
        <div className="appointments-list-header">
          <div>
            <h2>Agenda</h2>
            <p>{appointments.length} agendamento(s) encontrado(s)</p>
          </div>
        </div>

        {actionError && (
          <p className="server-error appointments-action-error">{actionError}</p>
        )}

        {actionSuccess && (
          <p className="appointments-action-success">{actionSuccess}</p>
        )}

        <div className="appointments-card-grid">
          {appointments.map((appointment) => {
            const isCancelled = appointment.status === 'cancelled';
            const isCompleted = appointment.status === 'completed';
            const canComplete = !isCancelled && !isCompleted;
            const isCompleting = completingAppointmentId === appointment.id;

            return (
              <article key={appointment.id} className="appointment-item-card">
                <div className="appointment-card-top">
                  <div className="appointment-avatar">
                    {(appointment.client?.name ?? '?').charAt(0).toUpperCase()}
                  </div>

                  <div className="appointment-card-title">
                    <h3>{appointment.client?.name ?? 'Cliente não informado'}</h3>
                    <p>{appointment.service?.name ?? 'Serviço não informado'}</p>
                  </div>

                  <span className={getAppointmentStatusClass(appointment.status)}>
                    {getAppointmentStatusLabel(appointment.status)}
                  </span>
                </div>

                <div className="appointment-item-meta">
                  <div className="appointment-meta-box">
                    <span>Data</span>
                    <strong>{formatDate(appointment.appointment_date)}</strong>
                  </div>

                  <div className="appointment-meta-box">
                    <span>Horário</span>
                    <strong>
                      {formatTime(appointment.start_time)} até{' '}
                      {formatTime(appointment.end_time)}
                    </strong>
                  </div>
                </div>

                <div className="appointment-card-actions icon-actions">
                  {canComplete && (
                    <button
                      type="button"
                      className="icon-action-button success"
                      disabled={isCompleting}
                      onClick={() => completeMutation.mutate(appointment.id)}
                      title="Concluir agendamento"
                      aria-label="Concluir agendamento"
                    >
                      {isCompleting ? '...' : '✓'}
                    </button>
                  )}

                  <button
                    type="button"
                    className="icon-action-button"
                    disabled={isCancelled || isCompleted}
                    onClick={() => onEdit(appointment)}
                    title="Editar agendamento"
                    aria-label="Editar agendamento"
                  >
                    ✎
                  </button>

                  <button
                    type="button"
                    className="icon-action-button danger"
                    disabled={isCancelled || isCompleted}
                    onClick={() => setAppointmentToCancel(appointment)}
                    title="Cancelar agendamento"
                    aria-label="Cancelar agendamento"
                  >
                    ⊘
                  </button>

                  <button
                    type="button"
                    className="icon-action-button ghost-danger"
                    onClick={() => onDelete(appointment)}
                    title="Excluir agendamento"
                    aria-label="Excluir agendamento"
                  >
                    🗑
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      

      {appointmentToCancel && (
        <CancelAppointmentModal
          appointment={appointmentToCancel}
          onClose={() => setAppointmentToCancel(null)}
          onSuccess={() => {
            setAppointmentToCancel(null);
            setActionError('');
            showSuccessMessage('Agendamento cancelado com sucesso.');
            onCancelled();
          }}
        />
      )}
    </>
  );
}