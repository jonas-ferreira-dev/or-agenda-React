import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

import { clientSchema, type ClientSchemaData } from '../schemas/client-schema';
import { createClient } from '../services/create-client';
import { updateClient } from '../services/update-client';
import type { Client } from '../types/client';

type ClientFormProps = {
  client?: Client | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export function ClientForm({ client, onSuccess, onCancel }: ClientFormProps) {
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientSchemaData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      notes: '',
    },
  });

  useEffect(() => {
    reset({
      name: client?.name ?? '',
      email: client?.email ?? '',
      phone: client?.phone ?? '',
      notes: client?.notes ?? '',
    });
  }, [client, reset]);

  async function onSubmit(formData: ClientSchemaData) {
    try {
      setServerError('');

      const payload = {
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        notes: formData.notes || undefined,
      };

      if (client) {
        await updateClient(client.id, payload);
      } else {
        await createClient(payload);
      }

      onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(error.response?.data?.message || 'Erro ao salvar cliente.');
        return;
      }

      setServerError('Erro inesperado ao salvar cliente.');
    }
  }

  return (
    <form className="client-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-field">
        <label className="form-label" htmlFor="name">
          Nome
        </label>
        <Input id="name" placeholder="Nome do cliente" {...register('name')} />
        {errors.name && <span className="form-error">{errors.name.message}</span>}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="email">
          E-mail
        </label>
        <Input id="email" type="email" placeholder="cliente@email.com" {...register('email')} />
        {errors.email && <span className="form-error">{errors.email.message}</span>}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="phone">
          Telefone
        </label>
        <Input id="phone" placeholder="(11) 99999-9999" {...register('phone')} />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="notes">
          Observações
        </label>
        <textarea
          id="notes"
          className="ui-textarea"
          placeholder="Observações sobre o cliente"
          {...register('notes')}
        />
      </div>

      {serverError && <p className="server-error">{serverError}</p>}

      <div className="form-actions">
        <button type="button" className="ghost-button" onClick={onCancel}>
          Cancelar
        </button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : client ? 'Atualizar cliente' : 'Cadastrar cliente'}
        </Button>
      </div>
    </form>
  );
}