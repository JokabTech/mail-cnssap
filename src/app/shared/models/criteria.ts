export class Criteria {
  constructor(
    public page?: number,
    public pageSize?: number,
    public keyword?: string,
    public withAnnotated?: boolean,
    public processed?: boolean,
    public startDate?: string,
    public endDate?: string,
    public department_id?: string,
    public assigned_to_me?: boolean,

    public withAdminAssistant?: boolean,
    public withSeniorAssistant?: boolean,
    public withDirector?: boolean,
  ) { }
}
