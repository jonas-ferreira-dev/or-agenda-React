import type { Appointment } from '../types/appointment';

type AppointmentSummaryCardsProps = {
  appointments: Appointment[];
};

function isToday(dateValue: string) {
  const today = new Date();
  const date = new Date(`${dateValue}T00:00:00`);

  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}

export function AppointmentSummaryCards({
  appointments,
}: AppointmentSummaryCardsProps) {
  const todayCount = appointments.filter((appointment) =>
    isToday(appointment.appointment_date)
  ).length;

  const scheduledCount = appointments.filter(
    (appointment) => appointment.status === 'scheduled'
  ).length;

  const completedCount = appointments.filter(
    (appointment) => appointment.status === 'completed'
  ).length;

  const cancelledCount = appointments.filter(
    (appointment) => appointment.status === 'cancelled'
  ).length;

  return (
    <div className="appointments-summary-grid">
      <div
        className={`appointments-summary-card ${
            todayCount > 0 ? 'primary' : ''
        }`}
        >
        <span>Hoje</span>
        <strong>{todayCount}</strong>
        <p>Agendamentos para hoje</p>
     </div>

      <div className="appointments-summary-card">
        <span>Agendados</span>
        <strong>{scheduledCount}</strong>
        <p>Atendimentos em aberto</p>
      </div>

      <div className="appointments-summary-card">
        <span>Concluídos</span>
        <strong>{completedCount}</strong>
        <p>Atendimentos finalizados</p>
      </div>

      <div className="appointments-summary-card danger">
        <span>Cancelados</span>
        <strong>{cancelledCount}</strong>
        <p>Cancelamentos registrados</p>
      </div>
    </div>
  );
}