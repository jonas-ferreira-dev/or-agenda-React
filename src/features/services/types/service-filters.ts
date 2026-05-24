export type ServiceActiveFilter = '' | 'active' | 'inactive';

export type ServiceFilters = {
  search: string;
  active: ServiceActiveFilter;
};