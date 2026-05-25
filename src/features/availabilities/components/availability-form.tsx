// src/features/availabilities/components/availability-form.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/shared/components/ui/button';
import { createAvailability } from '../services/create-availability';
import { updateAvailability } from '../services/update-availability';
import {
  WEEKDAYS,
  type ProfessionalAvailability,
} from '../types/availability';

type AvailabilityFormProps = {
  selectedAvailability: ProfessionalAvailability | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export function AvailabilityForm({
  selectedAvailability,
  onSuccess,
  onCancel,
}: AvailabilityFormProps) {
  const isEditing = selectedAvailability !== null;

  const [weekday, setWeekday] = useState(1);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [isActive, setIsActive] = useState(true);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!selectedAvailability) {
      setWeekday(1);
      setStartTime('10:00');
      setEndTime('12:00');
      setIsActive(true);
      setServerError('');
      return;
    }

    setWeekday(selectedAvailability.weekday);
    setStartTime(selectedAvailability.start_time.slice(0, 5));
    setEndTime(selectedAvailability.end_time.slice(0, 5));
    setIsActive(selectedAvailability.is_active);
    setServerError('');
  }, [selectedAvailability]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        weekday,
        start_time: startTime,
        end_time: endTime,
        is_active: isActive,
      };

      if (isEditing) {
        return updateAvailability(selectedAvailability.id, payload);
      }

      return createAvailability(payload);
    },
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
            setServerError(firstError[0]);
            return;
          }
        }

        setServerError(
          error.response?.data?.message || 'Erro ao salvar horário.'
        );
        return;
      }

      setServerError('Erro inesperado ao salvar horário.');
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError('');
    mutation.mutate();
  }

  return (
    <form className="client-form" onSubmit={handleSubmit}>
      {serverError && <p className="server-error">{serverError}</p>}

      <div className="form-field">
        <label className="form-label" htmlFor="availability-weekday">
          Dia da semana
        </label>

        <select
          id="availability-weekday"
          className="ui-input"
          value={weekday}
          onChange={(event) => setWeekday(Number(event.target.value))}
        >
          {WEEKDAYS.map((day) => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label className="form-label" htmlFor="availability-start-time">
            Início
          </label>

          <input
            id="availability-start-time"
            className="ui-input"
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="availability-end-time">
            Fim
          </label>

          <input
            id="availability-end-time"
            className="ui-input"
            type="time"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            required
          />
        </div>
      </div>

      <label className="checkbox-label availability-checkbox">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
        />
        Horário ativo para agendamentos
      </label>

      <div className="form-actions">
        <button
          type="button"
          className="ghost-button"
          onClick={onCancel}
          disabled={mutation.isPending}
        >
          Cancelar
        </button>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? 'Salvando...'
            : isEditing
              ? 'Salvar alterações'
              : 'Cadastrar horário'}
        </Button>
      </div>
    </form>
  );
}