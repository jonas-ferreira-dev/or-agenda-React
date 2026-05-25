// src/features/reports/services/get-cancellations-report.ts

import { api } from '@/services/api/client';
import type { ReportFilters } from '../types/report-filters';
import type { CancellationsReport } from '../types/reports';

type Response = {
  message: string;
  data: CancellationsReport;
};

export async function getCancellationsReport(filters: ReportFilters) {
  const response = await api.get<Response>('/reports/cancellations', {
    params: {
      start_date: filters.start_date,
      end_date: filters.end_date,
    },
  });

  return response.data;
}