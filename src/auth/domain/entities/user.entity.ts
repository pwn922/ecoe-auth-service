import { Role } from "./role.entity";
import { UserProps } from "../types/user.props";
import { EmailValueObject } from "../value-objects/email.value-object";
import { FullnameValueObject } from "../value-objects/fullname.value-object";
import { IdValueObject } from "../value-objects/id.value-object";

export class User {
    private id: IdValueObject | null;
    private readonly fullname: FullnameValueObject;
    private readonly email: EmailValueObject;
    private readonly role: Role;
    private readonly isProtected: boolean;

    private constructor(
        id: IdValueObject | null,
        fullname: FullnameValueObject,
        email: EmailValueObject,
        role: Role,
        isProtected: boolean,
    ) {
            this.id = id;
            this.fullname = fullname;
            this.email = email;
            this.role = role;
            this.isProtected = isProtected;
    }

    static fromPrimitives(props: UserProps): User {
        return new User(
            props.id ? new IdValueObject(props.id) : null,
            props.fullname ? new FullnameValueObject(props.fullname) : null,
            new EmailValueObject(props.email),
            // new PasswordValueObject(props.password),
            Role.fromPrimitives({
                id: props.role.id,
                name: props.role.name,
            }),
            props.isProtected,
        );
    }

    toPrimitives(): UserProps {
        return {
            id: this.id?.toPrimitive(),
            fullname: this.fullname?.toPrimitive() ?? '',
            email: this.email.toPrimitive(),
            role: this.role.toPrimitives(),
            isProtected: this.isProtected,
        };
    }

    getId(): string | undefined {
        return this.id?.toPrimitive();
    }

    getRole(): Role {
        return this.role;
    }

    getFullname(): string {
        return this.fullname?.toPrimitive() ?? 'N/A';
    }

    getEmail(): string {
        return this.email.toPrimitive();
    }

    getIsProtected(): boolean {
        return this.isProtected;
    }
}
