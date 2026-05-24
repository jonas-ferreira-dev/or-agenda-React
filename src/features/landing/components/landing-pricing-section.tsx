// src/features/landing/components/landing-pricing-section.tsx

const whatsappNumber = '5521988153770';

const whatsappMessage = encodeURIComponent(
  'Olá! Quero começar com o OR Agenda Start de R$ 59,90/mês.'
);

const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

export function LandingPricingSection() {
  return (
    <section className="landing-section" id="preco">
      <div className="landing-pricing-card">
        <div>
          <span className="section-badge">Plano inicial</span>
          <h2>OR Agenda Start</h2>
          <p>
            Ideal para barbearias, salões, estética, manicures e profissionais
            autônomos que querem organizar seus horários.
          </p>
        </div>

        <div className="landing-price-box">
          <span className="landing-price-label">Mensalidade</span>

          <div className="landing-price">
            <strong>R$ 59,90</strong>
            <span>/mês</span>
          </div>

          <p className="landing-setup-price">+ R$ 80 de implantação</p>

          <ul>
            <li>Página pública de agendamento</li>
            <li>Painel administrativo</li>
            <li>Cadastro inicial de serviços</li>
            <li>Configuração do perfil público</li>
            <li>Orientação para começar a usar</li>
          </ul>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="landing-primary-button landing-full-button"
          >
            Quero começar
          </a>
        </div>
      </div>
    </section>
  );
}