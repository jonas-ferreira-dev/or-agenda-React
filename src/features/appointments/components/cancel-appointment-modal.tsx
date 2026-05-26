import { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/shared/components/ui/button';
import { cancelAppointment } from '../services/cancel-appointment';
import type { Appointment } from '../types/appointment';

type CancelAppointmentModalProps = {
  appointment: Appointment;
  onClose: () => void;
  onSuccess: () => void;
};

export function CancelAppointmentModal({
  appointment,
  onClose,
  onSuccess,
}: CancelAppointmentModalProps) {
  const [reason, setReason] = useState('');
  const [serverError, setServerError] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      cancelAppointment(appointment.id, {
        cancellation_reason: reason.trim(),
      }),
    onSuccess: () => {
      setServerError('');
      onSuccess();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const errors = error.response?.data?.errors;

        if (errors && typeof errors === 'object') {
          const firstError = Object.values(errors)[0];

          if (Array.isArray(firstError) && firstError[0]) {
            setServerError(String(firstError[0]));
            return;
          }
        }

        setServerError(
          error.response?.data?.message || 'Erro ao cancelar agendamento.'
        );
        return;
      }

      if (error instanceof Error) {
        setServerError(error.message);
        return;
      }

      setServerError('Erro inesperado ao cancelar agendamento.');
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!reason.trim()) {
      setServerError('Informe o motivo do cancelamento.');
      return;
    }

    setServerError('');
    mutation.mutate();
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-card" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Cancelar agendamento</h2>
            <p className="modal-description">
              Informe o motivo do cancelamento. Esse motivo ficará salvo no
              histórico do agendamento.
            </p>
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        <form className="client-form" onSubmit={handleSubmit}>
          {serverError && <p className="server-error">{serverError}</p>}

          <div className="cancel-appointment-summary">
            <strong>{appointment.client?.name ?? 'Cliente'}</strong>
            <span>
              {appointment.service?.name ?? 'Serviço'} ·{' '}
              {String(appointment.start_time).slice(0, 5)} até{' '}
              {String(appointment.end_time).slice(0, 5)}
            </span>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="cancellation-reason">
              Motivo do cancelamento
            </label>

            <textarea
              id="cancellation-reason"
              className="ui-input cancel-reason-textarea"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Ex: Profissional indisponível neste horário."
              rows={5}
              maxLength={1000}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="ghost-button"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Voltar
            </button>

            <Button
              type="submit"
              disabled={mutation.isPending || !reason.trim()}
            >
              {mutation.isPending ? 'Cancelando...' : 'Confirmar cancelamento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}