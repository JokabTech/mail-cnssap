import { Role } from "./role";

export class Authentication {
  constructor(
    public full_name: string,
    public authorization: string,
    public roles: Role[] = []
  ) { }
}
