// src/features/reports/pages/reports-page.tsx

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/shared/components/ui/button';
import { getRevenueReport } from '../services/get-revenue-report';
import { getAppointmentsReport } from '../services/get-appointments-report';
import { getCancellationsReport } from '../services/get-cancellations-report';
import { getClientsReport } from '../services/get-clients-report';
import {
  INITIAL_REPORT_FILTERS,
  type ReportFilters,
  type ReportType,
} from '../types/report-filters';

const reportLabels: Record<ReportType, string> = {
  revenue: 'Faturamento',
  appointments: 'Agendamentos',
  cancellations: 'Cancelamentos',
  clients: 'Clientes',
};

const statusLabels: Record<string, string> = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatDate(date?: string | null) {
  if (!date) return '-';

  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR');
}

export function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('revenue');
  const [filters, setFilters] = useState<ReportFilters>(INITIAL_REPORT_FILTERS);

  const revenueQuery = useQuery({
    queryKey: ['reports', 'revenue', filters],
    queryFn: () => getRevenueReport(filters),
    enabled: reportType === 'revenue',
  });

  const appointmentsQuery = useQuery({
    queryKey: ['reports', 'appointments', filters],
    queryFn: () => getAppointmentsReport(filters),
    enabled: reportType === 'appointments',
  });

  const cancellationsQuery = useQuery({
    queryKey: ['reports', 'cancellations', filters],
    queryFn: () => getCancellationsReport(filters),
    enabled: reportType === 'cancellations',
  });

  const clientsQuery = useQuery({
    queryKey: ['reports', 'clients', filters],
    queryFn: () => getClientsReport(filters),
    enabled: reportType === 'clients',
  });

  const isLoading = useMemo(() => {
    return (
      revenueQuery.isLoading ||
      appointmentsQuery.isLoading ||
      cancellationsQuery.isLoading ||
      clientsQuery.isLoading
    );
  }, [
    revenueQuery.isLoading,
    appointmentsQuery.isLoading,
    cancellationsQuery.isLoading,
    clientsQuery.isLoading,
  ]);

  const isError = useMemo(() => {
    return (
      revenueQuery.isError ||
      appointmentsQuery.isError ||
      cancellationsQuery.isError ||
      clientsQuery.isError
    );
  }, [
    revenueQuery.isError,
    appointmentsQuery.isError,
    cancellationsQuery.isError,
    clientsQuery.isError,
  ]);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="content-stack reports-page">
      <div className="page-header report-screen-only">
        <div>
          <span className="section-badge">Gestão</span>
          <h1 className="page-title">Relatórios</h1>
          <p className="page-description">
            Acompanhe faturamento, agendamentos, cancelamentos e clientes.
          </p>
        </div>

        <Button type="button" onClick={handlePrint}>
          Imprimir / Salvar PDF
        </Button>
      </div>

      <div className="reports-tabs report-screen-only">
        {(Object.keys(reportLabels) as ReportType[]).map((type) => (
          <button
            key={type}
            type="button"
            className={`reports-tab ${reportType === type ? 'active' : ''}`}
            onClick={() => setReportType(type)}
          >
            {reportLabels[type]}
          </button>
        ))}
      </div>

      <div className="filters-card report-screen-only">
        <div className="reports-filters-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="report-start-date">
              Data inicial
            </label>
            <input
              id="report-start-date"
              className="ui-input"
              type="date"
              value={filters.start_date}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  start_date: event.target.value,
                }))
              }
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="report-end-date">
              Data final
            </label>
            <input
              id="report-end-date"
              className="ui-input"
              type="date"
              value={filters.end_date}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  end_date: event.target.value,
                }))
              }
            />
          </div>

          {reportType === 'appointments' && (
            <div className="form-field">
              <label className="form-label" htmlFor="report-status">
                Status
              </label>
              <select
                id="report-status"
                className="ui-input"
                value={filters.status}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    status: event.target.value as ReportFilters['status'],
                  }))
                }
              >
                <option value="">Todos</option>
                <option value="scheduled">Agendado</option>
                <option value="confirmed">Confirmado</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          )}

          {reportType === 'clients' && (
            <div className="form-field">
              <label className="form-label" htmlFor="report-search">
                Buscar cliente
              </label>
              <input
                id="report-search"
                className="ui-input"
                value={filters.search}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    search: event.target.value,
                  }))
                }
                placeholder="Nome, e-mail ou telefone"
              />
            </div>
          )}
        </div>
      </div>

      <section className="report-print-area table-card">
        <div className="report-print-header">
          <div>
            <span className="section-badge">OR Agenda</span>
            <h2 className="card-title">
              Relatório de {reportLabels[reportType]}
            </h2>
            <p className="page-description">
              Período: {formatDate(filters.start_date)} até{' '}
              {formatDate(filters.end_date)}
            </p>
          </div>
        </div>

        {isLoading && <p>Carregando relatório...</p>}

        {isError && (
          <p className="server-error">Erro ao carregar relatório.</p>
        )}

        {reportType === 'revenue' && revenueQuery.data && (
          <>
            <div className="report-summary-grid">
              <div className="report-summary-card">
                <span>Faturamento total</span>
                <strong>
                  {formatCurrency(revenueQuery.data.data.summary.total_revenue)}
                </strong>
              </div>

              <div className="report-summary-card">
                <span>Agendamentos concluídos</span>
                <strong>
                  {revenueQuery.data.data.summary.appointments_count}
                </strong>
              </div>

              <div className="report-summary-card">
                <span>Ticket médio</span>
                <strong>
                  {formatCurrency(revenueQuery.data.data.summary.average_ticket)}
                </strong>
              </div>
            </div>

            <h3 className="report-section-title">Serviços no período</h3>

            <div className="responsive-table-wrapper">
              <table className="data-table report-table">
                <thead>
                  <tr>
                    <th>Serviço</th>
                    <th>Qtd.</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueQuery.data.data.services.map((service) => (
                    <tr key={service.service_id ?? service.service_name}>
                      <td>{service.service_name}</td>
                      <td>{service.appointments_count}</td>
                      <td>{formatCurrency(service.total_revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {reportType === 'appointments' && appointmentsQuery.data && (
          <>
            <div className="report-summary-grid">
              <div className="report-summary-card">
                <span>Total</span>
                <strong>{appointmentsQuery.data.data.summary.total}</strong>
              </div>

              <div className="report-summary-card">
                <span>Agendados</span>
                <strong>{appointmentsQuery.data.data.summary.scheduled}</strong>
              </div>

              <div className="report-summary-card">
                <span>Concluídos</span>
                <strong>{appointmentsQuery.data.data.summary.completed}</strong>
              </div>

              <div className="report-summary-card">
                <span>Cancelados</span>
                <strong>{appointmentsQuery.data.data.summary.cancelled}</strong>
              </div>
            </div>

            <h3 className="report-section-title">Lista de agendamentos</h3>

            <div className="responsive-table-wrapper">
              <table className="data-table report-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Horário</th>
                    <th>Cliente</th>
                    <th>Serviço</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {appointmentsQuery.data.data.appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{formatDate(appointment.appointment_date)}</td>
                      <td>
                        {appointment.start_time} - {appointment.end_time}
                      </td>
                      <td>{appointment.client?.name ?? '-'}</td>
                      <td>{appointment.service?.name ?? '-'}</td>
                      <td>{statusLabels[appointment.status] ?? appointment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {reportType === 'cancellations' && cancellationsQuery.data && (
          <>
            <div className="report-summary-grid">
              <div className="report-summary-card">
                <span>Total de agendamentos</span>
                <strong>
                  {cancellationsQuery.data.data.summary.total_appointments}
                </strong>
              </div>

              <div className="report-summary-card">
                <span>Cancelamentos</span>
                <strong>
                  {cancellationsQuery.data.data.summary.cancelled_count}
                </strong>
              </div>

              <div className="report-summary-card">
                <span>Taxa de cancelamento</span>
                <strong>
                  {cancellationsQuery.data.data.summary.cancellation_rate}%
                </strong>
              </div>
            </div>

            <h3 className="report-section-title">Lista de cancelamentos</h3>

            <div className="responsive-table-wrapper">
              <table className="data-table report-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Horário</th>
                    <th>Cliente</th>
                    <th>Serviço</th>
                  </tr>
                </thead>

                <tbody>
                  {cancellationsQuery.data.data.appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{formatDate(appointment.appointment_date)}</td>
                      <td>
                        {appointment.start_time} - {appointment.end_time}
                      </td>
                      <td>{appointment.client?.name ?? '-'}</td>
                      <td>{appointment.service?.name ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {reportType === 'clients' && clientsQuery.data && (
          <>
            <div className="report-summary-grid">
              <div className="report-summary-card">
                <span>Total de clientes</span>
                <strong>{clientsQuery.data.data.summary.total_clients}</strong>
              </div>

              <div className="report-summary-card">
                <span>Novos no período</span>
                <strong>
                  {clientsQuery.data.data.summary.new_clients_in_period}
                </strong>
              </div>

              <div className="report-summary-card">
                <span>Com agendamentos</span>
                <strong>
                  {clientsQuery.data.data.summary.clients_with_appointments}
                </strong>
              </div>
            </div>

            <h3 className="report-section-title">Clientes</h3>

            <div className="responsive-table-wrapper">
              <table className="data-table report-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Contato</th>
                    <th>Agendamentos</th>
                    <th>Último agendamento</th>
                  </tr>
                </thead>

                <tbody>
                  {clientsQuery.data.data.clients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.name}</td>
                      <td>{client.phone || client.email || '-'}</td>
                      <td>{client.appointments_count}</td>
                      <td>{formatDate(client.last_appointment_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}