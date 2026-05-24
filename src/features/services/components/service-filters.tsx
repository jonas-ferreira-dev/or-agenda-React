import type { ServiceFilters } from '../types/service-filters';

type ServiceFiltersProps = {
  filters: ServiceFilters;
  onChange: (filters: ServiceFilters) => void;
  onClear: () => void;
};

export function ServiceFilters({
  filters,
  onChange,
  onClear,
}: ServiceFiltersProps) {
  function updateFilter<Key extends keyof ServiceFilters>(
    key: Key,
    value: ServiceFilters[Key]
  ) {
    onChange({
      ...filters,
      [key]: value,
    });
  }

  return (
    <div className="filters-card">
      <div className="service-filters-grid">
        <div className="form-field">
          <label className="form-label" htmlFor="service-search">
            Buscar serviço
          </label>

          <input
            id="service-search"
            className="ui-input"
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
            placeholder="Nome ou descrição do serviço"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="service-active">
            Status
          </label>

          <select
            id="service-active"
            className="ui-select"
            value={filters.active}
            onChange={(event) =>
              updateFilter(
                'active',
                event.target.value as ServiceFilters['active']
              )
            }
          >
            <option value="">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
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