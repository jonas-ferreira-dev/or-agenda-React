import type { Appointment } from '../types/appointment';
import {
  getAppointmentStatusClass,
  getAppointmentStatusLabel,
} from '../utils/appointment-status';
import { formatDate, formatTime } from '@/shared/utils/format';

type AppointmentsTableProps = {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
};

export function AppointmentsTable({
  appointments,
  onEdit,
  onDelete,
}: AppointmentsTableProps) {
  if (!appointments.length) {
    return (
      <div className="empty-state">
        <h3>Nenhum agendamento encontrado</h3>
        <p>Cadastre seu primeiro agendamento para começar a gerenciar sua agenda.</p>
      </div>
    );
  }

  return (
    <div className="table-card">
      <table className="data-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Serviço</th>
            <th>Data</th>
            <th>Início</th>
            <th>Fim</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.client?.name ?? '-'}</td>
              <td>{appointment.service?.name ?? '-'}</td>
              <td>{formatDate(appointment.appointment_date)}</td>
              <td>{formatTime(appointment.start_time)}</td>
              <td>{formatTime(appointment.end_time)}</td>
              <td>
                <span className={getAppointmentStatusClass(appointment.status)}>
                  {getAppointmentStatusLabel(appointment.status)}
                </span>
              </td>
              <td>
                <div className="table-actions">
                  <button
                    className="table-action-button"
                    onClick={() => onEdit(appointment)}
                  >
                    Editar
                  </button>
                  <button
                    className="table-action-button danger"
                    onClick={() => onDelete(appointment)}
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}