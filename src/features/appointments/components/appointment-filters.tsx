import type { AppointmentFilters } from '../types/appointment-filters';

type AppointmentFiltersProps = {
  filters: AppointmentFilters;
  onChange: (filters: AppointmentFilters) => void;
  onClear: () => void;
};

export function AppointmentFilters({
  filters,
  onChange,
  onClear,
}: AppointmentFiltersProps) {
  function updateFilter<Key extends keyof AppointmentFilters>(
    key: Key,
    value: AppointmentFilters[Key]
  ) {
    onChange({
      ...filters,
      [key]: value,
    });
  }

  return (
    <div className="filters-card">
      <div className="filters-grid">
        <div className="form-field">
          <label className="form-label" htmlFor="appointment-search">
            Buscar
          </label>

          <input
            id="appointment-search"
            className="ui-input"
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
            placeholder="Cliente, telefone, e-mail ou serviço"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="appointment-status">
            Status
          </label>

          <select
            id="appointment-status"
            className="ui-select"
            value={filters.status}
            onChange={(event) =>
              updateFilter(
                'status',
                event.target.value as AppointmentFilters['status']
              )
            }
          >
            <option value="">Todos</option>
            <option value="scheduled">Agendado</option>
            <option value="confirmed">Confirmado</option>
            <option value="completed">Concluído</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="appointment-date">
            Data
          </label>

          <input
            id="appointment-date"
            className="ui-input"
            type="date"
            value={filters.date}
            onChange={(event) => updateFilter('date', event.target.value)}
          />
        </div>

        <div className="filters-actions">
          <button
            type="button"
            className="ghost-button"
            onClick={onClear}
          >
            Limpar filtros
          </button>
        </div>
      </div>
    </div>
  );
}