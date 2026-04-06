export type Client = {
  id: number;
  user_id: number;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ClientsListResponse = {
  message: string;
  data: Client[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type ClientResponse = {
  message: string;
  data: Client;
};

export type CreateClientPayload = {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
};

export type UpdateClientPayload = CreateClientPayload;