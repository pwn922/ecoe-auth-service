import { from } from "rxjs";
import { IdValueObject } from "../value-objects/id.value-object";
import { RoleNameValueObject } from "../value-objects/rolname.value-object";
import { RoleProps } from "../types/role.props";

export class Role {
    private readonly id: IdValueObject;
    private readonly name: RoleNameValueObject;

    private constructor(id: IdValueObject, name: RoleNameValueObject) {
        this.id = id;
        this.name = name;
    }

    equals(other: Role): boolean {
        return this.name === other.name;
    }

    toPrimitives(): RoleProps {
        return {
            id: this.id.toPrimitive(),
            name: this.name.toPrimitive(),
        }
    }

    static fromPrimitives(props: RoleProps): Role {
        return new Role(
            new IdValueObject(props.id), 
            new RoleNameValueObject(props.name)
        );
    }
}