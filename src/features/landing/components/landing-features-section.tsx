// src/features/landing/components/landing-features-section.tsx

const features = [
  'Página pública personalizada para agendamento',
  'Cadastro de clientes com busca rápida',
  'Cadastro de serviços com status ativo ou inativo',
  'Gestão de agendamentos com filtros por data e status',
  'Perfil profissional com foto, slug e biografia',
  'Link ideal para colocar na bio do Instagram ou enviar no WhatsApp',
];

export function LandingFeaturesSection() {
  return (
    <section className="landing-section landing-section-muted" id="recursos">
      <div className="landing-section-header">
        <span className="section-badge">A solução</span>
        <h2>Um link profissional para seus clientes agendarem.</h2>
        <p>
          O OR Agenda organiza o fluxo básico do seu atendimento: serviços,
          clientes, horários e solicitações em um painel simples.
        </p>
      </div>

      <div className="landing-features-list">
        {features.map((feature) => (
          <div className="landing-feature-item" key={feature}>
            <span>✓</span>
            <p>{feature}</p>
          </div>
        ))}
      </div>
    </section>
  );
}