import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";


export class Fullname {
    private readonly value: string;
    constructor(value: string) {
        this.value = value;
        this.ensureIsValid();
    }

    private ensureIsValid(): void {
        if (typeof this.value !== 'string' || this.value.trim().length === 0) {
            throw new ArgumentInvalidException(`The Fullname '${this.value}' not have a valid format.`);
        }
    }

    toPrimitive(): string {
        return this.value;
    }
}