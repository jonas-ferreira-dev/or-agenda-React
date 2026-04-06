export type Service = {
  id: number;
  user_id: number;
  name: string;
  duration_minutes: number;
  price: string | null;
  description: string | null;
  active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ServicesListResponse = {
  message: string;
  data: Service[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type ServiceResponse = {
  message?: string;
  data: Service;
};

export type CreateServicePayload = {
  name: string;
  duration_minutes: number;
  price?: number | string;
  description?: string;
  active?: boolean;
};

export type UpdateServicePayload = CreateServicePayload;