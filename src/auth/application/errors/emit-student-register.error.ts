

export class EmitStudentRegisterError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EmitStudentRegisterError';
    }
}