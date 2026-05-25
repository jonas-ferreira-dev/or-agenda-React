// src/features/availabilities/types/availability.ts

export type ProfessionalAvailability = {
  id: number;
  user_id: number;
  weekday: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type AvailabilityPayload = {
  weekday: number;
  start_time: string;
  end_time: string;
  is_active?: boolean;
};

export const WEEKDAYS = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
];

export function getWeekdayLabel(weekday: number) {
  return WEEKDAYS.find((day) => day.value === weekday)?.label ?? '-';
}

export function formatTime(time: string) {
  return time.slice(0, 5);
}