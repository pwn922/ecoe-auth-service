

export interface IUserEventsOutPort {
    emitStudentRegistered(userId: string): Promise<void>;
}