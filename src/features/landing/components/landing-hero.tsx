import { Link } from 'react-router-dom';
import orAgendaLogo from '@/assets/or-agenda-logo.png';

const whatsappNumber = '5521999999999';

const whatsappMessage = encodeURIComponent(
  'Olá! Quero conhecer o OR Agenda e criar uma agenda online para meu negócio.'
);

const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

export function LandingHero() {
  return (
    <section className="landing-hero">
      <header className="landing-header">
        <div className="landing-brand">
          <img
            src={orAgendaLogo}
            alt="OR Agenda"
            className="landing-brand-logo"
          />
        </div>

        <nav className="landing-nav">
          <a href="#recursos">Recursos</a>
          <a href="#preco">Preço</a>
          <Link to="/login">Entrar</Link>
        </nav>
      </header>

      <div className="landing-hero-grid">
        <div className="landing-hero-content">
          <span className="landing-badge">Para negócios com horário marcado</span>

          <h2>Agenda online simples para pequenos negócios.</h2>

          <p>
            Seus clientes escolhem serviço, dia e horário por um link profissional.
            Você acompanha tudo em um painel administrativo simples e organizado.
          </p>

          <div className="landing-hero-actions">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="landing-primary-button"
            >
              Quero minha agenda online
            </a>

            <Link to="/agendar/joao-studio" className="landing-secondary-button">
              Ver demonstração
            </Link>
          </div>

          <div className="landing-hero-points">
            <span>Link para bio</span>
            <span>Painel administrativo</span>
            <span>Clientes e serviços</span>
          </div>
        </div>

        <div className="landing-dashboard-preview">
          <div className="landing-preview-top">
            <div>
              <span>Painel Administrativo</span>
              <strong>Agenda de hoje</strong>
            </div>

            <span className="landing-preview-status">Online</span>
          </div>

          <div className="landing-preview-cards">
            <div>
              <span>Agendamentos</span>
              <strong>12</strong>
            </div>

            <div>
              <span>Clientes</span>
              <strong>48</strong>
            </div>

            <div>
              <span>Serviços</span>
              <strong>8</strong>
            </div>
          </div>

          <div className="landing-preview-table">
            <div className="landing-preview-row landing-preview-head">
              <span>Cliente</span>
              <span>Serviço</span>
              <span>Horário</span>
            </div>

            <div className="landing-preview-row">
              <span>Joca</span>
              <span>Corte masculino</span>
              <strong>10:00</strong>
            </div>

            <div className="landing-preview-row">
              <span>Marcos</span>
              <span>Barba</span>
              <strong>11:30</strong>
            </div>

            <div className="landing-preview-row">
              <span>Ana</span>
              <span>Sobrancelha</span>
              <strong>14:00</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}