import type { ClientFilters } from '../types/client-filters';

type ClientFiltersProps = {
  filters: ClientFilters;
  onChange: (filters: ClientFilters) => void;
  onClear: () => void;
};

export function ClientFilters({
  filters,
  onChange,
  onClear,
}: ClientFiltersProps) {
  function updateSearch(value: string) {
    onChange({
      ...filters,
      search: value,
    });
  }

  return (
    <div className="filters-card">
      <div className="client-filters-grid">
        <div className="form-field">
          <label className="form-label" htmlFor="client-search">
            Buscar cliente
          </label>

          <input
            id="client-search"
            className="ui-input"
            value={filters.search}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder="Nome, e-mail ou telefone"
          />
        </div>

        <div className="filters-actions">
          <button
            type="button"
            className="ghost-button"
            onClick={onClear}
          >
            Limpar filtro
          </button>
        </div>
      </div>
    </div>
  );
}