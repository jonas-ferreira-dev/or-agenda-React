import { useQuery } from '@tanstack/react-query';
import { getDashboardStatsRequest } from '../services/get-dashboard-stats';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStatsRequest,
    staleTime: 1000 * 60 * 5, // 5 min
    gcTime: 1000 * 60 * 10,   // 10 min
    refetchOnWindowFocus: false,
  });
}