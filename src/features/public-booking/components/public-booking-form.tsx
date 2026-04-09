import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  publicBookingSchema,
  type PublicBookingSchemaData,
} from '../schemas/public-booking-schema';
import { getPublicAvailability } from '../services/get-public-availability';
import { createPublicAppointment } from '../services/create-public-appointment';
import type {
  PublicAvailabilityData,
  PublicProfessional,
  PublicService,
} from '../types/public-booking';
import { PublicSlots } from './public-slots';

type PublicBookingFormProps = {
  slug: string;
  professional: PublicProfessional;
  services: PublicService[];
};

export function PublicBookingForm({
  slug,
  professional,
  services,
}: PublicBookingFormProps) {
  const [availability, setAvailability] =
    useState<PublicAvailabilityData | null>(null);
  const [availabilityError, setAvailabilityError] = useState('');
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    resetField,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PublicBookingSchemaData>({
    resolver: zodResolver(publicBookingSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service_id: '',
      appointment_date: '',
      start_time: '',
      notes: '',
    },
  });

  const selectedServiceId = watch('service_id');
  const selectedDate = watch('appointment_date');
  const selectedStartTime = watch('start_time');

  const selectedService = useMemo(
    () => services.find((service) => service.id === Number(selectedServiceId)),
    [services, selectedServiceId]
  );

  useEffect(() => {
    async function loadAvailability() {
      if (!selectedServiceId || !selectedDate) {
        setAvailability(null);
        setAvailabilityError('');
        resetField('start_time');
        return;
      }

      try {
        setIsLoadingAvailability(true);
        setAvailabilityError('');
        setAvailability(null);
        resetField('start_time');

        const response = await getPublicAvailability({
          slug,
          date: selectedDate,
          service_id: Number(selectedServiceId),
        });

        setAvailability(response.data);
      } catch (error) {
        setAvailability(null);

        if (axios.isAxiosError(error)) {
          setAvailabilityError(
            error.response?.data?.message ||
              'Não foi possível carregar a disponibilidade.'
          );
        } else {
          setAvailabilityError('Erro inesperado ao carregar disponibilidade.');
        }
      } finally {
        setIsLoadingAvailability(false);
      }
    }

    loadAvailability();
  }, [slug, selectedServiceId, selectedDate, resetField]);

  const onSubmit: SubmitHandler<PublicBookingSchemaData> = async (formData) => {
  try {
    setServerError('');
    setSuccessMessage('');

    const response = await createPublicAppointment(slug, {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone,
      service_id: Number(formData.service_id),
      appointment_date: formData.appointment_date,
      start_time: formData.start_time,
      notes: formData.notes || undefined,
    });

    navigate(`/agendar/${slug}/sucesso`, {
      replace: true,
      state: {
        message: response.message || 'Agendamento realizado com sucesso.',
        professionalName: professional.public_name,
        serviceName: selectedService?.name ?? '',
        appointmentDate: formData.appointment_date,
        startTime: formData.start_time,
        clientName: formData.name,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      setServerError(
        error.response?.data?.message ||
          'Não foi possível concluir o agendamento.'
      );
      return;
    }

    setServerError('Erro inesperado ao concluir o agendamento.');
  }
};

  if (!professional.booking_enabled) {
    return (
      <div className="public-empty-state">
        <h3>Agendamento indisponível</h3>
        <p>Este profissional não está recebendo agendamentos no momento.</p>
      </div>
    );
  }

  return (
    <form className="public-booking-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="public-form-section">
        <h2>Escolha o serviço</h2>

        <div className="form-field">
          <label className="form-label" htmlFor="service_id">
            Serviço
          </label>
          <select
            id="service_id"
            className="ui-select"
            {...register('service_id')}
          >
            <option value="">Selecione um serviço</option>
            {services.map((service) => (
              <option key={service.id} value={String(service.id)}>
                {service.name} ({service.duration_minutes} min)
              </option>
            ))}
          </select>
          {errors.service_id && (
            <span className="form-error">{errors.service_id.message}</span>
          )}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="appointment_date">
            Data
          </label>
          <Input
            id="appointment_date"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            {...register('appointment_date')}
          />
          {errors.appointment_date && (
            <span className="form-error">{errors.appointment_date.message}</span>
          )}
        </div>
      </div>

      <div className="public-form-section">
        <h2>Horários disponíveis</h2>

        {selectedService && (
          <p className="public-helper-text">
            Duração do serviço: {selectedService.duration_minutes} minutos
          </p>
        )}

        {availabilityError && <p className="server-error">{availabilityError}</p>}

        {isLoadingAvailability ? (
          <p>Carregando horários...</p>
        ) : (
          <PublicSlots
            slots={availability?.available_slots ?? []}
            selectedSlot={selectedStartTime}
            onSelect={(slot) =>
              setValue('start_time', slot, { shouldValidate: true })
            }
          />
        )}

        {errors.start_time && (
          <span className="form-error">{errors.start_time.message}</span>
        )}
      </div>

      <div className="public-form-section">
        <h2>Seus dados</h2>

        <div className="form-field">
          <label className="form-label" htmlFor="name">
            Nome
          </label>
          <Input id="name" placeholder="Seu nome" {...register('name')} />
          {errors.name && (
            <span className="form-error">{errors.name.message}</span>
          )}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="phone">
            Telefone
          </label>
          <Input id="phone" placeholder="Seu telefone" {...register('phone')} />
          {errors.phone && (
            <span className="form-error">{errors.phone.message}</span>
          )}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="email">
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Seu e-mail"
            {...register('email')}
          />
          {errors.email && (
            <span className="form-error">{errors.email.message}</span>
          )}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="notes">
            Observações
          </label>
          <textarea
            id="notes"
            className="ui-textarea"
            placeholder="Alguma observação para o atendimento"
            {...register('notes')}
          />
        </div>
      </div>

      {serverError && <p className="server-error">{serverError}</p>}
      {successMessage && <p className="public-success-message">{successMessage}</p>}

      <div className="form-actions">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Agendando...' : 'Confirmar agendamento'}
        </Button>
      </div>
    </form>
  );
}