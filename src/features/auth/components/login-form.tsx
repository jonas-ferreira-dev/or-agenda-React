import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { loginRequest } from '../services/login';
import { loginSchema, type LoginSchemaData } from '../schemas/login-schema';
import { useAuth } from '../hooks/use-auth';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

export function LoginForm() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(formData: LoginSchemaData) {
    try {
      setServerError('');

      const response = await loginRequest(formData);

      signIn(response.token, response.user);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || 'Erro de login';
        setServerError(message);
        return;
      }

      setServerError('Unexpected error. Please try again.');
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-field">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="admin@email.com"
          {...register('email')}
        />
        {errors.email && <span className="form-error">{errors.email.message}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="password" className="form-label">
          Senha
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Coloque sua senha"
          {...register('password')}
        />
        {errors.password && (
          <span className="form-error">{errors.password.message}</span>
        )}
      </div>

      {serverError && <p className="server-error">{serverError}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}