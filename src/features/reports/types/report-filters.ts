// src/features/reports/types/report-filters.ts

export type ReportType = 'revenue' | 'appointments' | 'cancellations' | 'clients';

export type AppointmentReportStatus =
  | ''
  | 'scheduled'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export type ReportFilters = {
  start_date: string;
  end_date: string;
  status: AppointmentReportStatus;
  search: string;
};

export const INITIAL_REPORT_FILTERS: ReportFilters = {
  start_date: new Date().toISOString().slice(0, 10),
  end_date: new Date().toISOString().slice(0, 10),
  status: '',
  search: '',
};