import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { getPublicProfessional } from '../services/get-public-professional';
import { listPublicServices } from '../services/list-public-services';
import { PublicBookingForm } from '../components/public-booking-form';
import type { PublicProfessional, PublicService } from '../types/public-booking';

function buildProfilePhotoUrl(profilePhoto: string | null) {
  if (!profilePhoto) return '';

  if (profilePhoto.startsWith('http://') || profilePhoto.startsWith('https://')) {
    return profilePhoto;
  }

  const apiUrl = import.meta.env.VITE_API_URL as string;
  const appBaseUrl = apiUrl.replace('/api', '');

  return `${appBaseUrl}/storage/${profilePhoto}`;
}

export function PublicBookingPage() {
  const { slug = '' } = useParams();

  const [professional, setProfessional] = useState<PublicProfessional | null>(null);
  const [services, setServices] = useState<PublicService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    async function loadPage() {
      try {
        setIsLoading(true);
        setPageError('');

        const [professionalResponse, servicesResponse] = await Promise.all([
          getPublicProfessional(slug),
          listPublicServices(slug),
        ]);

        setProfessional(professionalResponse.data);
        setServices(servicesResponse.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setPageError(
            error.response?.data?.message ||
              'Não foi possível carregar a página de agendamento.'
          );
        } else {
          setPageError('Erro inesperado ao carregar a página de agendamento.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      loadPage();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <main className="public-page">
        <div className="public-container">
          <p>Carregando agenda...</p>
        </div>
      </main>
    );
  }

  if (pageError || !professional) {
    return (
      <main className="public-page">
        <div className="public-container">
          <div className="public-empty-state">
            <h1>Agenda indisponível</h1>
            <p>{pageError || 'Este link não está disponível.'}</p>
          </div>
        </div>
      </main>
    );
  }

  const photoUrl = buildProfilePhotoUrl(professional.profile_photo);

  return (
    <main className="public-page">
      <div className="public-container">
        <section className="public-hero">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={professional.public_name}
              className="public-profile-photo"
            />
          ) : (
            <div className="public-profile-photo-placeholder">
              {professional.public_name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="public-hero-content">
            <span className="section-badge">Agendamento online</span>
            <h1>{professional.public_name}</h1>
            <p>{professional.bio || 'Escolha um serviço e agende seu horário.'}</p>
          </div>
        </section>

        <section className="public-card">
          <PublicBookingForm
            slug={slug}
            professional={professional}
            services={services}
          />
        </section>
      </div>
    </main>
  );
}