import { User } from "src/auth/domain/entities/user.entity";
import { IUserEventsOutPort } from "../ports/out/user-event.out.port";
import { EmitStudentRegisterError } from "../errors/emit-student-register.error";
import { Inject } from "@nestjs/common";


export class EmitStudentRegisterUseCase {
    constructor(
        @Inject('IUserEventsOutPort')
        private readonly userEventsService: IUserEventsOutPort,
    ) {}

    async execute(user: User): Promise<void> {
        try {
            const userPrimitives = user.toPrimitives();
            if (userPrimitives.role.name !== 'estudiante') {
                return;
            }

            await this.userEventsService.emitStudentRegistered(userPrimitives.id);
        } catch (error) {
            console.error('Error emitting student registered event:', error);
            throw new EmitStudentRegisterError('Failed to emit student registered event');
        }        
    }
}