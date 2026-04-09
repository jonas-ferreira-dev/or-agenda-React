import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ProfessionalProfileForm } from '../components/professional-profile-form';
import { getProfessionalProfile } from '../services/get-professional-profile';
import type { ProfessionalProfile } from '../types/professional-profile';

const PROFESSIONAL_PROFILE_QUERY_KEY = ['professional-profile'];

export function ProfessionalProfilePage() {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: PROFESSIONAL_PROFILE_QUERY_KEY,
    queryFn: () => getProfessionalProfile(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const profile: ProfessionalProfile | null = data?.data ?? null;

  const profileNotFound =
    axios.isAxiosError(error) && error.response?.status === 404;

  function getPageErrorMessage() {
    if (!error || profileNotFound) return '';

    if (axios.isAxiosError(error)) {
      return (
        error.response?.data?.message || 'Erro ao carregar perfil profissional.'
      );
    }

    return 'Erro inesperado ao carregar perfil profissional.';
  }

  async function handleFormSuccess() {
    await queryClient.invalidateQueries({
      queryKey: PROFESSIONAL_PROFILE_QUERY_KEY,
    });
  }

  const pageError = getPageErrorMessage();

  return (
    <div className="profile-page-shell">
      <div className="profile-page-container">
        {pageError && <p className="server-error">{pageError}</p>}

        {isLoading ? (
          <div className="profile-card">
            <p>Carregando perfil profissional...</p>
          </div>
        ) : (
          <div className="profile-card profile-card-centered">
            {isFetching && (
              <div className="profile-refresh-state">
                <p>Atualizando perfil...</p>
              </div>
            )}

            <div className="profile-card-header centered">
              <span className="section-badge">Perfil profissional</span>
              <h1>
                {profileNotFound
                  ? 'Criar perfil profissional'
                  : 'Editar perfil profissional'}
              </h1>
              <p>
                {profileNotFound
                  ? 'Preencha os dados para criar seu perfil público.'
                  : 'Atualize suas informações públicas de forma simples e organizada.'}
              </p>
            </div>

            <ProfessionalProfileForm
              profile={profile}
              onSuccess={handleFormSuccess}
            />

            {profile && (
              <div className="profile-preview modern">
                <div className="profile-preview-header">
                  <h3>Prévia pública</h3>
                  <span className="profile-preview-slug">/{profile.slug}</span>
                </div>

                <div className="profile-preview-grid">
                  <div>
                    <strong>Nome público</strong>
                    <span>{profile.public_name}</span>
                  </div>

                  <div>
                    <strong>Perfil público</strong>
                    <span>{profile.is_public ? 'Ativo' : 'Oculto'}</span>
                  </div>

                  <div>
                    <strong>Agendamento</strong>
                    <span>
                      {profile.booking_enabled ? 'Disponível' : 'Desativado'}
                    </span>
                  </div>

                  <div>
                    <strong>Biografia</strong>
                    <span>{profile.bio || '-'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}