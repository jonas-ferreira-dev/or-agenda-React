// src/features/availabilities/components/availability-list.tsx

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAvailability } from '../services/delete-availability';
import { updateAvailability } from '../services/update-availability';
import {
  formatTime,
  getWeekdayLabel,
  WEEKDAYS,
  type ProfessionalAvailability,
} from '../types/availability';

type AvailabilityListProps = {
  availabilities: ProfessionalAvailability[];
  onEdit: (availability: ProfessionalAvailability) => void;
};

export function AvailabilityList({
  availabilities,
  onEdit,
}: AvailabilityListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['professional-availabilities'],
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (availability: ProfessionalAvailability) =>
      updateAvailability(availability.id, {
        weekday: availability.weekday,
        start_time: formatTime(availability.start_time),
        end_time: formatTime(availability.end_time),
        is_active: !availability.is_active,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['professional-availabilities'],
      });
    },
  });

  const groupedAvailabilities = WEEKDAYS.map((day) => ({
    ...day,
    availabilities: availabilities.filter(
      (availability) => availability.weekday === day.value
    ),
  }));

  if (availabilities.length === 0) {
    return (
      <div className="empty-state">
        <h3>Nenhum horário cadastrado</h3>
        <p>
          Cadastre seus horários de atendimento para liberar agendamentos no
          link público.
        </p>
      </div>
    );
  }

  return (
    <div className="availability-days-list">
      {groupedAvailabilities.map((day) => (
        <div key={day.value} className="availability-day-card">
          <div className="availability-day-header">
            <h3>{day.label}</h3>
            <span>{day.availabilities.length} bloco(s)</span>
          </div>

          {day.availabilities.length === 0 ? (
            <p className="availability-empty-day">Sem atendimento</p>
          ) : (
            <div className="availability-blocks">
              {day.availabilities.map((availability) => (
                <div
                  key={availability.id}
                  className={`availability-block ${
                    !availability.is_active ? 'inactive' : ''
                  }`}
                >
                  <div>
                    <strong>
                      {formatTime(availability.start_time)} até{' '}
                      {formatTime(availability.end_time)}
                    </strong>

                    <p>
                      {availability.is_active
                        ? 'Ativo para agendamentos'
                        : 'Pausado'}
                    </p>
                  </div>

                  <div className="availability-actions">
                    <button
                    type="button"
                    className="ghost-button"
                    onClick={() => onEdit(availability)}
                    >
                    Editar
                    </button>

                    <button
                      type="button"
                      className="ghost-button"
                      disabled={toggleMutation.isPending}
                      onClick={() => toggleMutation.mutate(availability)}
                    >
                      {availability.is_active ? 'Pausar' : 'Ativar'}
                    </button>

                    <button
                      type="button"
                      className="table-action-button danger"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        const confirmed = window.confirm(
                          `Remover o horário de ${getWeekdayLabel(
                            availability.weekday
                          )} das ${formatTime(
                            availability.start_time
                          )} às ${formatTime(availability.end_time)}?`
                        );

                        if (confirmed) {
                          deleteMutation.mutate(availability.id);
                        }
                      }}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}