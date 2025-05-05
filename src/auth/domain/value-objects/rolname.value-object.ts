
import { ArgumentInvalidError } from "../errors/argument-invalid.error";

export class RoleNameValueObject {
    private readonly value: string;
    
    constructor(value: string) {
        this.value = value;
        this.ensureIsValid();
    }

    private ensureIsValid(): void {
        if (typeof this.value !== 'string' || this.value.trim().length == 0) throw new ArgumentInvalidError('Role is required');
    }

    toPrimitive(): string {
        return this.value;
    }
}