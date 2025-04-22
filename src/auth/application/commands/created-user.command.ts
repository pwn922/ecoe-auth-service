

export class CreateUserCommand {
  constructor(
    public readonly fullname: string,
    public readonly email: string,
    public readonly password: string
  ) {}
}
