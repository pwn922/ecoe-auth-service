import { RegisterUserCommand } from "../../commands/register-user.command";

export interface RegisterUserInputPort {
  execute(command: RegisterUserCommand): Promise<void>;
}