// src/features/reports/types/reports.ts

export type ReportClient = {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
};

export type ReportService = {
  id: number;
  name: string;
  price?: number;
  duration_minutes?: number;
};

export type ReportAppointment = {
  id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  client: ReportClient | null;
  service: ReportService | null;
};

export type RevenueReport = {
  summary: {
    total_revenue: number;
    appointments_count: number;
    average_ticket: number;
  };
  services: Array<{
    service_id: number | null;
    service_name: string;
    appointments_count: number;
    total_revenue: number;
  }>;
  appointments: ReportAppointment[];
};

export type AppointmentsReport = {
  summary: {
    total: number;
    scheduled: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  statuses: Array<{
    status: string;
    count: number;
  }>;
  appointments: ReportAppointment[];
};

export type CancellationsReport = {
  summary: {
    total_appointments: number;
    cancelled_count: number;
    cancellation_rate: number;
  };
  clients: Array<{
    client_id: number | null;
    client_name: string;
    cancellations_count: number;
  }>;
  services: Array<{
    service_id: number | null;
    service_name: string;
    cancellations_count: number;
  }>;
  appointments: ReportAppointment[];
};

export type ClientsReport = {
  summary: {
    total_clients: number;
    new_clients_in_period: number;
    clients_with_appointments: number;
  };
  clients: Array<{
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    appointments_count: number;
    last_appointment_date?: string | null;
    created_at?: string;
  }>;
};