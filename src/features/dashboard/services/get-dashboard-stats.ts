import { api } from '@/services/api/client';

export type DashboardStatsResponse = {
  open_appointments: number;
  clients_count: number;
  completed_today: number;
};

export async function getDashboardStatsRequest() {
  const { data } = await api.get<DashboardStatsResponse>('/dashboard/stats');
  return data;
}