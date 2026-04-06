export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export type AppointmentClient = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
};

export type AppointmentService = {
  id: number;
  name: string;
  duration_minutes: number;
  price: string | null;
  description: string | null;
  active: boolean;
};

export type Appointment = {
  id: number;
  user_id: number;
  client_id: number;
  service_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes: string | null;
  client: AppointmentClient;
  service: AppointmentService;
  created_at?: string;
  updated_at?: string;
};

export type AppointmentsListResponse = {
  message: string;
  data: Appointment[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type AppointmentResponse = {
  message: string;
  data: Appointment;
};

export type CreateAppointmentPayload = {
  client_id: number;
  service_id: number;
  appointment_date: string;
  start_time: string;
  status?: AppointmentStatus;
  notes?: string;
};

export type UpdateAppointmentPayload = Partial<CreateAppointmentPayload>;