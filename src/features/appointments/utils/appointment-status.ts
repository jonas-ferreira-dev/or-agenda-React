import type { AppointmentStatus } from '../types/appointment';

export function getAppointmentStatusLabel(status: AppointmentStatus) {
  const labels: Record<AppointmentStatus, string> = {
    scheduled: 'Agendado',
    confirmed: 'Confirmado',
    completed: 'Concluído',
    cancelled: 'Cancelado',
  };

  return labels[status] ?? status;
}

export function getAppointmentStatusClass(status: AppointmentStatus) {
  const classes: Record<AppointmentStatus, string> = {
    scheduled: 'status-badge scheduled',
    confirmed: 'status-badge confirmed',
    completed: 'status-badge completed',
    cancelled: 'status-badge cancelled',
  };

  return classes[status] ?? 'status-badge';
}