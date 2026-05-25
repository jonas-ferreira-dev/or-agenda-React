// src/features/reports/services/get-clients-report.ts

import { api } from '@/services/api/client';
import type { ReportFilters } from '../types/report-filters';
import type { ClientsReport } from '../types/reports';

type Response = {
  message: string;
  data: ClientsReport;
};

export async function getClientsReport(filters: ReportFilters) {
  const response = await api.get<Response>('/reports/clients', {
    params: {
      start_date: filters.start_date,
      end_date: filters.end_date,
      search: filters.search || undefined,
    },
  });

  return response.data;
}