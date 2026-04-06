import { useEffect, useState } from 'react';
import axios from 'axios';

import { ProfessionalProfileForm } from '../components/professional-profile-form';
import { getProfessionalProfile } from '../services/get-professional-profile';
import type { ProfessionalProfile } from '../types/professional-profile';

export function ProfessionalProfilePage() {
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [profileNotFound, setProfileNotFound] = useState(false);

  async function loadProfile() {
    try {
      setIsLoading(true);
      setPageError('');
      setProfileNotFound(false);

      const response = await getProfessionalProfile();
      setProfile(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setProfile(null);
          setProfileNotFound(true);
          return;
        }

        setPageError(
          error.response?.data?.message ||
            'Erro ao carregar perfil profissional.'
        );
        return;
      }

      setPageError('Erro inesperado ao carregar perfil profissional.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div className="content-stack">
      <div className="page-header">
        <div>
          <span className="section-badge">Perfil</span>
          <h1 className="page-title">Perfil profissional</h1>
          <p className="page-description">
            Configure seu perfil público e controle a disponibilidade para
            agendamentos.
          </p>
        </div>
      </div>

      {pageError && <p className="server-error">{pageError}</p>}

      {isLoading ? (
        <div className="table-card">
          <p>Carregando perfil profissional...</p>
        </div>
      ) : (
        <div className="profile-card">
          <div className="profile-card-header">
            <div>
              <h2>
                {profileNotFound ? 'Criar perfil profissional' : 'Editar perfil'}
              </h2>
              <p>
                {profileNotFound
                  ? 'Você ainda não possui um perfil profissional cadastrado.'
                  : 'Atualize os dados públicos do seu perfil.'}
              </p>
            </div>
          </div>

          <ProfessionalProfileForm profile={profile} onSuccess={loadProfile} />

          {profile && (
            <div className="profile-preview">
              <h3>Prévia pública</h3>
              <p>
                <strong>Nome público:</strong> {profile.public_name}
              </p>
              <p>
                <strong>Slug:</strong> /{profile.slug}
              </p>
              <p>
                <strong>Perfil público:</strong>{' '}
                {profile.is_public ? 'Sim' : 'Não'}
              </p>
              <p>
                <strong>Agendamento ativo:</strong>{' '}
                {profile.booking_enabled ? 'Sim' : 'Não'}
              </p>
              <p>
                <strong>Biografia:</strong> {profile.bio || '-'}
              </p>
              <p>
                <strong>Foto:</strong> {profile.profile_photo || '-'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}