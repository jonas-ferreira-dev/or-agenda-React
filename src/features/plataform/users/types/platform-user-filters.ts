export type PlatformUserStatusFilter = '' | 'active' | 'inactive';

export type PlatformUserFilters = {
  search: string;
  status: PlatformUserStatusFilter;
};

export const INITIAL_PLATFORM_USER_FILTERS: PlatformUserFilters = {
  search: '',
  status: '',
};