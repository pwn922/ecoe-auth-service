import { LocalCredential } from 'src/auth/domain/entities/local-credential.entity';


export interface ILocalCredentialRepositoryOutputPort {
    findByUserId(userId: string): Promise<LocalCredential | null>;
}