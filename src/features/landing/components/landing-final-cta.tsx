// src/features/landing/components/landing-final-cta.tsx

const whatsappNumber = '5521988153770';

const whatsappMessage = encodeURIComponent(
  'Olá! Quero uma agenda online para meu negócio.'
);

const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

export function LandingFinalCta() {
  return (
    <section className="landing-final-cta">
      <h2>Organize seus agendamentos sem complicar sua rotina.</h2>
      <p>
        Comece com uma agenda simples, acessível e pronta para pequenos negócios.
      </p>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="landing-primary-button"
      >
        Falar no WhatsApp
      </a>
    </section>
  );
}