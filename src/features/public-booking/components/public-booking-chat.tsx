import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { PublicSlots } from './public-slots';
import { getPublicAvailability } from '../services/get-public-availability';
import { createPublicAppointment } from '../services/create-public-appointment';
import type {
  PublicAvailabilityData,
  PublicProfessional,
  PublicService,
} from '../types/public-booking';

type PublicBookingChatProps = {
  slug: string;
  professional: PublicProfessional;
  services: PublicService[];
};

type ChatRole = 'bot' | 'user';

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

type ChatStep =
  | 'intro'
  | 'service'
  | 'date'
  | 'slot'
  | 'name'
  | 'phone'
  | 'email_choice'
  | 'email'
  | 'notes_choice'
  | 'notes'
  | 'confirm'
  | 'submitting'
  | 'done';

type BookingDraft = {
  service_id: number | null;
  appointment_date: string;
  start_time: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
};

function formatDate(dateString: string) {
  if (!dateString) return '-';

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('pt-BR').format(date);
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function PublicBookingChat({
  slug,
  professional,
  services,
}: PublicBookingChatProps) {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState<ChatStep>('intro');

  const [draft, setDraft] = useState<BookingDraft>({
    service_id: null,
    appointment_date: '',
    start_time: '',
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  const [typedValue, setTypedValue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availability, setAvailability] =
    useState<PublicAvailabilityData | null>(null);
  const [availabilityError, setAvailabilityError] = useState('');
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedService = useMemo(
    () => services.find((service) => service.id === draft.service_id) ?? null,
    [services, draft.service_id]
  );

  function addBotMessage(text: string) {
    setMessages((prev) => [...prev, { id: createId(), role: 'bot', text }]);
  }

  function addUserMessage(text: string) {
    setMessages((prev) => [...prev, { id: createId(), role: 'user', text }]);
  }

  useEffect(() => {
    if (!professional.booking_enabled) {
      setMessages([
        {
          id: createId(),
          role: 'bot',
          text: `Olá! No momento ${professional.public_name} não está recebendo agendamentos.`,
        },
      ]);
      return;
    }

    setMessages([
      {
        id: createId(),
        role: 'bot',
        text: `Olá, você está no ${professional.public_name}. Gostaria de fazer um agendamento?`,
      },
    ]);
  }, [professional]);

  async function loadAvailability(date: string, serviceId: number) {
    try {
      setIsLoadingAvailability(true);
      setAvailabilityError('');
      setAvailability(null);

      const response = await getPublicAvailability({
        slug,
        date,
        service_id: serviceId,
      });

      setAvailability(response.data);
      addBotMessage('Perfeito. Estes são os horários disponíveis:');
      setStep('slot');
    } catch (error) {
      setAvailability(null);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          'Não consegui carregar os horários disponíveis.';
        setAvailabilityError(message);
        addBotMessage(message);
      } else {
        const message = 'Ocorreu um erro ao carregar a disponibilidade.';
        setAvailabilityError(message);
        addBotMessage(message);
      }
    } finally {
      setIsLoadingAvailability(false);
    }
  }

  function handleStartConversation() {
    addUserMessage('Sim, quero agendar.');
    addBotMessage('Ótimo. Primeiro, escolha o serviço desejado.');
    setStep('service');
  }

  function handleSelectService(service: PublicService) {
    setDraft((prev) => ({
      ...prev,
      service_id: service.id,
      appointment_date: '',
      start_time: '',
    }));

    addUserMessage(`${service.name} (${service.duration_minutes} min)`);
    addBotMessage('Agora selecione a data do atendimento.');
    setSelectedDate('');
    setAvailability(null);
    setStep('date');
  }

  function handleConfirmDate() {
    if (!selectedDate || !draft.service_id) return;

    setDraft((prev) => ({
      ...prev,
      appointment_date: selectedDate,
      start_time: '',
    }));

    addUserMessage(formatDate(selectedDate));
    void loadAvailability(selectedDate, draft.service_id);
  }

  function handleSelectSlot(slot: string) {
    setDraft((prev) => ({
      ...prev,
      start_time: slot,
    }));

    addUserMessage(slot);
    addBotMessage('Perfeito. Qual é o seu nome?');
    setStep('name');
    setTypedValue('');
  }

  function handleTypedSubmit() {
    const value = typedValue.trim();

    if (!value) return;

    if (step === 'name') {
      setDraft((prev) => ({ ...prev, name: value }));
      addUserMessage(value);
      addBotMessage('Agora me informe seu telefone.');
      setTypedValue('');
      setStep('phone');
      return;
    }

    if (step === 'phone') {
      setDraft((prev) => ({ ...prev, phone: value }));
      addUserMessage(value);
      addBotMessage('Deseja informar um e-mail também?');
      setTypedValue('');
      setStep('email_choice');
      return;
    }

    if (step === 'email') {
      setDraft((prev) => ({ ...prev, email: value }));
      addUserMessage(value);
      addBotMessage('Deseja deixar alguma observação para o atendimento?');
      setTypedValue('');
      setStep('notes_choice');
      return;
    }

    if (step === 'notes') {
      setDraft((prev) => ({ ...prev, notes: value }));
      addUserMessage(value);
      addBotMessage('Tudo certo. Vou confirmar seu agendamento.');
      setTypedValue('');
      setStep('confirm');
      return;
    }
  }

  function handleEmailChoice(answer: 'yes' | 'no') {
    if (answer === 'yes') {
      addUserMessage('Sim');
      addBotMessage('Digite seu e-mail.');
      setStep('email');
      return;
    }

    addUserMessage('Não');
    addBotMessage('Deseja deixar alguma observação para o atendimento?');
    setStep('notes_choice');
  }

  function handleNotesChoice(answer: 'yes' | 'no') {
    if (answer === 'yes') {
      addUserMessage('Sim');
      addBotMessage('Digite sua observação.');
      setStep('notes');
      return;
    }

    addUserMessage('Não');
    addBotMessage('Tudo certo. Vou confirmar seu agendamento.');
    setStep('confirm');
  }

  async function handleConfirmBooking() {
    if (
      !draft.service_id ||
      !draft.appointment_date ||
      !draft.start_time ||
      !draft.name ||
      !draft.phone
    ) {
      return;
    }

    try {
      setIsSubmitting(true);
      setServerError('');

      const response = await createPublicAppointment(slug, {
        name: draft.name,
        email: draft.email || undefined,
        phone: draft.phone,
        service_id: draft.service_id,
        appointment_date: draft.appointment_date,
        start_time: draft.start_time,
        notes: draft.notes || undefined,
      });

      setStep('done');

      navigate(`/agendar/${slug}/sucesso`, {
        replace: true,
        state: {
          message: response.message || 'Agendamento realizado com sucesso.',
          professionalName: professional.public_name,
          serviceName: selectedService?.name ?? '',
          appointmentDate: draft.appointment_date,
          startTime: draft.start_time,
          clientName: draft.name,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          'Não foi possível concluir o agendamento.';
        setServerError(message);
        addBotMessage(message);
      } else {
        const message = 'Erro inesperado ao concluir o agendamento.';
        setServerError(message);
        addBotMessage(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderActionArea() {
    if (!professional.booking_enabled) return null;

    if (step === 'intro') {
      return (
        <div className="chat-actions">
          <button
            type="button"
            className="chat-quick-reply"
            onClick={handleStartConversation}
          >
            Sim, quero agendar
          </button>
        </div>
      );
    }

    if (step === 'service') {
      return (
        <div className="chat-actions">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              className="chat-quick-reply"
              onClick={() => handleSelectService(service)}
            >
              {service.name} · {service.duration_minutes} min
            </button>
          ))}
        </div>
      );
    }

    if (step === 'date') {
      return (
        <div className="chat-panel">
          <Input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
          <Button type="button" onClick={handleConfirmDate} disabled={!selectedDate}>
            Ver horários
          </Button>
        </div>
      );
    }

    if (step === 'slot') {
      return (
        <div className="chat-panel">
          {selectedService && (
            <p className="chat-helper-text">
              Serviço selecionado: {selectedService.name} ({selectedService.duration_minutes} min)
            </p>
          )}

          {availabilityError && <p className="server-error">{availabilityError}</p>}

          {isLoadingAvailability ? (
            <p>Carregando horários...</p>
          ) : (
            <PublicSlots
              slots={availability?.available_slots ?? []}
              selectedSlot={draft.start_time}
              onSelect={handleSelectSlot}
            />
          )}
        </div>
      );
    }

    if (step === 'email_choice') {
      return (
        <div className="chat-actions">
          <button
            type="button"
            className="chat-quick-reply"
            onClick={() => handleEmailChoice('yes')}
          >
            Sim
          </button>
          <button
            type="button"
            className="chat-quick-reply secondary"
            onClick={() => handleEmailChoice('no')}
          >
            Não
          </button>
        </div>
      );
    }

    if (step === 'notes_choice') {
      return (
        <div className="chat-actions">
          <button
            type="button"
            className="chat-quick-reply"
            onClick={() => handleNotesChoice('yes')}
          >
            Sim
          </button>
          <button
            type="button"
            className="chat-quick-reply secondary"
            onClick={() => handleNotesChoice('no')}
          >
            Não
          </button>
        </div>
      );
    }

    if (step === 'confirm') {
      return (
        <div className="chat-panel confirmation">
          <div className="chat-summary">
            <div>
              <strong>Serviço</strong>
              <span>{selectedService?.name ?? '-'}</span>
            </div>
            <div>
              <strong>Data</strong>
              <span>{formatDate(draft.appointment_date)}</span>
            </div>
            <div>
              <strong>Horário</strong>
              <span>{draft.start_time}</span>
            </div>
            <div>
              <strong>Nome</strong>
              <span>{draft.name}</span>
            </div>
            <div>
              <strong>Telefone</strong>
              <span>{draft.phone}</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Confirmando...' : 'Confirmar agendamento'}
          </Button>
        </div>
      );
    }

    if (step === 'name' || step === 'phone' || step === 'email' || step === 'notes') {
      const placeholderMap: Record<'name' | 'phone' | 'email' | 'notes', string> = {
        name: 'Digite seu nome',
        phone: 'Digite seu telefone',
        email: 'Digite seu e-mail',
        notes: 'Digite sua observação',
      };

      const currentStep = step as 'name' | 'phone' | 'email' | 'notes';

      return (
        <div className="chat-panel input-panel">
          <Input
            value={typedValue}
            type={currentStep === 'email' ? 'email' : 'text'}
            placeholder={placeholderMap[currentStep]}
            onChange={(event) => setTypedValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleTypedSubmit();
              }
            }}
          />
          <Button type="button" onClick={handleTypedSubmit} disabled={!typedValue.trim()}>
            Enviar
          </Button>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="booking-chat-shell">
      <div className="booking-chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`booking-chat-bubble ${message.role === 'bot' ? 'bot' : 'user'}`}
          >
            {message.text}
          </div>
        ))}

        {serverError && <p className="server-error">{serverError}</p>}
      </div>

      <div className="booking-chat-footer">{renderActionArea()}</div>
    </div>
  );
}