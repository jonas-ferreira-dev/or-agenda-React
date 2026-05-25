import { useEffect, useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/shared/components/ui/button';
import { createPlatformUser } from '../services/create-platform-user';
import { updatePlatformUser } from '../services/update-platform-user';
import type { PlatformUser } from '../types/plataform-user';

type PlatformUserFormProps = {
  selectedUser: PlatformUser | null;
  onSuccess: () => void;
  onCancelEdit: () => void;
};

export function PlatformUserForm({
  selectedUser,
  onSuccess,
  onCancelEdit,
}: PlatformUserFormProps) {
  const isEditing = selectedUser !== null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [password, setPassword] = useState('12345678');
  const [passwordConfirmation, setPasswordConfirmation] = useState('12345678');
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!selectedUser) {
      setName('');
      setEmail('');
      setIsActive(true);
      setPassword('12345678');
      setPasswordConfirmation('12345678');
      setServerError('');
      setSuccessMessage('');
      return;
    }

    setName(selectedUser.name);
    setEmail(selectedUser.email);
    setIsActive(selectedUser.is_active);
    setPassword('');
    setPasswordConfirmation('');
    setServerError('');
    setSuccessMessage('');
  }, [selectedUser]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (isEditing) {
        return updatePlatformUser(selectedUser.id, {
          name,
          email,
          is_active: isActive,
          password: password || undefined,
          password_confirmation: passwordConfirmation || undefined,
        });
      }

      return createPlatformUser({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
    },
    onSuccess: (response) => {
      setSuccessMessage(response.message);
      setServerError('');

      if (!isEditing) {
        setName('');
        setEmail('');
        setIsActive(true);
        setPassword('12345678');
        setPasswordConfirmation('12345678');
      }

      onSuccess();
    },
    onError: (error) => {
      setSuccessMessage('');

      if (axios.isAxiosError(error)) {
        const errors = error.response?.data?.errors;

        if (errors && typeof errors === 'object') {
          const firstError = Object.values(errors)[0];

          if (Array.isArray(firstError) && firstError[0]) {
            setServerError(firstError[0]);
            return;
          }
        }

        setServerError(
          error.response?.data?.message || 'Erro ao salvar usuário.'
        );
        return;
      }

      setServerError('Erro inesperado ao salvar usuário.');
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setServerError('');
    setSuccessMessage('');

    mutation.mutate();
  }

  return (
    <form className="client-form" onSubmit={handleSubmit}>
      {serverError && <p className="server-error">{serverError}</p>}

      {successMessage && (
        <p className="public-success-message">{successMessage}</p>
      )}

      <div className="form-field">
        <label className="form-label" htmlFor="platform-user-name">
          Nome do usuário/profissional
        </label>

        <input
          id="platform-user-name"
          className="ui-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex: João Studio"
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="platform-user-email">
          E-mail de acesso
        </label>

        <input
          id="platform-user-email"
          className="ui-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="cliente@email.com"
          required
        />
      </div>

      {isEditing && (
        <div className="form-field">
          <label className="form-label" htmlFor="platform-user-active">
            Status do acesso
          </label>

          <select
            id="platform-user-active"
            className="ui-input"
            value={isActive ? 'active' : 'inactive'}
            onChange={(event) => setIsActive(event.target.value === 'active')}
          >
            <option value="active">Ativo</option>
            <option value="inactive">Bloqueado</option>
          </select>
        </div>
      )}

      <div className="form-grid">
        <div className="form-field">
          <label className="form-label" htmlFor="platform-user-password">
            {isEditing ? 'Nova senha opcional' : 'Senha inicial'}
          </label>

          <input
            id="platform-user-password"
            className="ui-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required={!isEditing}
            placeholder={isEditing ? 'Deixe vazio para manter' : undefined}
          />
        </div>

        <div className="form-field">
          <label
            className="form-label"
            htmlFor="platform-user-password-confirmation"
          >
            Confirmar senha
          </label>

          <input
            id="platform-user-password-confirmation"
            className="ui-input"
            type="password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            required={!isEditing}
            placeholder={isEditing ? 'Deixe vazio para manter' : undefined}
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="ghost-button"
          onClick={onCancelEdit}
          disabled={mutation.isPending}
        >
          Cancelar
        </button>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? 'Salvando...'
            : isEditing
              ? 'Salvar alterações'
              : 'Criar usuário'}
        </Button>
      </div>
    </form>
  );
}