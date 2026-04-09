import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/auth/pages/login-page';
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page';
import { ClientsPage } from '@/features/clients/pages/clients-page';
import { ServicesPage } from '@/features/services/pages/services-page';
import { AppointmentsPage } from '@/features/appointments/pages/appointments-page';
import { ProfessionalProfilePage } from '@/features/professional-profile/pages/professional-profile-page';
import { PublicBookingPage } from '@/features/public-booking/pages/public-booking-page';
import { ProtectedRoute } from './protected-route';
import { AppShell } from '@/shared/components/layout/app-shell';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
   {
            path: '/agendar/:slug',
            element: <PublicBookingPage />,
   },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/clientes',
            element: <ClientsPage />,
          },
          {
            path: '/servicos',
            element: <ServicesPage />,
          },
          {
            path: '/agendamentos',
            element: <AppointmentsPage />,
          },
          {
            path: '/perfil',
            element: <ProfessionalProfilePage />,
          },
         
        ],
      },
    ],
  },
]);