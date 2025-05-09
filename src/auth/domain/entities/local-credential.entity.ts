import { LocalCredentialProps } from '../types/local-credential.props';
import { IdValueObject } from '../value-objects/id.value-object';
import { PasswordHashValueObject } from '../value-objects/password-hash.value-object';

export class LocalCredential {
    private readonly id: IdValueObject | null;
    private readonly userId: IdValueObject;
    private readonly passwordHash: PasswordHashValueObject;

    private constructor(
        id: IdValueObject | null,
        userId: IdValueObject,
        passwordHash: PasswordHashValueObject,
    ) {
        this.id = id;
        this.userId = userId;
        this.passwordHash = passwordHash;
    }

    static fromPrimitives(props: LocalCredentialProps): LocalCredential {
        return new LocalCredential(
            props.id ? new IdValueObject(props.id) : null,
            new IdValueObject(props.userId),
            new PasswordHashValueObject(props.passwordHash),
        );
    }

    toPrimitives(): LocalCredentialProps {
        return {
            id: this.id?.toPrimitive(),
            userId: this.userId.toPrimitive(),
            passwordHash: this.passwordHash.toPrimitive(),
        };
    }

    getUserId(): string {
        return this.userId.toPrimitive();
    }

    getPasswordHash(): string {
        return this.passwordHash.toPrimitive();
    }
}
