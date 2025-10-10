export interface Holiday {
  id: number;
  name: string;
  day: number;
  month: number;
  is_fixed: boolean;
  year?: number;
  is_active: boolean;
}
