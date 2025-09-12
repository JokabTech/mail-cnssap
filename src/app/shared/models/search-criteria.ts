export interface SearchCriteria {
  url?: string;
  page?: number;
  pageSize?: number;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  department_id?: number;
  withAdminAssistant?: boolean;
  withSeniorAssistant?: boolean;
  withDirector?: boolean;
  assigned_to_me?: boolean;
  withAnnotated?: boolean;
  processed?: boolean;
}
