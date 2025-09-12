import { Department } from './department';
import { Function } from './function';
import { Role } from "./role";

export class User {
  constructor(
    public id: number,
    public full_name: string,
    public phone: string,
    public email: string,
    public is_active: boolean,
    public roles: Role[] = [],
    public department: Department,
    public funct: Function,
  ) { }
}
