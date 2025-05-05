import { User } from "src/auth/domain/entities/user.entity";
import { UserProps } from "src/auth/domain/types/user.props";


export class UserMapper {
    static toDomain(props: UserProps): User {
        return User.fromPrimitives(props);
    }

    static toPrimitives(user: User): UserProps {
        return user.toPrimitives();
    }
}