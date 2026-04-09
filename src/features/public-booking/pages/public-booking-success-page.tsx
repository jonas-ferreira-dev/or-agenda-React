import { Link, useLocation, useParams } from 'react-router-dom';

type SuccessState = {
  message?: string;
  professionalName?: string;
  serviceName?: string;
  appointmentDate?: string;
  startTime?: string;
  clientName?: string;
};

function formatDate(dateString?: string) {
  if (!dateString) return '-';

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export function PublicBookingSuccessPage() {
  const { slug = '' } = useParams();
  const location = useLocation();

  const state = (location.state as SuccessState | null) ?? null;

  if (!state) {
    return (
      <main className="public-page">
        <div className="public-container">
          <div className="public-success-card">
            <h1>Agendamento concluído</h1>
            <p>Seu agendamento foi processado.</p>

            <div className="public-success-actions">
              <Link to={`/agendar/${slug}`} className="public-link-button">
                Voltar para a agenda
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="public-page">
      <div className="public-container">
        <div className="public-success-card">
          <span className="public-success-badge">Tudo certo</span>
          <h1>Agendado com sucesso!</h1>
          <p>{state.message || 'Seu horário foi reservado com sucesso.'}</p>

          <div className="public-success-summary">
            <div>
              <strong>Cliente</strong>
              <span>{state.clientName || '-'}</span>
            </div>

            <div>
              <strong>Profissional</strong>
              <span>{state.professionalName || '-'}</span>
            </div>

            <div>
              <strong>Serviço</strong>
              <span>{state.serviceName || '-'}</span>
            </div>

            <div>
              <strong>Data</strong>
              <span>{formatDate(state.appointmentDate)}</span>
            </div>

            <div>
              <strong>Horário</strong>
              <span>{state.startTime || '-'}</span>
            </div>
          </div>

          <div className="public-success-actions">
            <Link to={`/agendar/${slug}`} className="public-link-button">
              Fazer novo agendamento
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}