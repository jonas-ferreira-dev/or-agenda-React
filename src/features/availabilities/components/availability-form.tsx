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

  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([1]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [isActive, setIsActive] = useState(true);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!selectedAvailability) {
      setSelectedWeekdays([1]);
      setStartTime('10:00');
      setEndTime('12:00');
      setIsActive(true);
      setServerError('');
      return;
    }

    setSelectedWeekdays([selectedAvailability.weekday]);
    setStartTime(selectedAvailability.start_time.slice(0, 5));
    setEndTime(selectedAvailability.end_time.slice(0, 5));
    setIsActive(selectedAvailability.is_active);
    setServerError('');
  }, [selectedAvailability]);

  function toggleWeekday(weekday: number) {
    setSelectedWeekdays((current) => {
      if (current.includes(weekday)) {
        return current.filter((day) => day !== weekday);
      }

      return [...current, weekday].sort((a, b) => a - b);
    });
  }

  const mutation = useMutation({
    mutationFn: async () => {
      if (!selectedWeekdays.length) {
        throw new Error('Selecione pelo menos um dia da semana.');
      }

      if (isEditing) {
        return updateAvailability(selectedAvailability.id, {
          weekday: selectedWeekdays[0],
          start_time: startTime,
          end_time: endTime,
          is_active: isActive,
        });
      }

      return Promise.all(
        selectedWeekdays.map((weekday) =>
          createAvailability({
            weekday,
            start_time: startTime,
            end_time: endTime,
            is_active: isActive,
          })
        )
      );
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
            setServerError(String(firstError[0]));
            return;
          }
        }

        setServerError(
          error.response?.data?.message || 'Erro ao salvar horário.'
        );
        return;
      }

      if (error instanceof Error) {
        setServerError(error.message);
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
        <label className="form-label">Dia(s) da semana</label>

        <div className="weekday-checkbox-grid">
          {WEEKDAYS.map((day) => (
            <label key={day.value} className="weekday-checkbox">
              <input
                type="checkbox"
                checked={selectedWeekdays.includes(day.value)}
                disabled={isEditing}
                onChange={() => toggleWeekday(day.value)}
              />
              <span>{day.label}</span>
            </label>
          ))}
        </div>

        {isEditing && (
          <p className="form-helper-text">
            Para editar o dia, remova este horário e cadastre novamente.
          </p>
        )}
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