import { User } from "./user";

export class Department {
  constructor(
    public id: number,
    public designation: string,
    public acronym: string,
    public director: User
  ) {}
}
