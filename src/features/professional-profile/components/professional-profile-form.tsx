import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

import {
  professionalProfileSchema,
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [removePhoto, setRemovePhoto] = useState(false);

  const isEditMode = !!profile;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfessionalProfileSchemaData>({
    resolver: zodResolver(professionalProfileSchema),
    defaultValues: {
      slug: '',
      public_name: '',
      bio: '',
      is_public: true,
      booking_enabled: true,
    },
  });

  useEffect(() => {
    reset({
      slug: profile?.slug ?? '',
      public_name: profile?.public_name ?? '',
      bio: profile?.bio ?? '',
      is_public: profile?.is_public ?? true,
      booking_enabled: profile?.booking_enabled ?? true,
    });

    setSelectedFile(null);
    setRemovePhoto(false);
    setPreviewUrl(profile?.profile_photo_url ?? '');
  }, [profile, reset]);

  useEffect(() => {
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const finalPreview = useMemo(() => {
    return previewUrl || '';
  }, [previewUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setRemovePhoto(false);
  }

  function removeSelectedPhoto() {
    setSelectedFile(null);
    setPreviewUrl('');
    setRemovePhoto(true);
  }

  const onSubmit: SubmitHandler<ProfessionalProfileSchemaData> = async (
    formData
  ) => {
    try {
      setServerError('');

      const payload = new FormData();

      payload.append('slug', formData.slug);
      payload.append('public_name', formData.public_name);
      payload.append('bio', formData.bio || '');
      payload.append('is_public', formData.is_public ? '1' : '0');
      payload.append(
        'booking_enabled',
        formData.booking_enabled ? '1' : '0'
      );

      if (selectedFile) {
        payload.append('profile_photo', selectedFile);
      }

      if (removePhoto) {
        payload.append('remove_profile_photo', '1');
      }

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
      <div className="profile-photo-section">
        <div className="profile-photo-wrapper">
          {finalPreview ? (
            <img
              src={finalPreview}
              alt="Preview da foto de perfil"
              className="profile-photo-preview"
            />
          ) : (
            <div className="profile-photo-placeholder">
              <span>Sem foto</span>
            </div>
          )}
        </div>

        <div className="profile-photo-actions">
          <label className="upload-button">
            Selecionar foto
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden-file-input"
              onChange={handleFileChange}
            />
          </label>

          {finalPreview && (
            <button
              type="button"
              className="ghost-button"
              onClick={removeSelectedPhoto}
            >
              Remover
            </button>
          )}
        </div>
      </div>

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