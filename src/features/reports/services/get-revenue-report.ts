// src/features/reports/services/get-revenue-report.ts

import { api } from '@/services/api/client';
import type { ReportFilters } from '../types/report-filters';
import type { RevenueReport } from '../types/reports';

type Response = {
  message: string;
  data: RevenueReport;
};

export async function getRevenueReport(filters: ReportFilters) {
  const response = await api.get<Response>('/reports/revenue', {
    params: {
      start_date: filters.start_date,
      end_date: filters.end_date,
    },
  });

  return response.data;
}