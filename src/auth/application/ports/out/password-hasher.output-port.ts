

export interface IPasswordHasherOutputPort {
    hash(plainPassword: string): Promise<string>;
    compare(plainPassword: string, hashedPassword: string): Promise<boolean>;
}