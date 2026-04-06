import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

import {
  serviceSchema,
  type ServiceFormInput,
  type ServiceSchemaData,
} from '../schemas/service-schema';
import { createService } from '../services/create-service';
import { updateService } from '../services/update-service';
import type { Service } from '../types/service';

type ServiceFormProps = {
  service?: Service | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export function ServiceForm({
  service,
  onSuccess,
  onCancel,
}: ServiceFormProps) {
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormInput, unknown, ServiceSchemaData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      duration_minutes: 30,
      price: undefined,
      description: '',
      active: true,
    },
  });

  useEffect(() => {
    reset({
      name: service?.name ?? '',
      duration_minutes: service?.duration_minutes ?? 30,
      price: service?.price != null ? Number(service.price) : undefined,
      description: service?.description ?? '',
      active: service?.active ?? true,
    });
  }, [service, reset]);

  const onSubmit: SubmitHandler<ServiceSchemaData> = async (formData) => {
    try {
      setServerError('');

      const payload = {
        name: formData.name,
        duration_minutes: formData.duration_minutes,
        price: formData.price,
        description: formData.description || undefined,
        active: formData.active,
      };

      if (service) {
        await updateService(service.id, payload);
      } else {
        await createService(payload);
      }

      onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(error.response?.data?.message || 'Erro ao salvar serviço.');
        return;
      }

      setServerError('Erro inesperado ao salvar serviço.');
    }
  };

  return (
    <form className="client-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-field">
        <label className="form-label" htmlFor="name">
          Nome do serviço
        </label>
        <Input id="name" placeholder="Ex.: Corte masculino" {...register('name')} />
        {errors.name && <span className="form-error">{errors.name.message}</span>}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="duration_minutes">
          Duração (minutos)
        </label>
        <Input
          id="duration_minutes"
          type="number"
          min={1}
          {...register('duration_minutes')}
        />
        {errors.duration_minutes && (
          <span className="form-error">{errors.duration_minutes.message}</span>
        )}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="price">
          Preço
        </label>
        <Input id="price" type="number" step="0.01" min="0" {...register('price')} />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="description">
          Descrição
        </label>
        <textarea
          id="description"
          className="ui-textarea"
          placeholder="Descreva o serviço"
          {...register('description')}
        />
      </div>

      <div className="checkbox-field">
        <label className="checkbox-label">
          <input type="checkbox" {...register('active')} />
          Serviço ativo
        </label>
      </div>

      {serverError && <p className="server-error">{serverError}</p>}

      <div className="form-actions">
        <button type="button" className="ghost-button" onClick={onCancel}>
          Cancelar
        </button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Salvando...'
            : service
              ? 'Atualizar serviço'
              : 'Cadastrar serviço'}
        </Button>
      </div>
    </form>
  );
}