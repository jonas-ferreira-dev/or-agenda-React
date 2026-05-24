export type AppointmentStatusFilter =
  | ''
  | 'scheduled'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export type AppointmentFilters = {
  search: string;
  status: AppointmentStatusFilter;
  date: string;
};