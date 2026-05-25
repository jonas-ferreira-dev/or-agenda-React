import type { PlatformUserFilters } from '../types/platform-user-filters';

type PlatformUserFiltersProps = {
  filters: PlatformUserFilters;
  onChange: (filters: PlatformUserFilters) => void;
  onClear: () => void;
};

export function PlatformUserFilters({
  filters,
  onChange,
  onClear,
}: PlatformUserFiltersProps) {
  return (
    <div className="filters-card">
      <div className="platform-user-filters-grid">
        <div className="form-field">
          <label className="form-label" htmlFor="platform-user-search">
            Buscar usuário
          </label>

          <input
            id="platform-user-search"
            className="ui-input"
            value={filters.search}
            onChange={(event) =>
              onChange({
                ...filters,
                search: event.target.value,
              })
            }
            placeholder="Nome ou e-mail"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="platform-user-status">
            Status
          </label>

          <select
            id="platform-user-status"
            className="ui-input"
            value={filters.status}
            onChange={(event) =>
              onChange({
                ...filters,
                status: event.target.value as PlatformUserFilters['status'],
              })
            }
          >
            <option value="">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Bloqueados</option>
          </select>
        </div>

        <div className="filters-actions">
          <button type="button" className="ghost-button" onClick={onClear}>
            Limpar filtros
          </button>
        </div>
      </div>
    </div>
  );
}