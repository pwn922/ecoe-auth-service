import { ArgumentInvalidError } from '../errors/argument-invalid.error';


export class IdValueObject {
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
    this.ensureIsValid();
  }

  private ensureIsValid(): void {
    if (typeof this.value !== 'string' || this.value.trim().length === 0) {
      throw new ArgumentInvalidError(`The Id '${this.value}' not have a valid format.`);
    }
  }

  toPrimitive(): string {
    return this.value;
  }
}