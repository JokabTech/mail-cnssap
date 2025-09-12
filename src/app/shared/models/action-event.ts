export class ActionEvent<T> {
  constructor(
    public action: string,
    public data: T
  ) { }
}
