export type ProfessionalProfile = {
  id: number;
  user_id: number;
  slug: string;
  public_name: string;
  bio: string | null;
  profile_photo: string | null;
  profile_photo_url: string | null;
  is_public: boolean;
  booking_enabled: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ProfessionalProfileResponse = {
  message: string;
  data: ProfessionalProfile;
};