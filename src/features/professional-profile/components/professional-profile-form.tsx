import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

import {
  professionalProfileSchema,
  type ProfessionalProfileSchemaInput,
  type ProfessionalProfileSchemaData,
} from '../schemas/professional-profile-schema';
import { createProfessionalProfile } from '../services/create-professional-profile';
import { updateProfessionalProfile } from '../services/update-professional-profile';
import type { ProfessionalProfile } from '../types/professional-profile';

type ProfessionalProfileFormProps = {
  profile: ProfessionalProfile | null;
  onSuccess: () => Promise<void> | void;
};

export function ProfessionalProfileForm({
  profile,
  onSuccess,
}: ProfessionalProfileFormProps) {
  const [serverError, setServerError] = useState('');
  const isEditMode = !!profile;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<
    ProfessionalProfileSchemaInput,
    unknown,
    ProfessionalProfileSchemaData
  >({
    resolver: zodResolver(professionalProfileSchema),
    defaultValues: {
      slug: '',
      public_name: '',
      bio: '',
      profile_photo: '',
      is_public: true,
      booking_enabled: true,
    },
  });

  useEffect(() => {
    reset({
      slug: profile?.slug ?? '',
      public_name: profile?.public_name ?? '',
      bio: profile?.bio ?? '',
      profile_photo: profile?.profile_photo ?? '',
      is_public: profile?.is_public ?? true,
      booking_enabled: profile?.booking_enabled ?? true,
    });
  }, [profile, reset]);

  const onSubmit: SubmitHandler<ProfessionalProfileSchemaData> = async (
    formData
  ) => {
    try {
      setServerError('');

      const payload = {
        slug: formData.slug,
        public_name: formData.public_name,
        bio: formData.bio || undefined,
        profile_photo: formData.profile_photo || undefined,
        is_public: formData.is_public,
        booking_enabled: formData.booking_enabled,
      };

      if (isEditMode) {
        await updateProfessionalProfile(payload);
      } else {
        await createProfessionalProfile(payload);
      }

      await onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message || 'Erro ao salvar perfil profissional.'
        );
        return;
      }

      setServerError('Erro inesperado ao salvar perfil profissional.');
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label" htmlFor="public_name">
            Nome público
          </label>
          <Input
            id="public_name"
            placeholder="Ex.: João Studio"
            {...register('public_name')}
          />
          {errors.public_name && (
            <span className="form-error">{errors.public_name.message}</span>
          )}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="slug">
            Slug público
          </label>
          <Input
            id="slug"
            placeholder="joao-studio"
            {...register('slug')}
          />
          {errors.slug && (
            <span className="form-error">{errors.slug.message}</span>
          )}
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="profile_photo">
          URL da foto de perfil
        </label>
        <Input
          id="profile_photo"
          placeholder="https://exemplo.com/foto.jpg"
          {...register('profile_photo')}
        />
        {errors.profile_photo && (
          <span className="form-error">{errors.profile_photo.message}</span>
        )}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="bio">
          Biografia
        </label>
        <textarea
          id="bio"
          className="ui-textarea"
          placeholder="Fale um pouco sobre sua atuação profissional"
          {...register('bio')}
        />
      </div>

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input type="checkbox" {...register('is_public')} />
          Perfil público
        </label>

        <label className="checkbox-label">
          <input type="checkbox" {...register('booking_enabled')} />
          Permitir agendamentos
        </label>
      </div>

      {serverError && <p className="server-error">{serverError}</p>}

      <div className="form-actions">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Salvando...'
            : isEditMode
            ? 'Atualizar perfil'
            : 'Criar perfil'}
        </Button>
      </div>
    </form>
  );
}