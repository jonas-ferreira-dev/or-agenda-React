import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

import {
  appointmentSchema,
  type AppointmentFormInput,
  type AppointmentSchemaData,
} from '../schemas/appointment-schema';
import { createAppointment } from '../services/create-appointment';
import { updateAppointment } from '../services/update-appointment';
import type { Appointment } from '../types/appointment';
import type { Client } from '@/features/clients/types/client';
import type { Service } from '@/features/services/types/service';

type AppointmentFormProps = {
  appointment?: Appointment | null;
  clients: Client[];
  services: Service[];
  onSuccess: () => void;
  onCancel: () => void;
};

function calculatePreviewEndTime(startTime: string, durationMinutes: number) {
  if (!startTime || !durationMinutes) return '';

  const [hours, minutes] = startTime.split(':').map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return '';

  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const nextHours = Math.floor(totalMinutes / 60) % 24;
  const nextMinutes = totalMinutes % 60;

  return `${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`;
}

export function AppointmentForm({
  appointment,
  clients,
  services,
  onSuccess,
  onCancel,
}: AppointmentFormProps) {
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormInput, unknown, AppointmentSchemaData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      client_id: 0,
      service_id: 0,
      appointment_date: '',
      start_time: '',
      status: 'scheduled',
      notes: '',
    },
  });

  useEffect(() => {
    reset({
      client_id: appointment?.client_id ?? 0,
      service_id: appointment?.service_id ?? 0,
      appointment_date: appointment?.appointment_date ?? '',
      start_time: appointment?.start_time?.slice(0, 5) ?? '',
      status: appointment?.status ?? 'scheduled',
      notes: appointment?.notes ?? '',
    });
  }, [appointment, reset]);

  const selectedServiceId = watch('service_id');
  const startTime = watch('start_time');

  const selectedService = useMemo(
    () => services.find((service) => service.id === Number(selectedServiceId)),
    [services, selectedServiceId]
  );

  const previewEndTime = selectedService
    ? calculatePreviewEndTime(startTime, selectedService.duration_minutes)
    : '';

  const onSubmit: SubmitHandler<AppointmentSchemaData> = async (formData) => {
    try {
      setServerError('');

      const payload = {
        client_id: formData.client_id,
        service_id: formData.service_id,
        appointment_date: formData.appointment_date,
        start_time: formData.start_time,
        status: formData.status,
        notes: formData.notes || undefined,
      };

      if (appointment) {
        await updateAppointment(appointment.id, payload);
      } else {
        await createAppointment(payload);
      }

      onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message || 'Erro ao salvar agendamento.'
        );
        return;
      }

      setServerError('Erro inesperado ao salvar agendamento.');
    }
  };

  return (
    <form className="client-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-field">
        <label className="form-label" htmlFor="client_id">
          Cliente
        </label>
        <select id="client_id" className="ui-select" {...register('client_id')}>
          <option value={0}>Selecione um cliente</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        {errors.client_id && (
          <span className="form-error">{errors.client_id.message}</span>
        )}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="service_id">
          Serviço
        </label>
        <select id="service_id" className="ui-select" {...register('service_id')}>
          <option value={0}>Selecione um serviço</option>
          {services
            .filter((service) => service.active)
            .map((service) => (
              <option key={service.id} value={service.id}>
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
        <Input id="appointment_date" type="date" {...register('appointment_date')} />
        {errors.appointment_date && (
          <span className="form-error">{errors.appointment_date.message}</span>
        )}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="start_time">
          Horário inicial
        </label>
        <Input id="start_time" type="time" {...register('start_time')} />
        {errors.start_time && (
          <span className="form-error">{errors.start_time.message}</span>
        )}
      </div>

      {selectedService && startTime && (
        <div className="preview-card">
          <strong>Previsão de término:</strong> {previewEndTime}
        </div>
      )}

      <div className="form-field">
        <label className="form-label" htmlFor="status">
          Status
        </label>
        <select id="status" className="ui-select" {...register('status')}>
          <option value="scheduled">Agendado</option>
          <option value="completed">Concluído</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="notes">
          Observações
        </label>
        <textarea
          id="notes"
          className="ui-textarea"
          placeholder="Observações do agendamento"
          {...register('notes')}
        />
      </div>

      {serverError && <p className="server-error">{serverError}</p>}

      <div className="form-actions">
        <button type="button" className="ghost-button" onClick={onCancel}>
          Cancelar
        </button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Salvando...'
            : appointment
              ? 'Atualizar agendamento'
              : 'Cadastrar agendamento'}
        </Button>
      </div>
    </form>
  );
}