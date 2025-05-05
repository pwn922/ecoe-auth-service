

export class ArgumentInvalidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ArgumentInvalidError';
  }
}