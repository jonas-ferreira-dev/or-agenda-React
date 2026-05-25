// src/features/reports/services/get-appointments-report.ts

import { api } from '@/services/api/client';
import type { ReportFilters } from '../types/report-filters';
import type { AppointmentsReport } from '../types/reports';

type Response = {
  message: string;
  data: AppointmentsReport;
};

export async function getAppointmentsReport(filters: ReportFilters) {
  const response = await api.get<Response>('/reports/appointments', {
    params: {
      start_date: filters.start_date,
      end_date: filters.end_date,
      status: filters.status || undefined,
    },
  });

  return response.data;
}