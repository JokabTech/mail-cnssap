export class FormActionPayload<T> {
  constructor(
    public action: string,
    public data: T
  ) {}
}
