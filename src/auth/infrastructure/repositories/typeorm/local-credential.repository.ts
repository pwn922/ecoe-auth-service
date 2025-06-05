import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { ILocalCredentialRepositoryOutputPort } from 'src/auth/domain/ports/out/local-credential.repository.out.port';
import { LocalCredential } from 'src/auth/domain/entities/local-credential.entity';
import { LocalCredentialOrmEntity } from '../../entities/local-credential.entity.orm';

@Injectable()
export class TypeOrmLocalCredentialRepository implements ILocalCredentialRepositoryOutputPort {
    constructor(
        @InjectRepository(LocalCredentialOrmEntity)
        private readonly repository: Repository<LocalCredentialOrmEntity>,
    ) {}

    async findByUserId(userId: string): Promise<LocalCredential | null> {
        const ormCredential = await this.repository.findOne({
            where: { user: { id: userId } },
            relations: ['user'],
        });

        if (!ormCredential) return null;

        return LocalCredential.fromPrimitives({
            id: ormCredential.id,
            userId: ormCredential.user.id,
            passwordHash: ormCredential.passwordHash,
        });
    }
}
