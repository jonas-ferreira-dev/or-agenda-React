// src/features/landing/components/landing-problem-section.tsx

export function LandingProblemSection() {
  return (
    <section className="landing-section">
      <div className="landing-section-header">
        <span className="section-badge">O problema</span>
        <h2>Agendamento pelo WhatsApp pode virar bagunça.</h2>
        <p>
          Quando tudo depende de conversa manual, fica fácil perder mensagem,
          esquecer horário ou deixar cliente esperando resposta.
        </p>
      </div>

      <div className="landing-cards-grid">
        <article className="landing-card">
          <h3>Mensagens perdidas</h3>
          <p>
            O cliente chama, você responde depois e o agendamento acaba ficando
            solto no meio das conversas.
          </p>
        </article>

        <article className="landing-card">
          <h3>Horários confusos</h3>
          <p>
            Sem uma visão organizada da agenda, fica mais fácil marcar dois
            clientes no mesmo horário.
          </p>
        </article>

        <article className="landing-card">
          <h3>Tempo desperdiçado</h3>
          <p>
            Você precisa responder preço, serviço, duração e disponibilidade
            várias vezes ao dia.
          </p>
        </article>
      </div>
    </section>
  );
}