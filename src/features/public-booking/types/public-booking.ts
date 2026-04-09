export type PublicProfessional = {
  slug: string;
  public_name: string;
  bio: string | null;
  profile_photo: string | null;
  booking_enabled: boolean;
};

export type PublicProfessionalResponse = {
  message: string;
  data: PublicProfessional;
};

export type PublicService = {
  id: number;
  name: string;
  duration_minutes: number;
  price: string | null;
  description: string | null;
  active: boolean;
};

export type PublicServicesResponse = {
  message: string;
  data: PublicService[];
};

export type BusySlot = {
  start_time: string;
  end_time: string;
};

export type PublicAvailabilityData = {
  date: string;
  service_id: number;
  duration_minutes: number;
  available_slots: string[];
  busy_slots: BusySlot[];
};

export type PublicAvailabilityResponse = {
  message: string;
  data: PublicAvailabilityData;
};

export type CreatePublicAppointmentPayload = {
  name: string;
  email?: string;
  phone: string;
  service_id: number;
  appointment_date: string;
  start_time: string;
  notes?: string;
};

export type PublicAppointmentResponse = {
  message: string;
  data: {
    id: number;
    appointment_date: string;
    start_time: string;
    end_time: string;
    status: string;
  };
};